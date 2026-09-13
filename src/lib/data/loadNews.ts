import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import type { NewsArticle, NewsDataset } from '../../types/news';
import { NEWS_CATEGORIES } from '../../types/news';

/**
 * src/data/news.json の読み込み・検証・公開判定。
 *
 * 「多磨霊園・周辺の新着記事」機能のデータ基盤。businesses.json/sources.csvや
 * sponsors.jsonとは完全に独立したファイル・読み込み経路とする（既存の比較・
 * スポンサー表示には一切影響しない）。
 *
 * 記事データが空（`articles: []`）でもビルドが成功することを前提にする
 * （CLAUDE_CODE_HANDOFF.md追加要件「記事データがない状態でもビルドできる
 * ようにする」）。運用は自動収集・自動公開を行わず、人が確認した記事案を
 * このJSONへ手動追加する前提のため、ここでは検証のみを行い、生成・取得は
 * 一切行わない。
 *
 * 所有者: リード（データ読み込み基盤）。data-content担当は
 * `src/data/news.json` の中身（記事データ）のみを編集する。
 */

// businesses.json/sponsors.json側のバリデーション（src/lib/data/validate.ts、
// loadSponsors.ts）と同様、Zodの`.url()`（非推奨）には依存せず、
// 独自の簡易URL検証を使う。
function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

const httpUrlSchema = z.string().min(1).refine(isValidHttpUrl, 'http(s) URLである必要があります');
const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD形式の日付である必要があります');

const newsArticleSchema = z
  .object({
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9-]+$/, 'slugは小文字英数字とハイフンのみ'),
    title: z.string().min(1),
    category: z.enum(NEWS_CATEGORIES),
    publishedAt: isoDateSchema,
    updatedAt: isoDateSchema.optional(),
    summary: z.string().min(1).optional(),
    body: z.array(z.string().min(1)).min(1, '本文は1段落以上必要です'),
    sourceName: z.string().min(1).optional(),
    sourceUrl: httpUrlSchema.optional(),
    published: z.boolean(),
  })
  .refine((a) => !a.sourceName === !a.sourceUrl, {
    message: 'sourceNameとsourceUrlは両方指定するか、両方省略してください',
    path: ['sourceUrl'],
  });

const newsDatasetSchema = z.object({
  schemaVersion: z.string(),
  articles: z.array(newsArticleSchema),
});

// astro buildはプリレンダリング用チャンクをdist配下へバンドルするため、
// import.meta.url基準の相対パスはENOENTになる。process.cwd()基準にする
// （src/lib/data/loadBusinesses.ts / loadSponsors.tsと同じ理由）。
const DATA_PATH = join(process.cwd(), 'src/data/news.json');

let cached: NewsDataset | null = null;

/** news.json を読み込み、Zodスキーマで検証して返す。 */
export function loadNewsDataset(): NewsDataset {
  if (cached) return cached;

  const raw = readFileSync(DATA_PATH, 'utf-8');
  const json = JSON.parse(raw);

  const result = newsDatasetSchema.safeParse(json);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - [${issue.path.join('.')}] ${issue.message}`)
      .join('\n');
    throw new Error(`news.json のスキーマ検証に失敗しました:\n${issues}`);
  }

  validateNewsSlugUniqueness(result.data);

  cached = result.data as NewsDataset;
  return cached;
}

/** slugの重複がないことを検証する（CLAUDE_CODE_HANDOFF.md10章1.と同じ考え方）。 */
function validateNewsSlugUniqueness(dataset: NewsDataset): void {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const article of dataset.articles) {
    if (seen.has(article.slug)) {
      duplicates.add(article.slug);
    }
    seen.add(article.slug);
  }
  if (duplicates.size > 0) {
    throw new Error(`news.json のslugが重複しています: ${Array.from(duplicates).join(', ')}`);
  }
}

/** テスト用途でキャッシュをリセットする。 */
export function resetNewsDatasetCache(): void {
  cached = null;
}

/**
 * 今日時点で公開してよい記事だけを、公開日の新しい順（降順）で返す。
 *
 * 「公開」の条件（すべて満たす場合のみ対象）:
 *   - published === true
 *   - publishedAt が今日以前（予約投稿の未来日付は表示しない）
 *
 * 表示件数の絞り込み（TOPの最大3件等）は呼び出し側（pages担当）が行う。
 * ここでは「本来公開してよい記事の全量」を返す。
 */
export function getPublishedNewsArticles(now: Date = new Date()): NewsArticle[] {
  const { articles } = loadNewsDataset();
  const todayStr = now.toISOString().slice(0, 10);

  return articles
    .filter((article) => article.published && article.publishedAt <= todayStr)
    .sort((a, b) => {
      if (a.publishedAt !== b.publishedAt) {
        return a.publishedAt < b.publishedAt ? 1 : -1;
      }
      // 同日公開はslugで安定した順序にする（表示順の揺れを防ぐ）。
      return a.slug.localeCompare(b.slug);
    });
}

/**
 * 公開対象の記事からslugで1件探す。下書き・未来日付の記事はここでも
 * 見つからない（詳細ページの静的生成対象を公開記事だけに限定するため）。
 */
export function getNewsArticleBySlug(
  slug: string,
  now: Date = new Date(),
): NewsArticle | undefined {
  return getPublishedNewsArticles(now).find((article) => article.slug === slug);
}
