# TECH.md
# 三鷹・街の電器屋 比較サイト — 技術実装仕様

## 1. 技術方針

V1は**静的生成を基本**とする。

理由:
- 店舗数が少ない
- 高速
- クロールしやすい
- 運用コストが低い
- Cloudflare Pages等へ配信しやすい
- DB障害に依存しない
- 将来テンプレートを他地域へ再利用しやすい

---

# 2. 推奨スタック

原則:

```text
Astro
TypeScript
Static Site Generation
YAML / Markdown / JSON
CSS
GA4
Cloudflare Pages
```

パッケージのバージョンは実装時点の安定版を使用し、
仕様書に古いバージョンを固定しない。

### React等

比較フィルター等、
クライアント側状態が本当に必要な部分だけ使用可能。

サイト全体をSPA化しない。

---

# 3. 推奨ディレクトリ

```text
/
├─ docs/
│  ├─ 01_CONTENT.md
│  ├─ 02_DESIGN.md
│  ├─ 03_SITE_STRUCTURE.md
│  ├─ 04_WIREFRAME.md
│  ├─ 05_DATA.md
│  ├─ 06_TECH.md
│  └─ 07_QA.md
│
├─ src/
│  ├─ components/
│  ├─ layouts/
│  ├─ pages/
│  ├─ content/
│  │  ├─ shops/
│  │  ├─ services/
│  │  ├─ guides/
│  │  └─ sponsors/
│  ├─ data/
│  │  ├─ site.yaml
│  │  ├─ search-clusters.yaml   # optional in V1; absence must not fail build
│  │  └─ sources/
│  ├─ lib/
│  └─ styles/
│
├─ public/
│  ├─ images/
│  ├─ robots.txt
│  └─ ...
│
└─ AGENTS.md
```

実際のAstro推奨構成に合わせて調整可能だが、
責任範囲は維持する。

---

# 4. ページ生成

静的に生成:

- TOP
- service index
- service detail
- shops index
- shop detail
- guide index
- guide detail
- trust pages

データ変更後に再ビルドして反映する。

---

# 5. コンテンツスキーマ

ビルド時にデータ検証を実施する。

検証対象:
- Shop
- Service
- Sponsor
- Guide
- SearchCluster
- Source

不正データがある場合、
本番ビルドを失敗させる方針を推奨。

---


## 5.1 内部運営データをビルド対象にしない

サイトrepoの`src/content/shops/`へ置くのは公開可能データのみ。

営業メモ、訂正・非掲載依頼の処理履歴等は別の非公開管理先で保持し、
Astro build・hydration・JSON serializationの対象にしない。

公開時にフィールド除外する方式を第二防御として使ってもよいが、
第一防御は**物理分離**とする。

---

# 6. 共通コンポーネント

```text
Header
Footer
Breadcrumb
Hero
QuickAnswer
ServiceCard
ServiceGrid
ShopCard
ShopGrid
ComparisonTable
ComparisonCardMobile
ServiceBadge
VerificationBadge
SponsorCard
SponsorRail
MobileSponsorSection
FAQList
FAQItem
SourceList
LastVerified
AccessCard
SimpleAccessMap
LandmarkList
PhoneCTA
OfficialSiteCTA
MapExternalCTA
CorrectionCTA
ArticleCard
RelatedLinks
```

---

# 7. レスポンシブ

`DESIGN.md`を正とする。

原則:
- Desktop: 3カラム
- Tablet: Main中心、スポンサーを別ブロック
- Mobile: 1カラム

CSSはmobile-firstでもdesktop-firstでもよいが、
成果物が仕様を満たすことを優先。

---

# 8. 比較UI

初期HTMLに比較内容を出力する。

### PC
semantic `<table>`

### Mobile
CSSまたは別HTML構造でカード化。

### JS

フィルターを追加する場合:
- 初期内容はSSG済み
- JS無効でも読める
- URLパラメータを大量indexさせない
- filter eventを計測

---

# 9. 簡易案内図

Google Maps iframeを標準表示しない。

## 推奨実装

データ:

```text
landmarks
street_names
intersection
bus_stop
```

から、
店舗ごとにSVGまたはHTML/CSS模式図を表示。

