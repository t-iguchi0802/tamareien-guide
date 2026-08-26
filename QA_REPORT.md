# QA_REPORT.md — feature/editorial-redesign 独立QA監査

> **本レポートは `feature/editorial-redesign` ブランチ（`integrated-mvp` から分岐、
> commit `1fbc397`「redesign: TOP/石材店一覧を『目的から探す』地域ガイドへ全面再設計」まで）
> を対象にした独立QA監査である。旧 `QA_REPORT.md`（`integrated-mvp` 監査分）は本内容で
> 上書きした。過去の監査内容が必要な場合は git 履歴（`d043381` 時点の `QA_REPORT.md`）を参照すること。**

- 担当: QA（`feature/qa` 相当の独立監査エージェント）
- 対象: `feature/editorial-redesign`（TOPページ・`/sekizaiten/` の全面再設計）
- 実施日: 2026-08-26
- 変更範囲（diff統計）: `src/layouts/BaseLayout.astro`,
  `src/styles/tokens.css`, `src/components/business/BusinessCard.astro`,
  `src/components/business/ServiceFilter.astro`（新規）,
  `src/components/business/serviceLabels.ts`,
  `src/pages/index.astro`, `src/pages/sekizaiten/index.astro`,
  `src/pages/_lib/business-display.ts`（GOAL_GROUPS削除）の8ファイル。
- 実施内容:
  - `npm run build` / `npm run check` / `npm run lint` の再実行（クリーン確認）。
  - `PURPOSE_GROUPS` と `ServiceKey` union の全数照合。
  - `ServiceFilter.astro` の絞り込みロジック（`applyFilter`）のコード読解 +
    **実ブラウザでの動作検証**（Playwright + Chromiumを一時的に
    `npm install --no-save` で導入し、本レポート作成後に `npm uninstall --no-save`
    で削除。`package.json` / `package-lock.json` は無変更であることを確認済み）。
    AND条件を2パターン手計算し、実際のクリック操作の結果と突き合わせて一致を確認。
  - `dist/` 出力（`sekizaiten/index.html` / `index.html` 等）の埋め込みJSON・
    コンパイル済みCSSの詳細度を直接検査。
  - 360px / 768px / 1440px でのスクリーンショット取得・目視確認（TOP・/sekizaiten/）。
  - キーボードのみでのTab順序・フォーカスリング表示を実機（Chromium）で確認。
  - WCAG AA コントラスト比の計算検証（Node.jsで相対輝度式を実装し、
    `tokens.css` コメント内の計算済み値と照合）。
  - `businesses.json` / `sources.csv` / `data_dictionary.md` の無変更確認
    （`git diff integrated-mvp..HEAD` が空）。
  - `src/data/**` とルート正本の内容一致確認（`diff` で完全一致）。
  - GA4 `data-event` 属性と `src/lib/analytics/dispatcher.ts` の契約の突き合わせ。

## サマリー

| 重大度 | 件数 |
|---|---:|
| Critical | 0 |
| Major | 0 |
| Medium | 1 |
| Minor | 1 |
| Info | 2 |

**結論**: CLAUDE.md の絶対厳守ルール（`not_confirmed` の非対応表示化禁止、非公式表記の
全ページ表示、広告と比較の分離、事実データ非改変、事業者データの手書き複製禁止、
`sourceId` 整合性）について、明確な違反は見つからなかった。`npm run build` /
`npm run check` / `npm run lint` はすべてクリーン。`PURPOSE_GROUPS` は12
`ServiceKey` を過不足・重複なく分類しており、絞り込みのAND条件は実ブラウザ検証で
手計算と一致した。`.business-card[hidden]` のCSS詳細度問題は正しく修正されていることを
コンパイル後CSSで確認した。`businesses.json` / `sources.csv` / `data_dictionary.md`
および `src/data/**` の複製は無改変・完全一致だった。

見つかった問題は、TOPページでの重複ランドマーク構造（Medium）1件と、
新規ファイルのPrettier未整形（Minor、機能に影響なし）、および参考情報2件のみである。

---

## Medium

### M-1: TOPページで `<section aria-labelledby="service-filter-heading">` が二重にネストしている

- **再現手順**:
  1. `npm run build` 後、`dist/index.html` を開く。
  2. `<section aria-labelledby="service-filter-heading">` を検索する。
  3. 同じ `aria-labelledby="service-filter-heading"` を持つ `<section>` が
     入れ子になって2つ出現することを確認する（外側: `src/pages/index.astro`
     が用意した `<section>`、内側: `ServiceFilter.astro` 自身のルート `<section
     class="service-filter">`）。

  実際の出力（`dist/index.html` から抜粋）:

  ```html
  <section aria-labelledby="service-filter-heading" data-astro-cid-lcdefpme>
    <section class="service-filter" aria-labelledby="service-filter-heading" ...>
      ...
    </section>
  </section>
  ```

