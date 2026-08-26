import type { Business, BusinessDataset } from '../../types/business';
import type { SourceRecord } from '../../types/source';

/**
 * businesses.json と sources.csv の相互整合性検証。
 *
 * 検証項目は CLAUDE_CODE_HANDOFF.md 10章「データ検証」と
 * data_dictionary.md 10章「Claude Codeが行ってはいけない処理」に対応する。
 * 単一フィールドの型・enum検証は schema.ts（Zod）が担当し、
 * ここでは複数ファイル・複数レコードにまたがる整合性のみを扱う。
 *
 * 不正が見つかった場合は例外を投げてビルドを失敗させる。
 */
export function validateBusinessData(dataset: BusinessDataset, sources: SourceRecord[]): void {
  const errors: string[] = [];
  const sourceIds = new Set(sources.map((s) => s.source_id));

  // 1. 事業者IDとslugの重複がない
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const b of dataset.businesses) {
    if (ids.has(b.id)) errors.push(`事業者id重複: ${b.id}`);
    ids.add(b.id);
    if (slugs.has(b.slug)) errors.push(`slug重複: ${b.slug}`);
    slugs.add(b.slug);
  }

  // 2. displayOrderが重複していない
  const orders = new Map<number, string>();
  for (const b of dataset.businesses) {
    const existing = orders.get(b.displayOrder);
    if (existing) {
      errors.push(`displayOrder重複: ${b.displayOrder} (${existing} / ${b.id})`);
    } else {
      orders.set(b.displayOrder, b.id);
    }
  }

  // 3. services のキーが serviceKeys（データセット正本）に存在する
  const validServiceKeys = new Set(dataset.serviceKeys);
  for (const b of dataset.businesses) {
    for (const key of Object.keys(b.services)) {
      if (!validServiceKeys.has(key as (typeof dataset.serviceKeys)[number])) {
        errors.push(`未定義のserviceKey: ${b.id}.services.${key}`);
      }
    }
  }

  // 4. 状態値の許可リストはZodスキーマ（schema.ts）が検証済み。

  // 5. evidenceSourceIds が sources.csv に存在する
  // 6. publishedPrices.sourceId が sources.csv に存在する
  for (const b of dataset.businesses) {
    for (const sourceId of b.evidenceSourceIds) {
      if (!sourceIds.has(sourceId)) {
        errors.push(`存在しないsourceId参照: ${b.id}.evidenceSourceIds -> ${sourceId}`);
      }
    }
    for (const price of b.publishedPrices) {
      if (!sourceIds.has(price.sourceId)) {
        errors.push(
          `存在しないsourceId参照: ${b.id}.publishedPrices[${price.serviceKey}] -> ${price.sourceId}`,
        );
      }
    }
  }

  // 7. URL形式が正しい
  const urlFields: Array<[string, string | null | undefined]> = [];
  for (const b of dataset.businesses) {
    urlFields.push([`${b.id}.contact.websiteUrl`, b.contact.websiteUrl]);
    urlFields.push([`${b.id}.contact.contactUrl`, b.contact.contactUrl]);
    urlFields.push([`${b.id}.contact.directoryUrl`, b.contact.directoryUrl]);
  }
  for (const [label, value] of urlFields) {
    if (!value) continue;
    if (!isValidHttpUrl(value)) {
      errors.push(`URL形式が不正: ${label} = ${value}`);
    }
  }
  for (const s of sources) {
    if (!isValidHttpUrl(s.url)) {
      errors.push(`URL形式が不正: sources.csv ${s.source_id}.url = ${s.url}`);
    }
  }

  // 8. confirmedの重要表示に少なくとも1つの根拠がある
  for (const b of dataset.businesses) {
    if (hasAnyConfirmedField(b) && b.evidenceSourceIds.length === 0) {
      errors.push(`confirmed項目があるがevidenceSourceIdsが空: ${b.id}`);
    }
  }

  // 9. not_confirmedを「非対応」に変換しないことは、表示層で
  //    src/lib/data/verificationStatus.ts の統一マッピングのみを使うことで担保する
  //    （ここではデータ側に矛盾がないかまでは検証できない）。

  if (errors.length > 0) {
    throw new Error(
      `事業者データの整合性検証に失敗しました:\n${errors.map((e) => `  - ${e}`).join('\n')}`,
    );
  }
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function hasAnyConfirmedField(b: Business): boolean {
  if (b.ownershipType === 'confirmed') return true;
  if (b.location.nearestGateStatus === 'confirmed') return true;
  if (b.contact.parking === 'confirmed') return true;
  return Object.values(b.services).some((status) => status === 'confirmed');
}
