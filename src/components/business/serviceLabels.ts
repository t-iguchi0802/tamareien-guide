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
 * 石材店カードで使う短い表示名。
 * 一覧性を優先し、意味を変えない範囲で語を短くする。
 */
export const COMPACT_SERVICE_LABELS: Record<ServiceKey, string> = {
  new_grave: '建墓',
  grave_closure: '墓じまい',
  reburial_support: '改葬',
  interment: '納骨',
  engraving: '文字彫刻',
  cleaning: '清掃',
  annual_management: '年間管理',
  flowers: '供花・墓参り',
  planting: '植木・除草',
  renovation: '修理・リフォーム',
  seismic: '耐震',
  remote_photo_report: '見守り・写真報告',
};

/**
 * 「目的から探す」の6分類（2026-10-03、スマホ優先で再設計）。
 *
 * 長い説明文を各選択肢に持たせず、短いチェック項目だけで素早く絞り込む。
 * 各分類内はOR、複数分類間はAND。既存12 ServiceKeyだけを使う。
 */
export interface PurposeGroup {
  id: string;
  heading: string;
  serviceKeys: ServiceKey[];
}

export const PURPOSE_GROUPS: PurposeGroup[] = [
  {
    id: 'build',
    heading: '墓を建てる',
    serviceKeys: ['new_grave'],
  },
  {
    id: 'repair',
    heading: '修理・リフォーム',
    serviceKeys: ['renovation', 'seismic'],
  },
  {
    id: 'closure',
    heading: '墓じまい・改葬',
    serviceKeys: ['grave_closure', 'reburial_support'],
  },
  {
    id: 'interment',
    heading: '納骨・文字彫刻',
    serviceKeys: ['interment', 'engraving'],
  },
  {
    id: 'care',
    heading: '清掃・年間管理',
    serviceKeys: ['cleaning', 'annual_management', 'planting'],
  },
  {
    id: 'visit',
    heading: '供花・墓参り代行',
    serviceKeys: ['flowers', 'remote_photo_report'],
  },
];
