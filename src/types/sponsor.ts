/**
 * スポンサー枠の型契約。
 *
 * data_dictionary.md 9章「掲載順と広告」:
 *   「スポンサー枠を追加する場合は、別データで`isSponsored`、`campaignId`、
 *    期間を管理する」「通常比較表のデータと広告契約データを同じJSONに
 *    混在させない」に基づき、businesses.json とは完全に別のデータ
 *    （src/data/sponsors.json）として管理する。
 *
 * 所有者: リード（src/types/**）。
 */

export interface Sponsor {
  id: string;
  /** 常にtrue。広告契約データであることをフィールドとしても明示する。 */
  isSponsored: true;
  /** 掲載キャンペーンの識別子（契約・請求管理側のキーを想定）。 */
  campaignId: string;
  /** 広告主（事業者）名。実在の契約がない限りここに値を追加しない。 */
  name: string;
  /** 広告主が用意した短い説明（当サイトの中立要約とは別扱いの広告文）。 */
  summary: string;
  websiteUrl: string;
  logoUrl: string | null;
  /** 表示順（管理用の安定順で、優先度・おすすめ度ではない）。 */
  displayOrder: number;
  /** 掲載期間の開始日（ISO 8601、例: "2026-09-01"）。 */
  periodStart: string;
  /** 掲載期間の終了日。nullの場合は終了日未定（契約継続中）。 */
  periodEnd: string | null;
  /** 掲載を有効化するフラグ。期間内であっても運用上停止したい場合に使う。 */
  active: boolean;
}

export interface SponsorDataset {
  schemaVersion: string;
  sponsors: Sponsor[];
}
