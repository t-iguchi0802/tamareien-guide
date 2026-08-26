import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { businessDatasetSchema } from './schema';
import type { BusinessDataset } from '../../types/business';

// src/data/businesses.json はビルド用の作業コピーである。
// 正本は repo ルート直下の businesses.json（CLAUDE_CODE_HANDOFF.md 4章）。
// data-content担当は更新のたびに両者を一致させること。
//
// パス解決は import.meta.url ではなく process.cwd() を基準にする。
// astro build はプリレンダリング用チャンクをdist配下へバンドルするため、
// import.meta.url基準の相対パスはバンドル後の出力先を指してしまい
// ENOENTになる（astro dev / astro check では発生しないため気付きにくい）。
// astro dev / astro build はいずれもプロジェクトルートから実行される前提。
const DATA_PATH = join(process.cwd(), 'src/data/businesses.json');

let cached: BusinessDataset | null = null;

/**
 * businesses.json を読み込み、Zodスキーマで検証して返す。
 * 不正データがある場合はビルドを失敗させる(06_TECH.md 5章の方針を踏襲)。
 */
export function loadBusinessDataset(): BusinessDataset {
  if (cached) return cached;

  const raw = readFileSync(DATA_PATH, 'utf-8');
  const json = JSON.parse(raw);

  const result = businessDatasetSchema.safeParse(json);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - [${issue.path.join('.')}] ${issue.message}`)
      .join('\n');
    throw new Error(`businesses.json のスキーマ検証に失敗しました:\n${issues}`);
  }

  cached = result.data as BusinessDataset;
  return cached;
}

/** テスト用途でキャッシュをリセットする。 */
export function resetBusinessDatasetCache(): void {
  cached = null;
}
