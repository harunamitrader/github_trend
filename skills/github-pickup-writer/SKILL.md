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
4. Read `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json` and check whether the same `repoName` is already published as pickup content.
5. Read only the target repository page and the minimum extra material needed to explain what it is.
6. Write one article in Japanese and save it under `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\articles\github\daily\`.
7. Append one `category: "github-pickup"` entry to `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json`.
8. Assign the next GitHub serial number by reading existing `github-trending` and `github-pickup` entries and incrementing the largest `serial`. Do not consume `github-update-report` numbers.
9. Refresh `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\github-search-index.json` via `generate_github_search_index.py`.
10. Refresh `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\feed.xml` via `generate_rss.py` when the article list changes.
11. Verify links, dates, category, serial, relative paths, and obvious Japanese typos before finalizing.
12. Commit once and push once inside `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base`.

## Rules

- Publish exactly one repository per run.
- Use only the repository slug as the article title, without the owner name.
- Add a one-line plain-Japanese explainer immediately below the title.
- Store the same one-line explainer in `data/articles.json`.
- Use a concrete `meta description` that matches the article's actual dek or summary; avoid vague boilerplate such as "要点を整理した記事".
- `data/articles.json` にエントリを追加する際、以下のメタデータを必ず推論・設定してください。
  - `originType`: 常に `"pickup"` を設定。
  - `genre`: 記事の内容に基づいて以下の9分類から最も適切な日本語を1つ選定して設定します。 ["AIコーディング (CLI本体・拡張機能)", "AIコーディング (ワークフロー・プロンプト・開発補助ツール)", "AIエージェント (自律基盤・特化アプリ)", "金融・トレード分析", "メディア作成・Web生成 (動画・画像・UI)", "ナレッジ管理・RAG解析", "スクレイピング・情報収集・セキュリティ", "汎用アプリ・AI基盤・IoT", "学習ガイド・開発アセット"]
- Use `category: "github-pickup"` for the JSON entry.
- Save pickup articles under `articles/github/daily/`.
- Add `serial` to the JSON entry and show the shared GitHub serial in the article page.
- The shared GitHub serial is based only on `github-trending` and `github-pickup`; `github-update-report` uses a separate numbering line.
- Use `publishedAt`, `createdAt`, `repoName`, `repoUrl`, and `articleUrl` on every new entry.
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
