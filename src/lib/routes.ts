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
  sekizaiten: { path: '/sekizaiten/', description: '14社の一覧・比較表' },
  hakajimai: { path: '/hakajimai/', description: '墓じまい・墓石撤去の比較と見積項目' },
  kanri: { path: '/kanri/', description: '墓所管理・清掃・供花の比較' },
  tetsuzuki: { path: '/tetsuzuki/', description: '改葬・墓所返還・施設変更の違いと公式リンク' },
  about: { path: '/about/', description: '運営方針、掲載基準、広告方針、訂正窓口' },
  sources: { path: '/sources/', description: '情報源・最終確認日' },
  privacy: { path: '/privacy/', description: 'プライバシーポリシー' },

  // feature/content-guide-and-sponsored-results（2026-08-27）で追加。
  // 石材店比較（既存ページ、URL不変）とは別枠の「多磨霊園ガイド」情報記事群。
  // 既存ページを削除・改名せず、ヘッダー主要ナビは最大4項目に保つため、
  // これらは各ヘッダー項目からのリンク先（ガイド一覧／総合案内）として使う。
  guide: { path: '/guide/', description: '多磨霊園ガイド一覧（アクセス・手続き・歴史/著名人の3カテゴリ）' },
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
} as const satisfies Record<string, SiteRoute>;

export type RouteKey = keyof typeof ROUTES;
