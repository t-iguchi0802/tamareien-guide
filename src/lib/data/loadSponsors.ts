import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import type { Sponsor, SponsorDataset } from '../../types/sponsor';
import { loadBusinessDataset } from './loadBusinesses';

/**
 * src/data/sponsors.json の読み込み・検証・有効判定。
 *
 * data_dictionary.md 9章「スポンサー契約の有無を自然掲載順、比較結果、評価に
 * 反映しない」「通常比較表のデータと広告契約データを同じJSONに混在させない」
 * に基づき、businesses.json とは完全に独立したファイル・読み込み経路とする
 * （getBusinesses() 等とは合流させない）。
 *
 * 実在の契約情報がない場合、`sponsors: []`（空配列）を維持する。
 * 企業名・推薦文・実績・評価を推測で追加しない。
 *
 * 写真付き広告対応（2026-09-02）: `websiteUrl`を`destinationUrl`へ改名し、
 * `headline`/`tagline`/`serviceTags`/`area`/`image`/`imageAlt`/
 * `imageIsPlaceholder`を追加した（詳細は`src/types/sponsor.ts`参照）。
 * `image`はサイト内絶対パスのみ許可し、外部URLを直接参照できないように
 * している（`sitePathSchema`）。
 *
 * 所有者: リード（データ読み込み基盤）。
 */

// businesses.json側のバリデーション（src/lib/data/validate.ts）と同様、
// Zodの`.url()`（非推奨）には依存せず、独自の簡易URL検証を使う。
function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

const httpUrlSchema = z.string().min(1).refine(isValidHttpUrl, 'http(s) URLである必要があります');

// `image`は`public/`からのサイト内絶対パス（例: "/images/sponsors/xxx.png"）。
// 外部URLではなくローカル画像のみを許可する（無断で外部サイトの画像URLを
// 直接参照しないという方針をスキーマレベルでも担保する）。
const sitePathSchema = z
  .string()
  .min(1)
  .refine((v) => v.startsWith('/') && !isValidHttpUrl(v), 'サイト内の絶対パス（例: "/images/..."）である必要があります');

const sponsorSchema = z
  .object({
    id: z.string().min(1),
    isSponsored: z.literal(true),
    campaignId: z.string().min(1),
    name: z.string().min(1),
    headline: z.string().min(1).optional(),
    tagline: z.string().min(1).optional(),
    byline: z.string().min(1).optional(),
    summary: z.string().min(1),
    serviceTags: z.array(z.string().min(1)).optional(),
    area: z.string().min(1).optional(),
    image: sitePathSchema.optional(),
    imageAlt: z.string().min(1).optional(),
    imageIsPlaceholder: z.boolean().optional(),
    destinationUrl: httpUrlSchema,
    logoUrl: httpUrlSchema.nullable(),
    ctaLabel: z.string().min(1).optional(),
    displayOrder: z.number().int(),
    periodStart: z.string().min(1),
    periodEnd: z.string().min(1).nullable(),
    active: z.boolean(),
    linkedBusinessId: z.string().min(1).nullable(),
  })
  .refine((s) => !s.image || !!s.imageAlt, {
    message: 'imageを指定する場合はimageAlt（代替テキスト）も必須です',
    path: ['imageAlt'],
  });

const sponsorDatasetSchema = z.object({
  schemaVersion: z.string(),
  sponsors: z.array(sponsorSchema),
});

// astro build はプリレンダリング用チャンクをdist配下へバンドルするため、
// import.meta.url基準の相対パスはENOENTになる。process.cwd()基準にする
// （src/lib/data/loadBusinesses.ts と同じ理由）。
const DATA_PATH = join(process.cwd(), 'src/data/sponsors.json');

let cached: SponsorDataset | null = null;

/** sponsors.json を読み込み、Zodスキーマで検証して返す。 */
export function loadSponsorDataset(): SponsorDataset {
  if (cached) return cached;

  const raw = readFileSync(DATA_PATH, 'utf-8');
  const json = JSON.parse(raw);

  const result = sponsorDatasetSchema.safeParse(json);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - [${issue.path.join('.')}] ${issue.message}`)
      .join('\n');
    throw new Error(`sponsors.json のスキーマ検証に失敗しました:\n${issues}`);
  }

  validateSponsorBusinessLinks(result.data);

  cached = result.data as SponsorDataset;
  return cached;
}

/**
 * linkedBusinessId が指定されている場合、businesses.json に実在する
 * 事業者idであることを検証する（存在しないIDを追加しない、
 * CLAUDE.md「businesses.json と sources.csv の対応関係を維持する」と
 * 同じ考え方をスポンサー⇄事業者の関連付けにも適用する）。
 * businesses.json 側のスキーマ検証（validateBusinessData）とは独立して
 * 呼び出せるよう、ここでは直接 loadBusinessDataset() を参照する
 * （index.ts 経由の循環importを避けるため）。
 */
function validateSponsorBusinessLinks(dataset: SponsorDataset): void {
  const linkedIds = dataset.sponsors
    .map((s) => s.linkedBusinessId)
    .filter((id): id is string => id !== null);
  if (linkedIds.length === 0) return;

  const businessIds = new Set(loadBusinessDataset().businesses.map((b) => b.id));
  const errors: string[] = [];
  for (const sponsor of dataset.sponsors) {
    if (sponsor.linkedBusinessId !== null && !businessIds.has(sponsor.linkedBusinessId)) {
      errors.push(
        `存在しない事業者idへの参照: sponsors.json ${sponsor.id}.linkedBusinessId -> ${sponsor.linkedBusinessId}`,
      );
    }
  }
  if (errors.length > 0) {
    throw new Error(`sponsors.json の事業者ID参照検証に失敗しました:\n${errors.map((e) => `  - ${e}`).join('\n')}`);
  }
}

/** テスト用途でキャッシュをリセットする。 */
export function resetSponsorDatasetCache(): void {
  cached = null;
}

/**
 * 今日時点で表示してよいスポンサーだけを、displayOrder順・最大4件で返す。
 *
 * 「有効」の条件（すべて満たす場合のみ表示対象）:
 *   - active === true
 *   - periodStart が今日以前
 *   - periodEnd が null、または今日以降
 *
 * displayOrderは管理用の安定順であり、優先度・おすすめ順ではない
 * （data_dictionary.md 9章）。4件を超える有効スポンサーがあっても、
 * 「最大4社を同じ大きさ・同じ優先度で表示する」という表示要件のため
 * ここで先頭4件に切り詰める（どの4件になるかはdisplayOrderのみで決まり、
 * 内容による選別は行わない）。
 */
export function getActiveSponsors(today: Date = new Date()): Sponsor[] {
  const { sponsors } = loadSponsorDataset();
  const todayStr = today.toISOString().slice(0, 10);

  return sponsors
    .filter((sponsor) => {
      if (!sponsor.active) return false;
      if (sponsor.periodStart > todayStr) return false;
      if (sponsor.periodEnd !== null && sponsor.periodEnd < todayStr) return false;
      return true;
    })
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, 4);
}
