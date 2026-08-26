# QA_REPORT.md — integrated-mvp 独立QA監査

- 担当: QA（`feature/qa`、CLAUDE.md 7章 / WORKTREE_AGENT_PLAN.md）
- 対象: `integrated-mvp` ブランチ（4エージェント統合後 + リード統合修正 `21c21fe` まで）
- 実施日: 2026-08-26
- 実施内容: `npm run check` / `npm run lint` / `npm run build`（環境変数あり・なし両方）の独立再実行、
  データ整合性のスクリプト検証、全ページのソース読解、`dist/` 出力の静的検査、
  コントラスト計算、見出し構造・内部リンクの機械チェック。
  ブラウザでの実機目視確認（360/768/1440pxの実描画・スクリーンリーダー実機確認）は
  環境制約により実施できておらず、CSS・HTML構造の静的読解による判断である旨を明記する。

## サマリー

| 重大度 | 件数 |
|---|---:|
| Critical | 0 |
| Major | 1 |
| Medium | 4 |
| Minor | 3 |
| Info | 3 |

**結論**: CLAUDE.md の絶対厳守ルール（`not_confirmed`の非対応表示化禁止、非公式表記、
広告と比較の分離、事実データ非改変、sourceId整合性）について、明確な違反は見つからなかった。
ビルド・型チェック・lintはすべてクリーン。14社は正しくデータ駆動で表示され、
`businesses.json` / `sources.csv` は正本と完全一致し、`foundation-v1` 以降無改変であることを確認した。
一方で、統合過程での「作り込み済みだが結線されていない」機能（行政手続コンテンツ、
`official_procedure_click`計測、構造化データ）が複数見つかったため、Major/Medium として報告する。

---

## Critical

該当なし。

---

## Major

### M-1. data-content担当が作成した行政手続きコンテンツ（`src/content/guides/**`）が /tetsuzuki/ に一切統合されておらず、pages担当が独自の簡易版を重複実装している

- **再現手順**:
  1. `src/content/guides/reburial-permit-application.md` /
     `grave-work-notification.md` / `tama-cemetery-official-info.md` /
     `procedure-differences-overview.md` を確認する。いずれも
     `targetPage: "/tetsuzuki/"`、`authority` / `topic`（GA4
     `official_procedure_click`のパラメータと同名）、`sources`（sourceId付き）を
     frontmatterに持つ、作り込まれた中立解説コンテンツである。
  2. `src/pages/tetsuzuki/index.astro` を見ると、上記ファイルを一切import/参照しておらず、
     コメントに「並行実装の都合上、data-content担当のコンテンツ（`src/content/**`）を
     参照できないため」独自に短い解説文を書いたと明記されている。
  3. `git show ed2f5eb`（data-content担当のコミット）には、Astro Content
     Collectionsが`src/content.config.ts`（担当範囲外の共有ファイル）を要求するため
     未導入である旨の記録があるが、この情報はdata-content担当のコミットメッセージにのみ残り、
     `REPORT.md`には記載されなかった（`git show feature/data-content:REPORT.md` は
     存在しない）。そのためpages担当・統合作業（リード）双方に伝わらず、
     統合修正（`21c21fe`）でも解決されていない。
  4. `procedure-differences-overview.md`には、「墓所返還」について
     「当サイトが確認できている公開資料には、墓所返還の具体的な手順・必要書類・窓口を示す
     出典が含まれていない」という重要な留保が明記されているが、現在の`/tetsuzuki/`ページの
     文言にはこの留保が明示的に反映されていない（該当箇所を東京都公園協会への案内で
     やや薄めて言及しているのみ）。
- **重大度**: Major（機能は壊れていないが、統合担当が作成した検証済みコンテンツが
  ユーザーに一切届いていない。行政手続きという誤情報リスクが特に高い領域で、
  より丁寧に出典・留保を書いたコンテンツが使われず、簡易版が公開されている）。
- **対象ファイル**:
  - `src/content/guides/reburial-permit-application.md`
  - `src/content/guides/grave-work-notification.md`
  - `src/content/guides/tama-cemetery-official-info.md`
  - `src/content/guides/procedure-differences-overview.md`
  - `src/pages/tetsuzuki/index.astro`
