import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'csv-parse/sync';
import { sourceRecordSchema } from './schema';
import type { SourceRecord } from '../../types/source';

// src/data/sources.csv はビルド用の作業コピーである。
// 正本は repo ルート直下の sources.csv（CLAUDE_CODE_HANDOFF.md 4章）。
// パス解決方針は loadBusinesses.ts のコメントを参照。
const DATA_PATH = join(process.cwd(), 'src/data/sources.csv');

let cached: SourceRecord[] | null = null;

/**
 * sources.csv を読み込み、Zodスキーマで各行を検証して返す。
 * ヘッダー行の列名を SourceRecord のフィールド名と一致させること。
 */
export function loadSources(): SourceRecord[] {
  if (cached) return cached;

  let raw = readFileSync(DATA_PATH, 'utf-8');
  // sources.csv（正本）はExcel等の出力由来でUTF-8 BOM付きの場合がある。
  // 正本ファイル自体は変更せず、読み込み側でBOMを除去してヘッダー名
  // （source_id等）の照合が壊れないようにする。
  if (raw.charCodeAt(0) === 0xfeff) {
    raw = raw.slice(1);
  }
  const rows: Record<string, string>[] = parse(raw, {
    columns: true,
    skip_empty_lines: true,
  });

  const records: SourceRecord[] = [];
  const errors: string[] = [];

  rows.forEach((row, index) => {
    const result = sourceRecordSchema.safeParse(row);
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `[${issue.path.join('.')}] ${issue.message}`)
        .join(', ');
      errors.push(`  - 行${index + 2}: ${issues}`);
      return;
    }
    records.push(result.data);
  });

  if (errors.length > 0) {
    throw new Error(`sources.csv のスキーマ検証に失敗しました:\n${errors.join('\n')}`);
  }

  cached = records;
  return cached;
}

/** テスト用途でキャッシュをリセットする。 */
export function resetSourcesCache(): void {
  cached = null;
}
