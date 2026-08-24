# DATA.md
# 三鷹・街の電器屋 比較サイト — データ仕様

## 1. 方針

V1ではDBを必須としない。

店舗数8〜20程度を想定し、
静的データファイルからサイトを生成する。

推奨:
- YAML または JSON
- スキーマ検証あり
- 1店舗1ファイル
- Gitで変更履歴を管理

重要:
**不明な情報を空想で補完しない。**

---

# 2. 状態値

## 2.1 サービス対応状態

```text
confirmed
conditional
not_available
unconfirmed
```

表示:

| 値 | 日本語 |
|---|---|
| confirmed | 対応確認済み |
| conditional | 条件あり |
| not_available | 非対応 |
| unconfirmed | 未確認 |

---

## 2.2 情報確認種別

```text
direct
official
manufacturer
association
public
unconfirmed
```

優先度:

```text
direct
> official
> manufacturer
> association
> public
> unconfirmed
```

複数ソースを保持可能とする。

---

# 3. Shop Schema

```yaml
id: kato-denki
slug: kato-denki

name: ""
company_name: ""

status: active

address:
  postal_code: ""
  prefecture: 東京都
  city: 三鷹市
  town: ""
  street: ""
  full: ""

contact:
  phone: ""
  official_url: ""
  map_url: ""

business:
  hours_text: ""
  closed_days_text: ""
  representative: ""
  founded_year:
  manufacturer_affiliation: []

area:
  primary_area: 三鷹市
  service_areas: []
  coverage_towns: []
  nearest_station: ""

access:
  latitude:
  longitude:
  nearest_bus_stop: ""
  bus_stop_walk_minutes:
  intersection: ""
  street_names: []
  landmarks:
    - name: ""
      type: school
      relation: ""
      distance_m:
  access_summary: ""
  map_note: ""
  display_mode: text_only
  verified_at:
  sources: []

services:
  # service_idをキーにしたMap。
  # キーはService定義に存在するIDのみ許可する。
  intercom:
    status: unconfirmed
    notes: ""
    source_ids: []
    capabilities:
      replacement: unconfirmed
      repair: unconfirmed
      customer_supplied: unconfirmed

  aircon:
    status: unconfirmed
    notes: ""
    source_ids: []
    capabilities:
      installation: unconfirmed
      removal: unconfirmed
      relocation: unconfirmed
      repair: unconfirmed
      customer_supplied: unconfirmed

# 防犯カメラ、IH、Wi-Fi等も、
# Service定義へIDを追加したうえで同じservices Mapに追加する。

commercial_terms:
  estimate:
    status: unconfirmed
    notes: ""
  trip_fee:
    status: unconfirmed
    notes: ""


# `commercial_terms`は店舗全体の代表値。
# サービスごとに条件が異なる場合はservices.{service_id}.notesで補足する。
features: []
suitable_for: []

pricing:
  text: ""
  verified: false
  source_ids: []

media:
  logo:
  exterior_image:
  images: []

search:
  aliases: []
  problem_terms: []
  product_terms: []
  brand_terms: []
  service_terms: []
  local_terms: []
  faq_questions: []
  target_intents: []

verification:
  verified_at:
  verification_type: public
  source_ids: []

editorial:
  summary: ""

published: true""
```

---


## 3.1 公開データと内部運営データの物理分離

公開Shop YAMLには、公開に必要な情報だけを置く。

**以下を公開Shop YAMLへ置いてはならない。**

- 営業優先度
- スポンサー交渉内容
- 店舗担当者の個人情報
- クレーム・トラブル経緯
- 訂正依頼の内部処理メモ
- 非掲載依頼の内部処理メモ
- `notes_internal`
- `correction_requested`
- `removal_requested`

これらはサイトリポジトリ・ビルド入力から物理的に分離し、
アクセス制限されたスプレッドシート、CRM、別の非公開ストア等で管理する。

```text
公開サイトrepo
└ src/content/shops/*.yaml     ← 公開情報のみ

内部運営データ
└ 別の非公開管理先            ← サイトビルドから参照しない
```

「ビルド時にフィルタすればよい」だけに依存しない。
内部データ自体を公開サイトrepoへ入れないことを原則とする。

---

# 4. Source Schema

全事実情報は可能な範囲でSourceへ紐づける。


### `access.display_mode`

```text
auto
simple_map
text_only
```

- `auto`: ビルド時に確認済みランドマーク数等から判断
- `simple_map`: 十分な確認情報があり模式図を表示
- `text_only`: 住所・最寄り・Googleマップ外部リンクのみ

`simple_map`を使うためにランドマークを推測してはならない。

---

```yaml
id: source-001
type: official
title: ""
publisher: ""
url: ""
checked_at: 2026-08-13
notes: ""
```

`type`:

```text
direct
official
manufacturer
association
public
```

### direct

店舗への電話・訪問確認。

```yaml
type: direct
method: phone
checked_at:
contact_role:
notes:
```

個人情報を必要以上に記録しない。

---

# 5. Service Schema

サービス定義は業種ごとにデータとして管理し、
Shop SchemaのTypeScript型へ固定キーをハードコードしない。

