/**
 * ヘッダー・フッター・モバイルメニューが共有するナビゲーション定義の正本。
 *
 * 2026-09-02、ナビゲーション・運営者表示・SEO/AIO監査対応で新設。
 * これまでBaseLayout.astro内にヘッダー用・フッター用のリンクがそれぞれ
 * 直書きされており、ページの追加・改名時にヘッダー／フッター／モバイル
 * メニューのリンク先が食い違う恐れがあった。本ファイルを唯一の正本にし、
 * 表示方法（ヘッダーは主要4項目のみ、フッターはサイト全体のサイトマップ、
 * モバイルメニューは主要4項目＋運営系ページ）はBaseLayout.astro側で
 * 作り分ける。
 *
 * 所有者: リード（src/lib/** は共有契約）。
 */
import { ROUTES } from './routes';

export interface NavLinkItem {
  label: string;
  /** サイト内パス。フッターの「スポンサー掲載について」のようにハッシュを含む場合がある。 */
  path: string;
}

export interface NavDropdownItem {
  label: string;
  /** ドロップダウンのDOM id（aria-controls等で使う）。 */
  id: string;
  items: NavLinkItem[];
}

export type PrimaryNavEntry =
  | ({ kind: 'link' } & NavLinkItem)
  | ({ kind: 'dropdown' } & NavDropdownItem);

/**
 * ヘッダー主要ナビ（PC原則4項目）。
 * 「多磨霊園を知る」はドロップダウンとし、著名人墓所・歴史・ガイド一覧を
 * ヘッダーから直接たどれるようにする（フッターを見つけないと到達できない
 * 状態を解消する）。
 */
export const PRIMARY_NAV: PrimaryNavEntry[] = [
  { kind: 'link', label: '石材店を探す', path: ROUTES.sekizaiten.path },
  { kind: 'link', label: '墓じまい・手続き', path: ROUTES.guideProcedures.path },
  { kind: 'link', label: '墓参り・アクセス', path: ROUTES.access.path },
  {
    kind: 'dropdown',
    label: '多磨霊園を知る',
    id: 'nav-dropdown-guide',
    items: [
      { label: '多磨霊園ガイド一覧', path: ROUTES.guide.path },
      { label: '多磨霊園の歴史', path: ROUTES.guideHistory.path },
      { label: '多磨霊園に眠る著名人', path: ROUTES.guideFamousGraves.path },
    ],
  },
];

/** モバイルメニュー内、主要ページに続けて表示する運営系ページ。 */
export const OPERATOR_NAV: NavLinkItem[] = [
  { label: '運営方針・掲載基準・広告方針', path: ROUTES.about.path },
  { label: '運営者情報', path: ROUTES.operator.path },
  { label: '情報源・最終確認日', path: ROUTES.sources.path },
  { label: 'プライバシーポリシー', path: ROUTES.privacy.path },
];

/** フッター最上部、常時表示の主要リンク4本。 */
export const FOOTER_PRIMARY_LINKS: NavLinkItem[] = [
  { label: 'トップ', path: ROUTES.top.path },
  { label: '石材店一覧・比較', path: ROUTES.sekizaiten.path },
  { label: '墓じまい・手続き', path: ROUTES.guideProcedures.path },
  { label: '運営方針', path: ROUTES.about.path },
];

export interface FooterNavGroup {
  label: string;
  items: NavLinkItem[];
}

/** フッターの分類別サイトマップ（3グループ）。 */
export const FOOTER_NAV_GROUPS: FooterNavGroup[] = [
  {
    label: '比較する',
    items: [
      { label: 'トップ', path: ROUTES.top.path },
      { label: '石材店一覧・比較', path: ROUTES.sekizaiten.path },
      { label: '墓じまいの比較', path: ROUTES.hakajimai.path },
      { label: '墓所管理の比較', path: ROUTES.kanri.path },
    ],
  },
  {
    label: 'ガイド',
    items: [
      { label: '多磨霊園を知る', path: ROUTES.guide.path },
      { label: '行き方・園内案内', path: ROUTES.access.path },
      { label: '墓じまい・手続き総合案内', path: ROUTES.guideProcedures.path },
      { label: '改葬・手続きの公式リンク', path: ROUTES.tetsuzuki.path },
      { label: '歴史', path: ROUTES.guideHistory.path },
      { label: '著名人墓所', path: ROUTES.guideFamousGraves.path },
    ],
  },
  {
    label: '運営',
    items: [
      { label: '運営方針・掲載基準・広告方針・訂正窓口', path: ROUTES.about.path },
      { label: 'スポンサー掲載について', path: `${ROUTES.about.path}#sponsor-info-heading` },
      { label: '運営者情報', path: ROUTES.operator.path },
      { label: '情報源・最終確認日', path: ROUTES.sources.path },
      { label: 'プライバシーポリシー', path: ROUTES.privacy.path },
    ],
  },
];

/**
 * 現在表示中のページを指すリンクかどうか（aria-current="page"用）。
 * 末尾スラッシュの有無・ハッシュの違いを吸収して比較する。
 */
export function isCurrentPath(pathname: string, targetPath: string): boolean {
  const normalize = (p: string): string => {
    const withoutHash = p.split('#')[0] ?? p;
    return withoutHash.endsWith('/') ? withoutHash : `${withoutHash}/`;
  };
  return normalize(pathname) === normalize(targetPath);
}
