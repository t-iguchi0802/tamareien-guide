# QA_REPORT.md

**監査対象ブランチ**: `feature/sponsor-and-responsive-qa`（`integrated-mvp` から分岐、コミット `f44a607` まで）
**監査担当**: 独立QAエージェント（`feature/qa` ワークツリー）
**監査日**: 2026-08-26
**監査範囲**: (1) TOPページへのスポンサー枠実装、(2) レスポンシブQA（360/390/768/1024/1440px）

本レポートは `feature/sponsor-and-responsive-qa` の差分（`git diff --stat integrated-mvp..HEAD`）
に基づく監査結果である。差分は以下11ファイルに限定されており、想定スコープ（TOPページ・共有基盤のみ）
と一致することを確認済み。

```text
src/components/sponsors/SponsorCard.astro
src/components/sponsors/SponsorSection.astro
src/data/sponsors.json
src/lib/analytics/dispatcher.ts
src/lib/analytics/events.ts
src/lib/data/index.ts
src/lib/data/loadSponsors.ts
src/pages/index.astro
src/types/analytics.ts
src/types/components.ts
src/types/sponsor.ts
```

`businesses.json` / `sources.csv` / `data_dictionary.md` は `git diff integrated-mvp..HEAD` で差分ゼロを確認。
`src/data/businesses.json` / `src/data/sources.csv` はルート正本と完全一致（`diff` で確認）。
検証作業中に一時的に `npm install -D playwright @axe-core/playwright --no-save` および
`src/data/sponsors.json` へのテストデータ投入を行ったが、検証後に `package.json` /
`package-lock.json` が無変更であることを確認し（diffゼロ）、`src/data/sponsors.json` は
空配列 `{ "schemaVersion": "1.0.0", "sponsors": [] }` に復元し、一時パッケージも
アンインストール済みである。

---

## サマリー（重大度別）

| 重大度 | 件数 |
|---|---:|
| Critical | 0 |
| Major | 0 |
| Medium | 1（このブランチの変更対象外・既存コンポーネントの問題） |
| Minor | 1 |
| Info | 複数（正常性確認の記録） |

**結論**: 今回の変更範囲（スポンサー枠実装・TOPページ配置）において、Critical/Major な問題は
見つからなかった。スポンサーと通常掲載データの分離、`not_confirmed`表示規則の非侵犯、
広告表記・`rel="sponsored"`・料金非表示・GA4計測・0/1/4件時の表示・displayOrder順の
先頭4件切り詰めロジックは、いずれもコードレビューと実ブラウザ（Playwright/Chromium）検証の
両方で意図通りに動作することを確認した。

検出した1件（Medium）は、このブランチの変更ファイルには含まれない共有コンポーネント
（`ComparisonTable.astro`、/kanri/ページ）の既存アクセシビリティ課題であり、
このブランチが原因ではない（`integrated-mvp` から変更されていないファイル）。
念のため報告する。

---

## Medium

### M-1: `.comparison-table__scroll`（ComparisonTable.astro）が axe の `scrollable-region-focusable` に抵触（このブランチの変更対象外）

- **再現手順**:
  1. `npm run build && npm run preview -- --port 4321`
  2. `/kanri/` を1024×900のビューポートで開く。
  3. `@axe-core/playwright` の `AxeBuilder({ page }).analyze()` を実行する。
  4. `scrollable-region-focusable`（impact: serious）が
     `.comparison-table__scroll` 要素に対して1件検出される
     （「Element should have focusable content」「Element should be focusable」）。
- **重大度**: Medium（axeでは serious 判定だが、既存コンポーネントの問題でありこのブランチの
  差分に含まれないため、本ブランチのマージ判断には影響しない想定。可視性のため報告する）
