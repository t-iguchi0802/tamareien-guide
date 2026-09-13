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
 *
 * 拡張（2026-08-28、スポンサー枠の全ページ共通化に伴う）: 全ページで
 * スポンサー枠を表示するようになったため、どのページ・どの枠位置での
 * 表示／クリックかを区別できるよう、`slot_position` と `page_category` を
 * `SponsorImpressionParams` / `SponsorClickParams` へ追加した。
 * 既存の `sponsor_id` / `campaign_id` / `page_path` は変更していない。
 *
 * 拡張（2026-09-02、ナビゲーション・運営者表示・SEO/AIO監査対応
 * 「GA4で確認するイベント」節）:
 * - `ComparisonFilterUseParams`に`selected_count`（送信時点で選択中の
 *   詳細条件数）・`result_count`（絞り込み後の該当事業者数）を追加した。
 *   「絞り込み後の該当件数」「0件になった検索（result_count===0）」を、
 *   新しいイベント名を増やさずに既存の`comparison_filter_use`だけで
 *   分析できるようにするため。既存の`filter_type`/`filter_value`/
 *   `page_path`の意味は変更していない。
 * - `internal_guide_link_click`を追加した。TOPの「多磨霊園ガイド」入口、
 *   ヘッダーの「多磨霊園を知る」ドロップダウン、各記事末尾の「関連ページ」
 *   カードなど、サイト内のガイド記事（アクセス・墓じまい手続き・
 *   著名人墓所・歴史等）への遷移を計測するための、既存6+2イベントとは
 *   意味が重ならない新規イベント（事業者の外部リンク・電話・地図
 *   クリックを表す`business_*`とは異なり、サイト内のガイド記事間の
 *   移動を表す）。
 *
 * 拡張（2026-09-02、「スポンサー掲載ページと訂正窓口の文章」対応）:
 * - `sponsor_inquiry_click`を追加した。/about/の「スポンサー掲載を
 *   問い合わせる」CTA（mailtoリンク）のクリックを計測する。既存の
 *   `sponsor_click`（契約中スポンサー自身の外部リンククリック、
 *   sponsor_id/campaign_id必須）とは意味が異なる（こちらは「まだ
 *   契約していない事業者からの掲載問い合わせ」であり、紐づく
 *   sponsor_id自体が存在しない）ため、新規イベントとした。
 * - 「掲載情報の訂正を依頼する」CTA（/about/、mailtoリンク）は、
 *   既存の`correction_request_click`（CorrectionCta.astro等で使用中の
 *   「訂正・非掲載を依頼する」導線と同じ意味＝訂正依頼の開始）を
 *   そのまま再利用し、新しいイベント名は追加していない。
 * - どちらのイベントもパラメータは`page_path`のみ。メールアドレス・
 *   氏名・電話番号・入力内容等の個人情報はGA4へ送信しない
 *   （mailtoのsubject/bodyはブラウザのメールアプリ側で組み立てられ、
 *   GA4送信とは別経路のため、実装上も個人情報が混ざりようがない）。
 */

export type AnalyticsEventName =
  | 'business_outbound_click'
  | 'business_phone_click'
  | 'business_map_click'
  | 'comparison_filter_use'
  | 'official_procedure_click'
  | 'correction_request_click'
  | 'sponsor_impression'
  | 'sponsor_click'
  | 'internal_guide_link_click'
  | 'sponsor_inquiry_click';

export type OutboundLinkType = 'official_site' | 'contact' | 'directory';

export interface BusinessOutboundClickParams {
  business_id: string;
  business_name: string;
  link_type: OutboundLinkType;
  page_path: string;
}

export interface BusinessPhoneClickParams {
  business_id: string;
  business_name: string;
  page_path: string;
}

export interface BusinessMapClickParams {
  business_id: string;
  business_name: string;
  page_path: string;
}

export interface ComparisonFilterUseParams {
  filter_type: string;
  filter_value: string;
  page_path: string;
  /** 送信時点で選択中の詳細条件（チェックボックス）数。 */
  selected_count?: number;
  /** 絞り込み後に対応を確認できた事業者数（0件検索の判定にも使う）。 */
  result_count?: number;
}

/** サイト内のガイド記事（アクセス・手続き・著名人墓所・歴史等）への遷移。 */
export interface InternalGuideLinkClickParams {
  /** 遷移先を表す短い識別子（例: "access" | "history" | "famous_graves"）。 */
  destination: string;
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

/** スポンサー掲載の問い合わせCTA（/about/、mailtoリンク）のクリック。 */
export interface SponsorInquiryClickParams {
  page_path: string;
}

/**
 * スポンサー枠4枠中のどの位置か。左右レール・モバイルグリッドのいずれでも、
 * DOM上の物理的な枠位置（left-1が最上段）をそのまま使う。
 */
export type SponsorSlotPosition = 'left-1' | 'left-2' | 'right-1' | 'right-2';

/** スポンサー枠がビューポート内に表示されたとき（1枠につき1ページで1回）。 */
export interface SponsorImpressionParams {
  sponsor_id: string;
  sponsor_name: string;
  campaign_id: string;
  page_path: string;
  slot_position: SponsorSlotPosition;
  page_category: string;
}

/** スポンサー枠の外部リンク（広告主サイト）のクリック。 */
export interface SponsorClickParams {
  sponsor_id: string;
  sponsor_name: string;
  campaign_id: string;
  page_path: string;
  slot_position: SponsorSlotPosition;
  page_category: string;
}

export type AnalyticsEventParams =
  | { name: 'business_outbound_click'; params: BusinessOutboundClickParams }
  | { name: 'business_phone_click'; params: BusinessPhoneClickParams }
  | { name: 'business_map_click'; params: BusinessMapClickParams }
  | { name: 'comparison_filter_use'; params: ComparisonFilterUseParams }
  | { name: 'official_procedure_click'; params: OfficialProcedureClickParams }
  | { name: 'correction_request_click'; params: CorrectionRequestClickParams }
  | { name: 'sponsor_impression'; params: SponsorImpressionParams }
  | { name: 'sponsor_click'; params: SponsorClickParams }
  | { name: 'internal_guide_link_click'; params: InternalGuideLinkClickParams }
  | { name: 'sponsor_inquiry_click'; params: SponsorInquiryClickParams };
