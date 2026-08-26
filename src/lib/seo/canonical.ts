/**
 * canonical URL生成ヘルパー。
 *
 * `siteConfig.productionOrigin` はデプロイ確定後にリードが設定する
 * （現状は`null`）。未設定時に絶対URLを捏造しないよう、その場合は
 * 正規化した相対パスをそのまま返す（相対canonicalとしても機能する）。
 *
 * 所有者: feature/seo-analytics（src/lib/seo/**）
 */

import { siteConfig } from '../siteConfig';

/** 先頭に "/" を1つだけ付けたパスへ正規化する（連続スラッシュは1つにまとめる）。 */
export function normalizePath(path: string): string {
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  return withLeadingSlash.replace(/\/{2,}/g, '/');
}

/**
 * canonical URLを生成する。
 * `siteConfig.productionOrigin` が設定されていれば絶対URL、
 * 未設定なら正規化した相対パスを返す。
 */
export function buildCanonicalUrl(path: string): string {
  const normalizedPath = normalizePath(path);
  const origin = siteConfig.productionOrigin;
  if (!origin) {
    return normalizedPath;
  }
  const trimmedOrigin = origin.replace(/\/+$/, '');
  return `${trimmedOrigin}${normalizedPath}`;
}

/** 本番originが確定しているか（絶対URLを組み立てられるか）。 */
export function hasProductionOrigin(): boolean {
  return Boolean(siteConfig.productionOrigin);
}
