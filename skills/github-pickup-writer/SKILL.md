---
name: github-pickup-writer
description: Publish one Japanese GitHub analysis article for a user-specified repository to C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base. Use when the user says things like "この repo を記事化して", "GitHub pickup を追加して", or gives a repository URL and wants one article added under the GitHub Watcher pickup flow.
---

# Github Pickup Writer

## Overview

Write one GitHub pickup article at a time.

Keep the site structure stable. Do not redesign layout or rename categories unless the user asks.

## Workflow

1. Read `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\AGENTS.md`.
2. Read `references/article-outline.md`.
3. Confirm the target repository or repository URL from the user request.
4. Resolve the target repository to the canonical GitHub URL after redirects, and normalize `repoName` to canonical `owner/repo` casing before writing anything.
5. Read `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json` and check whether the same canonical `repoName` / `repoUrl` is already published.
6. If the same repository is already published in `articles.json`, stop the task immediately, report the existing article's title and URL to the user in chat, and DO NOT create a new article or overwrite the existing one.
7. Read only the target repository page and the minimum extra material needed to explain what it is, and capture the current public GitHub star count.
8. Write one article in Japanese and save it under `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\articles\github\daily\`.
9. Append or replace one `category: "github-pickup"` entry in `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json` using the canonical `repoName` / `repoUrl`.
10. Assign the next GitHub serial number by reading existing `github-trending` and `github-pickup` entries and incrementing the largest `serial`. Do not consume `github-update-report` numbers.
11. Refresh `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\github-search-index.json` via `generate_github_search_index.py`.
12. Refresh `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\feed.xml` via `generate_rss.py` when the article list changes.
13. Verify links, dates, category, serial, relative paths, and obvious Japanese typos before finalizing.
14. Commit once and push once inside `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base`.

## Rules

- Publish exactly one repository per run.
- Use only the repository slug as the article title, without the owner name.
- Add a one-line plain-Japanese explainer immediately below the title.
- Store the same one-line explainer in `data/articles.json`.
- Use a concrete `meta description` that matches the article's actual dek or summary; avoid vague boilerplate such as "要点を整理した記事".
- `data/articles.json` にエントリを追加する際、以下のメタデータを必ず推論・設定してください。
  - `originType`: 常に `"pickup"` を設定。
  - `genre`: 記事の内容に基づいて以下の9分類から最も適切な日本語を1つ選定して設定します。 ["AIコーディング (CLI本体・拡張機能)", "AIコーディング (ワークフロー・プロンプト・開発補助ツール)", "AIエージェント (自律基盤・特化アプリ)", "AI基盤・データ基盤・業務アプリ", "金融・トレード分析", "メディア作成・マルチモーダル・UI", "ナレッジ管理・RAG解析", "スクレイピング・情報収集・セキュリティ", "学習ガイド・開発アセット"]
  - 分類は実装形態ではなく、読者が得る主価値で決めます。ブラウザやツールを自律操作する repo は `AIエージェント (自律基盤・特化アプリ)` を優先し、音声・画像・動画・UI 生成や処理が主価値なら `メディア作成・マルチモーダル・UI`、基盤モデル・データ基盤・業務アプリ寄りなら `AI基盤・データ基盤・業務アプリ` を優先します。
- Use `category: "github-pickup"` for the JSON entry.
- Save pickup articles under `articles/github/daily/`.
- Add `serial` to the JSON entry and show the shared GitHub serial in the article page.
- The shared GitHub serial is based only on `github-trending` and `github-pickup`; `github-update-report` uses a separate numbering line.
- Use `publishedAt`, `createdAt`, `repoName`, `repoUrl`, `articleUrl`, and `starCount` on every new entry.
- Add `Star数` to the article metadata grid alongside the existing date / type / target repo metadata.
- Use the back link to `../../github-trend.html`, not `../../index.html`.
- Include the target repository link in the article.
- If the pickup came from a user-provided source URL, include that source URL in the article too.
- Follow the repository rules in `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\AGENTS.md`.
- Keep the article short, concrete, and practical.
- Before finishing, do one quick proofreading pass for obvious wording slips or typos in Japanese.

## Output shape

- One article page under `articles/github/daily/`
- One matching JSON entry
- Refreshed `data/github-search-index.json`
- Refreshed `feed.xml` when applicable

## References

- Article outline: `references/article-outline.md`
