# GitHub Trend Journal

`C:\Users\sgmxk\Desktop\AI\codex\project\github-trending-zenn-pages` は、GitHub Trending の未記事 repo を毎朝 1 本ずつ記事化して載せるための極シンプルな GitHub Pages 用サイトです。

## 構成

- `index.html`: 最新記事と記事一覧だけを出すトップページ
- `styles.css`: 共通スタイル
- `app.js`: `data/articles.json` を読んで一覧を描画
- `data/articles.json`: 公開済み記事の一覧
- `articles/*.html`: 各記事ページ
- `.github/workflows/deploy-pages.yml`: push 時の Pages デプロイ

## 運用

自動 API 投稿ではなく、Codex に毎朝「今日の記事作って」と頼んで更新する前提です。  
daily 手順は `C:\Users\sgmxk\.codex\skills\github-trend-daily-writer` の skill に寄せます。

## ローカル確認

```powershell
cd C:\Users\sgmxk\Desktop\AI\codex\project\github-trending-zenn-pages
python -m http.server 4173
```

その後、`http://localhost:4173` を開く。