- **推奨修正**: リードが `src/content.config.ts` を追加してContent
  Collectionsとして正式に取り込むか、`src/pages/tetsuzuki/index.astro`側で
  frontmatter付きMarkdownを`import.meta.glob`等で直接読み込み、`authority`/`topic`を
  `data-event="official_procedure_click"` のCTA（M-2参照）に渡す形で統合することを検討されたい。
  特に「墓所返還の出典が現状ない」という留保は、断定回避の観点から本文に明示すべき。

---

## Medium

### D-1. `official_procedure_click` イベントが、型・ディスパッチャ・コンテンツはすべて用意されているのに、実際のUI要素には一切結線されていない

- **再現手順**: `grep -rn "official_procedure_click" src/` を実行すると、
  `src/types/analytics.ts`（型定義）、`src/lib/analytics/events.ts`
  （`trackOfficialProcedureClick`）、`src/lib/analytics/dispatcher.ts`
  （`data-authority` / `data-topic`読み取りロジック）には実装があるが、
  `src/pages/**` / `src/components/**` のいずれにも
  `data-event="official_procedure_click"` を持つ要素が存在しない。
  `/tetsuzuki/` ページの東京都公園協会・府中市への公式リンクは素の`<a>`タグで、
  計測属性を持たない。
- **重大度**: Medium（CLAUDE.md 3章で定義された6イベントのうち1つが、
  MVPの主要な行政手続導線で一度も発火しない。ビルドやUIは壊れないため
  Criticalではないが、公開後にこの導線の利用状況が一切計測できない）。
- **対象ファイル**: `src/pages/tetsuzuki/index.astro`
- **推奨修正**: `/tetsuzuki/`内の3つの公式リンク`<a>`に
  `data-event="official_procedure_click"` `data-authority="fuchu_city"` /
  `"tokyo_park_association"` `data-topic="reburial"` 等（M-1のfrontmatterの
  `authority`/`topic`値と揃える）を付与する。`initAnalyticsDispatcher`は
  BaseLayout経由で全ページ有効なため、属性追加のみで計測可能になる。

### D-2. `comparison_filter_use` イベントに対応する絞り込みUIがMVPに存在しない

- **再現手順**: `src/components/business/ComparisonTable.astro`のコメントに
  「並べ替え・絞り込みを行わない」と明記されており、`src/pages/**`のいずれにも
  地域・サービス等の絞り込みUI（`<select>`やチェックボックス等）が実装されていない。
  `grep -rn "comparison_filter_use" src/`は型・ディスパッチャ・
  `feature/ui-components`のREPORT.mdコメントにのみ現れ、実UIは無い。
- **重大度**: Medium（ui-components担当のREPORT.mdには「絞り込みUIはpages側の
  スコープと判断し作成していない」との申し送りがあり、pages側でも実装されなかった。
  6イベント契約のうち2つ目が未使用のまま。機能自体の欠落というより、
  MVPスコープの判断が担当間で明確に合意されないまま倒れた形跡）。
- **対象ファイル**: `src/components/business/ComparisonTable.astro` /
  `src/pages/sekizaiten/index.astro` 等
- **推奨修正**: 今回のMVPで絞り込みUIを追加しないと判断するなら、
  `CLAUDE_CODE_HANDOFF.md`側にその旨を明記し「MVPでは実装しない」と正式合意する。
  追加するなら、地域・サービス種別等の絞り込みセレクトをpages側に実装し、
  `data-event="comparison_filter_use"`を付与する。

### D-3. `robots.txt` が実在しない `sitemap-index.xml` を参照している

- **再現手順**: `public/robots.txt`に`Sitemap: /sitemap-index.xml`と記載されているが、
  `npm run build`後の`dist/`には`sitemap-index.xml`が生成されない
  （`@astrojs/sitemap`等のsitemap生成が未導入、`astro.config.mjs`にも`site`設定がない）。
  本番公開時、検索エンジンのクローラーがこのURLを取得すると404になる。
  `feature/seo-analytics`のREPORT.mdにも「サイトマップ自体が未生成の間、
  このURLは404になる点に注意」と明記されており、既知の未解決事項として残っている。
- **重大度**: Medium（実害は軽微だが、公開直前に見落とされやすく、
  検索エンジン側のクロールエラー・Search Consoleでの警告要因になる）。
