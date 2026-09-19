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
 *
 * 問い合わせ窓口の確定（2026-09-02、「スポンサー掲載ページと訂正窓口の
 * 文章」対応）: `contactEmail`が確定したため、null（「準備中」表示）から
 * 実際のアドレスへ更新した。スポンサー掲載・訂正依頼とも同じアドレスを
 * 使うが、`src/pages/about/index.astro`側でmailtoのsubject/bodyを
 * 用途ごとに変えて区別する。
 */
export const siteConfig: SiteConfig = {
  name: '多磨霊園 お墓ガイド',
  subtitle: '多磨霊園の石材店・墓じまい・管理を比較',
  locale: 'ja-JP',
  contact: {
    correctionUrl: '/about/',
    contactEmail: 't.iguchi@sunarrows-tky.co.jp',
  },
  // 運営法人（2026-09-02、ナビゲーション・運営者表示・SEO/AIO監査対応で追加）。
  // ユーザーから明示された確定情報のみを保持する（社名・会社公式サイトURL）。
  // 所在地・代表者名・電話番号・法人番号・メールアドレス等はリポジトリ内に
  // 正本がないため記載しない（不足情報は最終報告で列挙する）。
  operator: {
    name: '株式会社サンアローズ',
    url: 'https://sunarrows-tky.co.jp/',
  },
  // 本番ドメイン確定（2026-09-02、「公開前の最終確認とGitHubへのpush準備」
  // 対応、ユーザー指定）。canonical・OGP・構造化データ・sitemap.xmlの
  // 絶対URLは、buildCanonicalUrl()（src/lib/seo/canonical.ts）がこの値を
  // 参照して自動的に組み立てる。
  productionOrigin: 'https://tamareien-guide.jp',
};
