# harunami AI base

`C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base` は、GitHub Watcher と AI Tool Log をまとめて運用する GitHub Pages 用サイトです。

## 構成

- `index.html`: 全体トップ
- `github-trend.html`: GitHub Watcher 一覧
- `ai-tools-monitor.html`: AI Tool Log 一覧
- `styles.css`: 共通スタイル
- `app.js`: `data/articles.json` を読んで一覧を描画
- `data/articles.json`: 公開済み記事の一覧
- `articles\github\*.html`: GitHub Watcher 記事
- `articles\tools\*.html`: AI Tool Log 記事
- `.github/workflows/deploy-pages.yml`: push 時の Pages デプロイ

## 運用

自動 API 投稿ではなく、必要なときに AI へ依頼して更新する前提です。

- スキル正本: `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\skills`
- GitHub daily: `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\skills\github-trend-daily-writer\SKILL.md`
- GitHub pickup: `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\skills\github-pickup-writer\SKILL.md`
- AI tools all: `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\skills\ai-tools-monitor\SKILL.md`
- AI tools coding: `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\skills\ai-tools-coding-monitor\SKILL.md`
- AI tools others: `C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\skills\ai-tools-others-monitor\SKILL.md`

Codex では `C:\Users\sgmxk\.codex\skills` にある薄いラッパー経由でも使えるが、内容の正本は repo 側を優先する。

## ローカル確認

```powershell
cd C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base
python -m http.server 4173
```

その後、`http://localhost:4173` を開く。
