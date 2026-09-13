/**
 * ページパスから分析イベント用の大分類（page_category）を求める。
 *
 * スポンサー枠が全ページ共通表示になった（2026-08-28）ことに伴い、
 * sponsor_impression / sponsor_click イベントで「どの種類のページで
 * 表示・クリックされたか」を区別できるようにするための補助関数。
 * ルーティング自体（src/lib/routes.ts）や表示内容は変更しない、
 * 分析専用の分類。
 *
 * 所有者: リード（src/lib/analytics/**）。
 */
export type PageCategory = 'top' | 'comparison' | 'procedure' | 'guide' | 'policy' | 'other';

export function resolvePageCategory(pathname: string): PageCategory {
  if (pathname === '/') return 'top';
  if (
    pathname.startsWith('/sekizaiten/') ||
    pathname.startsWith('/hakajimai/') ||
    pathname.startsWith('/kanri/')
  ) {
    return 'comparison';
  }
  if (pathname.startsWith('/tetsuzuki/')) return 'procedure';
  if (
    pathname.startsWith('/guide/') ||
    pathname.startsWith('/access/') ||
    pathname.startsWith('/news/')
  )
    return 'guide';
  if (
    pathname.startsWith('/about/') ||
    pathname.startsWith('/sources/') ||
    pathname.startsWith('/privacy/')
  ) {
    return 'policy';
  }
  return 'other';
}
