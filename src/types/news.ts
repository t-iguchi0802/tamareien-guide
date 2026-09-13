/**
 * 「多磨霊園・周辺の読みもの」機能の型契約。
 *
 * 【公式情報／周辺の読みもの の役割分担（2026-09-14、サイト所有者判断による
 * 恒久ルール。詳細はCLAUDE.md2章「公式情報と周辺の読みものの分離」）】
 * 本サイトのコンテンツは次の2種類に明確に分離する。両者を混同しない。
 *
 * - **公式情報**（多磨霊園・東京都・公益財団法人東京都公園協会・関係自治体・
 *   交通機関・公共施設等の公式発表・一次情報）は、`src/pages/_lib/tama-news.ts`
 *   （`TamaNewsItem`）で扱う。TOPの「多磨霊園の公式お知らせ」に表示する。
 *   要点だけの短い要約＋公式リンクとし、独自記事のように加工しない。
 * - **周辺の読みもの**（独自の地域メディア・ブログ枠。周辺の飲食店・喫茶店・
 *   散策情報、季節の風景、多磨霊園の歴史、著名人の墓所と人物紹介、駅からの
 *   徒歩ルート、混雑・アクセスの実用情報、「墓参り＋◯◯」の半日コース等）は、
 *   **このファイルが定義する`NewsArticle`／`src/data/news.json`**で扱う。
 *   /news/ 一覧・詳細ページ、およびTOPの「多磨霊園・周辺の読みもの」に表示する。
 *
 * `NewsArticle`（本ファイル）は**公式発表の転載・要約だけの記事を入れる場所
 * ではない**。行政・公式機関の発表そのものを載せたい場合は、ここではなく
 * `tama-news.ts`側の`TamaNewsItem`を使うこと（2026-09-14、実際に公式発表
 * 記事が一度ここへ混入したため、移設し本コメントを追記した）。
 *
 * 周辺の読みものとしての編集方針:
 * - 単なるニュース転載・要約にしない。読んで面白い、行ってみたくなる、
 *   役に立つ記事を優先し、地域メディア・ブログとしての独自性を持たせる。
 * - 店舗の営業時間等の実用情報は公式情報を確認する。口コミのみで事実を
 *   断定しない。
 * - 著名人の墓所等、重要な事実は複数の信頼できる情報源で照合する。
 * - 事実と推測・感想を明確に分けて書く。
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
 * 記事カテゴリ（すべて「周辺の読みもの」枠のカテゴリであり、公式発表の
 * 分類ではない）。表示ラベルは `src/pages/_lib/news-display.ts` の
 * `NEWS_CATEGORY_LABELS` を正とする（statusToDisplayLabel()と同様、
 * 変換ロジックを他に作らない）。
 *
 * 2026-09-14改定: 旧`cemetery_news`/`area_news`（表示ラベルに「ニュース」を
 * 含んでいた）は、公式発表の要約と誤解されやすかったため、読みもの・特集
 * 記事であることが分かる`cemetery_feature`/`area_feature`へ改名した
 * （新規追加時点でこの2値を使ったデータが存在しなかったため、データ移行は
 * 不要だった）。
 */
export const NEWS_CATEGORIES = [
  'cemetery_feature',
  'area_feature',
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
