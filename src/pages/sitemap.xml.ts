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
 *
 * ニュース・記事掲載機能（2026-09-13追加）: 個別記事ページ（/news/[slug]/）は
 * slugごとの動的ルートのため、ROUTESには載っていない（一覧ページ
 * ROUTES.newsのみ載っている）。getPublishedNewsArticles()から公開対象の
 * slugを取得し、一覧ページのURLに追加する。記事が0件の場合は追加URLなし
 * （sitemapはROUTES分のみになり、ビルドは失敗しない）。
 */
import type { APIRoute } from 'astro';
import { ROUTES } from '../lib/routes';
import { buildCanonicalUrl } from '../lib/seo';
import { getPublishedNewsArticles } from '../lib/data';

export const GET: APIRoute = () => {
  const routeUrls = Object.values(ROUTES).map((route) => buildCanonicalUrl(route.path));
  const newsArticleUrls = getPublishedNewsArticles().map((article) =>
    buildCanonicalUrl(`/news/${article.slug}/`),
  );
  const urls = [...routeUrls, ...newsArticleUrls];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`).join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