- **重大度**: Medium（アクセシビリティ構造の不備。axe-core の `landmark-unique`
  相当のルールに抵触しうる。同一の役割・同一のアクセシブルネームを持つ
  ランドマークが入れ子になっており、スクリーンリーダーのランドマークナビゲーションで
  同じ名前の領域が二重に読み上げられる可能性がある。機能停止やデータ誤表示は
  伴わないため Critical/Major ではない）。
- **対象ファイル**:
  - `src/pages/index.astro`（30〜33行目付近、`<section
    aria-labelledby="service-filter-heading"><ServiceFilter .../></section>`）
  - `src/components/business/ServiceFilter.astro`（50行目、
    コンポーネント自身のルート `<section class="service-filter"
    aria-labelledby="service-filter-heading" ...>`）
- **推奨修正**（要人間判断・リード対応）: `ServiceFilter.astro` 自身が
  見出し付きの `<section>` ランドマークを既に提供しているため、
  `index.astro` 側の外側 `<section aria-labelledby="service-filter-heading">`
  を削除し、単なる非ランドマーク要素（`<div>`）にするか、あるいは
  `index.astro` 側にラップ用のsectionを残す場合は `ServiceFilter.astro`
  側のmode="link"のときだけルート要素を `<div>`にする等、いずれか一方の
  ランドマークだけを残す設計に統一する。なお `/sekizaiten/` 側
  (`src/pages/sekizaiten/index.astro`) は `<ServiceFilter mode="inline" />`
  を直接呼び出しており、この二重ネスト問題は発生していない（TOPページのみの
  問題）。

---

## Minor

### N-1: 新規ファイル `ServiceFilter.astro` がPrettier未整形

- **再現手順**: `npm run format:check` を実行する。`src/components/business/ServiceFilter.astro`
  が整形対象として警告される。
- **重大度**: Minor（ビルド・lint・型チェックには影響しない。`npm run
  format:check` はCLAUDE.md 6章のコマンド一覧には含まれるが、本ブランチの
  重点確認項目・`npm run build`/`check`/`lint` の合否には含まれない）。
- **対象ファイル**: `src/components/business/ServiceFilter.astro`
- **補足**: `integrated-mvp` の時点で既に40ファイルがPrettier未整形の状態であり
  （`BaseLayout.astro` / `BusinessCard.astro` / `serviceLabels.ts` /
  `index.astro` / `sekizaiten/index.astro` / `business-display.ts` /
  `tokens.css` を含む）、これは本ブランチ以前からの既存事象である。本ブランチが
  新たに未整形化させたのは新規ファイル `ServiceFilter.astro` の1件のみ
  （`integrated-mvp` と `feature/editorial-redesign` の
  `format:check` 対象ファイル一覧を `diff` して確認済み）。
- **推奨修正**: リード側で `npm run format` を一括実行するタイミングで
  まとめて解消してよい（本ブランチ固有の緊急対応は不要）。

---

## Info（参考情報。対応不要または既存事象）

### I-1: Prettier未整形は `integrated-mvp` の時点から既存の全社的事象

上述 N-1 参照。プロジェクト全体で40ファイル前後がPrettier未整形であり、
本ブランチの変更対象8ファイルのうち7ファイル（`BaseLayout.astro` /
`BusinessCard.astro` / `serviceLabels.ts` / `index.astro` /
`sekizaiten/index.astro` / `business-display.ts` / `tokens.css`）は
編集前から既に未整形だった。対応するなら本ブランチ固有ではなく
プロジェクト全体の整形として実施するのが妥当（要人間判断）。

### I-2: チェックボックスの check/uncheck が同一の `filter_value` でGA4計測される

`ServiceFilter.astro` のチェックボックスは `data-filter-value={key}`
が固定値であり、`change` イベントはチェックON/OFFどちらでも発火する
（`checkboxes.forEach((cb) => cb.addEventListener('change', applyFilter))`
とは別に、`autoInit`/`dispatcher.ts` 側の `change` リスナーが同じ要素から
`comparison_filter_use { filter_type: "service", filter_value: <key> }` を
毎回送信する）。CLAUDE.md / `CLAUDE_CODE_HANDOFF.md` のGA4契約は
`filter_type`/`filter_value` の2属性のみを定義しており、ON/OFFの区別は
契約上要求されていないため契約違反ではないが、GA4データを分析する際に
「その条件をONにした」のか「OFFにした」のかを区別できない点は
将来の分析設計上の注意点として記録する（要人間判断。対応不要の可能性が高い）。

---

## 重点確認項目チェックリスト（すべてPASS。詳細は上記参照）

