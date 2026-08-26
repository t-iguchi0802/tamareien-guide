# CLAUDE.md

本リポジトリで作業するすべてのエージェント（リード・並行実装エージェント・QA）が
恒久的に守るルールをまとめたものである。作業前に必ず読むこと。

---

## 0. 最初に理解すること: このリポジトリには2つの異なるプロジェクト資料が混在している

このリポジトリのルート直下には、**目的の異なる2つのプロジェクトの設計資料**が
両方とも置かれている。取り違えると事業ドメインそのものを誤る重大事故になるため、
最初に明確化する。

### 今回実装する対象（本プロジェクト）

**多磨霊園のお墓相談比較ガイド** — 多磨霊園周辺の石材店・お墓関連事業者を、
公開情報のみで中立に比較する静的サイト。

正本資料:

- `businesses.json` — 事業者データ（正本。内容を変更しない）
- `data_dictionary.md` — データ定義・表示ルール（正本）
- `sources.csv` — 出典データ（正本。内容を変更しない）
- `CLAUDE_CODE_HANDOFF.md` — サイト目的・MVP範囲・技術構成
- `WORKTREE_AGENT_PLAN.md` — 並行開発体制・ファイル所有権

### 今回は実装しない別プロジェクトの資料（参考限定）

`00_README.md` `01_CONTENT.md` `02_DESIGN.md` `03_SITE_STRUCTURE.md`
`04_WIREFRAME.md` `05_DATA.md` `06_TECH.md` `07_QA.md`
`08_REVIEW_DECISIONS.md` `AGENTS.md` は、**「三鷹・街の電器屋」比較サイト**という、
本プロジェクトとは事業ドメイン・データスキーマ・URL構成・GA4イベント名が
まったく異なる別プロジェクトの設計資料である（例: サービスが
エアコン/インターホン等、URLが`/service/aircon/`等、状態値が
`confirmed/conditional/not_available/unconfirmed`、イベント名が
`shop_card_click`等）。

**これらのファイルにある固有の内容（事業ドメイン、URL、データ項目、
GA4イベント名、店舗情報等）を本プロジェクトへ転用しない。**

ただし、以下のような**一般的な設計パターン**は、本プロジェクトの資料
（CLAUDE_CODE_HANDOFF.md / WORKTREE_AGENT_PLAN.md / businesses.json /
data_dictionary.md）と矛盾しない範囲でのみ参考にしてよい。

- 高齢者・家族層に配慮したタイポグラフィ・タップ領域等のアクセシビリティ基準
- 広告（スポンサー）と編集コンテンツを分離するUI設計思想
- 未確認情報を推測しないという編集姿勢そのもの（値の名前は違うが思想は共通）
- QA Release Gateのような「公開判定を一箇所に集約する」考え方
- 比較表のレスポンシブ対応（PC表 / モバイルカード化）等の一般的なUIパターン

判断に迷う場合は、旧資料の具体的な内容を採用せず、
CLAUDE_CODE_HANDOFF.md / WORKTREE_AGENT_PLAN.md / data_dictionary.md へ立ち返ること。

### 資料の優先順位（本プロジェクト内）

1. 事業者情報・出典・表示ルール → `businesses.json` / `data_dictionary.md` / `sources.csv`
2. サイトの目的・MVP範囲・技術構成 → `CLAUDE_CODE_HANDOFF.md`
3. 並行開発・ファイル所有権 → `WORKTREE_AGENT_PLAN.md`
4. 上記と矛盾しない範囲でのみ、旧資料をデザイン・品質基準の参考にする

資料間に重大な矛盾がある場合は、推測で統合せずリード（人間）へ報告する。

---

## 1. サイト概要

- サイト名: **多磨霊園のお墓相談比較ガイド**
- サブタイトル: **墓じまい・管理・納骨・石材店を公開情報で比較**
- 対象: 多磨霊園周辺の石材店・お墓関連事業者（14社、`businesses.json`）
- 制作方式: Astro + TypeScript、静的出力、JSON + Markdown（外部DB不使用）
- 非公式表記（全ページのヘッダー・フッターに常時表示。省略しない）:

  > 当サイトは東京都、多磨霊園、東京都公園協会の公式サイトではありません。
  > 地域事業者の公開情報を整理した民間の比較情報サイトです。

