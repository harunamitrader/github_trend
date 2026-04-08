# サイト規約 (Site Contract)

## 目的

`harunami_AI_base` サイトの既存の静的サイト構造を壊さずに、GitHub 記事セクションを管理・更新します。

## リポジトリパス

`C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base`

## 通常のデイリー実行で更新するファイル

- `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json`
- `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\github-search-index.json`
- `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\articles\github\daily\<date>-<slug>.html`
- `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\articles\github\reports\<date>-update-report.html`
- `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\feed.xml`

1回の実行で1〜5つの新しい記事ファイルが追加されます。
GitHub Watcher 本体の記事は `github-trending` と `github-pickup` が同じ serial 系列を共有します。
`github-update-report` は別カウントとして扱い、GitHub Watcher 本体の serial を消費しません。
`github-update-report` の serial は更新レポートだけの別通し番号で、`publishedAt` の古い順に 1 から採番します。

通常、デイリー実行では以下のファイルは編集しないでください：

- `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\index.html`
- `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\github-trend.html`
- `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\styles.css`
- `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\app.js`

## JSON 形式

`data/articles.json` には以下のキーが含まれます：

- `site`
- `articles`

各記事エントリ（`articles` 配下）には以下を含めます：

- `category`
- `slug`
- `title`
- `dek`
- `summary`
- `publishedAt`
- `repoName`
- `repoUrl`
- `articleUrl`

同じ公開日内の順序が重要な場合は `createdAt` を追加してください。
`github-update-report` は同日重複を作らず、既存の同日エントリを更新します。

JSON 記述に関する期待事項：

- `title` はオーナー名を含まないリポジトリ名（slug）のみを使用します
- `dek` は記事ページに表示される1行説明と一致させます
- `summary` は `dek` よりも長く、または具体的な内容にします
- `articleUrl` は `articles/github/` 配下の実際のファイルパスと一致させる必要があります
- `github-update-report` の `articleUrl` は `./articles/github/reports/` を使います
- カテゴリのセマンティクスは `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\AGENTS.md` のリポジトリルールと互換性を保ちます

## ファイル名の命名規則

以下を使用してください：

- `daily` 記事: `YYYY-MM-DD-owner-repo.html`
- `reports` 記事: `YYYY-MM-DD-update-report.html`

例：

- `2026-04-01-vas3k-taxhacker.html`

## 記事パスの命名規則

`data/articles.json` では以下のように保存します：

- `github-trending` / `github-pickup`: `./articles/github/daily/YYYY-MM-DD-owner-repo.html`
- `github-update-report`: `./articles/github/reports/YYYY-MM-DD-update-report.html`

## HTML 規約

- 記事内のアセットパスは以下を使用します：
  - `../../favicon.svg`
  - `../../styles.css`
- GitHub 記事の「戻る」リンクは以下を指すようにします：
  - `../../github-trend.html`

## RSS

`data/articles.json` が変更された場合は、以下を実行して RSS を再生成します：

- `python generate_rss.py`

実行ディレクトリ：

- `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base`

## 検索インデックス

GitHub 系記事の検索用データは以下で管理します：

- `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\github-search-index.json`

GitHub 記事や更新レポートが変わった場合は、以下を実行して再生成します：

- `python generate_github_search_index.py`

## Git ステップ

以下のディレクトリで Git コマンドを実行します：

- `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base`

手順：

1. `git status --short`
2. `git add data/articles.json articles/github/... feed.xml`
3. `git commit -m "..."`
4. `git push`

ユーザーから依頼がない限り、古い記事の書き換えは行いません。
Trending ページ全体を見ても未作成のリポジトリがない場合は、ファイルの編集やコミットは行いません。

## アップデートレポート形式

- 参照テンプレート:
  `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\articles\github\reports\2026-04-05-update-report.html`
- `eyebrow` は `Update Report`
- `dek` は `本日調査したGitHubトレンドの全順位と、新規作成された記事のまとめ`
- 本文は以下の2見出しを基本とします:
  - `本日の調査ランキング（全件）`
  - `今後の展望`
- `本日の調査ランキング（全件）` には、https://github.com/trending に表示されている**全順位**をそのまま順番どおり掲載します。
- ランキング内で `✅ 記事作成済み` または `✨ 新規追加` とする項目は、repo 名そのものを対応記事へのリンクにします。
