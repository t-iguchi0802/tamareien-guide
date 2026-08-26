# REPORT.md（統合: integrated-mvp）

このファイルは `feature/ui-components` と `feature/seo-analytics` が
それぞれ独立に作成した `REPORT.md`（root）が統合時に add/add 競合したため、
リードが両方の内容をセクション分けしてそのまま保持する形で解決した。
内容の削除・要約は行っていない。

---

# REPORT — UI Components (feature/ui-components)

## 前提確認

- `git rev-parse HEAD`（作業開始時点）は `foundation-v1` タグと同一コミット（`8832926`）。
- `git switch -c feature/ui-components` でブランチ作成済み。
- 編集範囲は `src/components/**` と `src/styles/**` のみ。他ディレクトリ（`src/data`, `src/content`,
  `src/pages`, `src/lib`, `src/types`, `src/layouts`, package系, `CLAUDE.md` 等）は一切変更していない
  （`git status --porcelain` は新規追加ファイルのみで、既存ファイルの変更は0件）。

## デザイン方針（frontend-design スキル検討結果の要約）

- 対象読者（高齢者本人・離れて暮らす40〜60代の家族）向けに、白・深緑・石色を基調とした
  落ち着いた独自デザインとし、東京都・多磨霊園公式サイトの配色やロゴを模倣していない。
- 見出し（事業者名等）にはOS標準の明朝体（`Yu Mincho` / `Hiragino Mincho ProN` / `Noto Serif JP`）を
  石碑の刻字を想起させる書体として採用し、本文はBaseLayoutのゴシック体（Noto Sans JP）のまま維持。
  Webフォントの追加読み込みは行っていない（レイアウト非依存・オフライン耐性維持）。
- 視覚的シグネチャ: カード上部・比較表見出しに「石の目地」を思わせる二重の細罫線
  （`border-top: … double var(--color-stone-line)`）を使用。カード自体の角は控えめな角丸
  （石版を思わせる）、CTAボタンは丸ボタン（タップしやすい親しみやすい形）という対比をつけている。
- 状態色は `not_confirmed` を「非対応（赤系）」に見せないよう、中立な石色＋破線ボーダーで表現。
  `explicitly_not_offered` のみ落ち着いた土色（クレイ系）で区別し、赤は一切使っていない。
- スポンサー枠（`SponsorCard`）は比較カードと明確に異なる暖色クリーム＋金の破線ボーダーとし、
  「広告・スポンサー枠」の表記と、掲載順・評価に影響しない旨の注記を必ず含めている。
- `src/layouts/BaseLayout.astro` のグローバルトークン（`--color-bg` 等）は再定義せず、
  `src/styles/tokens.css` でコンポーネント固有トークン（状態色・見出し書体・罫線色等）のみを追加。

## 実装したコンポーネント一覧

