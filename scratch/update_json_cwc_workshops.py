import json
import os

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_entry = {
    "category": "github-pickup",
    "originType": "pickup",
    "slug": "2026-05-07-anthropics-cwc-workshops",
    "title": "cwc-workshops",
    "dek": "Claude と共に次世代のエージェントを創る。Anthropic 公式ワークショップ「Code with Claude」のハンズオン教材・実践モジュール集。",
    "summary": "Anthropic 公式ワークショップ「Code with Claude」の教材リポジトリを調査。プロンプトの分解手法、MCP によるツール連携、エージェントの性能評価など、高度な AI アシスタントを構築するための実践的な知見とハンズオンの内容を解説します。",
    "publishedAt": "2026-05-07",
    "createdAt": "2026-05-07T15:20:00+09:00",
    "repoName": "anthropics/cwc-workshops",
    "repoUrl": "https://github.com/anthropics/cwc-workshops",
    "starCount": 1515,
    "articleUrl": "./articles/github/daily/2026-05-07-anthropics-cwc-workshops.html",
    "serial": 464,
    "genre": "学習ガイド・開発アセット"
}

data['articles'].insert(0, new_entry)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Successfully updated articles.json with cwc-workshops")
