export const NEWS_CATEGORIES = [
  '多磨霊園のニュース',
  '周辺地域のニュース',
  '多磨霊園に眠る著名人',
  '多磨霊園の歴史',
  '周辺の飲食店・店舗・散策情報',
  '墓参り・アクセスなどの実用情報',
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export interface NewsSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface NewsSource {
  name: string;
  title: string;
  url: string;
  publishedAt?: string;
  checkedAt: string;
}

export interface NewsArticle {
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: NewsCategory;
  publishedAt: string;
  updatedAt: string;
  status: 'draft' | 'published';
  sections: NewsSection[];
  sources: NewsSource[];
}

/**
 * 人が内容と一次情報を確認し、掲載を承認した記事だけを登録する。
 * 外部サイトの文章は転載せず、確認できた事実を当サイト向けに整理する。
 */
export const NEWS_ARTICLES: NewsArticle[] = [
  {
    slug: '2026-gassou-kenkashiki',
    title: '多磨霊園で10月1日に合葬埋蔵施設の献花式　代表献花は10時・14時',
    summary:
      '2026年10月1日に行われる合葬埋蔵施設の献花式について、開催時間、当日の内容、事前に用意したいものを整理しました。',
    description:
      '2026年10月1日に多磨霊園で行われる合葬埋蔵施設の献花式について、開催時間、代表献花、YouTube配信、持参物、アクセスを公式発表に基づき整理します。',
    category: '多磨霊園のニュース',
    publishedAt: '2026-09-13',
    updatedAt: '2026-09-13',
    status: 'published',
    sections: [
      {
        heading: '献花式は10月1日、10時から15時まで',
        paragraphs: [
          '公益財団法人東京都公園協会は、2026年10月1日（木）に、多磨霊園の合葬埋蔵施設で献花式を実施すると発表しました。',
          '開催時間は10時から15時までです。管理事務所長による代表献花と慰霊の辞は、10時と14時に予定されています。東京都と東京都公園協会による供花も行われます。',
          '14時頃には、代表献花と慰霊の辞の様子が東京都公園協会の公式YouTubeチャンネルで配信される予定です。',
        ],
      },
      {
        heading: '自由に献花できる時間があります',
        paragraphs: [
          '管理事務所長による代表献花の時間を除き、来園者は自由に献花できます。墓参者には管理事務所長からの弔意を表したメッセージカードが配布され、10時から15時頃まで休憩用テントも設置されます。',
          '今回は遺族代表による献花や芳名帳への記帳は行われず、記帳台も設置されません。',
        ],
      },
      {
        heading: '花や線香は事前に用意を',
        paragraphs: [
          '多磨霊園内では、献花用の花や線香は販売されていません。献花を予定している場合は、来園前に用意しておく必要があります。',
          '天候によっては気温が高くなることや悪天候も想定されます。水分、雨具、服装などを当日の予報に合わせて準備してください。',
        ],
      },
      {
        heading: '多磨霊園へのアクセス',
        paragraphs: [
          '西武多摩川線「多磨」駅からは徒歩約10分です。京王線「多磨霊園」駅、またはJR中央線「武蔵小金井」駅から京王バスを利用する場合は、「多磨霊園表門」下車、徒歩約2分です。',
          '当日の門の開閉時間やYouTube配信先などは、出発前に東京都公園協会の公式ページで最新情報をご確認ください。',
        ],
      },
    ],
    sources: [
      {
        name: '公益財団法人東京都公園協会',
        title: '令和8年度合葬埋蔵施設の献花式について',
        url: 'https://www.tokyo-park.or.jp/reien/tama/news/2026/7_1.html',
        publishedAt: '2026-09-11',
        checkedAt: '2026-09-13',
      },
      {
        name: '公益財団法人東京都公園協会',
        title: '多磨霊園（交通案内）',
        url: 'https://www.tokyo-park.or.jp/reien/tama/index.html',
        checkedAt: '2026-09-13',
      },
    ],
  },
];

export function getPublishedNewsArticles(): NewsArticle[] {
  return NEWS_ARTICLES.filter((article) => article.status === 'published').sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}

export function getRecentNewsArticles(limit = 3): NewsArticle[] {
  return getPublishedNewsArticles().slice(0, limit);
}
