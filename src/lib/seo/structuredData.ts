/**
 * 構造化データ（JSON-LD）ビルダー。
 *
 * 絶対厳守（CLAUDE.md 2章 / .claude/agents/seo-analytics.md 参照）:
 * - `review` / `aggregateRating` / `award` / `best` 等、根拠のないランキング系の
 *   プロパティを一切含めない。
 * - 事業者の構造化データは、画面に実際に表示している確認済み情報だけを使う。
 *   （例: `contact.phone`がnullなら`telephone`を入れない。
 *   `location.nearestGateStatus`が`confirmed`でなければ`nearestGate`を
 *   位置関連プロパティへ入れない。）
 * - 比較サイト運営者（Organization）と掲載事業者（LocalBusiness）を
 *   同一視・混同させない。事業者側に運営者と誤認させる`publisher`等は付与しない。
 *
 * 呼び出し側（pages担当）は、返り値を
 * `<script type="application/ld+json" set:html={JSON.stringify(data)} />`
 * のような形でページへ埋め込む想定。このモジュール自体はデータの組み立てのみ行い、
 * マークアップは持たない。
 *
 * 所有者: feature/seo-analytics（src/lib/seo/**）
 */

import type { Business } from '../../types/business';
import { siteConfig } from '../siteConfig';
import { buildCanonicalUrl } from './canonical';

/** JSON-LDオブジェクトの緩い型（schema.orgの語彙をTS型として厳密化しない）。 */
export type JsonLd = Record<string, unknown>;

/**
 * サイト運営主体（比較サイトそのもの）を表す`Organization`。
 * 個別事業者（掲載事業者）とは別エンティティであることを明確にするため、
 * 掲載事業者の構造化データとは常に別オブジェクトとして生成する。
 */
export function buildOrganizationJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: buildCanonicalUrl('/'),
    description: siteConfig.subtitle,
  };
}

export interface BreadcrumbItemInput {
  /** パンくずに表示する名称。 */
  name: string;
  /** サイト内パス（例: "/sekizaiten/"）。 */
  path: string;
}

/** ページ階層を示す`BreadcrumbList`。 */
export function buildBreadcrumbListJsonLd(items: BreadcrumbItemInput[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildCanonicalUrl(item.path),
    })),
  };
}

export interface ItemListEntryInput {
  /** 一覧項目の名称。 */
  name: string;
  /** サイト内パス。 */
  path: string;
}

/**
 * 汎用の`ItemList`ビルダー。
 * `review` / `aggregateRating` 等の評価系プロパティは受け付けない
 * （呼び出し側が渡しても無視される設計にはせず、そもそも型に含めていない）。
 */
export function buildItemListJsonLd(
  entries: ItemListEntryInput[],
  options?: { listPath?: string; name?: string; description?: string },
): JsonLd {
  const data: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      url: buildCanonicalUrl(entry.path),
    })),
  };
  if (options?.listPath) {
    data.url = buildCanonicalUrl(options.listPath);
  }
  if (options?.name) {
    data.name = options.name;
  }
  if (options?.description) {
    data.description = options.description;
  }
  return data;
}

/**
 * `/sekizaiten/`等の事業者一覧ページ用の`ItemList`。
 * 事業者名とページ内リンクのみを含み、評価・順位付け情報は含めない。
 * `displayOrder`はここでも「推奨順位」としては扱わず、渡された配列順を
 * そのまま`position`に反映するだけである（並べ替えの意思決定は呼び出し側が行う）。
 */
export function buildBusinessListItemListJsonLd(
  entries: Array<{ business: Business; path: string }>,
  options?: { listPath?: string; name?: string; description?: string },
): JsonLd {
  return buildItemListJsonLd(
    entries.map((entry) => ({ name: entry.business.name, path: entry.path })),
    options,
  );
}

export interface BusinessJsonLdOptions {
  /** この事業者情報が表示されているサイト内ページのパス。 */
  path: string;
}

/**
 * 個別事業者の構造化データ（`LocalBusiness`）。
 *
 * 画面に実際表示される確認済み情報だけを使う設計:
 * - `telephone`: `contact.phone`が非nullの場合だけ設定する。
 * - `url`: `contact.websiteUrl`（公式サイト）を優先し、なければ
 *   `contact.directoryUrl`（第三者店舗ページ）。どちらもnullなら設定しない。
 * - `areaServed`: `location.nearestGateStatus`が`confirmed`の場合だけ、
 *   `location.nearestGate`を設定する（未確認の門情報を位置関連プロパティへ
 *   入れない）。
 * - `address.postalCode`: `location.postalCode`が非nullの場合だけ設定する。
 * - `review` / `aggregateRating` 等は一切含めない。
 * - 比較サイト運営者（`buildOrganizationJsonLd`）へのリンクは含めない
 *   （運営者と掲載事業者の混同を避けるため）。
 */
export function buildBusinessJsonLd(business: Business, options: BusinessJsonLdOptions): JsonLd {
  const pageUrl = buildCanonicalUrl(options.path);

  const address: JsonLd = {
    '@type': 'PostalAddress',
    addressCountry: 'JP',
    addressRegion: business.location.prefecture,
    addressLocality: business.location.city,
    streetAddress: business.location.addressLine,
  };
  if (business.location.postalCode) {
    address.postalCode = business.location.postalCode;
  }

  const data: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${pageUrl}#business-${business.id}`,
    name: business.name,
    description: business.summary,
    address,
  };

  const primaryUrl = business.contact.websiteUrl ?? business.contact.directoryUrl;
  if (primaryUrl) {
    data.url = primaryUrl;
  }

  if (business.contact.phone) {
    data.telephone = business.contact.phone;
  }

  if (business.location.nearestGateStatus === 'confirmed' && business.location.nearestGate) {
    data.areaServed = business.location.nearestGate;
  }

  return data;
}