### 要件
- 地図画像サービスの転載禁止
- `aria-label`または説明文
- SVG内の文字も意味を持つ
- 本文にも同じランドマーク情報を出す
- Google Maps URLは外部CTA
- 十分な確認済みランドマークがない場合は`text_only`アクセスカードへフォールバック
- 模式図作成のために道路・ランドマークを推測しない

---

# 10. SEO 基盤

必須:

```text
title
meta description
canonical
lang=ja
H1
semantic HTML
crawlable links
sitemap.xml
robots.txt
404
Breadcrumb
JSON-LD
```

### canonical

indexableページは原則self canonical。

### sitemap

index対象URLのみ。

### robots

誤ってCSS/JS等をブロックしない。
管理用・不要パスのみ必要に応じて制御。

OAI-SearchBotを意図せずブロックしない。

---

# 11. JSON-LD

## TOP
- Organization
- WebSite（必要範囲）

## Shop Detail

第三者比較サイト上の店舗紹介として、JSON-LD `@graph`を推奨する。

```text
ItemPage
└ mainEntity → LocalBusiness
```

- `ItemPage`：当比較メディアの店舗詳細URL
- `LocalBusiness`：紹介対象店舗。別`@id`
- `PostalAddress`
- `GeoCoordinates`
- `openingHoursSpecification`
- `telephone`
- `url`
- `areaServed`
- `hasMap`

表示内容と一致する情報だけ出力する。
掲載店舗を運営会社の支店・所有店舗として関連付けない。

## FAQ

FAQ本文は通常HTMLとして実装するが、
V1では`FAQPage`構造化データを必須にしない。
一般的な地域比較サイトでFAQリッチリザルト獲得を前提にしない。

### 注意

比較サイト運営者と掲載店舗を混同しない。

掲載店舗のLocalBusinessは、
「当サイトがその事業者を所有している」と誤解させない構造にする。

---

# 12. Open Graph

主要ページに:
- og:title
- og:description
- og:url
- og:type
- og:image

SNS流入が主目的ではないため、
SEOより優先しない。

---

# 13. GA4

## イベント

```text
service_select
shop_card_click
shop_page_view
phone_click
official_site_click
map_open_click
ad_impression
ad_click
```


### V1任意イベント

機能を実装したときだけ追加する。

- `comparison_filter_use`
- `guide_article_click`

V1では独立イベントを作らない:
- `comparison_open`
- `access_section_view`
- `shop_list_view`

通常のGA4 page_viewや主要クリックで代替する。

### data属性

UIclass名と計測IDを分離。

例:

```html
<a
  href="/shops/example/"
  data-event="shop_card_click"
  data-shop-id="example"
  data-source-page="service_intercom"
  data-position="3">
```

---

# 14. 広告インプレッション

単なるDOM存在ではなく、
画面内に一定条件で表示されたときに`ad_impression`を送る。

IntersectionObserver等を使用可能。

V1の計測ルールを統一する。

```text
広告要素の50%以上が1秒以上viewport内に入った
AND
そのページ表示中に同じad_id × placementをまだ送信していない
→ ad_impressionを1回送信
```

実装:
- `IntersectionObserver`
- 1秒timer
- 発火後に`data-impression-sent="true"`を付与
- 同一ページ表示中は再発火しない
- ページ再読み込み・別ページ表示は新しい表示として計測

この値はサイト独自ルールによる「表示確認インプレッション」であり、
第三者認証された広告viewability指標とは表現しない。

---

# 15. 電話計測

店舗詳細だけでなく、確認済み電話番号がある店舗カードにも電話CTAを設置可能。

```html
<a
  href="tel:..."
  data-event="phone_click"
  data-shop-id="..."
  data-source-page="...">
```

電話が成立したことは分からない。

媒体資料では、
**「電話クリック」**と表現し、
「問い合わせ数」「成約数」と誤認させない。

---

# 16. 公式HPクリック

外部遷移:
`official_site_click`

別タブ強制は必須にしない。

広告ではない店舗公式リンクに
`sponsored`を付けない。

---

# 17. スポンサーリンク

スポンサー広告:
- 広告表記
- 必要なrel属性を適用
- `ad_click`
- `ad_id`
- `placement`

広告と通常の店舗リンクを計測上も分離。

