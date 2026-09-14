/**
 * 「いまの多磨霊園」（TOPページ、条件選択の下）で使う短いお知らせ一覧。
 *
 * 【公式情報／周辺の読みもの の役割分担（2026-09-14、サイト所有者判断による
 * 恒久ルール。詳細はCLAUDE.md2章「公式情報と周辺の読みものの分離」）】
 * このファイルは、多磨霊園・東京都・公益財団法人東京都公園協会・関係自治体・
 * 交通機関・公共施設等の**公式発表・一次情報だけ**を扱う（＝「公式情報」枠）。
 * 独自取材の読みもの・ブログ的な記事（周辺の飲食店、散歩、季節の風景、歴史、
 * 著名人紹介等）は、ここではなく `src/data/news.json`（`NewsArticle`、
 * 「周辺の読みもの」枠）へ入れる。公式発表の要約記事を`news.json`側へ
 * 誤って入れない（過去に一度、`news.json`へ公式発表記事が混入したため、
 * 本コメントで明記する）。
 *
 * 出典: 公益財団法人東京都公園協会の公式サイト（多磨霊園個別のお知らせ
 * ページ、または都立霊園共通の募集・抽選結果ページ）のみ。公開日と
 * リンク先が確認できたものだけを掲載する（2026-09-01、WebFetchで直接
 * 内容を確認済み）。毎日の一般ニュースの転載・AIによる言い換え・
 * 内容の薄い記事の量産は行わない（最大3件、東京都公園協会の公式発表の
 * 要点だけを短く紹介する）。
 *
 * `expiresAt`（期限）を過ぎた項目はTOPへ表示しない
 * （ビルド時点の日付で判定。src/pages/access/index.astroの
 * HIGAN_NOTICE_2026_SEPと同じ考え方）。期限のない項目は`expiresAt`を
 * 省略する。
 *
 * 表示件数は先頭`MAX_ITEMS`件（現在の日付を基準にソートし直す処理は持たない）
 * ため、新しい項目は配列の**先頭**に追加すること（末尾に追加すると、
 * 期限のない古い項目に埋もれて表示されないことがある）。
 */
export interface TamaNewsItem {
  title: string;
  publishedAt: string;
  sourceName: string;
  sourceUrl: string;
  /** 期間限定のお知らせの場合、表示を終える日（YYYY-MM-DD）。 */
  expiresAt?: string;
}

export const TAMA_NEWS_ITEMS: TamaNewsItem[] = [
  {
    // 2026-09-14、src/data/news.json（周辺の読みもの枠）から移設。
    // 東京都公園協会の公式発表そのものであり、独自取材の読みものではないため
    // （CLAUDE.md2章「公式情報と周辺の読みものの分離」）、公式お知らせ枠へ
    // 移した。タイトル・公開日・公式リンクは移設元と同一のまま保持している。
    title: '多磨霊園で10月1日に合葬埋蔵施設の献花式　代表献花は10時・14時',
    publishedAt: '2026-09-13',
    sourceName: '公益財団法人東京都公園協会',
    sourceUrl: 'https://www.tokyo-park.or.jp/reien/tama/news/2026/7_1.html',
    expiresAt: '2026-10-01',
  },
  {
    title: '9月お彼岸期間の開閉門時間とみたま堂（献花台）について',
    publishedAt: '2026-08-19',
    sourceName: '公益財団法人東京都公園協会',
    sourceUrl: 'https://www.tokyo-park.or.jp/reien/tama/news/2026/park_info_1_1_2.html',
    expiresAt: '2026-09-25',
  },
  {
    title: '多磨霊園 野鳥観察会（10月3日開催、申込残り2名・9月14日11時38分確認）',
    publishedAt: '2026-08-26',
    sourceName: '公益財団法人東京都公園協会',
    sourceUrl: 'https://www.tokyo-park.or.jp/reien/tama/news/2026/park_info_28.html',
    expiresAt: '2026-09-25',
  },
  {
    title: '令和8年度 都立霊園使用者募集の抽選結果について',
    publishedAt: '2026-08-31',
    sourceName: '公益財団法人東京都公園協会',
    sourceUrl: 'https://www.tokyo-park.or.jp/reien/use/new_user/results/index.html',
  },
];

const MAX_ITEMS = 3;

/** 期限切れの項目を除いた、表示すべき「いまの多磨霊園」を返す（ビルド時点の日付で判定）。 */
export function getActiveTamaNewsItems(now: Date = new Date()): TamaNewsItem[] {
  return TAMA_NEWS_ITEMS.filter((item) => {
    if (!item.expiresAt) return true;
    const expires = new Date(`${item.expiresAt}T23:59:59+09:00`);
    return now <= expires;
  }).slice(0, MAX_ITEMS);
}