| # | 項目 | 結果 |
|---|---|---|
| 1 | `npm run check` / `npm run lint` / `npm run build` | PASS（すべてクリーン） |
| 2 | `PURPOSE_GROUPS` が12 `ServiceKey` を過不足・重複なく分類 | PASS（build:4 + closure:2 + care:6 = 12、重複なし） |
| 3 | 絞り込みAND条件の正しさ | PASS（コード読解＋実ブラウザ検証で2パターン手計算と一致。詳細下記） |
| 4 | 未選択時に14社すべてが対象 | PASS（`!hasSelection` 分岐、実ブラウザで件数14を確認） |
| 5 | `.business-card[hidden]` のCSS詳細度 | PASS（コンパイル後CSSで `.business-card[data-astro-cid-xxx][hidden]{display:none}` が `.business-card[data-astro-cid-xxx]{display:flex}` より高詳細度であることを確認） |
| 6 | `:scope > [data-business-id]` がPhoneLink等を誤取得していないか | PASS（`:scope >` は直接の子要素のみに限定。PhoneLink/MapLink/OutboundLink/CorrectionCtaのdata-business-idはすべて子孫要素であり対象外） |
| 7 | `not_confirmed` が「非対応」と誤認させる表現になっていないか | PASS（新しい文はconfirmedのみ列挙。0件時のフォールバック文言「現時点でありません（掲載情報は随時更新します）」も断定を避けている。実機スクリーンショットで確認） |
| 8 | 重複する「公開情報で確認できる対応」見出しの削除 | PASS（該当文言はコード内コメントにのみ残存し、レンダリング結果には出現しない） |
| 9 | スポンサー分離・主観語の不在 | PASS（新規コピーに「おすすめ」等の主観語なし。スポンサーコンポーネントは本ブランチで未使用） |
| 10 | 全8ページで非公式表記がヘッダー・フッターにあるか | PASS（8ページ全てで確認。`BaseLayout.astro`以外のページは無変更） |
| 11 | WCAG AA コントラスト | PASS（計算した全ペアが4.5:1以上。`tokens.css`コメント内の実測値「stone-text: stone-surface比5.28:1、paper比5.77:1」も計算により再現・確認） |
| 12 | キーボード操作性 | PASS（Tab順序が論理的。目的ボタン・チェックボックス・クリアボタン・summaryはすべてネイティブ要素で、フォーカスリングも実機確認済み） |
| 13 | `businesses.json` / `sources.csv` / `data_dictionary.md` 無変更 | PASS（`git diff integrated-mvp..HEAD` が空） |
| 14 | `src/data` 複製とルート正本の一致 | PASS（`diff`で完全一致） |
| 15 | GA4 `data-event`契約準拠 | PASS（`data-filter-type`/`data-filter-value`、イベント名`comparison_filter_use`が`dispatcher.ts`契約と一致） |

### 補足: AND条件の実ブラウザ検証詳細

`dist/sekizaiten/index.html` に埋め込まれたconfirmedサービスのみのJSONを元に、
以下2パターンを手計算し、Playwright経由の実際のチェックボックス操作結果と
突き合わせて一致を確認した。

- **パターンA**: `new_grave` + `engraving` を選択 → 手計算7件
  （toshimaya, koganeya, ishikatsu, fukaya, shibata, yamada, ishisei）。
  実機操作結果も `result-count = 7`、可視カードIDも同一7件で一致。
- **パターンB**: 目的ボタン「お墓を建てる・整える」
  （`new_grave, engraving, renovation, seismic` の4条件AND）をクリック
  → 手計算2件（ishikatsu, shibata）。実機操作結果も `result-count = 2` で一致。
- 「条件をクリア」ボタン押下後は `result-count = 14`（全件）に復帰することを確認。

---

## 監査時に発見しなかった主な確認事項（明示的に問題なしと判断）

- TOPページは `<ServiceFilter mode="link">` を使い、14社カードグリッドを
  複製描画していない（`dist/index.html` に `class="business-card"` が
  0件であることを確認）。目的の「業者データベースではなく地域ガイド」という
  設計方針に沿っている。
- `/sekizaiten/` では14件の `data-business-id` がすべてユニークであり、
  `businesses.json` の14社と一致（手書き複製やデータ改変の痕跡なし）。
- 内部運営情報（`notes_internal` 相当、営業評価・交渉メモ等）の
  混入は本ブランチ変更ファイル内に見つからなかった。
- スポンサー表示は本ブランチの変更範囲に含まれておらず、比較結果・
  掲載順への影響は確認されなかった。
- GA4 Measurement ID未設定でも `npm run build` は成功し（本監査は
  環境変数未設定のまま実施）、`GaTag.astro` は何も出力しないため
  サイトは壊れない。
