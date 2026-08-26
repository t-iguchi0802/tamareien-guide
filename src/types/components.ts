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
import type { Sponsor } from './sponsor';

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

/**
 * スポンサー枠実装時（2026-08-26）に追加。
 * 通常掲載（BusinessCardProps）とは別の型契約とし、
 * 事業者データと広告契約データを混同しないようにする。
 *
 * レイアウト刷新（2026-08-26）: 中央本文左右の4枠固定レイアウトに
 * 合わせ、`sponsor: Sponsor` から `sponsor: Sponsor | null` へ変更した
 * （契約が無い枠は`null`を渡し、「スポンサー枠」というプレースホルダーを
 * 表示する。4枠を常に同じ大きさ・同じ扱いで表示するための変更）。
 */
export interface SponsorSlotProps {
  sponsor: Sponsor | null;
}
