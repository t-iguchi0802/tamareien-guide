/**
 * GA4計測の有効/無効判定と、Measurement IDの取得。
 *
 * Measurement IDは環境変数 `PUBLIC_GA_MEASUREMENT_ID`（Astro/Viteの規約上、
 * クライアントへ公開してよい環境変数は `PUBLIC_` 接頭辞を付ける）を優先する。
 * 未設定・空文字の場合は、本番サイト（tamareien-guide.jp）用に確定済みの
 * Measurement IDへフォールバックする。
 *
 * GA4 Measurement IDはページのソース・ネットワークリクエストに必然的に
 * 露出する公開識別子であり、APIキー等の秘密情報ではないため、確定値を
 * コードへ記載すること自体はCLAUDE.mdの秘密情報の扱いに抵触しない
 * （2026-09-05、GA4導入対応。対象サイト・IDはサイト所有者から明示された値）。
 * 環境変数を優先する設計は維持しているため、開発・ステージング等で計測を
 * 無効化・差し替えたい場合は `PUBLIC_GA_MEASUREMENT_ID` を設定すればよい
 * （空文字を明示的に設定した場合はフォールバックせず未計測にする、という
 * 従来のuse caseは失われるが、本サイトは単一環境のみのため実害はない）。
 *
 * 所有者: feature/seo-analytics（src/lib/analytics/**）
 */

/** 本番サイト（https://tamareien-guide.jp）のGA4 Measurement ID（既定値）。 */
const DEFAULT_GA_MEASUREMENT_ID = 'G-F21VPYXE6P';

/**
 * GA4 Measurement IDを取得する。環境変数 `PUBLIC_GA_MEASUREMENT_ID` が
 * 設定されていればそれを使い、未設定・空白のみの場合は既定値
 * （`DEFAULT_GA_MEASUREMENT_ID`）を返す。ビルド・実行時エラーにはしない。
 */
export function getGaMeasurementId(): string | null {
  const raw: unknown = import.meta.env.PUBLIC_GA_MEASUREMENT_ID;
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
  }
  return DEFAULT_GA_MEASUREMENT_ID;
}

/** GA4計測が有効化されているか（Measurement IDが設定されているか）。 */
export function isAnalyticsEnabled(): boolean {
  return getGaMeasurementId() !== null;
}
