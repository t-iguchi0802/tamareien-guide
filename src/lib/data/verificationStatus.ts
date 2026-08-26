import type { VerificationStatus } from '../../types/business';

/**
 * 確認状態 → 画面表示文言 の唯一の変換関数。
 *
 * data_dictionary.md 6章「状態の画面変換」表の正本実装。
 * UI側はこの関数「だけ」を経由して状態を文字列化すること。
 * 独自に "非対応" 等へ変換するコードを別途作らない
 * （not_confirmed を非対応へ変換しないという最重要ルールの実装上の担保）。
 */
export function statusToDisplayLabel(status: VerificationStatus): string {
  switch (status) {
    case 'confirmed':
      return '○ 公開確認済み';
    case 'not_confirmed':
      return '公開情報では未確認';
    case 'explicitly_not_offered':
      return '非対応と明記';
    case 'not_applicable':
      return '対象外';
  }
}

/**
 * 比較表の絞り込み対象に含めてよいか。
 * data_dictionary.md 6章: confirmedのみ「含める」。
 */
export function isFilterableStatus(status: VerificationStatus): boolean {
  return status === 'confirmed';
}
