/**
 * 「多磨霊園・周辺の新着記事」機能のpages担当専用表示ヘルパー。
 *
 * このファイルは `_` で始まるディレクトリに置かれているため、
 * Astroのルーティング対象にはならない（src/pages/_lib/business-display.ts
 * と同じ位置づけ）。データ取得は必ず src/lib/data 経由
 * （getPublishedNewsArticles / getNewsArticleBySlug）で行い、
 * ここでは「取得したデータをどう見せるか」の表示ロジックのみを持つ。
 *
 * `formatJaDate` は、従来 src/pages/index.astro 内に個別に定義していた
 * 関数（TOPの「多磨霊園に関する最新情報」用）をここへ移し、TOP・/news/系の
 * 両方から共有する（同じ日付表記ロジックの重複を避けるため）。
 */
import type { NewsCategory } from '../../types/news';

/** カテゴリの表示ラベル（CLAUDE_CODE_HANDOFF.md追加要件の想定カテゴリに対応）。 */
export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  cemetery_news: '多磨霊園のニュース',
  area_news: '周辺地域のニュース',
  notable_graves: '多磨霊園に眠る著名人',
  history: '多磨霊園の歴史',
  local_shops: '周辺の飲食店・店舗・散策情報',
  visiting_info: '墓参り・アクセスなどの実用情報',
};

/** "YYYY-MM-DD" を "YYYY年M月D日" へ整形する（TOPの公式お知らせと共通の表記）。 */
export function formatJaDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${y}年${m}月${d}日`;
}
