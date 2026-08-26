/**
 * pages担当（src/pages/**）専用の表示用ヘルパー。
 *
 * このファイルは `_` で始まるディレクトリに置かれているため、
 * Astroのルーティング対象にはならない（ページ・エンドポイントを生成しない）。
 * src/pages/** の編集範囲内で完結させるための内部実装であり、
 * src/lib/** や src/components/** の担当領域には触れない。
 *
 * データ・出典の取得は必ず src/lib/data 経由（getBusinesses 等）で行い、
 * ここでは「取得したデータをどう見せるか」の表示ロジックのみを持つ。
 * 確認状態の文言変換は statusToDisplayLabel（src/lib/data/verificationStatus.ts）
 * のみを経由し、ここで独自の変換を行わない。
 *
 * 統合時（integrated-mvp、リード作業）のメモ:
 * 旧 `buildTelHref()` はこのファイル専用の `_partials/ComparisonTable.astro`
 * （独自実装の比較表。電話・地図・外部リンクをtel:/`<a>`で直接組み立てていた）
 * でのみ使用されていたが、そのファイルを ui-components 正本の
 * <ComparisonTable>（サービス比較専任）＋ 新設の
 * `_partials/BusinessContactList.astro`（PhoneLink/MapLink/OutboundLinkを使用）
 * へ差し替えたため削除した。tel:リンクの組み立ては PhoneLink.astro 内部が
 * 担当する。`buildMapSearchUrl()` は MapLink.astro が href を呼び出し側の
 * 責務としているため、引き続きここで使用する。
 */
import type { Business, ServiceKey } from '../../types/business';

/** data_dictionary.md 6章の表示ラベル。 */
export const SERVICE_LABELS: Record<ServiceKey, string> = {
  new_grave: '墓石建立・建墓',
  grave_closure: '墓じまい・撤去',
  reburial_support: '改葬・手続支援',
  interment: '納骨・法事支援',
  engraving: '戒名・文字彫刻',
  cleaning: '清掃・クリーニング',
  annual_management: '年間管理・定期管理',
  flowers: '供花・墓参り代行',
  planting: '植木・雑草・樹木対応',
  renovation: '修理・リフォーム',
  seismic: '耐震・免震対応',
  remote_photo_report: '遠方対応・写真報告',
};

/** 全12サービスキー（businesses.json の serviceKeys と一致）。 */
export const ALL_SERVICE_KEYS: ServiceKey[] = [
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
];

/**
 * トップページ「困りごと別入口」の分類。
 * 各serviceKeyの対応状況を集計する用途にのみ使い、順位付けには使わない。
 */
export interface GoalGroup {
  id: string;
  heading: string;
  description: string;
  serviceKeys: ServiceKey[];
  href: string;
  linkLabel: string;
}

export const GOAL_GROUPS: GoalGroup[] = [
  {
    id: 'sekizaiten',
    heading: '石材店を比較したい・新しくお墓を建てたい',
    description: '建墓、文字彫刻、修理・耐震まで、14社の対応状況を一覧で比較できます。',
    serviceKeys: ['new_grave', 'engraving', 'renovation', 'seismic'],
    href: '/sekizaiten/',
    linkLabel: '14社の一覧・比較表を見る',
  },
  {
    id: 'hakajimai',
    heading: '墓じまい・墓石撤去をしたい',
    description: '墓じまい・改葬の手続支援について、公開情報を確認できる事業者を比較できます。',
    serviceKeys: ['grave_closure', 'reburial_support'],
    href: '/hakajimai/',
    linkLabel: '墓じまいの比較を見る',
  },
  {
    id: 'kanri',
    heading: '管理・清掃・供花をお願いしたい',
    description: '年間管理、清掃、供花・墓参り代行、植木の対応状況を比較できます。',
    serviceKeys: ['annual_management', 'cleaning', 'flowers', 'planting'],
    href: '/kanri/',
    linkLabel: '墓所管理の比較を見る',
  },
  {
    id: 'tetsuzuki',
    heading: '改葬・墓所返還などの手続きを知りたい',
    description: '事業者比較ではなく、行政の公式ページに基づく手続きの案内です。',
    serviceKeys: ['reburial_support', 'interment'],
    href: '/tetsuzuki/',
    linkLabel: '手続きの案内を見る',
  },
];

/**
 * 事業者の住所（都道府県+市区町村+番地）からGoogleマップの検索リンクを組み立てる。
 * location.* は必須文字列項目（未確認nullを許容しない）であるため、
 * 全事業者で常に生成してよい。緯度経度や事業者独自の地図URLを推測しない。
 */
export function buildMapSearchUrl(business: Business): string {
  const address = `${business.location.prefecture}${business.location.city}${business.location.addressLine}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

/**
 * 公開価格の表示ラベル。「〜円」ではなく必ず「◯円〜」形式にし、
 * 固定価格であるかのような断定表示をしない。
 */
export function formatPriceFrom(amountFromJpy: number): string {
  return `${amountFromJpy.toLocaleString('ja-JP')}円〜`;
}
