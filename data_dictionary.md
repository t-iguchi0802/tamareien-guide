# 多磨霊園比較サイト｜データ定義書

- 対象ファイル：`businesses.json`、`sources.csv`
- 基準日：2026年9月3日
- 目的：公開情報を、Claude Codeが推測せずに画面へ展開できる状態にする

## 1. 最重要ルール

1. `confirmed`だけを「対応を公開確認済み」と表示する。
2. `not_confirmed`は「非対応」ではなく、必ず「公開情報では未確認」と表示する。
3. `explicitly_not_offered`は、事業者が非対応と明記した一次情報がある場合だけ使用する。現在のデータには使用していない。
4. 空欄、`null`、未確認項目をAIで補完しない。
5. 店舗名、住所、電話、料金、サービス、創業年を変更するときは、`sources.csv`に根拠を追加する。
6. スポンサー契約の有無を自然掲載順、比較結果、評価に反映しない。
7. 現段階では口コミ点数、星、独自ランキング、満足度を持たせない。

## 2. トップレベル

| フィールド | 型 | 必須 | 説明 |
|---|---|---:|---|
| `schemaVersion` | string | ○ | データ構造のバージョン。破壊的変更時に更新 |
| `datasetId` | string | ○ | データセット識別子 |
| `title` | string | ○ | 管理用名称 |
| `lastVerifiedAt` | ISO date | ○ | 全体の最終確認日 |
| `locale` | string | ○ | 表示ロケール。初期値は`ja-JP` |
| `editorialPolicy` | object | ○ | サイト全体の編集・広告ルール |
| `statusValues` | string[] | ○ | 使用できる確認状態 |
| `serviceKeys` | string[] | ○ | 比較対象サービスのキー一覧 |
| `businesses` | object[] | ○ | 掲載事業者 |

## 3. 事業者の基本項目

| フィールド | 型 | 必須 | 表示・運用ルール |
|---|---|---:|---|
| `id` | string | ○ | 永続ID。名称変更でも変えない |
| `slug` | string | ○ | URL用。英小文字とハイフンのみ |
| `displayOrder` | integer | ○ | 地理・編集上の管理順。推奨順位ではない |
| `listingTier` | `A`/`B` | ○ | 内部の調査進行管理用。Aは公式情報が比較的多く、Bは公開情報の補完が必要。品質・営業状況・推奨度の評価ではなく、公開画面には表示しない |
| `listingStatus` | string | ○ | 初期値は`publish`。公開停止時は別途状態を追加 |
| `name` | string | ○ | 画面表示名 |
| `legalName` | string/null | ○ | 法人・商号の確認名。確認できない場合は`null` |
| `ownershipType` | status | ○ | 独立系・系列等の資本関係。未確認なら推測しない |
| `summary` | string | ○ | 公開情報だけで書いた中立要約。広告文にしない |

## 4. 所在地

| フィールド | 型 | 説明 |
|---|---|---|
| `location.postalCode` | string/null | 郵便番号。文字列で保持 |
| `location.prefecture` | string | 都道府県 |
| `location.city` | string | 市区町村 |
| `location.addressLine` | string | 市区町村以下 |
| `location.nearestGate` | string/null | 公式情報で確認できる門・参道名 |
| `location.nearestGateStatus` | status | `confirmed`以外は門別ページに断定表示しない |
| `location.locationNote` | string/null | 徒歩分数等の出典付き補足 |

住所から近い門を地図上で推定して自動入力しない。地図計測値を追加する場合は、`distanceMethod`と確認日を新設する。

## 5. 連絡先

| フィールド | 型 | 説明 |
|---|---|---|
| `contact.phone` | string/null | 電話番号。ハイフン付き文字列 |
| `contact.websiteUrl` | URL/null | 事業者公式サイト。ディレクトリは入れない |
| `contact.directoryUrl` | URL/null | 公式サイトがない場合の第三者店舗ページ |
| `contact.contactUrl` | URL/null | 問い合わせページ |
| `contact.businessHours` | string/null | 曜日差・受付時間との違いを勝手に単純化しない |
| `contact.closedDays` | string/null | 定休日。未確認は`null` |
| `contact.parking` | status | 駐車場有無の公開確認状態 |

