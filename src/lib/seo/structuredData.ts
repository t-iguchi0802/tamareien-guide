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
 * サイトの運営法人を表す`Organization`。
 *
 * 2026-09-02（ナビゲーション・運営者表示・SEO/AIO監査対応）: 従来は
 * サイトのブランド名（siteConfig.name＝「多磨霊園 お墓ガイド」）を
 * `Organization`の`name`に使っていたが、これは「サイト」と「運営法人」を
 * 混同する実装だった。ユーザーから確定情報として示された運営法人
 * （`siteConfig.operator`＝株式会社サンアローズ、会社公式URL）を
 * `Organization`として発行し、サイトそのものは別途`buildWebSiteJsonLd()`
 * （`WebSite`、`publisher`でこの`Organization`を参照）として発行する
 * 構成に変更した。所在地・代表者名・電話番号・法人番号等、確認できない
 * 情報は追加しない。
 *
 * 個別事業者（掲載事業者、`LocalBusiness`）とは別エンティティであることを
 * 明確にするため、掲載事業者の構造化データとは常に別オブジェクトとして
 * 生成する。
 */
export function buildOrganizationJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.operator.name,
    url: siteConfig.operator.url,
  };
}

/**
 * サイトそのものを表す`WebSite`（2026-09-02追加）。
 * `publisher`として運営法人（`Organization`）を参照する。`potentialAction`
 * （サイト内検索のSearchAction等）は、サイト内検索機能が実際には存在
 * しないため追加しない（画面にない機能を構造化データにだけ書かない）。
 */
export function buildWebSiteJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: buildCanonicalUrl('/'),
    description: siteConfig.subtitle,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.operator.name,
      url: siteConfig.operator.url,
    },
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
    // 「ランキングではなく順不同の一覧」であることをJSON-LD上でも明確にする
    // （2026-09-02追加、ミチの編集改善・SEO/AIO対応「構造化データ」節）。
    // positionは配列の並び順（displayOrder＝管理用の安定表示順）を機械的に
    // 反映しているだけで、推奨順位ではないことに変わりはない
    // （data_dictionary.md・CLAUDE.md「displayOrderは推奨順位ではない」参照）。
    itemListOrder: 'https://schema.org/ItemListUnordered',
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

export interface ArticleJsonLdInput {
  path: string;
  headline: string;
  description: string;
  /** 記事本文が事実として最後に更新された日（YYYY-MM-DD）。ビルド日ではない。 */
  datePublished: string;
  dateModified: string;
  /** OGP同様、サイトルートからの絶対パス。 */
  image?: string;
}

/**
 * ガイド記事用の`Article`。
 *
 * `datePublished`/`dateModified`は、ビルドを実行した日ではなく、
 * 本文を実際に確認・更新した日（各ページの`checkedAt`相当の値）を
 * 呼び出し側から渡す（2026-09-02追加、ミチの編集改善・SEO/AIO対応
 * 「更新日と情報源」節「dateModifiedは実際に本文を更新した場合だけ
 * 変更する」に対応。`new Date()`等でビルド時刻を自動的に入れない）。
 * `author`は個人名を持たないため、`publisher`（サイト運営主体、
 * Organization）のみを設定する。
 */
export function buildArticleJsonLd(input: ArticleJsonLdInput): JsonLd {
  const pageUrl = buildCanonicalUrl(input.path);
  const data: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.operator.name,
      url: siteConfig.operator.url,
    },
  };
  if (input.image) {
    data.image = buildCanonicalUrl(input.image);
  }
  return data;
}
