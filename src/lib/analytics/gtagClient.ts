/**
 * gtag.js（GA4）への送信を行う最小のクライアント側ラッパー。
 *
 * - `window.gtag` が存在しない環境（GA4未設定、SSR/ビルド時、テスト環境、
 *   広告ブロッカー等）でも例外を投げず、静かに何もしない。
 * - どのイベント名・パラメータを送るかは `src/types/analytics.ts` の
 *   `AnalyticsEventParams` 判別共用体で型的に固定する。
 *
 * 所有者: feature/seo-analytics（src/lib/analytics/**）
 */

import type { AnalyticsEventName, AnalyticsEventParams } from '../../types/analytics';

declare global {
  interface Window {
    /** gtag.js（Google Analytics 4）が読み込まれている場合のみ存在する。 */
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type ParamsForEvent<Name extends AnalyticsEventName> = Extract<
  AnalyticsEventParams,
  { name: Name }
>['params'];

/**
 * GA4イベントを送信する。`window` や `window.gtag` が存在しない場合は
 * 何もしない（GA4未設定でもサイト動作に影響させないための唯一の送信経路）。
 */
export function sendGaEvent<Name extends AnalyticsEventName>(
  name: Name,
  params: ParamsForEvent<Name>,
): void {
  if (typeof window === 'undefined') {
    return;
  }
  const gtagFn = window.gtag;
  if (typeof gtagFn !== 'function') {
    return;
  }
  try {
    gtagFn('event', name, params);
  } catch {
    // 計測の失敗はサイト機能に一切影響させない。
  }
}
