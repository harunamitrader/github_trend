import json
import os

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

articles = data.get('articles', [])

new_entry = {
    "category": "github-pickup",
    "originType": "pickup",
    "slug": "2026-05-05-h4ckf0r0day-obscura",
    "title": "obscura",
    "dek": "「AI エージェントに、自由なブラウジングを」。スクレイピングと AI エージェントの自律操作に特化した、高速・高機能なヘッドレスブラウザ CLI。",
    "summary": "AI エージェントやウェブスクレイピングのために設計された、強力なヘッドレスブラウザの CLI およびサーバー「Obscura」の機能と活用方法についてまとめました。",
    "publishedAt": "2026-05-05",
    "createdAt": "2026-05-05T06:05:00Z",
    "repoName": "h4ckf0r0day/obscura",
    "repoUrl": "https://github.com/h4ckf0r0day/obscura",
    "starCount": 10060,
    "articleUrl": "./articles/github/daily/2026-05-05-h4ckf0r0day-obscura.html",
    "serial": 428,
    "genre": "スクレイピング・情報収集・セキュリティ"
}

# Insert after the report (Index 0) or just at Index 1
articles.insert(1, new_entry)

data['articles'] = articles

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated articles.json with obscura pickup.")