---


### スポンサー0件

契約スポンサーが0件の場合:
- 空の広告カードを複数表示しない
- レール自体をcollapse可能にする
- 必要なら`広告掲載について`への控えめな導線のみ表示
- 本文幅を不自然に狭いまま固定しない

V1ではスポンサー表示をランダムローテーションしない。
固定枠＋SSG再ビルドで運用する。

# 18. Search Console / Bing

公開時:
- Google Search Console
- sitemap送信
- URL検査
- Bing Webmaster Tools
- sitemap
- IndexNow対応

IndexNowはページ追加・更新・削除時に通知できる構造を準備。


### Google Business Profile

比較メディア自身のGBP取得・自動生成・地域別プロフィール作成は実装範囲外。

店舗のGoogleマップURLは外部リンクとして保持する。
将来店舗のGBP管理支援を行う場合も、本サイト実装とは別業務として扱う。

---

# 19. パフォーマンス

重要:
- 画像最適化
- width/height
- lazy load
- HeroのLCP管理
- JS最小化
- フォント最小化
- 広告枠サイズ予約
- Google Maps iframe常時読込なし
- 外部スクリプト最小化

Core Web Vitalsを継続監視する。

---

# 20. アクセシビリティ

最低:
- semantic landmarks
- keyboard
- focus-visible
- 44px以上のタップ領域
- 色だけに依存しない
- alt
- label
- heading order
- 200% zoom
- reduced motion配慮

---

# 21. 画像

優先:
1. 店舗提供
2. 許可済み現地写真
3. 正式ロゴ
4. プレースホルダー

他サイト・Google Maps等から無断転載しない。

ファイル:
- WebP / AVIF等
- 意味のある名前
- alt

---

# 22. セキュリティ

静的サイトでも最低限:
- dependency update
- secretをrepoへ入れない
- CSP等は導入時にサイト機能との互換確認
- 外部リンクsanitize
- フォームスパム対策
- 管理用情報をpublicへ出さない

店舗の内部営業評価をビルド成果物へ含めない。

---

# 23. フォーム

V1:
- 一般問い合わせ
- 掲載情報訂正

店舗への仕事依頼を比較サイトのフォームで受けない。

フォーム実装方法はホスティング構成に合わせる。

---

# 24. デプロイ

推奨:
GitHub
→ build
→ Cloudflare Pages

### Preview
Pull RequestごとにPreviewを利用可能にする。

### Production
main等の本番branchから自動デプロイ。

branch名等は実際のrepoルールに合わせる。

---

# 25. Environment

Secrets:
- GA4関連で必要なもの
- フォーム連携
- IndexNow key等

公開可能なIDとsecretを区別する。

---


### GA4 Measurement ID

Production / Previewで値を切り替えられるよう、
site.yamlへ本番IDを固定せず環境変数から注入する。

# 26. 404

404ページに:
- TOP
- 困りごと
- 店舗一覧

への導線。

検索エンジンには正しい404 status。

---

# 27. リダイレクト

URL変更時のみ使用。

多段redirect禁止。

存在しない店を無関係な店へredirectしない。

---

# 28. テスト

自動化可能:
- type check
- schema validation
- build
- broken internal links
- duplicate title
- missing H1
- missing canonical
- sitemap checks

ブラウザ:
- responsive
- keyboard
- tracking
- layout shift
- external links

詳細は`07_QA.md`。

---

# 29. 将来拡張

同一コードで:
- 武蔵野 × 街の電器屋
- 国分寺 × 街の電器屋
- 別業種

へ展開可能にする。

地域固有値はsite configとdataへ分離。

ただし、
1つの全国公開ポータルへ統合することを前提にしない。

---

# 30. TECH Acceptance Criteria

- [ ] 静的生成
- [ ] データスキーマ検証
- [ ] 主要情報はSSG HTML
- [ ] compareがJS必須でない
- [ ] sitemap
- [ ] robots
- [ ] canonical
- [ ] JSON-LD
- [ ] GA4イベント
- [ ] sponsor impression/click
- [ ] Simple Access Map
- [ ] Google Mapsは補助遷移
- [ ] Cloudflare Pagesにデプロイ可能
- [ ] QA自動化を追加可能
