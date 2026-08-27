/**
 * サイト全体設定の型契約。実値は src/lib/siteConfig.ts が保持する。
 * 所有者: リード（src/types/**）
 *
 * 2026-08-27（サイト所有者判断による誤認防止ルール改定）:
 * 非公式表記の定型文を保持していた `officialDisclaimer` フィールドを削除した。
 * CLAUDE.md 2章の改定に伴い、常時表示の注意書きではなく、専用ページでの
 * 運営者情報の明示（`/about/`）で誤認防止を担保する方式へ変更したため。
 */

export interface SiteRoute {
  /** 末尾スラッシュ付きの絶対パス。例: "/hakajimai/" */
  path: string;
  /** ページの役割の短い説明（開発者向け、画面には出さない）。 */
  description: string;
}

export interface SiteConfig {
  name: string;
  subtitle: string;
  locale: 'ja-JP';
  contact: {
    correctionUrl: SiteRoute['path'];
    contactEmail: string | null;
  };
  /** 本番URLはデプロイ確定後にリードが設定する。sitemap/canonical生成に使用。 */
  productionOrigin: string | null;
}
