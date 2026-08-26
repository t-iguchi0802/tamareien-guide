/**
 * サイト全体設定の型契約。実値は src/lib/siteConfig.ts が保持する。
 * 所有者: リード（src/types/**）
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
  /** CLAUDE_CODE_HANDOFF.md 記載の非公式表記。ヘッダー・フッター・運営者情報に表示する。 */
  officialDisclaimer: string;
  contact: {
    correctionUrl: SiteRoute['path'];
    contactEmail: string | null;
  };
  /** 本番URLはデプロイ確定後にリードが設定する。sitemap/canonical生成に使用。 */
  productionOrigin: string | null;
}
