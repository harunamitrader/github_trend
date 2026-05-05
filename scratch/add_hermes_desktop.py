import json
import os

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

articles = data.get('articles', [])

new_entry = {
    "category": "github-pickup",
    "originType": "pickup",
    "slug": "2026-05-05-dodo-reach-hermes-desktop",
    "title": "hermes-desktop",
    "dek": "「Hermes エージェントを、もっと安全・シンプルに」。macOS から SSH 経由で直接エージェントを管理可能な、ネイティブデスクトップアプリ。",
    "summary": "Hermes エージェントを macOS から安全に管理するためのネイティブアプリ「Hermes Desktop」の概要と、SSH 接続によるセキュアな運用のメリットについてまとめました。",
    "publishedAt": "2026-05-05",
    "createdAt": "2026-05-05T20:33:00Z",
    "repoName": "dodo-reach/hermes-desktop",
    "repoUrl": "https://github.com/dodo-reach/hermes-desktop",
    "starCount": 909,
    "articleUrl": "./articles/github/daily/2026-05-05-dodo-reach-hermes-desktop.html",
    "serial": 432,
    "genre": "AIエージェント (自律基盤・特化アプリ)"
}

# Insert at Index 1 (after the report, before other pickups of today)
articles.insert(1, new_entry)

data['articles'] = articles

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated articles.json with hermes-desktop pickup.")
