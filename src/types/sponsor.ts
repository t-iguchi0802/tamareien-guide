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

/**
 * 写真付き広告クリエイティブ対応（2026-09-02、「スポンサー広告の全面
 * 再設計」対応）。
 *
 * 従来はロゴ＋事業者名＋一文の要約だけの簡易表示だったが、実際に掲載料を
 * 払う広告主向けに、写真を主役にした広告クリエイティブへ共通対応した
 * （`src/components/sponsors/SponsorCard.astro`が下記フィールドの
 * 有無で「写真付き広告」「簡易表示（ロゴ・要約のみ）」を自動的に
 * 出し分ける。個別スポンサーごとに専用CSSを書かず、今後のスポンサーも
 * 同じフィールドを埋めるだけで同水準の広告を追加できるようにする）。
 *
 * `image`が設定されている場合のみ`imageAlt`が必須（空文字不可）になる
 * （`src/lib/data/loadSponsors.ts`のZodスキーマで検証する）。
 */
export interface Sponsor {
  id: string;
  /** 常にtrue。広告契約データであることをフィールドとしても明示する。 */
  isSponsored: true;
  /** 掲載キャンペーンの識別子（契約・請求管理側のキーを想定）。 */
  campaignId: string;
  /** 広告主の正式なサービス名。実在の契約がない限りここに値を追加しない。 */
  name: string;
  /** 広告の主見出し（例:「相続と実家の相談」）。省略時は`name`を見出しとして使う。 */
  headline?: string;
  /** キャッチコピー（短い一文）。 */
  tagline?: string;
  /** 広告主が用意した短い説明（当サイトの中立要約とは別扱いの広告文）。
   *  写真付き広告で`serviceTags`を使う場合も、meta descriptionや
   *  簡易表示（画像なしスポンサー）向けの説明として保持する。 */
  summary: string;
  /** 対応内容を示す短いタグ（例:["相続","空き家","見守り"]）。写真付き広告でのみ使う。 */
  serviceTags?: string[];
  /** 対応地域を示す短いラベル（例:「三鷹市周辺」）。 */
  area?: string;
  /** 広告写真（`public/`からの絶対パス）。省略時は画像なしの簡易表示になる。 */
  image?: string;
  /** 画像の代替テキスト。`image`を指定する場合は必須（空文字不可）。 */
  imageAlt?: string;
  /**
   * 画像が本番差し替え前の仮素材であることを示すフラグ。trueの場合、
   * 写真の右下にごく小さく「イメージ」と表示する
   * （「画像はイメージです」という大きな注記は表示しない）。
   */
  imageIsPlaceholder?: boolean;
  /** 外部リンク先URL（旧`websiteUrl`から改名。石材店側`business.contact.websiteUrl`とは無関係の別型）。 */
  destinationUrl: string;
  logoUrl: string | null;
  /**
   * 外部リンクのボタン文言（2026-09-02追加）。省略時は既定文言
   * 「サイトを見る」を使う（`src/components/sponsors/SponsorCard.astro`
   * 参照）。広告主のサービス性質に合わせた文言（例:
   * 「相談窓口を見る」）を個別に指定できるようにするための任意フィールド。
   */
  ctaLabel?: string;
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
