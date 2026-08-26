# REPORT.md — feature/seo-analytics（Phase 1）

- 担当: SEO・計測（`.claude/agents/seo-analytics.md`）
- ブランチ: `feature/seo-analytics`（`foundation-v1` タグのコミットから分岐）
- 編集範囲: `src/lib/seo/**`, `src/lib/analytics/**`, `public/robots.txt` のみ

## 1. 実装したユーティリティ一覧

### 1-1. `src/lib/analytics/**`（GA4計測）

| ファイル | 役割 |
|---|---|
| `config.ts` | `PUBLIC_GA_MEASUREMENT_ID` 環境変数からMeasurement IDを読む。未設定・空文字は`null`（`getGaMeasurementId`, `isAnalyticsEnabled`）。 |
| `gtagClient.ts` | `window.gtag`の型宣言（`declare global`）と、GA4イベント送信の唯一の経路`sendGaEvent()`。`window`/`window.gtag`が無い場合は何もしない。例外もtry/catchで握りつぶし、計測失敗がサイト動作に影響しないようにしている。 |
| `events.ts` | `src/types/analytics.ts`の6イベントに対応する薄いラッパー関数（`trackBusinessOutboundClick` 等6関数）。 |
| `dispatcher.ts` | `data-event`等のdata-*属性からイベントを拾う汎用クリック/change委譲ディスパッチャ（`initAnalyticsDispatcher()`）。ui-components/pages担当がマークアップにdata-*属性を付けるだけで計測を組み込める疎結合設計。 |
| `autoInit.ts` | `initAnalyticsDispatcher()`をimportの副作用として即時実行する薄いエントリ（`<script>import '../lib/analytics/autoInit'</script>`するだけで有効化）。 |
| `GaTag.astro` | 任意のGA4(gtag.js)読み込みコンポーネント。Measurement ID未設定時はfrontmatterで早期`return`し、何も出力しない。 |
| `index.ts` | 上記TSモジュールの公開バレル（`.astro`は含めない。個別import）。 |

### 1-2. `src/lib/seo/**`（SEO）

| ファイル | 役割 |
|---|---|
| `canonical.ts` | `buildCanonicalUrl(path)` — `siteConfig.productionOrigin`が設定されていれば絶対URL、未設定なら正規化した相対パスを返す。`normalizePath`, `hasProductionOrigin`も公開。 |
| `structuredData.ts` | JSON-LDビルダー群。`buildOrganizationJsonLd()`（サイト運営主体）、`buildBreadcrumbListJsonLd()`、`buildItemListJsonLd()` / `buildBusinessListItemListJsonLd()`（一覧ページ用、review/aggregateRating等は型にも実装にも含めない）、`buildBusinessJsonLd(business, { path })`（個別事業者用`LocalBusiness`。`contact.phone`が非nullの場合だけ`telephone`、`location.nearestGateStatus === 'confirmed'`の場合だけ`areaServed`へ`nearestGate`、`location.postalCode`が非nullの場合だけ`address.postalCode`を設定。`contact.websiteUrl`優先・なければ`contact.directoryUrl`を`url`に設定）。 |
| `meta.ts` | `buildPageTitle()`（サイト名付与）、`truncateDescription()`（description用の切り詰め）、`findMetaIssues()`（title/description の空値・重複・長さ超過を検出する任意の開発時チェック）。 |
| `index.ts` | 公開バレル。 |

### 1-3. `public/robots.txt`

- `User-agent: *` / `Allow: /` で主要ページを一切ブロックしない（OAI-SearchBotを含め特定クローラーの意図的ブロックなし）。
- 管理用パスは現時点で存在しないため個別Disallowは設定していない。
- `Sitemap: /sitemap-index.xml` を仮記載。**実際のsitemap生成は今回のスコープ外**。本番origin確定後は絶対URL（例: `https://example.com/sitemap-index.xml`）へ更新が必要（現状`siteConfig.productionOrigin`は`null`のため、robots.txt側でも絶対URLを捏造していない）。sitemap自体が未生成の間、このURLは404になる点に注意。

## 2. 使用例（pages/ui-components担当向け）

### GA4イベント送信（data属性方式・推奨）

```astro
<a
  href={business.contact.websiteUrl}
  data-event="business_outbound_click"
  data-business-id={business.id}
  data-link-type="official_site"
>
  公式サイト
</a>

<script>
  import '../lib/analytics/autoInit';
</script>
```

`comparison_filter_use`は `<select>` 等の`change`イベントでも拾えるよう、click/change両方をリッスンしている。

### GA4イベント送信（関数直接呼び出し方式）

```ts
import { trackBusinessPhoneClick } from '../lib/analytics/events';

trackBusinessPhoneClick({ business_id: 'biz-xxx', page_path: '/sekizaiten/' });
```

### GAタグ読み込み（任意。レイアウト/ページ担当が`<head>`へ組み込む場合）

