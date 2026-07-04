# Plan — reading-tree（人文・社会科学 読書ロードマップ）
status: approved
stack: Next.js (App Router) + TypeScript + Supabase (Postgres + Auth) + Vercel。コード品質: Biome（lint/format）。CI/CD: GitHub Actions（Biome check + tsc --noEmit + test）+ Vercel Git連携（PRごとにプレビュー、mainマージで本番デプロイ）。ドメイン: 検証段階はVercel無料サブドメイン、反応が得られ次第独自ドメインへ切替。分析: PostHog（Cloud, 無料枠）。グラフ描画: react-force-graph or Cytoscape.js。
external_skills: なし

## T0: 大学シラバスからの経営学書籍リスト収集
- goal: 東京大学・京都大学・一橋大学・早稲田大学・慶應義塾大学・青山学院大学・東京理科大学・立教大学・明治大学ほか公開シラバスを持つ日本の主要大学（学士・修士・博士課程横断）から、経営学・MBA関連科目で使用されている書籍を収集しリスト化する
- files: data/university-syllabus-books.json
- acceptance: リストに重複除去済みで50件以上の書籍（書名・著者・出典大学/科目名を含む）が記録されている
- depends: なし
- skills: なし

## T1: プロジェクト初期化（Next.js + Biome + CI）
- goal: Next.js(TypeScript)プロジェクトを作成し、Biomeでlint/format設定、GitHubリポジトリを作成、GitHub ActionsでCIを設定する
- files: package.json, biome.json, tsconfig.json, .github/workflows/ci.yml, next.config.js
- acceptance: `npx biome check .` がエラーなく通り、PR作成時にGitHub Actions上のCIがgreenになる
- depends: なし
- skills: なし

## T2: Supabaseセットアップ（DBスキーマ・Auth）
- goal: Supabaseプロジェクトを作成し、books/fields/field_books/edges/proposalsテーブルを作成、Google OAuthを設定する
- files: supabase/migrations/0001_init.sql, .env.local.example
- acceptance: `supabase db push` 後、Supabase管理画面で5テーブルが確認でき、Google OAuthでテストログインができる
- depends: T1
- skills: なし

## T3: 書籍データ統合シード作成
- goal: books.csvとT0の大学シラバス書籍リストを統合し、重複を除去してSupabaseへ投入するシードスクリプトを作成する
- files: scripts/seed-books.ts
- acceptance: `npm run seed` 実行後、booksテーブルにbooks.csv由来+シラバス由来の書籍が重複なく登録され、登録件数がコンソールに出力される
- depends: T2, T0
- skills: なし

## T4: 経営学ツリー（初期データ）の手動作成
- goal: シードされた経営学関連書籍から、初級→中級→専門のレベル分けとedges（前提関係）を設定する
- files: scripts/seed-management-tree.ts
- acceptance: field_books, edgesテーブルに経営学分野のノードが最低30件・エッジが最低20件登録されている
- depends: T3
- skills: なし

## T5: ツリー/グラフ表示UI
- goal: 経営学分野のノード・エッジをグラフライブラリで描画するページを実装する
- files: app/fields/[slug]/page.tsx, components/BookGraph.tsx
- acceptance: `npm run dev` で `/fields/keieigaku` にアクセスするとノードとエッジが描画され、ノードクリックで書籍詳細（タイトル・著者・アフィリエイトリンク）がパネル表示される
- depends: T4
- skills: なし

## T6: Google OAuthログイン実装
- goal: Supabase AuthのGoogle OAuthでログイン・ログアウトができるようにする
- files: app/login/page.tsx, lib/supabase/client.ts, middleware.ts
- acceptance: 未ログインで保護ページにアクセスすると/loginへリダイレクトされ、Googleログイン後は元のページに戻る
- depends: T2
- skills: なし

## T7: 本の追加提案フォーム
- goal: ログインユーザーが本・依存関係の追加を提案できるフォームを実装し、proposalsテーブルにstatus=in_reviewで保存する
- files: app/fields/[slug]/propose/page.tsx, app/api/proposals/route.ts
- acceptance: フォーム送信後、proposalsテーブルに新規行が作成され、status='in_review'、proposer_idが送信者のuser idと一致する
- depends: T6
- skills: なし

## T8: 管理者レビュー画面（承認/却下）
- goal: 開発者本人のみアクセス可能な管理画面でproposalsをapprove/rejectでき、approve時にbooks/edgesへ反映する
- files: app/admin/proposals/page.tsx, app/api/admin/proposals/[id]/route.ts
- acceptance: admin以外のユーザーが/adminにアクセスすると403が返る。adminがapproveすると対象proposalのstatusがapprovedになり、books/edgesテーブルに反映される
- depends: T7
- skills: なし

## T9: アフィリエイトリンク生成
- goal: 書籍のISBNからAmazon/楽天のアフィリエイトタグ付きURLをサーバー側で生成する（ユーザー入力の任意URLは使わない）
- files: lib/affiliate.ts, lib/affiliate.test.ts
- acceptance: `npm test` で affiliate.test.ts が、同一ISBNに対し常に同一の正しいタグ付きURLを返すことを検証し全ケース通る
- depends: T3
- skills: なし

## T10: PostHog導入
- goal: PostHogをNext.jsに統合し、marketing-plan.mdで定義された計測イベント（page_view, cta_click_hero, cta_click_footer, tree_node_click, proposal_submitted, proposal_approved）をトラッキングする
- files: lib/posthog.ts, app/layout.tsx
- acceptance: ローカルで操作後、PostHogダッシュボードにpage_view, cta_click_hero, tree_node_click, proposal_submittedの4イベントが表示される
- depends: T1
- skills: なし

## T12: LPページ実装
- goal: marketing-plan.mdのLP要件に基づき、トップページをHero→デモ→共感→機能→比較表→Pricing→testimonial→フッターCTAの構成で実装し、実文コピーをそのまま反映する
- files: app/page.tsx, components/lp/Hero.tsx, components/lp/ComparisonTable.tsx, components/lp/Pricing.tsx
- acceptance: `npm run dev`で`/`にアクセスすると、Hero見出し「コンサル1年目の経営学、遠回りゼロで読む順番がわかる」とフッターCTA「今日から、経営学の迷子をやめる」の文字列がページ内に完全一致で存在し、CTAボタンクリックでcta_click_heroイベントが発火する
- depends: T5, T10
- skills: なし

## T11: Vercelデプロイ設定
- goal: GitHubリポジトリをVercelに連携し、mainブランチへのマージで自動デプロイ、PRごとにプレビュー環境が作られるようにする
- files: vercel.json（必要な場合のみ）
- acceptance: PR作成で自動的にプレビューURLが発行され、mainマージ後に本番URL（*.vercel.app）が更新される
- depends: T1
- skills: なし