```yaml
id: intercom
slug: intercom
name: インターホン
short_name: インターホン
group: primary
description: ""
icon: ""

seo:
  primary_intent: ""
  primary_terms: []
  variants: []
  questions: []

capabilities:
  - id: replacement
    label: 交換
  - id: repair
    label: 修理
  - id: customer_supplied
    label: 他店購入品

comparison_fields:
  - replacement
  - customer_supplied
```

`group`:

```text
primary
additional
```

Shop側の`services`は`service_id`をキーにしたMapとして保持する。

TypeScript / Zodでは概念的に:

```text
services: Record<string, ShopService>
```

とし、キーがService定義に存在することをビルド時に検証する。

これにより別業種へ展開するときに
`aircon`や`intercom`をエンジン側Typeへ固定しない。

---

# 6. Guide Schema

```yaml
id: intercom-not-ringing
slug: intercom-not-ringing
title: ""
status: draft

search:
  cluster: intercom
  intent: problem
  primary_term: ""
  variants: []
  questions: []

content:
  quick_answer: ""
  body_source: ""

related_services:
  - intercom

related_shops: []

sources: []

published_at:
updated_at:
```

本文そのものをMarkdownで管理する場合は、
frontmatterと本文を分離してもよい。

---

# 7. Sponsor Schema

スポンサーは店舗データとは分離する。

```yaml
id: sponsor-001
name: ""
status: active

creative:
  image: ""
  alt: ""
  short_copy: ""

link:
  url: ""
  rel: sponsored

placements:
  - left_top

period:
  start:
  end:

tracking:
  campaign_id: ""
```

placement:

```text
left_top
left_bottom
right_top
right_bottom
mobile_1
mobile_2
```

### 重要

スポンサー情報をShopの比較データへ混ぜない。

---

# 8. Search Cluster Schema（V1任意）

検索戦略をコードから分離できるようにするが、
**V1のビルド必須データにはしない。**

初期運用はMarkdown / YAML / スプレッドシートでもよく、
サイト数・検索語数が増えた時点で本格データ化する。

参考スキーマ:

```yaml
id: intercom-replace
cluster: intercom
intent: transaction

primary_term: "三鷹 インターホン交換"

variants:
  - "三鷹 ドアホン交換"
  - "インターホン 交換 三鷹"

questions:
  - "三鷹でインターホン交換はどこに頼む？"

target_url: /service/intercom/

status: active

sources:
  - manual_serp

reviewed_at:
```

---

# 9. Site Config

地域展開に備えて地域固有値を分離する。

```yaml
site:
  name: ""
  locale: ja-JP
  region_name: 三鷹市
  prefecture: 東京都
  industry_name: 街の電器屋
  canonical_origin: ""

contact:
  operator_name: ""
  contact_url: /contact/

theme:
  industry_accent: ""

analytics:
  # 実値は環境変数から注入。ここへ本番/検証環境IDを固定しない。
  enabled: true""
```

---

# 10. 表示データと内部データ

## 公開可能
- 店名
- 住所
- 電話
- 営業時間
- 公式URL
- 対応サービス
- アクセス
- 情報源
- 確認日

## 内部のみ
- スポンサー営業評価
- HP制作営業評価
- ヒアリングメモ
- 掲載停止依頼の内部処理メモ
- 担当者名等の不要な個人情報
- 交渉内容

内部営業評価を公開データと同じファイルへ持たせないことを推奨。

---

# 11. データ更新ルール

更新時:

1. 変更情報を確認
2. sourceを追加・更新
3. verified_atを更新
4. 対応状態を更新
5. サイトを再生成
6. QA
7. 公開

### 未確認

古い情報を見つけても、
新情報を推測して上書きしない。

---

# 12. 閉店・休業

Shop status:

```text
active
temporarily_closed
closed
unknown
```

`temporarily_closed`や`closed`を
スポンサー状況と連動させない。

---

# 13. Slug

- 小文字英数字
- ハイフン
- 一度公開したら原則変更しない
- 店舗名変更でもURL維持を検討

例:

```text
kato-denki
sankosha
renjaku-denki
```

---

# 14. データ検証

ビルド時に最低限検証:

- id重複なし
- slug重複なし
- statusがenum内
- service statusがenum内
- published shopのname/addressが存在
- URL形式
- verified_at形式
- source参照先が存在
- sponsor placementがenum内

---

# 15. DATA Acceptance Criteria

- [ ] 1店舗1ファイル
- [ ] 未確認は`unconfirmed`
- [ ] sourceを保持
- [ ] verified_atを保持
- [ ] sponsorとshopを分離
- [ ] accessにランドマークを持てる
- [ ] `text_only`フォールバックを持てる
- [ ] 主要8サービスの分類がCONTENT/DESIGNと一致する
- [ ] GA4用に安定したidがある
- [ ] SEO検索語をコンテンツ本文から分離して管理可能
- [ ] schema validationがある
- [ ] 内部運営情報が公開Shop YAMLに存在しない
- [ ] servicesキーがService定義に存在することを検証
