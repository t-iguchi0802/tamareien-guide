/**
 * GA4計測の有効/無効判定と、Measurement IDの取得。
 *
 * Measurement IDはリポジトリへ直書きせず、環境変数
 * `PUBLIC_GA_MEASUREMENT_ID` から読む（Astro/Viteの規約上、クライアントへ
 * 公開してよい環境変数は `PUBLIC_` 接頭辞を付ける）。
 * 未設定・空文字の場合は計測を静かにスキップできるよう `null` を返す。
 *
 * 所有者: feature/seo-analytics（src/lib/analytics/**）
 */

/**
 * GA4 Measurement IDを環境変数から取得する。
 * 未設定・空白のみの場合は `null` を返す（ビルド・実行時エラーにしない）。
 */
export function getGaMeasurementId(): string | null {
  const raw: unknown = import.meta.env.PUBLIC_GA_MEASUREMENT_ID;
  if (typeof raw !== 'string') {
    return null;
  }
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** GA4計測が有効化されているか（Measurement IDが設定されているか）。 */
export function isAnalyticsEnabled(): boolean {
  return getGaMeasurementId() !== null;
}
