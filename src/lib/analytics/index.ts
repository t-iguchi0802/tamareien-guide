/**
 * `src/lib/analytics/**` の公開エントリ（TypeScriptモジュールのみ）。
 *
 * `GaTag.astro` はAstroコンポーネントのため、Astroファイルから直接
 * `../lib/analytics/GaTag.astro` をimportして使用する（このbarrelには含めない）。
 *
 * 所有者: feature/seo-analytics（src/lib/analytics/**）
 */

export { getGaMeasurementId, isAnalyticsEnabled } from './config';
export { sendGaEvent } from './gtagClient';
export {
  trackBusinessOutboundClick,
  trackBusinessPhoneClick,
  trackBusinessMapClick,
  trackComparisonFilterUse,
  trackOfficialProcedureClick,
  trackCorrectionRequestClick,
  trackSponsorImpression,
  trackSponsorClick,
  trackInternalGuideLinkClick,
  trackSponsorInquiryClick,
} from './events';
export { initAnalyticsDispatcher } from './dispatcher';
export { resolvePageCategory } from './pageCategory';
export type { PageCategory } from './pageCategory';
