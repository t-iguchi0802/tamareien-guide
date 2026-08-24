# REVIEW_DECISIONS.md
# 外部AIレビュー検証結果

## 結論

外部レビューの主要指摘を、現在のMD実体と2026年8月時点のGoogle公式情報に照らして再検証した。

### 採用

1. 掲載情報の訂正だけでなく非掲載依頼を追加
2. Shop Cardから直接電話できる短縮導線
3. 簡易案内図の`text_only`フォールバック
4. サービス分類の正本をDATAへ統一
5. V1から`address_copy`イベントを削除
6. 検索クラスターDBを任意化

### 修正して採用

#### Google Business Profile

Google公式はBusiness Profileの対象外例として、
- Lead generation agents or companies
- Brands, organizations, artists, and other online-only businesses

等を明記している。

一方、本サイトは問い合わせを取得して販売することを主目的としたリード販売型ではないため、
「比較メディアだから必ずlead generation companyに該当する」とまでは断定しない。

ただし、地域別比較サイトのためにGBPを作る必要はなく、
ポリシーリスクも避けるため、**比較メディア自身のGBP取得を検索戦略から除外**した。

掲載店舗のGBP/MEOと、本比較メディアの通常検索SEOを分離する。

#### FAQ

GoogleがFAQリッチリザルトを一般サイトで大幅制限したのは2023年。
「2026年5月から」というレビュー上の時期は正確ではない。

ただし結論として、
一般的な地域比較サイトがFAQリッチリザルトを狙うべきではない点は正しい。

FAQは:
- 利用者の疑問解消
- 検索意図の補完
- AI検索が内容を理解しやすい構造

のために残し、`FAQPage`構造化データはV1必須から外す。

### V1へ追加しない

- 火災警報器
- 見守り機器
- EV/PHEVコンセント等

は検索候補バックログとして保持するが、
実店舗の対応状況と検索需要を確認する前に独立ページを作らない。

---

## 公式確認先

- Google Business Profile: Business eligibility and ownership guidelines
- Google Business Profile: Overview of Google Business Profile policies
- Google Search Central: Changes to HowTo and FAQ rich results
- Google Search Central: Optimizing your website for generative AI features on Google Search

公式仕様は変わり得るため、実装直前にも再確認する。


---

# v3 Claude / Gemini 専門レビュー最終統合

## 採用

- Service / Guideの検索意図を分離
- Mobile店舗詳細の電話CTAをH1直下へ
- 上部電話CTAが画面外になった場合のみSticky電話CTA
- 内部運営情報を公開Shopデータから物理分離
- `map_mode:auto`を廃止し明示指定
- 3カラム開始を1360px以上へ変更
- 1024〜1359pxは本文＋1スポンサーrail
- Shop servicesを動的ID Map化
- ad_impressionの重複防止
- Search Clusterファイル不在でもビルド成功
- GA4イベントをV1必須/任意へ整理
- verified_atを利用者向けに上部表示

## 修正して採用

### LocalBusiness

Google公式資料では第三者サイトでLocalBusinessを一律禁止する記述は確認できない。
削除せず、

```text
ItemPage
└ mainEntity → LocalBusiness
```

とし、比較メディアのページと紹介対象店舗を別エンティティとして明確化する。

### 町名SEO

町名ページは作らない。
店舗所在地・確認済み対応地域だけを通常HTMLへ自然に出力する。
SEO目的の町名一括列挙は禁止。

### 簡易案内図

全面廃止しない。
`text_only`を標準とし、運営者が十分な確認情報を持つ店舗だけ`simple_map`を指定する。

### Sticky電話CTA

全ページ固定ではなく店舗詳細Mobileのみ。
上部CTAが画面外になった場合だけ表示する。

## 不採用

- LocalBusiness構造化データの全面削除
- PC左右スポンサー枠の全面廃止
- V1からWorkers/KV/SSR広告配信を導入
- GEO用特殊markup / llms.txt依存
- FAQPageリッチリザルトをV1 KPIにする
- 町名別ページの量産
- 自動営業時間判定
- 文字サイズ切替ボタンのV1必須化

## 補足

Service / Guideの役割分離は検索意図を明確にするための情報設計上の判断であり、
「似たページが存在すればGoogleが必ず両方の順位を下げる」という単純な公式ルールとして扱わない。
