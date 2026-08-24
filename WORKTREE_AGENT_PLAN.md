# Claude Code並列制作計画｜Git worktree・エージェント分担

- 対象：多磨霊園のお墓相談比較ガイド
- 方針：共通基盤を先に固定し、ファイル所有権を分けて同時並行する
- 重要：同時並行とは、同じファイルを複数エージェントに編集させることではない

## 1. 全体構成

### Phase 0：リードだけで共通基盤を作る

並列作業を開始する前に、リードエージェントが次を完成させてコミットする。

- Astro＋TypeScriptの初期化
- package managerの決定
- `package.json`とロックファイル
- `tsconfig.json`、Astro設定
- ディレクトリ構成
- 事業者データのTypeScript型
- サービス状態の型
- ページURL
- CSS方式
- 共通コンポーネントのインターフェース
- テスト・lint・formatコマンド
- `CLAUDE.md`

基準コミット例：`chore: establish foundation contracts`

基準タグ例：`foundation-v1`

基盤コミット前にworktreeを作らない。

## 2. worktree構成

基盤コミット後、同じコミットから次を作る。

```bash
git worktree add ../tama-data -b feature/data-content
git worktree add ../tama-ui -b feature/ui-components
git worktree add ../tama-pages -b feature/pages
git worktree add ../tama-seo -b feature/seo-analytics
```

統合後のQA用は後から作る。

```bash
git worktree add ../tama-qa -b feature/qa integrated-mvp
```

パスは実際の親ディレクトリに合わせて変更してよい。1つのブランチを複数worktreeで同時に使用しない。

## 3. エージェントとファイル所有権

| エージェント | ブランチ | 編集してよい範囲 | 編集禁止 |
|---|---|---|---|
| Data & Content | `feature/data-content` | `src/data/**`, `src/content/**`, データ検証用fixture | components、pages、package系 |
| UI Components | `feature/ui-components` | `src/components/**`, `src/styles/**` | data、content、pages、package系 |
| Pages | `feature/pages` | `src/pages/**` | data本文、components内部、package系 |
| SEO & Analytics | `feature/seo-analytics` | `src/lib/seo/**`, `src/lib/analytics/**`, `public/robots.txt`, 構造化データ専用部品 | data本文、pages本文、package系 |
| QA | `feature/qa` | `tests/**`, `scripts/qa/**`, テスト報告 | 本番コードの直接修正。問題は報告する |
| Lead | 統合ブランチ | 共有設定、依存関係、統合修正 | なし。ただし事実データを無断変更しない |

### 共有ファイルの責任者

次はリード以外変更禁止。

- `package.json`
- lockfile
- `astro.config.*`
- `tsconfig.json`
- `src/types/**`
- `src/layouts/**`
- `.github/**`
- `CLAUDE.md`

依存パッケージが必要な場合、各エージェントは追加理由とパッケージ名だけを報告し、リードが判断して基盤へ追加する。

## 4. 基盤で固定する契約

並列開始前に次のインターフェースを固定する。

```ts
type VerificationStatus =
  | 'confirmed'
  | 'not_confirmed'
  | 'explicitly_not_offered'
  | 'not_applicable';

type ServiceKey =
  | 'new_grave'
  | 'grave_closure'
  | 'reburial_support'
  | 'interment'
  | 'engraving'
  | 'cleaning'
  | 'annual_management'
  | 'flowers'
  | 'planting'
  | 'renovation'
  | 'seismic'
  | 'remote_photo_report';
```

共通コンポーネントの仮契約例：

```ts
<BusinessCard business={business} />
<ComparisonTable businesses={businesses} visibleServices={serviceKeys} />
<VerificationBadge status="confirmed" />
<OutboundLink businessId="biz-toshimaya" linkType="official_site" href="..." />
```

並列期間中は型名、props名、イベント名を変更しない。変更が必要ならリードが全員を止め、基盤契約を更新する。

## 5. 各エージェントへの初期指示

### Data & Content

```text
あなたはデータ・コンテンツ担当です。
編集範囲は src/data/** と src/content/** だけです。
businesses.json、data_dictionary.md、sources.csvを正本として使用してください。
未確認項目を推測しないでください。
公式サイトの文章を長く転載せず、中立要約にしてください。
他のディレクトリは変更せず、必要事項はREPORT.mdに報告してください。
完了前にJSON、sourceId、内部リンクを検証してください。
```