詳細は `CLAUDE_CODE_HANDOFF.md` を正とする。

---

## 2. 絶対厳守ルール

### データの正確性

- 事業者への事前ヒアリング、スポンサー営業、掲載許可待ちは行わない（公開情報のみで構成する）。
- 店舗名・住所・電話・料金・サービス・創業年等を**推測・創作しない**。
- `not_confirmed` を「非対応」に変換しない。必ず「公開情報では未確認」と表示する
  （表示は `src/lib/data/verificationStatus.ts` の `statusToDisplayLabel()` のみを経由する。
  独自の変換ロジックを別途作らない）。
- `explicitly_not_offered` は、事業者が非対応と明記した一次情報がある場合だけ使用する。
- 空欄・`null`・未確認項目をAIで補完しない。
- 住所から門名・徒歩分数・位置関係を自動断定しない。
- `businesses.json` と `sources.csv` の対応関係（`evidenceSourceIds` /
  `publishedPrices[].sourceId` → `source_id`）を維持する。存在しないIDを追加しない。

### 広告と比較の分離

- スポンサー契約の有無を、通常掲載順・比較結果・評価に反映しない。
- `displayOrder` は推奨順位ではない（管理用の安定表示順）。
- 口コミ点数・星評価・独自ランキング・「おすすめ」「人気」「優良」等の主観語を店名やUIに追加しない。
- `review` / `aggregateRating` / `award` / `best` 等の構造化データを使用しない。
- スポンサー枠を追加する場合は別データで管理し、「スポンサー」「広告」であることを明示する。

### 表記・信頼性

- 東京都・多磨霊園・東京都公園協会の公式サイトであるかのような誤認をさせない。
- 「多摩霊園」ではなく正式名称「多磨霊園」を基本表記とする。
- 正確な検索数は未確認。検索ボリュームを断定する文章を作らない。
- 行政手続を法律相談として断定しない。行政制度は東京都公園協会・府中市等の公式URLへリンクする。

### 既存資料・正本データの扱い

- リポジトリ直下の `businesses.json` / `sources.csv` / `data_dictionary.md` /
  `00〜08_*.md` / `AGENTS.md` / `CLAUDE_CODE_HANDOFF.md` / `WORKTREE_AGENT_PLAN.md`
  を削除しない。整形（Prettier等）の対象にもしない
  （`.prettierignore` で既に除外済み。理由は同ファイル内コメント参照）。
- `src/data/businesses.json` / `src/data/sources.csv` はビルド用の作業コピーであり、
  ルート直下の正本と**内容を完全一致**させる。更新時は正本を更新してからコピーし直す。
- 内部運営情報（営業評価、交渉メモ、苦情履歴、訂正/非掲載依頼の内部処理メモ、
  担当者個人情報等）を、公開サイトrepo・ビルド対象へ一切含めない。

### スコープ規律

- 口コミ投稿、会員登録、事業者ログイン、見積り一括送信、課金・請求、外部DB
  （Supabase等）、AIチャット相談、無審査自動更新は本MVPの対象外。
- 薄い事業者個別ページを14枚量産しない。一覧比較を優先する
  （`CLAUDE_CODE_HANDOFF.md` 5章）。

---

## 3. データスキーマ概要

正本: `data_dictionary.md`（表示ルール） / `businesses.json`（実データ） /
`sources.csv`（出典）。実装上の型契約は `src/types/business.ts` /
`src/types/source.ts`、検証は `src/lib/data/schema.ts`（Zod）。

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

状態の画面変換（`data_dictionary.md` 6章。実装は `verificationStatus.ts`）:

| 保存値 | 比較表 | 絞り込み対象 |
|---|---|---:|
| `confirmed` | ○ 公開確認済み | 含める |
| `not_confirmed` | 公開情報では未確認 | 含めない |
| `explicitly_not_offered` | 非対応と明記 | 含めない |
| `not_applicable` | 対象外 | 含めない |

