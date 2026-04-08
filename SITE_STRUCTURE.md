# harunami AI base — サイト構成・変更サマリー

> Antigravityスキル作成用リファレンス。サイトの現在の構成・監視対象・変更履歴をまとめる。

## ⚠️ ファイル編集時の注意（必読）
## 6. デプロイメント (Deployment)
- **環境**: GitHub Pages (`https://harunami-trader.github.io/harunami_AI_base/`)
- **トリガー**: `origin main` への Git Push。
- **デプロイ対象ブランチ**: `gh-pages` が存在する場合、そのブランチの更新により本番が反映される。
- **反映の必須条件**: 修正コミット後は必ず `git push origin main`（および必要に応じて `git push origin main:gh-pages --force`）までを実行し、ビルドの成功を確認すること。
- **キャッシュ回避**: `github-trend.html` 等の動的データ取得ページでは、`articles.json?t=${Date.now()}` クオリティによるキャッシュバイパスを行う。

**全ファイルはUTF-8（BOMなし）で保存されています。**
ファイルの読み書きは必ずUTF-8を明示的に指定すること。BOMを付けないこと。

```python
# Python
with open('file.html', 'r', encoding='utf-8') as f: ...
with open('file.html', 'w', encoding='utf-8') as f: ...
# NG: encoding='utf-8-sig'  ← BOMが付いて文字化けする
```

```js
// Node.js
fs.readFileSync('file.html', 'utf-8')
fs.writeFileSync('file.html', content, 'utf-8')
```

過去に encoding 未指定でファイルを書き直した際、全日本語テキストが Mojibake になった（Shift-JIS/CP932誤認識）。

---

## フォルダ構成

```
harunami_ai_base/
├── index.html              # Home
├── github-trend.html       # GitHub Watcher
├── ai-tools-monitor.html   # AI Tool Log
├── my-tools.html           # My Project
├── links.html              # AI Bookmark
├── styles.css              # 共通スタイル
├── app.js                  # 記事レンダリング（articles.json読込）
├── favicon.svg
├── SITE_STRUCTURE.md       # このファイル
├── data/
│   └── articles.json       # 全記事メタデータ（category・articleUrl含む）
└── articles/
    ├── github/             # GitHub Trending解析記事
    │   └── 2026-03-24-*.html  (6記事)
    ├── tools/              # AIツール更新要約記事
    │   └── 2026-03-*.html     (21記事)
    └── other/              # その他（現在空）
```

---

## ページ構成

| ファイル | タイトル | body class | テーマカラー |
|---------|---------|------------|------------|
| index.html | Home | `theme-home` | #1e293b（濃グレー）|
| github-trend.html | GitHub Watcher | `theme-github` | #0969da（青）|
| ai-tools-monitor.html | AI Tool Log | `theme-aitools` | #7c3aed（紫）|
| my-tools.html | My Project | `theme-project` | #059669（緑）|
| links.html | AI Bookmark | `theme-bookmark` | #d97706（オレンジ）|

---

## ナビゲーション仕様

- 全5タブをpillボタン形式で横並び（`flex: 1` で均等幅）
- 各タブに固有色（選択前・後ともに着色）
- 選択時：太字 + 下線 + 白背景 + ドロップシャドウ
- 非選択時：薄い角丸枠あり
- モバイル：はみ出しなし（`flex: 1` + 小フォント）

---

## AI Tool Log — 監視対象ツール一覧

`ai-tools-monitor.html` に記載。記事は `articles/tools/` に格納。

| ツールID | ツール名 | 監視先 | 監視方法 |
|---------|---------|--------|---------|
| `tool-claudecode` | ClaudeCode | https://github.com/anthropics/claude-code/releases | GitHub Releases |
| `tool-antigravity` | Antigravity | 公式Changelog | Official Changelog |
| `tool-cursor` | Cursor | https://cursor.com/changelog | Web Scraping |
| `tool-windsurf` | Windsurf | https://codeium.com/windsurf | Web Scraping |
| `tool-cline` | Cline | https://github.com/cline/cline/releases | GitHub API |
| `tool-geminicli` | Gemini CLI | https://github.com/google/gemini-cli/releases | GitHub Atom Feed |
| `tool-copilot` | GitHub Copilot | https://github.blog/changelog | Changelog Feed |
| `tool-codex` | Codex | https://openai.com/blog | OpenAI Blog |
| `tool-openclaw` | OpenClaw | https://github.com/openclaw/openclaw/releases | GitHub Releases |
| `tool-chatgpt` | ChatGPT | https://openai.com/blog | OpenAI Blog |
| `tool-gemini` | Gemini | https://blog.google | Google Blog |
| `tool-claude` | Claude | https://anthropic.com/blog | Anthropic Blog |
| `tool-grok` | Grok | https://x.ai/blog | xAI Blog |
| `tool-grokcli` | Grok CLI | https://github.com/superagent-ai/grok-cli/blob/main/CHANGELOG.md | GitHub CHANGELOG.md |
| `tool-perplexity` | Perplexity | https://perplexity.ai | 公式サイト |
| `tool-aistudio` | Google AI Studio | https://blog.google | Google Blog |
| `tool-notebooklm` | NotebookLM | https://blog.google/technology/ai/notebooklm-updates/ | Google Blog |
| `tool-obsidian` | Obsidian | https://obsidian.md/changelog | 公式サイト |