- **対象ファイル**: `public/robots.txt`
- **推奨修正**: 本番公開前に、`Sitemap:`行を削除するか、実際にサイトマップを
  生成する仕組み（`@astrojs/sitemap`導入 + `astro.config.mjs`に`site`設定）を追加する。

### D-4. `businesses.json` の `editorialNotes`（重要な確認範囲の留保）がどの画面にも表示されない

- **再現手順**: `businesses.json`の各事業者に`editorialNotes`フィールドがあり、
  例えば`biz-ibaragi-meiseki`には「石材事業者であることは確認済みだが、多磨霊園の
  墓石店として数えるには追加の公開情報が必要。比較表ではサービスをすべて未確認表示とする」
  という、なぜこの事業者の全サービスが「公開情報では未確認」なのかを説明する重要な注記がある。
  `grep -rn "editorialNotes" src/`では`types/business.ts`・`schema.ts`・
  `data/businesses.json`にのみ出現し、`src/components/**` / `src/pages/**`の
  どこからも参照・表示されていない。
- **重大度**: Medium（表示自体は`statusToDisplayLabel()`経由で正しく
  「公開情報では未確認」に統一されており、CLAUDE.mdの最重要ルール違反ではない。
  ただし、なぜ確認できなかったかの背景情報がユーザーに一切届かず、
  中立性・透明性という編集方針の一部が画面に反映されていない）。
- **対象ファイル**: `src/components/business/BusinessCard.astro` /
  `src/components/business/ComparisonTable.astro`
- **推奨修正**: `BusinessCard`または比較表の事業者行に、`editorialNotes`が
  存在する場合のみ小さな注記（例: 詳細開閉の`<details>`）として表示することを検討。
  必ず`statusToDisplayLabel()`とは独立した「編集注記」であることが分かる見せ方にし、
  対応状況の判定そのものとは混同させないこと。

---

## Minor

### N-1. `npm run format:check` が `REPORT.md` 内の擬似コードでハードエラーになる

- **再現手順**: `npm run format:check`を実行すると、`REPORT.md`（feature/ui-componentsの
  使用例）内の```astro```コードフェンス中の
  `const businesses: Business[] = /* src/lib/data 経由で取得 */;`が
  不正な構文としてPrettierのパーサーエラーになり、`format:check`全体がエラー終了する
  （`.prettierignore`に`REPORT.md`は含まれていない）。
- **重大度**: Minor（ビルド・型チェック・lintには影響しないが、
  CLAUDE.md 6章に定義されたコマンドの1つが恒常的に失敗する状態になっている）。
- **対象ファイル**: `REPORT.md`
- **推奨修正**: コードフェンス内のプレースホルダーを`// TODO: getBusinesses()等から取得`
  のようなコメント行に分離するか、`REPORT.md`を`.prettierignore`に追加する。

### N-2. `src/pages/sources/index.astro` の運営方針ページへのリンクが `ROUTES.about.path` 定数を使わずハードコードされている

- **再現手順**: `src/pages/sources/index.astro`21行目の
  `<a href="/about/">運営方針ページ</a>`は、他ページが一貫して使っている
  `ROUTES.about.path`（`src/lib/routes.ts`）を経由していない。
  現時点で値は一致しており実害はないが、将来`ROUTES`側でパスを変更した場合に
  追随されない。
- **重大度**: Minor（動作上のリンク切れではない。保守性の指摘）。
- **対象ファイル**: `src/pages/sources/index.astro`
- **推奨修正**: `import { ROUTES } from '../../lib/routes';`を追加し、
  `ROUTES.about.path`を使うよう統一する。

### N-3. `--color-status-na-fg` (#79766a) と `--color-status-na-bg` (#f1efe9) のコントラスト比が約3.96:1で、通常文字のWCAG AA基準（4.5:1）をわずかに下回る

- **再現手順**: `src/styles/tokens.css`の`--color-status-na-fg` /
  `--color-status-na-bg`の値でコントラスト比を計算すると約3.96:1
  （他の状態色は6.3〜8.2:1）。`VerificationBadge`の`.verification-badge__label`は
  `font-size: 0.9375rem`（15px相当）・通常太字（`font-weight: 600`）であり、
  WCAG AA「大きな文字」（太字18.66px相当以上）の基準は満たさない可能性が高い。
