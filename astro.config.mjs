// @ts-check
import { defineConfig } from 'astro/config';

// 本番originはデプロイ確定後にリードが設定する（sitemap / canonical の絶対URL生成に必要）。
// https://astro.build/config
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
});