- **対象ファイル**: `src/components/business/ComparisonTable.astro`
  （`git diff --stat integrated-mvp..HEAD` に含まれないファイル。`/sekizaiten/` `/hakajimai/` では
  検証時のビューポート幅でテーブルが折り返さずaxeに検出されなかったが、同じコンポーネントを
  使っているため、より狭い幅では同様に発生する可能性がある）
- **推奨修正**: 横スクロール領域となる `div.comparison-table__scroll` に
  `tabindex="0"` と `role="region"` +　`aria-label`（例: 「比較表（横スクロール可能）」）を付与し、
  キーボードのみでもスクロール操作ができるようにする。このブランチの担当範囲外のため、
  `ui-components` または元のページ実装担当への差し戻しを推奨する。

---

## Minor

### m-1: 非公式表記の掲載箇所数がページによって異なる（このブランチとは無関係、既存仕様）

- **再現手順**: `dist/*/index.html` に対し `grep -o "公式サイトではありません"` で
  出現数を数えると、`/`・`/about/`・`/privacy/` は3回、他の5ページは2回出現する。
- **重大度**: Minor（CLAUDE.mdの要求「全ページのヘッダー・フッターに常時表示」は
  ヘッダー1回・フッター1回の計2回で満たされており、3回になっているページは
  本文中に追加で `siteConfig.officialDisclaimer` を再掲しているだけで、
  欠落ではなく重複表示。実害はないが、`BaseLayout.astro`（共有ファイル）を
  経由しない箇所での重複表示は将来の文言修正時に更新漏れの温床になりうる）
- **対象ファイル**: `src/pages/index.astro`（「当サイトについて」セクション内で
  `{siteConfig.officialDisclaimer}` を再掲）、`src/pages/about/index.astro`、
  `src/pages/privacy/index.astro`（このブランチの差分には含まれない）
- **推奨修正**: 対応不要（現状で要件は満たしている）。将来的に文言を一本化したい場合のみ、
  本文中の再掲を削除し「詳しくはヘッダー/フッター参照」等に変更することを検討。

---

## Info（正常性確認の記録）

### I-1: ビルド・型チェック・Lint

- `npm run check`: 0 errors / 0 warnings / 0 hints（50ファイル）
- `npm run lint`: エラー・警告なし
- `npm run build`: `src/data/sponsors.json` が空配列の状態で成功（8ページ生成）

### I-2: スポンサーデータの分離

- `src/lib/data/index.ts` で `loadSponsors.ts` の `export *` は
  `getBusinessDataset()` の検証・キャッシュ処理（`validated`フラグ、
  `validateBusinessData()`）とは完全に独立していることをコードで確認。
- `src/lib/data/loadSponsors.ts` は `businesses.json` / `schema.ts` /
  `validate.ts` のいずれにも依存せず、独自の `sponsorDatasetSchema`（Zod）で
  `src/data/sponsors.json` のみを検証する。
- `getActiveSponsors()` は `getBusinesses()` / `ServiceFilter` の絞り込み状態を
  一切参照しない（引数は `today: Date` のみ）。

### I-3: `src/data/sponsors.json` の内容

- 現状 `{ "schemaVersion": "1.0.0", "sponsors": [] }`（空配列）であることを確認。
  実在しない企業名・推薦文の創作は無い。

### I-4: 0件時の表示（実ブラウザ検証）

- `npm run build`後の `dist/index.html` および `preview`起動中の実ブラウザで、
  スポンサー0件時は4枠の空白ではなく「地域スポンサー募集中」の案内カードが
  **1つだけ**表示されることを確認（`cardCount: 0, hasRecruit: true`）。
- 料金・契約条件の記載は募集中カードに一切ない（本文に「円」「月額」等の語を含まない）。

### I-5: `getActiveSponsors()` のロジック検証（一時テストデータ、検証後に空配列へ復元済み）

一時的に以下8件のテストデータ（active/未来開始/期限切れ/5件超のケースを含む）を投入し、
`npm run build` 後の `dist/index.html` に出力された `data-sponsor-id` を確認した。

