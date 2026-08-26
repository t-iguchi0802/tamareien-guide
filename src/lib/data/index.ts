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
// スポンサーデータ（src/data/sponsors.json）はbusinesses.jsonと完全に別経路。
// getBusinessDataset()の検証・キャッシュとは合流させない
// （data_dictionary.md 9章「通常比較表のデータと広告契約データを
// 同じJSONに混在させない」）。
export * from './loadSponsors';

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
