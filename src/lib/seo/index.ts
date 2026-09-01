/**
 * `src/lib/seo/**` の公開エントリ。
 *
 * 所有者: feature/seo-analytics（src/lib/seo/**）
 */

export { buildCanonicalUrl, normalizePath, hasProductionOrigin } from './canonical';
export type {
  JsonLd,
  BreadcrumbItemInput,
  ItemListEntryInput,
  BusinessJsonLdOptions,
  ArticleJsonLdInput,
} from './structuredData';
export {
  buildOrganizationJsonLd,
  buildBreadcrumbListJsonLd,
  buildItemListJsonLd,
  buildBusinessListItemListJsonLd,
  buildBusinessJsonLd,
  buildArticleJsonLd,
} from './structuredData';
export type { PageMetaEntry, MetaIssue } from './meta';
export { buildPageTitle, truncateDescription, findMetaIssues } from './meta';