GA4イベント契約（正本: `CLAUDE_CODE_HANDOFF.md` 7章、型: `src/types/analytics.ts`）:

```text
business_outbound_click  { business_id, link_type, page_path }
business_phone_click     { business_id, page_path }
business_map_click       { business_id, page_path }
comparison_filter_use    { filter_type, filter_value, page_path }
official_procedure_click { authority, topic, page_path }
correction_request_click { page_path }
```

MVPページURL（正本: `CLAUDE_CODE_HANDOFF.md` 5章、実装契約: `src/lib/routes.ts`）:

```text
/               トップ・困りごと別入口
/sekizaiten/    14社の一覧・比較表
/hakajimai/     墓じまい・墓石撤去の比較と見積項目
/kanri/         墓所管理・清掃・供花の比較
/tetsuzuki/     改葬・墓所返還・施設変更の違いと公式リンク
/about/         運営方針、掲載基準、広告方針、訂正窓口
/sources/       情報源・最終確認日
/privacy/       プライバシーポリシー
```

---

## 4. 技術スタック

Phase 0で確定した版（`npm ls`で確認可能。バージョンは今後
`npm view`等で実確認せず更新しない。更新が必要な場合は理由と共に報告する）:

```text
astro                  ^7.2.7
typescript              ^5.9.3   （TypeScript 7系ネイティブ実装は
                                   ESLint等エコシステムとの互換性が
                                   未確認のためPhase 0では不採用）
@astrojs/check          ^0.9.10
eslint                  ^10.9.1
eslint-plugin-astro     ^3.1.0
typescript-eslint       ^8.68.0
@eslint/js              ^10.0.1
prettier                ^3.9.6
prettier-plugin-astro   ^0.14.1
zod                     ^4.4.3
csv-parse               ^7.0.2
@types/node             ^24.13.3
```

Node.js: v22.12.0以上を要求（Astro 7の要件）。開発機は v24.18.0 で動作確認済み。
Vitest（単体テスト）はQA段階で追加する（Phase 0では未導入）。
Playwright・axe相当のアクセシビリティ確認もQA段階で追加する。

パッケージマネージャ: npm（`package-lock.json`をコミットする）。

---

## 5. ディレクトリ構成とファイル所有権

`WORKTREE_AGENT_PLAN.md` の担当表を正とする。要約:

| 担当 | ブランチ | 編集してよい範囲 | 編集禁止 |
|---|---|---|---|
| Data & Content | `feature/data-content` | `src/data/**`, `src/content/**` | components、pages、package系 |
| UI Components | `feature/ui-components` | `src/components/**`, `src/styles/**` | data、content、pages、package系 |
| Pages | `feature/pages` | `src/pages/**` | data本文、components内部、package系 |
| SEO & Analytics | `feature/seo-analytics` | `src/lib/seo/**`, `src/lib/analytics/**`, `public/robots.txt` | data本文、pages本文、package系 |
| QA | `feature/qa` | `tests/**`, `scripts/qa/**` | 本番コードの直接修正 |
| Lead | 統合ブランチ | 共有設定・依存関係・統合修正 | 事実データの無断変更 |

共有ファイル（リード以外変更禁止。`WORKTREE_AGENT_PLAN.md` 3章）:

```text
package.json
package-lock.json
astro.config.mjs
tsconfig.json
eslint.config.mjs
prettier.config.mjs
src/types/**
src/layouts/**
.github/**
CLAUDE.md
```

Phase 0でリードが追加で確立した、上記に準ずる共有基盤（並行実装エージェントは
変更せず、変更が必要な場合はREPORT.mdで報告する）:

```text
src/lib/data/**    データ読み込み・検証基盤（schema.ts / loadBusinesses.ts /
                   loadSources.ts / validate.ts / verificationStatus.ts）
src/lib/routes.ts  ページURL契約
src/lib/siteConfig.ts  サイト全体設定の実値
```

ディレクトリ構成:

