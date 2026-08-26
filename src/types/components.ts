/**
 * 共通コンポーネントのProps契約（インターフェースのみ）。
 *
 * ここでは型だけを固定し、実装（.astroファイル）は置かない。
 * 実装は feature/ui-components が src/components/** に作成する。
 * 並行実装期間中はこの契約を変更しない。変更が必要な場合はリードが
 * 全エージェントを止めて本ファイルを更新する（WORKTREE_AGENT_PLAN.md 4章）。
 *
 * 所有者: リード（src/types/**）
 */

import type { Business, ServiceKey, VerificationStatus } from './business';
import type { OutboundLinkType } from './analytics';

export interface BusinessCardProps {
  business: Business;
}

export interface ComparisonTableProps {
  businesses: Business[];
  visibleServices: ServiceKey[];
}

export interface VerificationBadgeProps {
  status: VerificationStatus;
}

export interface OutboundLinkProps {
  businessId: string;
  linkType: OutboundLinkType;
  href: string;
  label?: string;
}

export interface PhoneLinkProps {
  businessId: string;
  /** 電話番号が未確認の場合はこのコンポーネントを描画しない（呼び出し側で判定）。 */
  phone: string;
}

export interface MapLinkProps {
  businessId: string;
  href: string;
  label?: string;
}

export interface CorrectionCtaProps {
  businessId?: string;
}
