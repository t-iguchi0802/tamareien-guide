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
  /**
   * このスポンサーが、businesses.json に掲載済みの事業者と同一の場合、
   * その事業者の `id` を指定する（該当なしはnull）。
   *
   * 条件付き上位表示（2026-08-27追加）専用のフィールド。businesses.json
   * 側は一切変更せず、広告契約データ側（このファイル）だけにIDで
   * 参照を持たせることで、「通常掲載データと広告契約データを混在させない」
   * という既存方針を保ったまま関連付けを表現する。
   * `src/lib/data/loadSponsors.ts` が、参照先が実在する事業者IDであることを
   * ビルド時に検証する（存在しないIDは許可しない）。
   */
  linkedBusinessId: string | null;
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