```text
/
├─ CLAUDE.md
├─ businesses.json / data_dictionary.md / sources.csv   ← 正本（変更しない）
├─ 00〜08_*.md / AGENTS.md                               ← 別プロジェクト参考資料
├─ CLAUDE_CODE_HANDOFF.md / WORKTREE_AGENT_PLAN.md       ← 本プロジェクト正本
├─ astro.config.mjs / tsconfig.json / package.json
├─ eslint.config.mjs / prettier.config.mjs
├─ src/
│  ├─ components/       ui-components担当（business/access/sponsors/common）
│  ├─ content/           data-content担当（guides/sponsors）
│  ├─ data/              data-content担当（businesses.jsonの作業コピー等）
│  ├─ layouts/           リード共有（BaseLayout.astro）
│  ├─ lib/
│  │  ├─ data/           リード共有（データ読み込み・検証基盤）
│  │  ├─ seo/            seo-analytics担当
│  │  ├─ analytics/      seo-analytics担当
│  │  ├─ routes.ts       リード共有
│  │  └─ siteConfig.ts   リード共有
│  ├─ pages/             pages担当
│  ├─ styles/            ui-components担当
│  └─ types/             リード共有（共通型契約）
├─ public/
│  └─ images/
├─ tests/                QA担当
└─ scripts/qa/           QA担当
```

---

## 6. コマンド

```bash
npm run dev             # 開発サーバー
npm run build            # 本番ビルド（データ検証を含む）
npm run preview          # ビルド結果のプレビュー
npm run check             # astro check（型チェック）
npm run lint               # eslint .
npm run format             # prettier --write .
npm run format:check       # prettier --check .
```

`npm run build` は `src/pages/**` が `src/lib/data` 経由でデータへアクセスした時点で
`businesses.json` / `sources.csv` のスキーマ検証・相互整合性検証を実行し、
不正データがあればビルドを失敗させる。

---

## 7. 並行実装エージェント

`.claude/agents/` に以下を定義済み。起動時は原則として
`Agent`ツールの `isolation: "worktree"` を指定し、
`WORKTREE_AGENT_PLAN.md` 2章のブランチ構成
（`feature/data-content` 等）に対応させること。

- `data-content` — `src/data/**`, `src/content/**`
- `ui-components` — `src/components/**`, `src/styles/**`
  （frontend-designプラグインのスキル `frontend-design:frontend-design` を使用する）
- `pages` — `src/pages/**`
- `seo-analytics` — `src/lib/seo/**`, `src/lib/analytics/**`, `public/robots.txt`
- `qa` — `tests/**`, `scripts/qa/**`（`feature/qa`ブランチ。他4エージェント統合後に開始）

各エージェントの詳細な指示は `.claude/agents/*.md` 本体を参照。

---

## 8. Phase 0 完了状態

- [x] `package.json` / `package-lock.json`（現行安定版・相互互換性確認済み）
- [x] `tsconfig.json`（`astro/tsconfigs/strict` 継承）
- [x] `astro.config.mjs`
- [x] ESLint / Prettier 設定
- [x] 共通型（`src/types/business.ts` / `source.ts` / `site.ts` / `analytics.ts` / `components.ts`）
- [x] データ読み込み・検証基盤（`src/lib/data/**`）
- [x] サイト設定・URL契約（`src/lib/siteConfig.ts` / `src/lib/routes.ts`）
- [x] 基本レイアウト（`src/layouts/BaseLayout.astro`）
- [x] ディレクトリ構成一式（各エージェント担当ディレクトリを含む）
- [x] `npm run build` 成功（データ検証込み）
- [x] `.claude/agents/` 5エージェント定義

`src/pages/index.astro` はPhase 0のスモークテスト用プレースホルダーであり、
本実装ではない。`pages`担当が本実装へ置き換える。

## 9. 次フェーズ

Phase 0コミット後、`foundation-v1`タグを打った時点から
`WORKTREE_AGENT_PLAN.md` 2章のworktreeを作成し、4エージェント
（data-content / ui-components / pages / seo-analytics）を並行起動できる。
ただし実際の起動はユーザーの明示的な指示があるまで行わない。
