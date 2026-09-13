/**
 * 「多磨霊園・周辺の新着記事」機能の型契約。
 *
 * 既存の`src/pages/_lib/tama-news.ts`（`TamaNewsItem`＝東京都公園協会の
 * 公式お知らせだけを扱う、TOP専用の小さな配列）とは別物である。
 * こちらは「多磨霊園のニュース」「周辺地域のニュース」「著名人」「歴史」
 * 「周辺の飲食店・店舗・散策情報」「墓参り・アクセスの実用情報」という、
 * より幅広いカテゴリの記事を、一覧ページ（/news/）と個別記事ページ
 * （/news/[slug]/）として公開するためのデータである。
 *
 * 運用前提（CLAUDE.md「ニュースを外部サイトから自動取得したり、自動公開
 * したりする機能は今回は作らない」）: 記事は外部サイトの自動収集・自動公開を
 * 行わず、ChatGPT等の定期調査で作成した記事案を人が確認したうえで
 * `src/data/news.json` へ手動追加する運用を前提にする。そのため本ファイルは
 * データ形状の契約のみを持ち、収集・生成ロジックは持たない。
 *
 * 所有者: リード（型契約。src/types/**）。実データは data-content 担当が
 * `src/data/news.json` を編集する（businesses.json/sponsors.jsonと同じ、
 * JSON + Zod検証という既存の構成に合わせている）。
 */

/**
 * 記事カテゴリ（CLAUDE_CODE_HANDOFF.md追加要件「想定カテゴリ」に対応）。
 * 表示ラベルは `src/pages/_lib/news-display.ts` の `NEWS_CATEGORY_LABELS` を
 * 正とする（statusToDisplayLabel()と同様、変換ロジックを他に作らない）。
 */
export const NEWS_CATEGORIES = [
  'cemetery_news',
  'area_news',
  'notable_graves',
  'history',
  'local_shops',
  'visiting_info',
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export interface NewsArticle {
  /** 記事ページのURL（/news/${slug}/）に使う識別子。小文字英数字とハイフンのみ。 */
  slug: string;
  title: string;
  category: NewsCategory;
  /** 公開日（YYYY-MM-DD）。この日付を過ぎるまで一覧・詳細に表示されない。 */
  publishedAt: string;
  /** 本文を実際に更新した日（YYYY-MM-DD）。更新していない場合は省略する。 */
  updatedAt?: string;
  /** 一覧カード用の短い概要（省略可）。 */
  summary?: string;
  /** 記事本文（段落ごとの配列。プレーンテキストのみ、HTML/Markdownは解釈しない）。 */
  body: string[];
  /** 参考にした情報源の名称（sourceUrlとセットで指定する）。 */
  sourceName?: string;
  /** 参考にした情報源のURL（sourceNameとセットで指定する）。 */
  sourceUrl?: string;
  /** falseの場合、公開日に関わらず一覧・詳細のどちらにも表示しない（下書き）。 */
  published: boolean;
}

export interface NewsDataset {
  schemaVersion: string;
  articles: NewsArticle[];
}
