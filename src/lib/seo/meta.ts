/**
 * title/description生成の補助、およびページ間の重複検出ユーティリティ。
 *
 * CLAUDE_CODE_HANDOFF.md 8章「ページごとに固有のtitle、description、canonical」
 * を満たす助けとして、pages担当が任意で使用できる。必須の統合ポイントではない。
 *
 * 所有者: feature/seo-analytics（src/lib/seo/**）
 */

import { siteConfig } from '../siteConfig';

const DEFAULT_TITLE_SEPARATOR = '｜';
/** GoogleのSERPで概ね切り詰められずに収まる目安の文字数（日本語）。 */
const RECOMMENDED_DESCRIPTION_MAX_LENGTH = 120;
const RECOMMENDED_TITLE_MAX_LENGTH = 32;

/**
 * ページ固有タイトルにサイト名を付与する。
 * `pageTitle`が空文字の場合はサイト名のみを返す（トップページ等）。
 */
export function buildPageTitle(
  pageTitle: string,
  options?: { siteName?: string; separator?: string },
): string {
  const siteName = options?.siteName ?? siteConfig.name;
  const separator = options?.separator ?? DEFAULT_TITLE_SEPARATOR;
  const trimmed = pageTitle.trim();
  return trimmed.length > 0 ? `${trimmed}${separator}${siteName}` : siteName;
}

/**
 * description用に文字列を目安の長さで切り詰める。
 * 文中で切れないよう、超過分は末尾の句読点・空白の位置を優先して切る。
 */
export function truncateDescription(
  text: string,
  maxLength: number = RECOMMENDED_DESCRIPTION_MAX_LENGTH,
): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  const sliced = trimmed.slice(0, maxLength);
  const lastBreak = Math.max(
    sliced.lastIndexOf('。'),
    sliced.lastIndexOf('、'),
    sliced.lastIndexOf(' '),
  );
  const cut = lastBreak > maxLength * 0.5 ? sliced.slice(0, lastBreak + 1) : sliced;
  return `${cut}…`;
}

export interface PageMetaEntry {
  /** サイト内パス（例: "/sekizaiten/"）。識別・報告用。 */
  path: string;
  title: string;
  description: string;
}

export interface MetaIssue {
  path: string;
  issue:
    | 'empty_title'
    | 'empty_description'
    | 'title_too_long'
    | 'duplicate_title'
    | 'duplicate_description';
}

/**
 * ページ間のtitle/description重複、空値、タイトル長超過を検出する。
 * ビルド前チェックやQA用の補助として使用できる（実行はしない。呼び出し側が使う）。
 */
export function findMetaIssues(
  entries: PageMetaEntry[],
  options?: { titleMaxLength?: number },
): MetaIssue[] {
  const titleMaxLength = options?.titleMaxLength ?? RECOMMENDED_TITLE_MAX_LENGTH;
  const issues: MetaIssue[] = [];

  const titleCounts = new Map<string, number>();
  const descriptionCounts = new Map<string, number>();
  for (const entry of entries) {
    titleCounts.set(entry.title, (titleCounts.get(entry.title) ?? 0) + 1);
    descriptionCounts.set(entry.description, (descriptionCounts.get(entry.description) ?? 0) + 1);
  }

  for (const entry of entries) {
    if (entry.title.trim().length === 0) {
      issues.push({ path: entry.path, issue: 'empty_title' });
    } else if (entry.title.length > titleMaxLength) {
      issues.push({ path: entry.path, issue: 'title_too_long' });
    } else if ((titleCounts.get(entry.title) ?? 0) > 1) {
      issues.push({ path: entry.path, issue: 'duplicate_title' });
    }

    if (entry.description.trim().length === 0) {
      issues.push({ path: entry.path, issue: 'empty_description' });
    } else if ((descriptionCounts.get(entry.description) ?? 0) > 1) {
      issues.push({ path: entry.path, issue: 'duplicate_description' });
    }
  }

  return issues;
}
