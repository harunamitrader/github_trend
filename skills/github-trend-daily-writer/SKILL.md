---
name: github-trend-daily-writer
description: GitHub Trendingから日次の日本語分析記事を公開し、C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base のGitHub Pagesリポジトリを更新します。ユーザーが「トレンドの更新」「GitHubランキングの記事化」などを求めた場合に使用します。Trendingを読み込み、data/articles.jsonにある既存記事と比較して、ページに掲載されている全リポジトリの中から未作成のリポジトリを最大5つ選択して記事化します。各記事を「GitHub Watcher」形式で作成し、インデックスデータとfeed.xmlを更新します。
---
# Github Trend Daily Writer

## Overview

1リクエストにつき最大5つの新しいGitHubリポジトリ紹介記事を公開します。
サイト構造を安定させ、ユーザーの指示がない限りレイアウトやカテゴリを変更しないでください。

## Workflow

1. `references/site-contract.md` を確認します。
2. GitHub Trending を最新の情報源として読み込み、**https://github.com/trending のページに掲載されているすべての順位・リポジトリ**をリストアップします。
3. `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json` を読み込みます。
4. 取得したすべてのTrendingリポジトリについて、GitHub 上で最終的に開かれる canonical なリポジトリ URL を確認し、`owner/repo` 形式の正規化済み `repoName` と `repoUrl` を確定します。
5. その canonical な `repoName` / `repoUrl` を既存エントリと比較します。同じリポジトリが既にある場合は重複記事を増やさず、必要なら**最新記事を残して古い重複を置き換える**前提で扱います。
6. ページ上の全順位の中から、未作成のリポジトリを**順位順に最大5つ**選びます。
7. 記事の作成順は、選定後に**下位順位のものから先に**進めます。これにより、あとから追加される上位順位の記事が一覧上で上に並びやすくなります。
8. ページ上のすべてのリポジトリを調査しても未作成がない場合は、コンテンツの変更は行いません。
9. 各リポジトリについて、GitHub MCPやAPI（`.env` のトークン等）を利用して正確な `stargazers_count`（整数）と `README.md` などの基本情報を高速に取得し、内容を把握します。ブラウザエージェントでの巡回は時間がかかるため避け、APIによる一括・高速なデータ収集を優先してください。
10. `references/article-outline.md` に従い、日本語で記事を執筆します。形式は **GitHub Watcher** スタイルを厳守します。
11. 新しい記事を `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\articles\github\daily\` に保存します。
12. `data/articles.json` には canonical な `repoName` / `repoUrl` を使って新規追加または既存重複の置き換えを行います。
13. 既存の `github-trending` と `github-pickup` を読み込み、最大の `serial` をインクリメントして GitHub Watcher 本体記事の新しい通し番号を割り当てます。
14. 1つ以上の新しい記事が作成された場合、同日のアップデートレポート記事を `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\articles\github\reports\YYYY-MM-DD-update-report.html` に作成または更新します。
15. `data/articles.json` に `category: "github-update-report"` のエントリを追加または更新します。アップデートレポートは GitHub Watcher 本体とは別カウントとして扱い、同日の重複エントリを作らないでください。
15. 記事リストが変更されたら、`generate_github_search_index.py` を実行して `data/github-search-index.json` を更新します。
16. 記事リストが変更されたら、`generate_rss.py` を実行して `feed.xml` を更新します。
17. リンク、日付、カテゴリ、シリアル番号、相対パスを検証します。
18. `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base` 内でコミットとプッシュを1回ずつ行います。

## Rules

- 未作成のリポジトリのうち、順位が高いものを優先します。
- 記事化対象を決めた後の実際の執筆順は、選ばれた集合の中で下位順位から開始します。
- 公開後の見え方では、同日の上位順位の記事が上に来る状態を保ちます。
- https://github.com/trending のページに表示されている順位は、件数に関わらずすべて調査対象とします。
- アップデートレポートには、https://github.com/trending にその時点で表示されている**全順位**を掲載します。上位だけに省略しないでください。
- 1回の実行で作成する新規記事は最大5つまでです。
- 記事のメタデータとファイル名には現在の日付を使用します。
- **記事の形式（GitHub Watcherスタイル）**:
  - `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\templates\github-daily.template.html` のテンプレートを必ず使用してください。
  - テンプレート内の `{{変数名}}` を適切な値に置換して使用します。
  - 記事の各セクション（これは何か、等）以外の構成は変更しないでください。
- 記事のタイトルには、オーナー名を含まないリポジトリ名（slug）のみを使用します。
- タイトルの直下に、1行の簡潔な日本語説明を `<p class="article-dek">` で追加します。
- `data/articles.json` にも同じ1行説明を保存します。また、以下の新しいメタデータ項目を必ず推論・設定してください。
  - `originType`: 常に `"trending"` を設定。
  - `rank`: トレンドの順位（整数）を設定。
  - `genre`: 記事の内容に基づいて以下の9分類から最も適切な日本語を1つ選定して設定します。 ["AIコーディング (CLI本体・拡張機能)", "AIコーディング (ワークフロー・プロンプト・開発補助ツール)", "AIエージェント (自律基盤・特化アプリ)", "AI基盤・データ基盤・業務アプリ", "金融・トレード分析", "メディア作成・マルチモーダル・UI", "ナレッジ管理・RAG解析", "スクレイピング・情報収集・セキュリティ", "学習ガイド・開発アセット"]
  - 分類は実装形態ではなく、読者が得る主価値で決めます。ブラウザやツールを自律操作する repo は `AIエージェント (自律基盤・特化アプリ)` を優先し、音声・画像・動画・UI 生成や処理が主価値なら `メディア作成・マルチモーダル・UI`、基盤モデル・データ基盤・業務アプリ寄りなら `AI基盤・データ基盤・業務アプリ` を優先します。
- GitHub Watcher 本体の記事と `data/articles.json` には、取得した現在の GitHub star 数を `starCount`（整数）として必ず保存します。
- このワークフローで作成されるすべてのエントリに `category: "github-trending"` を使用します。
- トレンド記事は `articles/github/daily/`、アップデートレポートは `articles/github/reports/` に保存します。
- `github-trending` と `github-pickup` は GitHub Watcher 本体として同じ通し番号系列を共有します。
- `github-update-report` は別カウントとして扱い、GitHub Watcher 本体の通し番号を消費しません。
- 新規に付与する `serial` は、既存の `github-trending` と `github-pickup` の中で最も大きい番号の次を使います。
- `github-update-report` の `serial` は更新レポートだけの別通し番号です。既存レポートを `publishedAt` の古い順に見て、次の番号を使ってください。
- 新規記事が追加された場合、必ず同日の `github-update-report` を作成・更新します。
- GitHub 記事の追加・更新後は、`data/github-search-index.json` も必ず再生成します。
- **アップデートレポートの形式**:
  - `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\templates\github-report.template.html` のテンプレートを必ず使用してください。
  - ランキングの出力はテンプレート内の例に従い、`<ol>` リスト内に作成します。
  - 記事があるもの（既存・新規）については、必ず記事へのリンクを付与してください。
- 新規記事が追加されなかった場合は、レポートの作成は行いません。
- カテゴリ、メタデータの形状、バックリンクの挙動については `AGENTS.md` のルールに従います。
- 記事リストの管理は `data/articles.json` のみで行います。
- 記事ファイルは `articles/github/` 以下に保存します。
- GitHub Pagesが正常に動作しない場合は、原因を説明してください。

## Site Tab Structure (as of 2026-04-19)

The GitHub Watcher page (`github-trend.html`) has **3 tabs**:
| Tab label | data-cat | 説明 |
|---|---|---|
| カテゴリ一覧 | `github-articles` | カテゴリ別アコーディオン表示（旧「記事一覧」） |
| 全記事一覧 | `github-all-articles` | 全記事を `serial` 降順でフラット表示。新規記事は自動で最上位に現れる |
| 更新レポート | `github-update-report` | この daily writer が生成するレポート |

Do **not** rename or remove these tabs without a user instruction.

## Output shape

- `articles/github/daily/` 配下に1〜5つの記事ページ
- 該当する場合、`articles/github/reports/` 配下の同日アップデートレポートページ1つ
- 対応する新しいJSONエントリ（正しい `serial`、`genre`、`originType: "trending"` を含む）
- 更新された `data/github-search-index.json`
- 更新された `feed.xml`

## References

- サイト規約: `references/site-contract.md`
- 記事構成案: `references/article-outline.md`
