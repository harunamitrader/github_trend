# GitHub Trending Zenn-style Page

`C:\Users\sgmxk\Desktop\AI\codex\project\github-trending-zenn-pages` は、2026-03-24 時点の GitHub Trending を題材にした静的ページです。

## ファイル

- `index.html`: ページ本体
- `styles.css`: Zenn 風の見た目
- `app.js`: ランキングデータと描画処理
- `favicon.svg`: アイコン

## ローカル確認

PowerShell 例:

```powershell
cd C:\Users\sgmxk\Desktop\AI\codex\project\github-trending-zenn-pages
python -m http.server 4173
```

その後、`http://localhost:4173` を開く。

## GitHub Pages で公開する方法

1. このディレクトリの内容を公開用 GitHub リポジトリへ push する
2. GitHub の Settings > Pages を開く
3. Branch を `main`、Folder を `/ (root)` または `docs` に設定する
4. 保存後、公開 URL に反映される

## 注意

- ランキング内容は 2026-03-24 のスナップショット
- 後日同じ URL を見ても順位や掲載リポジトリは変わる
