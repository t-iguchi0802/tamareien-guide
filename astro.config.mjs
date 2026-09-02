// @ts-check
import { defineConfig } from 'astro/config';

// 本番ドメイン確定（2026-09-02、「公開前の最終確認とGitHubへのpush準備」
// 対応、ユーザー指定）。`site`はAstro自身が使う設定（Astro.site等）で、
// アプリ側のcanonical/OGP/構造化データ生成は別途
// src/lib/siteConfig.ts の productionOrigin を見る
// （src/lib/seo/canonical.ts buildCanonicalUrl()）。両方を本番ドメインに
// そろえておく。
// https://astro.build/config
export default defineConfig({
  site: 'https://tamareien-guide.jp',
  output: 'static',
  trailingSlash: 'always',
});
