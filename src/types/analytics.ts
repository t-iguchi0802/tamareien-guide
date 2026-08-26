/**
 * GA4イベント契約。
 *
 * 正本: CLAUDE_CODE_HANDOFF.md 第7章。
 *
 * 注意: repoルートの旧設計資料（00〜08_*.md, AGENTS.md）に記載のイベント名
 * （shop_card_click, phone_click 等）は「三鷹・街の電器屋」比較サイトという
 * 別プロジェクトのものであり、本プロジェクトでは使用しない。CLAUDE.md参照。
 *
 * 所有者: リード（型契約）。実装は feature/seo-analytics 担当が
 * src/lib/analytics/** に置く。
 *
 * 追加（2026-08-26、スポンサー枠実装時）: `sponsor_impression` /
 * `sponsor_click` の2イベントをCLAUDE_CODE_HANDOFF.md第7章の6イベントに
 * 追加した。スポンサー枠（src/components/sponsors/**）の表示回数・
 * クリックを計測するために必要な拡張であり、既存6イベントの意味は
 * 変更していない。
 */

export type AnalyticsEventName =
  | 'business_outbound_click'
  | 'business_phone_click'
  | 'business_map_click'
  | 'comparison_filter_use'
  | 'official_procedure_click'
  | 'correction_request_click'
  | 'sponsor_impression'
  | 'sponsor_click';

export type OutboundLinkType = 'official_site' | 'contact' | 'directory';

export interface BusinessOutboundClickParams {
  business_id: string;
  link_type: OutboundLinkType;
  page_path: string;
}

export interface BusinessPhoneClickParams {
  business_id: string;
  page_path: string;
}

export interface BusinessMapClickParams {
  business_id: string;
  page_path: string;
}

export interface ComparisonFilterUseParams {
  filter_type: string;
  filter_value: string;
  page_path: string;
}

export interface OfficialProcedureClickParams {
  authority: string;
  topic: string;
  page_path: string;
}

export interface CorrectionRequestClickParams {
  page_path: string;
}

/** スポンサー枠がビューポート内に表示されたとき（1枠につき1ページで1回）。 */
export interface SponsorImpressionParams {
  sponsor_id: string;
  campaign_id: string;
  page_path: string;
}

/** スポンサー枠の外部リンク（広告主サイト）のクリック。 */
export interface SponsorClickParams {
  sponsor_id: string;
  campaign_id: string;
  page_path: string;
}

export type AnalyticsEventParams =
  | { name: 'business_outbound_click'; params: BusinessOutboundClickParams }
  | { name: 'business_phone_click'; params: BusinessPhoneClickParams }
  | { name: 'business_map_click'; params: BusinessMapClickParams }
  | { name: 'comparison_filter_use'; params: ComparisonFilterUseParams }
  | { name: 'official_procedure_click'; params: OfficialProcedureClickParams }
  | { name: 'correction_request_click'; params: CorrectionRequestClickParams }
  | { name: 'sponsor_impression'; params: SponsorImpressionParams }
  | { name: 'sponsor_click'; params: SponsorClickParams };