### UI Components

```text
あなたはUIコンポーネント担当です。
編集範囲は src/components/** と src/styles/** だけです。
型とprops契約を変更しないでください。
高齢者本人と40〜60代の家族が読みやすい比較UIを作ってください。
not_confirmedを非対応表示にしないでください。
東京都公式サイトの見た目を模倣しないでください。
360px、768px、1440pxで成立する部品を作り、使用例をREPORT.mdに記録してください。
```

### Pages

```text
あなたはページ組立担当です。
編集範囲は src/pages/** だけです。
既定の型・layout・component propsを変更しないでください。
MVPページを構成し、仮データのHTML直書きを避けてください。
ページ固有の文章以外の事業者情報はbusinesses.jsonから取得してください。
不足コンポーネントは自作せず、必要なAPIをREPORT.mdに記載してください。
```

### SEO & Analytics

```text
あなたはSEO・計測担当です。
編集範囲は src/lib/seo/**、src/lib/analytics/**、public/robots.txt、専用部品だけです。
review、aggregateRating、根拠のないランキング構造化データを作らないでください。
GA4 IDは環境変数とし、未設定でもビルド可能にしてください。
指定イベント名とパラメータを実装してください。
事業者ページの構造化データは画面表示される確認済み情報だけに限定してください。
```

### QA

```text
あなたは独立QA担当です。
統合済みブランチを対象に、ビルド、型、リンク、表示、アクセシビリティ、データ整合性を確認してください。
本番コードを直接直さず、再現手順、重大度、対象ファイル、推奨修正をQA_REPORT.mdに記載してください。
not_confirmedが非対応表示になっていないか、非公式表記が全ページにあるかを重点確認してください。
```

## 6. 並列作業中の通信ルール

- 各エージェントは開始時に担当範囲を宣言する。
- 共通契約への変更要求は、コード変更ではなく`REPORT.md`へ記載する。
- 15〜30分単位または機能単位で小さくコミットする。
- コミットメッセージに担当名と対象を含める。
- 他ブランチを自己判断でマージしない。
- 他worktreeのファイルを直接編集しない。
- 同一ファイルの所有権を途中で移さない。

## 7. 統合順序

推奨順序：

1. `feature/data-content`
2. `feature/ui-components`
3. `feature/pages`
4. `feature/seo-analytics`
5. 統合ブランチでビルド・手動確認
6. `feature/qa`を作成して独立監査
7. QA指摘を元の担当またはリードが修正
8. 最終ビルド・Cloudflare Pagesプレビュー

統合例：

```bash
git switch -c integrated-mvp foundation-v1
git merge --no-ff feature/data-content
git merge --no-ff feature/ui-components
git merge --no-ff feature/pages
git merge --no-ff feature/seo-analytics
npm run check
npm run test
npm run build
```

実際のnpm scriptsは基盤で定義した名前に合わせる。

## 8. コンフリクト時の処理

1. 自動的に「両方採用」しない。
2. ファイル所有権を確認する。
3. 所有者側の実装を原則優先する。
4. 共通契約との不一致はリードが判断する。
5. 事実データの競合は、コード都合で解決せず出典を再確認する。
6. 解決内容を統合コミット本文に残す。

## 9. 品質ゲート

各ブランチの完了条件：

- 担当範囲外の変更がない
- ビルドまたは担当テストが通る
- `REPORT.md`に変更・未解決・依存要求がある
- 秘密情報、GA4 ID、APIキーを含まない
- 事実データをHTMLへ重複記載していない

統合後の完了条件：

- 14社表示
- sourceId整合
- 非公式表示
- 未確認表示
- 360pxで操作可能
- キーボード操作可能
- 外部リンクイベント計測
- リンク切れなし
- Cloudflare Pagesプレビュー成功

## 10. worktreeの終了

マージと確認が完了してから削除する。

```bash
git worktree list
git worktree remove ../tama-data
git worktree remove ../tama-ui
git worktree remove ../tama-pages
git worktree remove ../tama-seo
git worktree remove ../tama-qa
git worktree prune
```

未コミット変更があるworktreeを強制削除しない。削除前に各ブランチのマージ済み状態を確認する。

