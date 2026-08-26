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
