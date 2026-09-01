import type { SiteConfig } from '../types/site';

/**
 * サイト全体設定の実値。
 * 正本: CLAUDE_CODE_HANDOFF.md 1章・2章（非公式表記の常時表示に関する記載は
 * 2026-08-27付でCLAUDE.md側が優先。サイト所有者判断により廃止）。
 * 所有者: リード（他エージェントは値の参照のみ行い、直接編集しない）。
 *
 * 2026-08-27: `officialDisclaimer`（非公式表記の定型文）を削除した。
 * 運営者情報は `/about/` ページの本文（独自の説明文）で表示している。
 *
 * ブランド表示の短縮（2026-09-02、ミチの編集改善・SEO/AIO対応）:
 * 画面上（ヘッダー・フッター・本文中の「当サイト」表記）は
 * 「多磨霊園 お墓ガイド」という短い名称にした。従来の長い名称
 * 「多磨霊園のお墓相談比較ガイド」は、ブラウザタブ・検索結果に出る
 * <title>のほうへ、ページごとに個別の文言として残す
 * （src/layouts/BaseLayout.astroはpropsのtitleをそのまま<title>へ出す
 * 方式に変更し、siteConfig.nameを自動的に末尾へ付け足す処理はやめた。
 * 各ページのtitle定数側で、必要に応じてブランド名を含める）。
 * subtitleは画面表示用の短い補足（ヘッダー直下）専用とし、
 * meta descriptionには使わない（各ページが個別に用意する）。
 */
export const siteConfig: SiteConfig = {
  name: '多磨霊園 お墓ガイド',
  subtitle: '石材店・墓じまい・管理を目的から探す',
  locale: 'ja-JP',
  contact: {
    correctionUrl: '/about/',
    contactEmail: null,
  },
  // 本番originはCloudflare Pagesのデプロイ確定後にリードが設定する。
  productionOrigin: null,
};
