/**
 * `src/types/analytics.ts` で定義された6イベントを送信する薄いラッパー関数群。
 *
 * ui-components / pages 担当は、DOM操作の詳細を気にせずこれらの関数を
 * 呼び出すだけでよい（`sendGaEvent` 経由でGA4未設定時は自動的に無害化される）。
 *
 * 所有者: feature/seo-analytics（src/lib/analytics/**）
 */

import { sendGaEvent } from './gtagClient';
import type {
  BusinessOutboundClickParams,
  BusinessPhoneClickParams,
  BusinessMapClickParams,
  ComparisonFilterUseParams,
  OfficialProcedureClickParams,
  CorrectionRequestClickParams,
} from '../../types/analytics';

/** 事業者の外部リンク（公式サイト・問い合わせ・ディレクトリ）クリック。 */
export function trackBusinessOutboundClick(params: BusinessOutboundClickParams): void {
  sendGaEvent('business_outbound_click', params);
}

/** 事業者の電話番号クリック（タップ）。 */
export function trackBusinessPhoneClick(params: BusinessPhoneClickParams): void {
  sendGaEvent('business_phone_click', params);
}

/** 事業者の地図検索リンククリック。 */
export function trackBusinessMapClick(params: BusinessMapClickParams): void {
  sendGaEvent('business_map_click', params);
}

/** 比較表の絞り込み（地域・門・サービス・並べ替え等）操作。 */
export function trackComparisonFilterUse(params: ComparisonFilterUseParams): void {
  sendGaEvent('comparison_filter_use', params);
}

/** 行政制度・公式手続きページへのリンククリック。 */
export function trackOfficialProcedureClick(params: OfficialProcedureClickParams): void {
  sendGaEvent('official_procedure_click', params);
}

/** 訂正申請導線（訂正窓口）のクリック。 */
export function trackCorrectionRequestClick(params: CorrectionRequestClickParams): void {
  sendGaEvent('correction_request_click', params);
}
