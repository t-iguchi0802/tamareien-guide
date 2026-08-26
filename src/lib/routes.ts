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
} as const satisfies Record<string, SiteRoute>;

export type RouteKey = keyof typeof ROUTES;