`null`の電話・営業時間・定休日を画面で空白にせず、「公開情報では未確認」に変換する。

## 6. サービス状態

| キー | 画面表示例 |
|---|---|
| `new_grave` | 墓石建立・建墓 |
| `grave_closure` | 墓じまい・撤去 |
| `reburial_support` | 改葬・手続支援 |
| `interment` | 納骨・法事支援 |
| `engraving` | 戒名・文字彫刻 |
| `cleaning` | 清掃・クリーニング |
| `annual_management` | 年間管理・定期管理 |
| `flowers` | 供花・墓参り代行 |
| `planting` | 植木・雑草・樹木対応 |
| `renovation` | 修理・リフォーム |
| `seismic` | 耐震・免震対応 |
| `remote_photo_report` | 遠方対応・写真報告 |

### 状態の画面変換

| 保存値 | 比較表 | 絞り込み対象 |
|---|---|---:|
| `confirmed` | ○ 公開確認済み | 含める |
| `not_confirmed` | 公開情報では未確認 | 含めない |
| `explicitly_not_offered` | 非対応と明記 | 含めない |
| `not_applicable` | 対象外 | 含めない |

確認済み件数を点数化してランキングに使用しない。公式サイトの情報量が多い会社ほど有利になるためである。

## 7. 公開価格

`publishedPrices`は配列とし、次を保持する。

| フィールド | 型 | 説明 |
|---|---|---|
| `serviceKey` | string | `serviceKeys`のいずれか |
| `label` | string | 事業者の公開表現を短く整理 |
| `amountFromJpy` | integer | 税込・税別を分離した数値。円記号を含めない |
| `unit` | string | 1回、1平方メートル等 |
| `taxIncluded` | boolean/null | 税込確認済みなら`true` |
| `conditions` | string | 最低価格、現地見積り等の条件 |
| `sourceId` | string | `sources.csv`の根拠ID |

「～」の価格を固定価格として表示しない。UIでは必ず「○円～」「条件により見積り」と表示する。

## 8. 出典

`evidenceSourceIds`は`businesses.json`と`sources.csv`を接続する外部キーである。

- すべてのIDが`sources.csv`に存在しなければビルドを失敗させる。
- `sources.csv`の`checked_at`を過ぎたという理由だけで情報を削除しない。
- 住所、電話、営業、料金、制度は90日ごとの再確認対象とする。
- 行政制度は更新頻度が高いため30日ごと、または公開直前に再確認する。
- リンク切れは即削除せず、代替公式URLを探して更新履歴に残す。

## 9. 掲載順と広告

- `displayOrder`は初期画面の安定表示用で、評価ではない。
- ユーザーには地域・門・サービス・五十音の切替を提供する。
- スポンサー枠を追加する場合は、別データで`isSponsored`、`campaignId`、期間を管理する。
- スポンサー枠には必ず「スポンサー」または「広告」を表示する。
- 通常比較表のデータと広告契約データを同じJSONに混在させない。

## 10. Claude Codeが行ってはいけない処理

- 公式サイトの文章を長く転載する
- 電話番号や料金の桁を推測修正する
- 住所から門名・徒歩分数を自動断定する
- `not_confirmed`を`false`や「非対応」に変換する
- 情報量を品質点やおすすめ順位に変換する
- 店名に「おすすめ」「人気」「優良」を追加する
- 行政手続を法律相談として断定する
- 東京都や多磨霊園の公式サービスと誤認させる

## 11. 更新手順

1. 公式情報を確認する。
2. `sources.csv`へ行を追加または更新する。
3. `businesses.json`を更新する。
4. JSON Schema・外部キー・URL形式の検証を実行する。
5. 差分レビューで、未確認が勝手に確認済みになっていないか確認する。
6. 確認日と変更理由をコミットメッセージに残す。
