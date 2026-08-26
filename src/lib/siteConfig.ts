import type { SiteConfig } from '../types/site';

/**
 * サイト全体設定の実値。
 * 正本: CLAUDE_CODE_HANDOFF.md 1章・2章。
 * 所有者: リード（他エージェントは値の参照のみ行い、直接編集しない）。
 */
export const siteConfig: SiteConfig = {
  name: '多磨霊園のお墓相談比較ガイド',
  subtitle: '墓じまい・管理・納骨・石材店を公開情報で比較',
  locale: 'ja-JP',
  officialDisclaimer:
    '当サイトは東京都、多磨霊園、東京都公園協会の公式サイトではありません。地域事業者の公開情報を整理した民間の比較情報サイトです。',
  contact: {
    correctionUrl: '/about/',
    contactEmail: null,
  },
  // 本番originはCloudflare Pagesのデプロイ確定後にリードが設定する。
  productionOrigin: null,
};
