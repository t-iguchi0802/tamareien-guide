/**
 * 事業者データ（businesses.json）の型契約。
 *
 * 正本は repo ルートの `businesses.json` / `data_dictionary.md` である。
 * この型は正本のスキーマに一致させること。フィールドを追加・変更する場合は、
 * 先に `data_dictionary.md` を更新し、このファイルとZodスキーマ
 * （src/lib/data/schema.ts）を同時に更新する。
 *
 * 所有者: リード（src/types/** は共有契約であり、並行実装エージェントは変更しない）
 */

/** 確認状態。4値以外は許可しない。 */
export type VerificationStatus =
  'confirmed' | 'not_confirmed' | 'explicitly_not_offered' | 'not_applicable';

/** 比較対象サービスのキー。businesses.json の serviceKeys と一致させる。 */
export type ServiceKey =
  | 'new_grave'
  | 'grave_closure'
  | 'reburial_support'
  | 'interment'
  | 'engraving'
  | 'cleaning'
  | 'annual_management'
  | 'flowers'
  | 'planting'
  | 'renovation'
  | 'seismic'
  | 'remote_photo_report';

export type ListingTier = 'A' | 'B';

export interface EditorialPolicy {
  researchMethod: string;
  preLaunchInterview: boolean;
  unknownLabel: string;
  officialSiteDisclaimer: string;
  rankingPolicy: string;
  sponsorshipPolicy: string;
}

export interface BusinessLocation {
  postalCode: string | null;
  prefecture: string;
  city: string;
  addressLine: string;
  nearestGate: string | null;
  nearestGateStatus: VerificationStatus;
  locationNote: string | null;
}

export interface BusinessContact {
  phone: string | null;
  websiteUrl: string | null;
  directoryUrl?: string | null;
  contactUrl: string | null;
  businessHours: string | null;
  closedDays: string | null;
  parking: VerificationStatus;
}

export interface PublishedPrice {
  serviceKey: ServiceKey;
  label: string;
  amountFromJpy: number;
  unit: string;
  taxIncluded: boolean | null;
  conditions: string;
  /** sources.csv の source_id を参照する外部キー。 */
  sourceId: string;
}

/**
 * サービスキーごとの対応状態マップ。
 * businesses.json では全事業者が12サービス全キーを明示的に保持する
 * （未確認は省略ではなく not_confirmed を明示する）ため、exhaustiveな
 * Recordとして扱う。ServiceKeyに存在しないキーは許可しない。
 */
export type BusinessServiceMap = Record<ServiceKey, VerificationStatus>;

export interface Business {
  id: string;
  slug: string;
  displayOrder: number;
  listingTier: ListingTier;
  listingStatus: string;
  name: string;
  legalName: string | null;
  ownershipType: VerificationStatus;
  summary: string;
  location: BusinessLocation;
  contact: BusinessContact;
  services: BusinessServiceMap;
  publishedPrices: PublishedPrice[];
  credentials: string[];
  founded: string | null;
  /** sources.csv の source_id を参照する外部キー配列。 */
  evidenceSourceIds: string[];
  editorialNotes: string[];
}

export interface BusinessDataset {
  schemaVersion: string;
  datasetId: string;
  title: string;
  lastVerifiedAt: string;
  locale: string;
  editorialPolicy: EditorialPolicy;
  statusValues: VerificationStatus[];
  serviceKeys: ServiceKey[];
  businesses: Business[];
}
