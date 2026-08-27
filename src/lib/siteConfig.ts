import type { SiteConfig } from '../types/site';

/**
 * サイト全体設定の実値。
 * 正本: CLAUDE_CODE_HANDOFF.md 1章・2章（非公式表記の常時表示に関する記載は
 * 2026-08-27付でCLAUDE.md側が優先。サイト所有者判断により廃止）。
 * 所有者: リード（他エージェントは値の参照のみ行い、直接編集しない）。
 *
 * 2026-08-27: `officialDisclaimer`（非公式表記の定型文）を削除した。
 * 運営者情報は `/about/` ページの本文（独自の説明文）で表示している。
 */
export const siteConfig: SiteConfig = {
  name: '多磨霊園のお墓相談比較ガイド',
  subtitle: '墓じまい・管理・納骨・石材店を公開情報で比較',
  locale: 'ja-JP',
  contact: {
    correctionUrl: '/about/',
    contactEmail: null,
  },
  // 本番originはCloudflare Pagesのデプロイ確定後にリードが設定する。
  productionOrigin: null,
};