```astro
---
import GaTag from '../lib/analytics/GaTag.astro';
---
<head>
  <GaTag />
</head>
```

### SEO: canonical / JSON-LD

```astro
---
import { buildCanonicalUrl, buildOrganizationJsonLd, buildBreadcrumbListJsonLd, buildBusinessListItemListJsonLd } from '../lib/seo';

const canonical = buildCanonicalUrl('/sekizaiten/');
const orgJsonLd = buildOrganizationJsonLd();
const breadcrumbJsonLd = buildBreadcrumbListJsonLd([
  { name: 'トップ', path: '/' },
  { name: '石材店一覧', path: '/sekizaiten/' },
]);
const itemListJsonLd = buildBusinessListItemListJsonLd(
  businesses.map((b) => ({ business: b, path: '/sekizaiten/' })),
  { listPath: '/sekizaiten/' },
);
---
<link rel="canonical" href={canonical} />
<script type="application/ld+json" set:html={JSON.stringify(orgJsonLd)} />
<script type="application/ld+json" set:html={JSON.stringify(breadcrumbJsonLd)} />
<script type="application/ld+json" set:html={JSON.stringify(itemListJsonLd)} />
```

## 3. 未解決事項・統合時の注意

1. **`src/layouts/BaseLayout.astro`（リード共有）への`GaTag.astro`組み込みは行っていない。** 編集範囲外のため、統合時にリードまたはpages担当が`<head>`へ`<GaTag />`を配置する必要がある（配置しなくてもビルドは壊れない。単に計測が無効なだけ）。
2. **`data-event`等のdata-*属性は、pages/ui-components担当のマークアップにまだ実装されていない。** 統合時に、`dispatcher.ts`冒頭のコメントに記載した属性名（`data-event`, `data-business-id`, `data-link-type`, `data-filter-type`, `data-filter-value`, `data-authority`, `data-topic`, `data-page-path`）に合わせてもらう必要がある。属性名が変わる場合は本ブランチ側の`dispatcher.ts`を統合ブランチ側で調整する必要がある。
3. **JSON-LD（`buildBusinessJsonLd`等）もどのページにも埋め込まれていない。** pages担当が`/sekizaiten/`等で呼び出して`<script type="application/ld+json">`へ渡す想定。
4. **`robots.txt`の`Sitemap`行はプレースホルダー。** サイトマップ生成は今回のスコープ外。本番origin確定後、絶対URLへの更新とサイトマップ本体の実装が別途必要。
5. **GA4 Measurement IDの環境変数名は`PUBLIC_GA_MEASUREMENT_ID`とした。** `CLAUDE_CODE_HANDOFF.md`には具体名の指定がないため、Astro/Viteの規約（クライアントに公開する環境変数は`PUBLIC_`接頭辞必須）に従い命名した。Cloudflare Pages側の環境変数名をこれに合わせるか、異なる名前にする場合は`src/lib/analytics/config.ts`のみ修正すればよい。
6. **`buildBusinessJsonLd`は`telephone`/`url`/`areaServed`/`postalCode`のみ条件付きで含める設計とした。** `businessHours`（自由記述文字列で構造化が困難）、`parking`（`VerificationStatus`型で単純な真偽値ではない）は、誤った構造化を避けるため意図的に含めていない。将来これらを含める場合は、`data_dictionary.md`の表示ルールと矛盾しない形で追加検討が必要。
7. **prettier-plugin-astroの既知の制約を1件回避した。** `{condition && (<script define:vars>...)}`のようにscriptタグをJSX式で条件分岐すると、prettier-plugin-astroがscript内`{`/`}`を式コンテナの一部と誤認しSyntaxErrorになる（Astro本体のコンパイル・型チェック・ビルドは問題ない、prettier固有の制約）。`GaTag.astro`はfrontmatterでの早期`return`に書き換えて回避した。他ファイルでこのパターンを踏襲する場合は同様の書き方を推奨する。

## 4. コマンド結果

- `npm ci`: 成功
- `npm run check`: 0 errors / 0 warnings / 0 hints
- `npm run lint`: エラーなし
- `npm run build`: 成功（`dist/index.html`のみ生成。pages担当実装前のPhase 0プレースホルダーのため1ページ）
- `npx prettier --check src/lib/analytics src/lib/seo public/robots.txt`: `.ts`/`.astro`は全てPrettier準拠（`robots.txt`はprettierの対象外拡張子のため個別チェック時にエラーになるが、`npm run format:check`の対象ではあるので統合時に確認要）

## 5. 担当範囲外の変更

なし。`git status --porcelain`で確認した変更は以下のみ:

```
 D src/lib/analytics/.gitkeep   (実ファイル追加により不要になったため削除)
 D src/lib/seo/.gitkeep         (同上)
?? public/robots.txt
?? src/lib/analytics/*.ts, GaTag.astro, index.ts
?? src/lib/seo/*.ts
```
