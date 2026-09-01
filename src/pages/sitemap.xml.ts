/**
 * sitemap.xml（静的エンドポイント）。
 *
 * 2026-09-02、ミチの編集改善・SEO/AIO対応「sitemap・robots・AIクローラー」節。
 *
 * 対象は`src/lib/routes.ts`のROUTESに載っている公開ページ全件（管理画面等は
 * 存在しないため除外対象なし）。URLは`buildCanonicalUrl()`で生成する。
 *
 * 重要な制約: `siteConfig.productionOrigin`が未確定（現状`null`）のため、
 * 現時点では`<loc>`が相対パスのまま出力される。sitemap.xmlの仕様上、
 * `<loc>`は絶対URLである必要があり、本番ドメインが確定するまでこの
 * ファイルは仕様上「無効」な状態のままである。したがって、本番ドメインが
 * 確定してsiteConfig.productionOriginを設定するまでは、public/robots.txt
 * へ`Sitemap:`行を追加しない（存在しない・無効なsitemapを参照すると
 * クロールエラーの原因になるという既存のQA指摘と同じ理由）。
 *
 * lastmodは各ページのbuildCanonicalUrl呼び出し時点のbuild日時ではなく、
 * ここでは省略する（本文の実際の更新日と機械的に同期させる仕組みが
 * ないため、不正確なlastmodを出力しない）。
 */
import type { APIRoute } from 'astro';
import { ROUTES } from '../lib/routes';
import { buildCanonicalUrl } from '../lib/seo';

export const GET: APIRoute = () => {
  const urls = Object.values(ROUTES).map((route) => buildCanonicalUrl(route.path));

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`).join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
