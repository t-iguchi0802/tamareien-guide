/**
 * 「多磨霊園・周辺の読みもの」機能のpages担当専用表示ヘルパー。
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

/**
 * カテゴリの表示ラベル（すべて「周辺の読みもの」枠のラベル）。
 *
 * 2026-09-14改定（CLAUDE.md2章「公式情報と周辺の読みものの分離」）:
 * 旧ラベル「多磨霊園のニュース」「周辺地域のニュース」は、東京都公園協会等の
 * 公式発表（TOPの「多磨霊園の公式お知らせ」枠）と混同されやすかったため、
 * 読みもの・特集記事であることが分かる文言へ変更した。あわせて型契約側の
 * キー名も`cemetery_news`→`cemetery_feature`、`area_news`→`area_feature`へ
 * 改名済み（src/types/news.ts参照）。
 */
export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  cemetery_feature: '多磨霊園の話題',
  area_feature: '周辺地域の話題',
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