| id | active | periodStart | periodEnd | displayOrder | 結果 |
|---|---|---|---|---|---|
| test-sponsor-8 | true | 過去 | null | 0 | 表示（1位） |
| test-sponsor-1 | true | 過去 | null | 1 | 表示（2位） |
| test-sponsor-2 | true | 過去 | 未来 | 2 | 表示（3位） |
| test-sponsor-3-inactive | **false** | 過去 | null | 3 | 除外（active=false） |
| test-sponsor-4-future | true | **未来** | null | 4 | 除外（開始日未到来） |
| test-sponsor-5-expired | true | 過去 | **過去** | 5 | 除外（終了日経過） |
| test-sponsor-6 | true | 過去 | null | 6 | 表示（4位） |
| test-sponsor-7 | true | 過去 | null | 7 | **切り詰めで除外**（有効5件中、displayOrder上位4件のみ表示） |

実際に `dist/index.html` へ出力されたのは `test-sponsor-8, 1, 2, 6` の4件のみで、
`displayOrder` 昇順・先頭4件への切り詰めが仕様通り動作することを確認した。
`periodEnd: null`（終了日未定）のスポンサーが現在有効なら含まれることも確認した
（test-sponsor-8, 1, 6はいずれも`periodEnd: null`）。

検証後、`src/data/sponsors.json` を空配列に復元し、再ビルドして元の状態に戻したことを確認済み。

### I-6: スポンサー表示と通常掲載の相互不干渉（実ブラウザ検証）

- TOPページでスポンサー0件表示中に `ServiceFilter` の目的ボタンをクリックし、
  絞り込み結果件数（`data-result-count`）が変化する一方、スポンサーセクション
  （`.sponsor-card` / `.sponsor-recruit` の有無）は変化しないことを確認
  （逆方向：絞り込み操作→スポンサー表示への影響なし）。
- コードレビューでも、`SponsorSection.astro` / `getActiveSponsors()` が
  `businesses` や絞り込み状態を一切引数に取らないことを確認済み
  （順方向：スポンサー側→通常掲載側への影響もそもそも経路が存在しない）。

### I-7: 広告表記・外部リンクのrel属性

- スポンサーカード（1〜4件のテストデータで検証）全件に「広告・スポンサー」ラベル
  （`.sponsor-card__eyebrow`）が表示されることを確認。
- 「サイトを見る」リンクの `rel` 属性はすべて `"noopener noreferrer sponsored"`
  （4件のテストデータで確認）。
- 各カードに「掲載順・比較結果には影響しません。」という開示文を確認。

### I-8: 料金・契約条件の非表示

- `Sponsor`型（`src/types/sponsor.ts`）、`SponsorCard.astro`、`SponsorSection.astro`、
  募集中カードのいずれにも料金フィールド・金額表記は存在しない。
- 実ブラウザでTOPページの本文（`document.body.innerText`）に「円」「月額」の文字列が
  含まれないことを確認（テストスポンサー表示中・0件時の両方）。

### I-9: GA4計測（`window.gtag`モック、実ブラウザ）

- `sponsor_impression`: スポンサーグリッドを表示→非表示→再表示と3回スクロール操作したが、
  4件のスポンサーそれぞれについて **ちょうど1回ずつ**（計4回）しか発火しないことを確認
  （`IntersectionObserver`の`unobserve()`によるガードが機能している）。
- `sponsor_click`: 「サイトを見る」リンクのクリックで
  `{ sponsor_id: "test-sponsor-8", campaign_id: "camp-8", page_path: "/" }` が
  正しいパラメータで1回発火することを確認。
- 検証は一時的に `playwright` を `--no-save` でインストールして実施し、
  検証後にアンインストール、`package.json` / `package-lock.json` の無変更を
  diffで確認済み。

### I-10: レスポンシブ（360/390/768/1024/1440px、実ブラウザ）

