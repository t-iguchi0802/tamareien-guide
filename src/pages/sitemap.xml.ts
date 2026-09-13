/**
 * sitemap.xml（静的エンドポイント）。
 *
 * 2026-09-02、ミチの編集改善・SEO/AIO対応「sitemap・robots・AIクローラー」節。
 *
 * 対象は`src/lib/routes.ts`のROUTESに載っている公開ページ全件（管理画面等は
 * 存在しないため除外対象なし）。URLは`buildCanonicalUrl()`で生成する。
 *
 * 本番ドメイン確定（2026-09-02、siteConfig.productionOrigin =
 * https://tamareien-guide.jp）に伴い、`<loc>`は絶対URLで出力される
 * （public/robots.txtのSitemap:行もあわせて有効化済み）。
 *
 * lastmodは各ページのbuildCanonicalUrl呼び出し時点のbuild日時ではなく、
 * ここでは省略する（本文の実際の更新日と機械的に同期させる仕組みが
 * ないため、不正確なlastmodを出力しない）。
 */
import type { APIRoute } from 'astro';
import { ROUTES } from '../lib/routes';
import { buildCanonicalUrl } from '../lib/seo';
import { getPublishedNewsArticles } from '../data/news';

export const GET: APIRoute = () => {
  const staticUrls = Object.values(ROUTES).map((route) => buildCanonicalUrl(route.path));
  const articleUrls = getPublishedNewsArticles().map((article) =>
    buildCanonicalUrl(`${ROUTES.news.path}${article.slug}/`),
  );
  const urls = [...staticUrls, ...articleUrls];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`).join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
