import type { SiteRoute } from '../types/site';

/**
 * MVPページURL契約。
 * 正本: CLAUDE_CODE_HANDOFF.md 5章「MVPのページ」。
 * pages担当（feature/pages）は、この一覧にあるURLでsrc/pages/**を構成する。
 * URLを追加・変更する場合はリードがこのファイルを更新する。
 *
 * 所有者: リード（src/lib/routes.ts は共有契約として扱う）
 */
export const ROUTES = {
  top: { path: '/', description: 'トップ・困りごと別入口' },
  sekizaiten: { path: '/sekizaiten/', description: '周辺事業者の一覧・比較表' },
  hakajimai: { path: '/hakajimai/', description: '墓じまい・墓石撤去の比較と見積項目' },
  kanri: { path: '/kanri/', description: '墓所管理・清掃・供花の比較' },
  tetsuzuki: { path: '/tetsuzuki/', description: '改葬・墓所返還・施設変更の違いと公式リンク' },
  about: { path: '/about/', description: '運営者、掲載情報、スポンサー掲載、訂正窓口' },
  sources: { path: '/sources/', description: '情報源・最終確認日' },
  privacy: { path: '/privacy/', description: 'プライバシーポリシー' },
  // 2026-09-02、ナビゲーション・運営者表示・SEO/AIO監査対応で追加。
  // 運営法人（株式会社サンアローズ）を明示する専用ページ。
  // /about/（掲載基準・広告方針）とは役割を分け、運営者情報だけを扱う。
  operator: { path: '/operator/', description: '運営者情報（運営法人・サイトの目的）' },

  // feature/content-guide-and-sponsored-results（2026-08-27）で追加。
  // 石材店比較（既存ページ、URL不変）とは別枠の「多磨霊園ガイド」情報記事群。
  // 既存ページを削除・改名せず、ヘッダー主要ナビは最大4項目に保つため、
  // これらは各ヘッダー項目からのリンク先（ガイド一覧／総合案内）として使う。
  guide: {
    path: '/guide/',
    description: '多磨霊園ガイド一覧（アクセス・手続き・歴史/著名人の3カテゴリ）',
  },
  access: { path: '/access/', description: '多磨霊園への行き方（電車・バス・車、門の選び方）' },
  guideHistory: { path: '/guide/history/', description: '多磨霊園の歴史（1923年開園の経緯）' },
  guideFamousGraves: { path: '/guide/famous-graves/', description: '多磨霊園に眠る著名人ガイド' },
  guideProcedures: {
    path: '/guide/procedures/',
    description: '墓じまい・お墓の手続き 総合案内（既存の比較・手続きページの入口）',
  },
  guideProceduresHakajimaiVsKaisou: {
    path: '/guide/procedures/hakajimai-to-kaisou/',
    description: '墓じまいと改葬の違い｜多磨霊園で手続きを始める前に',
  },

  // ニュース・記事掲載機能（2026-09-13追加、2026-09-14に名称整理）。
  // TOPの「多磨霊園の公式お知らせ」（src/pages/_lib/tama-news.ts、東京都公園
  // 協会の公式発表のみ）とは別枠の、「周辺の読みもの」（独自の地域メディア・
  // ブログ枠）の一覧・詳細ページ。両者の役割分担はCLAUDE.md2章「公式情報と
  // 周辺の読みものの分離」を正とする。個別記事（/news/[slug]/）はslugごとの
  // 動的ルートのため、単一のURLを持つROUTESには含めない（一覧・詳細それぞれの
  // 生成先はsrc/pages/sitemap.xml.ts側でgetPublishedNewsArticles()から
  // 個別に追加する）。URL（/news/）自体は既存リンクを維持するため変更しない。
  news: { path: '/news/', description: '多磨霊園・周辺の読みもの一覧' },
} as const satisfies Record<string, SiteRoute>;

export type RouteKey = keyof typeof ROUTES;
