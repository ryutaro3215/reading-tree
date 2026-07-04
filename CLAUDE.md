# CLAUDE.md

## 開発の基本方針

このプロジェクトの開発は `.dev/` ディレクトリ内のドキュメントを唯一の仕様源として進める。
コードを書く前に必ず該当ドキュメントを参照し、記載された要件・タスク定義・受け入れ条件に従う。

## .dev/ ドキュメント一覧

| ファイル | 役割 |
|----------|------|
| `.dev/business-plan.md` | 事業目的・ターゲット・差別化・収益モデル・成功指標 |
| `.dev/requirements.md` | 機能要件・非機能要件・セキュリティ要件・非スコープ |
| `.dev/marketing-plan.md` | LP要件（実文コピー含む）・計測イベント・ローンチ計画 |
| `.dev/plan.md` | スタック定義・タスク一覧（T0〜T12）・依存関係・受け入れ条件 |

## 開発ルール

- **タスクの単位は `plan.md` の T0〜T12**。着手前に `depends` を確認し、前提タスクが完了していることを確認する。
- **受け入れ条件（acceptance）を満たしてタスク完了**とする。条件を満たさない実装は未完了扱い。
- **UIのコピー文言は `marketing-plan.md` の実文をそのまま使用する**。意訳・省略・改変しない。
- **計測イベント名は `marketing-plan.md` の定義に合わせる**（`page_view`, `cta_click_hero`, `cta_click_footer`, `tree_node_click`, `proposal_submitted`, `proposal_approved`）。
- **非スコープは実装しない**（`requirements.md` の「非スコープ」セクションを参照）。

## スタック

`plan.md` 冒頭の `stack:` 行が正とする。

- Next.js (App Router) + TypeScript
- Supabase (Postgres + Auth)
- Vercel デプロイ
- Biome（lint/format）
- GitHub Actions CI
- PostHog（分析）
- react-force-graph または Cytoscape.js（グラフ描画）