---

## ツールインデックス（ジャンプバー）仕様

`ai-tools-monitor.html` の `.tool-index` セクション。

- 各ツールに `data-latest="YYYY-MM-DD"` 属性
- JavaScriptで最終更新日の新しい順に自動ソート（毎ページロード時）
- 7日以内の更新は緑色ハイライト（`.recent` クラス）
- 未確認ツールは `data-latest=""` → リストの最後尾に並ぶ

### ツールカードを追加する手順

1. `.tool-index` に `<a>` 要素を追加（`href="#tool-xxx"`, `data-latest="YYYY-MM-DD"`）
2. `.tool-grid` にツールカード `<div id="tool-xxx" class="tool-card card-xxx">` を追加
3. `styles.css` に `.card-xxx` のアクセントカラーを追加
4. 必要に応じて記事を `articles/tools/` に追加し `articles.json` を更新

---

## articles.json 構造

```json
{
  "site": { "title": "...", "repoUrl": "..." },
  "articles": [
    {
      "category": "ai-tool-log" | "github-trending",
      "slug": "YYYY-MM-DD-tool-version",
      "title": "...",
      "dek": "...",
      "summary": "...",
      "publishedAt": "YYYY-MM-DD",
      "createdAt": "YYYY-MM-DDTHH:mm:ss+09:00",
      "repoName": "owner/repo",
      "repoUrl": "https://...",
      "articleUrl": "./articles/tools/YYYY-MM-DD-xxx.html"
                  | "./articles/github/daily/YYYY-MM-DD-xxx.html"
    }
  ]
}
```

- `category: "ai-tool-log"` → `articleUrl`: `./articles/tools/`
- `category: "github-trending"` → `articleUrl`: `./articles/github/daily/`
- `category: "github-update-report"` → `articleUrl`: `./articles/github/daily/`
- `category: "github-pickup"` → `articleUrl`: `./articles/github/daily/`
- `createdAt` は同日内の並び順を決める記事作成時刻（ISO 8601）として使う
- `serial` は GitHub Watcher 本体記事である `github-trending` と `github-pickup` が共有する通し番号
- `github-update-report` は別カウントとして扱い、GitHub Watcher 本体の通し番号を消費しない

---

## GitHub Watcher — タブ構成

`github-trend.html` に2タブ。

| タブID | 表示名 | 内容 |
|-------|--------|------|
| `tab-trending` | GitHub Trending | 自動解析記事（`category: "github-trending"`）|
| `tab-pickup` | ピックアップ | 手動で気になったGitHub記事 |

### GitHub Watcher の並び順

- 第1キー: `publishedAt` 降順
- 第2キー: 同日内は `createdAt` 降順
- `rank` は表示用であり、並び順の主キーには使わない

---

## 記事HTMLファイルの構造

各記事は `articles/tools/` と `articles/github/daily/` に格納。

相対パスの基準（3階層上がルート）:
```html
<link rel="icon" href="../../../favicon.svg" />
<link rel="stylesheet" href="../../../styles.css" />
<a class="article-back" href="../../../github-trend.html">← 記事一覧へ戻る</a>
```

---

## 今回の主な変更履歴（2026-03-25〜26）

### 新規追加ツール（監視対象）
- OpenClaw, ChatGPT, Gemini, Claude, Grok, Grok CLI, Perplexity
- Google AI Studio, NotebookLM, Obsidian
- ※ Genspark は削除済み

### ページデザイン変更
- 全ページにテーマカラー（hero背景 + タブ文字色）
- ナビゲーションをpillボタン形式に刷新（各タブ固有色）
- AI Tool Log にツールジャンプインデックス追加
- GitHub Watcher に「Trending / ピックアップ」タブ追加
- モバイルデザイン刷新（エッジtoエッジカード）

### フォルダ構成変更
- `articles/` → `articles/github/daily/` + `articles/tools/` + `articles/other/`
- `articles.json` の GitHub 系 `articleUrl` を新パスに更新済み
- 各 GitHub 記事HTMLの相対パスを `../../` → `../../../` に更新済み