| ファイル | Props契約 | 概要 |
|---|---|---|
| `src/components/common/VerificationBadge.astro` | `VerificationBadgeProps` | 確認状態バッジ。表示文言は必ず `statusToDisplayLabel()` を経由（独自変換なし）。状態ごとに色・アイコン（装飾/aria-hidden）を出し分け。`not_confirmed` は破線＋中立色で「未確認」であって「非対応」ではないことを視覚的にも区別。 |
| `src/components/business/BusinessCard.astro` | `BusinessCardProps` | 事業者カード。`listingTier`/`displayOrder` は評価と誤認されないよう非表示。確認済みサービスをタグ列挙（件数による優劣主張はしない）。電話未確認時はPhoneLinkを描画せず「電話番号: 公開情報では未確認」と明示。地図リンクは確認済み住所文字列からGoogleマップ検索URLを組み立て（座標・徒歩分数の独自推定はしていない）。 |
| `src/components/business/ComparisonTable.astro` | `ComparisonTableProps` | PC用`<table>`（sticky見出し行・sticky事業者列、768px以上で表示、狭幅では横スクロール）と、モバイル用`<details>`カード（JS不要・キーボード操作可能なネイティブ開閉、767px以下で表示）の両方を1コンポーネントに実装。各セルは`VerificationBadge`のみを経由して表示。並べ替え・絞り込みは行わず、渡された`businesses`配列の順序をそのまま表示する。 |
| `src/components/business/serviceLabels.ts` | （型契約外の内部共有定数） | `ServiceKey → 表示ラベル` の対応表。`BusinessCard`と`ComparisonTable`の重複を避けるための`src/components/**`内共有ヘルパー。データ本体・型契約は変更していない。 |
| `src/components/access/OutboundLink.astro` | `OutboundLinkProps` | 外部リンクCTA（公式サイト/問い合わせ/掲載ページ）。`data-event="business_outbound_click"` `data-business-id` `data-link-type` `data-page-path` を付与。 |
| `src/components/access/PhoneLink.astro` | `PhoneLinkProps` | 電話発信リンク（`tel:`）。`data-event="business_phone_click"` `data-business-id` `data-page-path` を付与。桁の補正等は行わない。 |
| `src/components/access/MapLink.astro` | `MapLinkProps` | 地図リンク。`data-event="business_map_click"` `data-business-id` `data-page-path` を付与。href組み立ては呼び出し側の責務。 |
| `src/components/common/CorrectionCta.astro` | `CorrectionCtaProps` | 訂正・非掲載依頼への導線。`siteConfig.contact.correctionUrl`（`/about/`）へリンクし、`businessId`があれば`?business=`クエリを付与。`data-event="correction_request_click"` を付与。スポンサー契約の有無に関わらず受け付ける旨の文言を明記。 |
| `src/components/sponsors/SponsorCard.astro` | 独自定義`SponsorCardProps`（`src/types/components.ts`未定義。優先度低の暫定実装） | スポンサー枠プレースホルダー。比較カードと明確に異なる配色（クリーム＋金）、「広告・スポンサー枠」表記必須、掲載順・評価に影響しない旨の注記あり。実データ未整備のため差し込み位置と見た目のみ。 |
| `src/styles/tokens.css` | — | コンポーネント層のデザイントークン（状態色・見出し書体・石目罫線色・タップ領域サイズ・角丸半径等）と`.sr-only`ユーティリティ。BaseLayoutのグローバルトークンは再定義せず`var()`で参照。 |

## 使用例（props渡し方）

```astro
---
import BusinessCard from '../components/business/BusinessCard.astro';
import ComparisonTable from '../components/business/ComparisonTable.astro';
import VerificationBadge from '../components/common/VerificationBadge.astro';
import CorrectionCta from '../components/common/CorrectionCta.astro';
import type { Business, ServiceKey } from '../types/business';

// businesses は src/lib/data 経由で取得する（getBusinesses() 等）
declare const businesses: Business[];
const visibleServices: ServiceKey[] = [
  'new_grave', 'grave_closure', 'reburial_support', 'interment',
  'engraving', 'cleaning', 'annual_management', 'flowers',
  'planting', 'renovation', 'seismic', 'remote_photo_report',
];
---
<section>
  {businesses.map((business) => <BusinessCard business={business} />)}
</section>

<ComparisonTable businesses={businesses} visibleServices={visibleServices} />

<VerificationBadge status="not_confirmed" />

<CorrectionCta businessId="biz-toshimaya" />
```

`OutboundLink` / `PhoneLink` / `MapLink` は `BusinessCard` 内部で組み立て済みだが、
単独でも次のように使用できる。

```astro
<OutboundLink businessId="biz-toshimaya" linkType="official_site" href="https://www.toshimaya.net/" />
<PhoneLink businessId="biz-toshimaya" phone="042-381-2616" />
<MapLink businessId="biz-toshimaya" href="https://www.google.com/maps/search/?api=1&query=..." />
```

## コマンド結果

