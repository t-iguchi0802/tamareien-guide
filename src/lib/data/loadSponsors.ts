import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import type { Sponsor, SponsorDataset } from '../../types/sponsor';

/**
 * src/data/sponsors.json の読み込み・検証・有効判定。
 *
 * data_dictionary.md 9章「スポンサー契約の有無を自然掲載順、比較結果、評価に
 * 反映しない」「通常比較表のデータと広告契約データを同じJSONに混在させない」
 * に基づき、businesses.json とは完全に独立したファイル・読み込み経路とする
 * （getBusinesses() 等とは合流させない）。
 *
 * 実在の契約情報がないため、現時点の src/data/sponsors.json は
 * `sponsors: []`（空配列）である。企業名・推薦文を推測で追加しない。
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

const sponsorSchema = z.object({
  id: z.string().min(1),
  isSponsored: z.literal(true),
  campaignId: z.string().min(1),
  name: z.string().min(1),
  summary: z.string().min(1),
  websiteUrl: httpUrlSchema,
  logoUrl: httpUrlSchema.nullable(),
  displayOrder: z.number().int(),
  periodStart: z.string().min(1),
  periodEnd: z.string().min(1).nullable(),
  active: z.boolean(),
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

  cached = result.data as SponsorDataset;
  return cached;
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
