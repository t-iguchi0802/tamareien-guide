/**
 * サービスキー → 画面表示ラベル。
 *
 * 正本: data_dictionary.md 6章「サービス状態」の表。
 * BusinessCard / ComparisonTable の両方で使うため、UIコンポーネント層
 * （src/components/**）内で共有する。データ本体（src/data/**）や型契約
 * （src/types/**）は変更しない。
 */
import type { ServiceKey } from '../../types/business';

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

/**
 * 「目的から探す」の3分類（editorial-redesign）。
 *
 * TOPページの3つの目的ボタン・石材店一覧の詳しい条件選択の両方で使う共有定義。
 * 既存の12 ServiceKeyだけを使い、新しいサービスは作らない
 * （12キー全てがちょうど1分類に属し、抜け漏れ・重複がないことをQAで確認する）。
 * 「供養」は納骨後の法事・お参りに関わる行為として、管理・清掃と同じ
 * 「お墓を建てたあとの継続的な手入れ」分類に含めた
 * （interment=「納骨・法事支援」をこの分類に入れる判断）。
 */
export interface PurposeGroup {
  id: string;
  heading: string;
  description: string;
  serviceKeys: ServiceKey[];
}

export const PURPOSE_GROUPS: PurposeGroup[] = [
  {
    id: 'build',
    heading: 'お墓を建てる・整える',
    description: '新しくお墓を建てる、文字を彫る、修理や耐震補強をする',
    serviceKeys: ['new_grave', 'engraving', 'renovation', 'seismic'],
  },
  {
    id: 'closure',
    heading: '墓じまい・改葬を考える',
    description: '墓じまいの相談や、改葬にともなう手続きの支援を受ける',
    serviceKeys: ['grave_closure', 'reburial_support'],
  },
  {
    id: 'care',
    heading: '管理・清掃・供養を頼む',
    description: '年間管理、清掃、供花、納骨・法事、遠方からの見守りを頼む',
    serviceKeys: ['annual_management', 'cleaning', 'flowers', 'planting', 'interment', 'remote_photo_report'],
  },
];