- **重大度**: Minor（4値中1状態のみ、かつ実データでは使用件数が少ない見込みの
  `not_applicable`の配色に限定される。他3状態は問題なし）。
- **対象ファイル**: `src/styles/tokens.css`
- **推奨修正**: `--color-status-na-fg`をやや濃く（例: `#655f52`程度）調整し、
  4.5:1以上を確保する。

---

## Info（要確認・参考情報。修正必須ではない）

### I-1. JSON-LD構造化データ（`src/lib/seo/structuredData.ts`）がどのページにも埋め込まれていない

`buildOrganizationJsonLd` / `buildBreadcrumbListJsonLd` / `buildBusinessJsonLd`等は
`review`/`aggregateRating`を含まない安全な実装だが、feature/seo-analyticsのREPORT.mdに
「pages担当が呼び出す想定」と明記された統合ポイントが実際には使われていない。
SEO上のメリットを取りこぼしているだけで、CLAUDE.mdの禁止事項には抵触しない
（禁止されている評価系プロパティを埋め込んでいないため、むしろ「未使用」の方が安全側ではある）。
将来対応する場合の担当はpages/リード。

### I-2. `.claude/worktrees/` 配下に旧並行エージェントの完了済みworktreeが残存している

`git worktree list`で`feature/ui-components` `feature/data-content`
`feature/seo-analytics` `feature/pages`の4つが`.claude/worktrees/agent-*`配下に
残ったままになっている（`git status`では未追跡ディレクトリとして検出）。
`npm run format:check`等をリポジトリルートから実行すると、これらのworktree内の
ファイルも巻き込んでノイズになる（今回の監査でも該当ログが混在した）。
WORKTREE_AGENT_PLAN.md 10章の手順（`git worktree remove`）に従い、
統合完了後にリードが削除することを推奨する。データ改変やビルド失敗の原因にはなっていない。

### I-3. `CorrectionCta` の `businessId` パラメータは現状すべての呼び出し箇所で未指定

`src/pages/sekizaiten/index.astro` / `hakajimai/index.astro` / `kanri/index.astro`は
いずれも`<CorrectionCta />`のみを呼び出しており、`businessId`を渡していないため、
コンポーネント内の「事業者を特定するクエリを付与する」ロジックは現状使われていない
（`href`は常に`/about/`）。動作不良ではないが、将来事業者個別のカードに
「この事業者の情報を訂正」ボタンを追加する設計余地として、コンポーネント側は
すでに対応済みであることを申し送りとして記録する。

---

## 確認済み・問題なし（重点確認項目チェックリスト）

- [x] `npm run build`（`PUBLIC_GA_MEASUREMENT_ID`未設定・設定両方）成功。8ページ生成。
- [x] `npm run check`: 0 errors / 0 warnings / 0 hints（46ファイル）。
- [x] `npm run lint`: エラー・警告なし。
- [x] 14社すべてが`businesses.json`から読み込まれ、`/sekizaiten/`の一覧・比較表
      （PC表・モバイルカード双方）に表示されることを`dist/`出力で確認
      （`biz-ibaragi-meiseki`のような全サービス未確認の事業者も除外されず表示される）。
- [x] `evidenceSourceIds` / `publishedPrices[].sourceId` は、
      `src/lib/data/validate.ts`によりビルド時に`sources.csv`の`source_id`と
      突合検証されており（不整合があれば`npm run build`が失敗する設計）、
      ビルドが成功していることから整合性を確認した。
- [x] ルート直下`businesses.json`/`sources.csv`と`src/data/`配下のコピーは
      `diff`でバイト単位一致を確認。
- [x] `git diff foundation-v1..HEAD -- businesses.json sources.csv
      data_dictionary.md CLAUDE_CODE_HANDOFF.md WORKTREE_AGENT_PLAN.md` は空
      （事実データ・正本ドキュメントの無断変更なし）。
- [x] `not_confirmed`は`statusToDisplayLabel()`（`src/lib/data/verificationStatus.ts`）
      経由のみで「公開情報では未確認」と表示され、「非対応」という文言は
      `explicitly_not_offered`（非対応と明記）以外のどの状態にも使われていない
      （`grep`によるソース全文検索で確認）。
