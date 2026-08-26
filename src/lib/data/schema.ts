/**
 * businesses.json / sources.csv のビルド時検証スキーマ（Zod）。
 *
 * data_dictionary.md 第10章「Claude Codeが行ってはいけない処理」および
 * 同章「ビルド前に次を自動検証する」を実装レベルで担保する。
 *
 * 所有者: リード（データ読み込み基盤）。フィールド追加時は
 * data_dictionary.md → src/types/business.ts・source.ts → 本ファイル
 * の順で同時更新する。
 */
import { z } from 'zod';

export const verificationStatusSchema = z.enum([
  'confirmed',
  'not_confirmed',
  'explicitly_not_offered',
  'not_applicable',
]);

export const serviceKeySchema = z.enum([
  'new_grave',
  'grave_closure',
  'reburial_support',
  'interment',
  'engraving',
  'cleaning',
  'annual_management',
  'flowers',
  'planting',
  'renovation',
  'seismic',
  'remote_photo_report',
]);

export const listingTierSchema = z.enum(['A', 'B']);

const editorialPolicySchema = z.object({
  researchMethod: z.string(),
  preLaunchInterview: z.boolean(),
  unknownLabel: z.string(),
  officialSiteDisclaimer: z.string(),
  rankingPolicy: z.string(),
  sponsorshipPolicy: z.string(),
});

const businessLocationSchema = z.object({
  postalCode: z.string().nullable(),
  prefecture: z.string(),
  city: z.string(),
  addressLine: z.string(),
  nearestGate: z.string().nullable(),
  nearestGateStatus: verificationStatusSchema,
  locationNote: z.string().nullable(),
});

const businessContactSchema = z.object({
  phone: z.string().nullable(),
  websiteUrl: z.string().nullable(),
  directoryUrl: z.string().nullable().optional(),
  contactUrl: z.string().nullable(),
  businessHours: z.string().nullable(),
  closedDays: z.string().nullable(),
  parking: verificationStatusSchema,
});

const publishedPriceSchema = z.object({
  serviceKey: serviceKeySchema,
  label: z.string(),
  amountFromJpy: z.number().int().nonnegative(),
  unit: z.string(),
  taxIncluded: z.boolean().nullable(),
  conditions: z.string(),
  sourceId: z.string().min(1),
});

// businesses.json では全事業者が12サービス全キーを明示的に保持する
// （未確認は省略ではなく not_confirmed を明示する）。そのためexhaustiveな
// レコードとして検証する。
const businessServiceMapSchema = z.record(serviceKeySchema, verificationStatusSchema);

export const businessSchema = z.object({
  id: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'slugは小文字英数字とハイフンのみ'),
  displayOrder: z.number().int(),
  listingTier: listingTierSchema,
  listingStatus: z.string().min(1),
  name: z.string().min(1),
  legalName: z.string().nullable(),
  ownershipType: verificationStatusSchema,
  summary: z.string().min(1),
  location: businessLocationSchema,
  contact: businessContactSchema,
  services: businessServiceMapSchema,
  publishedPrices: z.array(publishedPriceSchema),
  credentials: z.array(z.string()),
  founded: z.string().nullable(),
  evidenceSourceIds: z.array(z.string().min(1)),
  editorialNotes: z.array(z.string()),
});

export const businessDatasetSchema = z.object({
  schemaVersion: z.string(),
  datasetId: z.string(),
  title: z.string(),
  lastVerifiedAt: z.string(),
  locale: z.string(),
  editorialPolicy: editorialPolicySchema,
  statusValues: z.array(verificationStatusSchema),
  serviceKeys: z.array(serviceKeySchema),
  businesses: z.array(businessSchema),
});

export const sourceRecordSchema = z.object({
  source_id: z.string().min(1),
  business_id: z.string(),
  source_type: z.string(),
  publisher: z.string(),
  title: z.string(),
  url: z.string(),
  checked_at: z.string(),
  claims: z.string(),
  status: z.string(),
  notes: z.string(),
});

export type BusinessDatasetParsed = z.infer<typeof businessDatasetSchema>;
export type SourceRecordParsed = z.infer<typeof sourceRecordSchema>;
