/**
 * 出典データ（sources.csv）の型契約。
 *
 * 正本は repo ルートの `sources.csv` / `data_dictionary.md` である。
 * 所有者: リード（src/types/**）
 */

export type SourceType =
  | 'official_site'
  | 'government'
  | 'chamber_directory'
  | 'business_directory'
  | 'industry_association'
  | string;

export interface SourceRecord {
  source_id: string;
  /** 事業横断の出典（都公園協会の制度案内等）は空文字を許容する。 */
  business_id: string;
  source_type: SourceType;
  publisher: string;
  title: string;
  url: string;
  checked_at: string;
  claims: string;
  status: string;
  notes: string;
}
