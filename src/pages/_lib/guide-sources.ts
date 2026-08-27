/**
 * 多磨霊園ガイド記事（src/pages/guide/**、src/pages/access/**）専用の出典定義。
 *
 * businesses.json / sources.csv（正本、内容を変更しない）とは別に、
 * ガイド記事だけで使う出典（多磨霊園の公式概要ページ、公式園内マップPDF、
 * 公式墓所ナビ等）をここにまとめる。sources.csv 側には既に事業者比較用の
 * 出典（SRC-TAMA-OFFICIAL 等）があるが、そちらは変更せず、
 * getSourceById() 経由でそのまま参照できるものは各ページで直接参照する
 * （例: SRC-TAMA-OFFICIAL）。
 *
 * checkedAt はこのガイド機能を実装した際に実際にページ内容を確認した日付。
 * 各記事は公式サイトの一次情報を要約したものであり、本文の転載はしない。
 */
export interface GuideSource {
  publisher: string;
  title: string;
  url: string;
  checkedAt: string;
}

export const GUIDE_SOURCES = {
  tamaOverview: {
    publisher: '公益財団法人東京都公園協会',
    title: '都立霊園の概要',
    url: 'https://www.tokyo-park.or.jp/reien/overview_reien/index.html',
    checkedAt: '2026-08-27',
  },
  tamaMapPdf: {
    publisher: '公益財団法人東京都公園協会',
    title: '多磨霊園 園内マップ（日本語）PDF',
    url: 'https://www.tokyo-park.or.jp/reien/tama/assets/%E5%9C%92%E5%86%85%E3%83%9E%E3%83%83%E3%83%97%EF%BC%88%E6%97%A5%E6%9C%AC%E8%AA%9E%EF%BC%89_2.pdf',
    checkedAt: '2026-08-27',
  },
  tamaHakaNavi: {
    publisher: '公益財団法人東京都公園協会',
    title: '多磨霊園 墓所ナビ（経路案内）',
    url: 'https://boshu.tokyo-park-reien.jp/map/tamareien',
    checkedAt: '2026-08-27',
  },
  googleMapsTama: {
    publisher: 'Google マップ',
    title: 'Googleマップで「多磨霊園」を開く',
    url: 'https://www.google.com/maps/search/?api=1&query=%E5%A4%9A%E7%A3%A8%E9%9C%8A%E5%9C%92',
    checkedAt: '2026-08-27',
  },
} as const satisfies Record<string, GuideSource>;
