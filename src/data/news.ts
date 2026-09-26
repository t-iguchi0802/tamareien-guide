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
    slug: '2026-tama-bird-watching',
    title: '多磨霊園の野鳥観察会、申込受付中　残り2名（9月14日11時38分確認）',
    summary:
      '2026年10月3日に開催される多磨霊園の野鳥観察会について、申込フォームを確認したところ、2026年9月14日11時38分時点で残り2名でした。',
    description:
      '多磨霊園で2026年10月3日に開催される野鳥観察会の最新申込状況を確認。2026年9月14日11時38分時点で残り2名です。',
    category: '多磨霊園のニュース',
    publishedAt: '2026-09-14',
    updatedAt: '2026-09-14',
    status: 'published',
    sections: [
      {
        heading: '10月3日に野鳥観察会を開催',
        paragraphs: [
          '多磨霊園では、2026年10月3日（土）午前9時から正午まで、野鳥観察会が開催されます。野鳥写真家の叶内拓哉氏による基礎講座の後、園内を観察します。',
          '参加費は50円で、定員は30名の先着順です。小雨決行、荒天中止となっています。',
        ],
      },
      {
        heading: '申込フォームでは残り2名',
        paragraphs: [
          '2026年9月14日11時38分（日本時間）に公式申込フォームを確認した時点では、残りはあと2名と表示されていました。申込状況は変わる可能性があるため、参加を希望する場合は早めの確認がおすすめです。',
          '申込期限は9月25日ですが、定員に達した時点で受付終了となります。',
        ],
      },
      {
        heading: '飲み物や雨具を準備',
        paragraphs: [
          '集合場所は、みたま堂休憩所前です。飲み物、雨具、双眼鏡などを準備します。双眼鏡は貸し出しもあります。',
          '墓参りとあわせて参加する場合は、墓所内や周囲での観察、撮影が迷惑にならないよう配慮しましょう。',
        ],
      },
    ],
    sources: [
      {
        name: '公益財団法人東京都公園協会',
        title: '多磨霊園 野鳥観察会のお知らせ',
        url: 'https://www.tokyo-park.or.jp/reien/tama/news/2026/park_info_28.html',
        publishedAt: '2026-08-26',
        checkedAt: '2026-09-14',
      },
      {
        name: '公益財団法人東京都公園協会',
        title: '野鳥観察会 申込フォーム',
        url: 'https://form.run/@tama-Jwl66v6xxf4gMYFa56TP',
        checkedAt: '2026-09-14',
      },
    ],
  },
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
  {
    slug: '2026-tama-cemetery-park-graveyard-history',
    title: '多磨霊園はなぜ公園のように広い？墓所を敷地の半分以下にした設計',
    summary:
      '多磨霊園が公園墓地と呼ばれる理由を、開園の背景、面積、緑地を確保した設計から短く紹介します。',
    description:
      '多磨霊園の歴史と広さを公式資料で確認。墓所部分を敷地全体の50％以下に抑えた、公園墓地としての設計を紹介します。',
    category: '多磨霊園の歴史',
    publishedAt: '2026-09-26',
    updatedAt: '2026-09-26',
    status: 'published',
    sections: [
      {
        heading: '多磨霊園は日本初の公園墓地',
        paragraphs: [
          '多磨霊園は1923年4月1日に開園しました。東京都の案内では、海外の森林墓地を参考にしてつくられた、日本初の公園墓地と紹介されています。',
          'そのため、多磨霊園には墓所だけでなく、アカマツや雑木林、桜並木などの緑が残されています。',
        ],
      },
      {
        heading: '墓所部分は敷地の半分以下',
        paragraphs: [
          '多磨霊園の面積は1,280,237平方メートル、約128ヘクタールです。都立8霊園の中で最も広い霊園とされています。',
          '公式案内図によると、実際の墓所面積は敷地全体の50％以下に抑えられています。墓所を広げすぎず、豊かな緑地を確保する設計です。',
        ],
      },
      {
        heading: '100年以上前の計画が現在の景観につながる',
        paragraphs: [
          '開設時の面積はおよそ100万平方メートルでした。その後、1939年に西側へ拡張され、現在の約128万平方メートルになりました。',
          '墓域は園路によって26区に分けられています。広い道路と緑地の間に墓域が配置されていることが、多磨霊園の公園のような印象につながっています。',
        ],
      },
      {
        heading: '墓参りのときに見える多磨霊園の特徴',
        paragraphs: [
          '多磨霊園を訪れたときは、墓石だけでなく、園路の広さや樹木の配置にも目を向けると、この霊園が「公園墓地」と呼ばれる理由を感じやすくなります。',
          '墓所の位置や園内の施設は、出発前に公式の案内図や墓所ナビで確認できます。',
        ],
      },
    ],
    sources: [
      {
        name: '公益財団法人東京都公園協会',
        title: '多磨霊園｜TOKYO霊園さんぽ',
        url: 'https://www.tokyo-park.or.jp/reien/tama/index.html',
        checkedAt: '2026-09-26',
      },
      {
        name: '公益財団法人東京都公園協会',
        title: '東京都多磨霊園案内図',
        url: 'https://www.tokyo-park.or.jp/reien/tama/assets/%E5%9C%92%E5%86%85%E3%83%9E%E3%83%83%E3%83%97%EF%BC%88%E6%97%A5%E6%9C%AC%E8%AA%9E%EF%BC%89_2.pdf?date=20260913110120',
        checkedAt: '2026-09-26',
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
