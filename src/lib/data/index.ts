import { loadBusinessDataset } from './loadBusinesses';
import { loadSources } from './loadSources';
import { validateBusinessData } from './validate';
import type { Business, BusinessDataset } from '../../types/business';
import type { SourceRecord } from '../../types/source';

export * from './schema';
export * from './loadBusinesses';
export * from './loadSources';
export * from './validate';
export * from './verificationStatus';

let validated = false;

/**
 * 検証済みの事業者データセットを返す。
 * ページ・コンポーネントはこの関数（または getBusinesses / getSources）
 * のみを経由してデータへアクセスすること。
 */
export function getBusinessDataset(): BusinessDataset {
  const dataset = loadBusinessDataset();
  const sources = loadSources();
  if (!validated) {
    validateBusinessData(dataset, sources);
    validated = true;
  }
  return dataset;
}

export function getBusinesses(): Business[] {
  return getBusinessDataset().businesses;
}

export function getSources(): SourceRecord[] {
  getBusinessDataset(); // 検証をトリガーする
  return loadSources();
}

export function getSourceById(sourceId: string): SourceRecord | undefined {
  return getSources().find((s) => s.source_id === sourceId);
}

export function getBusinessBySlug(slug: string): Business | undefined {
  return getBusinesses().find((b) => b.slug === slug);
}