- 全8ページ×5ビューポートで `document.documentElement.scrollWidth === clientWidth`
  （横スクロールなし）を確認（0件の逸脱）。
- TOPページの目的ボタン（`.purpose-card`）・詳しい条件チェックボックスの実際の
  タップ領域（`<label class="service-check">`、`<input>`自体ではなくラベル全体）は
  360px幅で幅312px・高さ約51〜120pxであり、44px以上を満たすことを確認
  （`<input>`要素自体は約15×15pxだが、`min-height: var(--tap-target-min)`を持つ
  ラベル/ボタンが実際のタップ領域であるため問題なし。これはこのブランチの変更対象外
  ＝`ServiceFilter.astro`の既存実装であり、正しく実装されていることの確認）。
- スポンサーカードは1件・2件・4件いずれの件数でも `max-width: 260px` の制約により
  カードサイズが揃い、間延びや崩れが無いことを1440px幅で確認
  （4件時: 全カード260×283px、1件時: 単一カードも260px幅で崩れなし）。
- `/sekizaiten/` を390px・1024pxで開き横スクロールが発生しないことを確認
  （比較表・事業者カードのレイアウト自体はこのブランチの変更対象外）。
- キーボードのみでTabキーを送出し、スポンサーの「サイトを見る」リンクへ
  フォーカスが到達すること、および`:focus-visible`のアウトライン定義
  （`outline: 3px solid var(--color-accent)`）がCSSに存在することを確認。

### I-11: axe-core相当のアクセシビリティスキャン（`@axe-core/playwright`、一時導入）

- 全8ページ（1024×900）でスキャンし、critical/serious違反は `/kanri/` の
  M-1（既存コンポーネント、このブランチの差分外）1件のみ。
  それ以外の7ページ（`/`, `/sekizaiten/`, `/hakajimai/`, `/tetsuzuki/`, `/about/`,
  `/sources/`, `/privacy/`）は critical/serious 違反0件。
- 検証後、`@axe-core/playwright` と `playwright` はアンインストール済み。
  `package.json` / `package-lock.json` は無変更（diffゼロ）。

### I-12: `not_confirmed`表示・非公式表記・事業者データの独立確認（このブランチとは無関係の一般確認）

- `dist/sekizaiten/index.html` 内の「非対応」という文字列は、
  「非対応という意味ではなく、事業者の公開情報で対応の有無を確認できていないことを示します。」
  という**説明文の一部としてのみ**出現し、状態そのものを「非対応」と誤表示している箇所はない。
- 非公式表記は全8ページのヘッダー・フッター双方に存在（`grep -o`で各ページ2回以上を確認）。
- `businesses.json` / `src/data/businesses.json` に内部運営メモ相当の文字列
  （`notes_internal`, `internal_note`, 「営業メモ」「交渉メモ」「苦情」等）は検出されなかった。
- `evidenceSourceIds` / `publishedPrices[].sourceId` はすべて `sources.csv` の
  `source_id`（30件）に存在することをNode.jsスクリプトで独立検証（欠落0件）。

---

## 検証環境・実施コマンド（再現用メモ）

```bash
npm run check
npm run lint
npm run build
npm run preview -- --port 4321   # 別プロセスで起動、検証後にPIDをkill
npm install -D playwright@latest --no-save
npx playwright install chromium
npm install -D @axe-core/playwright@latest --no-save
# Playwrightスクリプトでレスポンシブ・GA4・axeを検証（検証用一時スクリプトは
# tests/**やscripts/qa/**配下に保存せず、作業完了後に削除済み）
npm uninstall playwright @axe-core/playwright --no-save
```

`src/data/sponsors.json` は検証の一時期間のみテストデータに書き換え、
検証後に `{ "schemaVersion": "1.0.0", "sponsors": [] }` へ復元し、
`npm run build` で再ビルドして状態を確認済み。