- `npm ci` — 成功。
- `npm run check`（`astro check`） — 0 errors / 0 warnings / 0 hints（25ファイル診断）。
- `npm run lint`（`eslint .`） — エラー・警告なし。
- `npm run build` — 成功（既存の`src/pages/index.astro`のみをビルド。新規コンポーネントは
  `astro check`の対象として型・構文検証済みだが、ページ未統合のため`dist/`には現時点で出力されない）。
- `npm run format:check` — 新規コンポーネントファイルを含む33ファイルで差分ありと報告されたが、
  このリストには`CLAUDE.md` / `package.json` / `astro.config.mjs` / `tsconfig.json` /
  `src/types/**` / `src/lib/data/**` 等、**本エージェントが一切変更していない共有ファイル**も
  含まれており、`foundation-v1`時点から既に repo 全体でフォーマット差分がある状態と判断した
  （改行コード等の環境差の可能性）。新規作成した`src/components/**`・`src/styles/**`配下の
  ファイルには`npx prettier --write`を実行済みで、これらのファイル単体では整形済み。

## 未解決事項・統合時の注意点

1. **地図リンクのhref**: `businesses.json`のスキーマに地図URL専用フィールドが無いため、
   `BusinessCard`内部で確認済み住所文字列（`prefecture + city + addressLine`）と事業者名から
   Googleマップ検索URLを構築している（座標・徒歩分数等の独自推定はしていない、公開情報の
   文字列をそのまま検索クエリ化しているのみ）。より適切な地図リンク運用（例: 事業者公式の
   地図ページURLをデータに持たせる等）が必要であれば、`data_dictionary.md`・
   `src/types/business.ts`側の契約追加をリードに検討いただきたい。
2. **`listingTier`・`displayOrder`は画面に一切表示していない**（品質評価と誤認されるリスクを避けるため）。
   将来的にA/B区分や管理順を画面表示したいという要件が出た場合は、表示ルールを別途明確化した上での対応が必要。
3. **`businessHours` / `closedDays`の「公開情報では未確認」表示**は、`BusinessCard`・
   `ComparisonTable`のどちらでも行っていない（今回のスコープでは項目自体を表示していないため）。
   将来、事業者詳細ページ等でこれらを表示する場合は、`null`時に「公開情報では未確認」へ
   変換する同様のパターンを実装側で踏襲する必要がある（`PhoneLink`未描画時の
   `business-card__unconfirmed-note`と同じ考え方）。
4. **`SponsorCard`のProps契約**は`src/types/components.ts`に未定義（スポンサー実データ・
   `isSponsored`/`campaignId`等の設計が固まっていないため）。実データ設計確定時に、
   共有型契約への追加をリードに検討いただきたい（契約変更提案であり、今回コード側では対応していない）。
5. **`ComparisonTable`のブレークポイント**は768pxで表・カードを切り替えている
   （768px以上=表、767px以下=カード）。要求されている360/768/1440の3サイズいずれでも
   崩れないことを確認済み（768pxちょうどは表側、横スクロールコンテナ内に収まる）。
6. **GA4計測ロジックは未実装**（指示通り）。`OutboundLink`/`PhoneLink`/`MapLink`/`CorrectionCta`には
   `data-event` `data-business-id` `data-link-type` `data-page-path`
   （analytics.tsのパラメータ名に合わせたsnake_case）を安定属性として付与済み。
   `comparison_filter_use`イベント用の絞り込みUI（地域・サービス絞り込み等）は
   pages側の実装スコープと判断し、本エージェントでは作成していない
   （`ComparisonTable`自体は絞り込みを行わないビュー専任コンポーネント）。
7. **pages担当への申し送り**: `ComparisonTable`は絞り込み・並べ替えを一切行わないため、
   地域・門・サービス絞り込みや五十音・管理順の並べ替えUIはpages側（またはこのコンポーネントを
   ラップする上位コンポーネント）で`businesses`配列を事前に加工してから渡す設計を想定している。
   `comparison_filter_use`イベントの発火元もpages側のフィルターUIになる想定。

## 依存パッケージ追加要求

なし。既存パッケージのみで実装した。

---

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
