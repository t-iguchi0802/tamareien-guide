/**
 * 「いまの多磨霊園」（TOPページ、条件選択の下）で使う短いお知らせ一覧。
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
    title: '9月お彼岸期間の開閉門時間とみたま堂（献花台）について',
    publishedAt: '2026-08-19',
    sourceName: '公益財団法人東京都公園協会',
    sourceUrl: 'https://www.tokyo-park.or.jp/reien/tama/news/2026/park_info_1_1_2.html',
    expiresAt: '2026-09-25',
  },
  {
    title: '多磨霊園 野鳥観察会（10月3日開催、9月25日申込締切）',
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
