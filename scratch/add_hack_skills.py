import json
import os

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

articles = data.get('articles', [])

new_entry = {
    "category": "github-pickup",
    "originType": "pickup",
    "slug": "2026-05-05-yaklang-hack-skills",
    "title": "hack-skills",
    "dek": "「AI エージェントを、凄腕のハッカーへ」。脆弱性診断やペネトレーションテストの知識を AI が扱える形式で集約した、セキュリティ特化型ナレッジベース。",
    "summary": "AI エージェントが自律的にセキュリティ検証を行うためのナレッジベース「Hack Skills」の内容と、エージェントへの適用方法について紹介します。",
    "publishedAt": "2026-05-05",
    "createdAt": "2026-05-05T12:28:40Z",
    "repoName": "yaklang/hack-skills",
    "repoUrl": "https://github.com/yaklang/hack-skills",
    "starCount": 427,
    "articleUrl": "./articles/github/daily/2026-05-05-yaklang-hack-skills.html",
    "serial": 430,
    "genre": "スクレイピング・情報収集・セキュリティ"
}

# Insert at Index 1 (after the report, after the last pickup)
articles.insert(1, new_entry)

data['articles'] = articles

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated articles.json with hack-skills pickup.")