- [x] スポンサー枠（`SponsorCard.astro`）は「広告・スポンサー枠」表記・
      「比較表の掲載順・対応状況の評価には影響しません」の注記を持つ実装だが、
      現状どのページからも呼び出されていない未使用コンポーネント
      （＝実データが無いため比較結果に影響のしようがない状態）。
- [x] 全8ページ（`/`, `/sekizaiten/`, `/hakajimai/`, `/kanri/`, `/tetsuzuki/`,
      `/about/`, `/sources/`, `/privacy/`）の内部リンクを`dist/`のHTMLから機械抽出し、
      すべて実在するページ・アセットに解決することを確認（リンク切れなし）。
- [x] 電話・地図・外部リンクCTAはすべて`PhoneLink` / `MapLink` / `OutboundLink`
      経由で実装されており、素の`<a>`直書きの事業者CTAは残っていない
      （行政公式ページへの引用リンクは仕様通り素の`<a>`のまま）。
- [x] `PUBLIC_GA_MEASUREMENT_ID`未設定でビルド・`dist/index.html`を確認し、
      `googletagmanager.com`のスクリプトが一切出力されないことを確認。
      GA4 IDのハードコードも`src/`全体に存在しない。
- [x] `business_outbound_click` / `business_phone_click` / `business_map_click` /
      `correction_request_click`の4イベントは、対応する`data-event`属性を持つ
      コンポーネントが実装され、`BaseLayout.astro`経由で
      `src/lib/analytics/autoInit`（`initAnalyticsDispatcher`）が全ページに
      読み込まれていることを確認（`comparison_filter_use` /
      `official_procedure_click`は上記Medium D-1・D-2で報告）。
- [x] 非公式表記はBaseLayout（リード共有）のヘッダー・フッター双方に
      `siteConfig.officialDisclaimer`として常時出力され、個別ページ側で
      省略している箇所はない（全8ページのdist出力で確認）。
- [x] 掲載基準・広告方針・訂正窓口は`/about/`に、情報源・最終確認日は`/sources/`に
      存在し、いずれも`businesses.json`の`editorialPolicy`・`sources.csv`を
      データソースとしている（HTML直書きの複製ではない）。
- [x] `notes_internal`相当のフィールドは`businesses.json`に存在しない。
      `editorialNotes`は営業評価・苦情履歴・個人情報等ではなく、
      公開情報での確認範囲を説明する編集注記であることを内容確認済み
      （ただし画面未表示。Medium D-4参照）。
- [x] 口コミ点数・星評価・独自ランキング・「おすすめ」「人気」「優良」等の語は、
      ソース中では「使用していない」という否定文脈以外に出現しない。
      `credentials`内の「全国優良石材店の会（全優石）」は業界団体の固有名詞であり、
      事実の列挙として妥当。
- [x] 見出し階層（h1→h2→h3）は全8ページで飛び級・重複h1なし
      （静的HTML読解による確認）。
- [x] タップ領域は`--tap-target-min: 44px`がCTA各部品に適用されている。
      キーボード操作（`<details>`のネイティブ開閉、`:focus-visible`の
      アウトライン、スキップリンク）はソースコード上実装されていることを確認。
      実ブラウザでの操作確認は未実施（環境制約。Info欄参照）。
- [x] スポンサー表示は現状未使用のため、比較結果・掲載順への影響は原理的に発生し得ない。

## 実施できなかった確認（環境制約）

- 実ブラウザでの360px/768px/1440pxのスクリーンショット目視確認、
  axe-core等によるオートメーテッドアクセシビリティスキャン、
  スクリーンリーダー実機確認は、本セッションの環境制約（GUIブラウザ操作不可）により
  実施できていない。CSS・HTMLの静的読解による評価にとどまる点をご承知おきいただきたい。
  Vitest/Playwrightは`package.json`に未導入（CLAUDE.md 4章の記載通りQA段階での追加対象）。
  今回は既存の`npm run build`成果物（`dist/`）に対する静的検査スクリプトのみを
  `scripts/qa/`配下には追加していない（恒久スクリプト化は行わず、都度Node
  ワンライナーで検証した。将来のCI組み込みを検討する場合は、本レポートの
  検証手順をベースに`scripts/qa/verify-data-integrity.mjs`等として
  スクリプト化することを推奨する）。
