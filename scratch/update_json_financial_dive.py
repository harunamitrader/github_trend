import json
import os

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_entry = {
    "category": "github-pickup",
    "originType": "pickup",
    "slug": "2026-05-07-anthropics-financial-services-deep-dive",
    "title": "[Deep Dive] financial-services",
    "dek": "Claude for Financial Services: 徹底解剖。Managed Agents と MCP が切り拓く金融実務の未来。",
    "summary": "Anthropic 公式の金融エージェント基盤「financial-services」を技術的に深掘り。オーケストレーターとワーカーによるマルチエージェント設計、MCP による外部データ連携、そして専門スキルの実装詳細など、実務への AI 導入に不可欠なエッセンスを詳説します。",
    "publishedAt": "2026-05-07",
    "createdAt": "2026-05-07T15:25:00+09:00",
    "repoName": "anthropics/financial-services",
    "repoUrl": "https://github.com/anthropics/financial-services",
    "starCount": 8933,
    "articleUrl": "./articles/github/details/2026-05-07-anthropics-financial-services-deep-dive.html",
    "serial": 465,
    "genre": "AIエージェント (自律基盤・特化アプリ)"
}

data['articles'].insert(0, new_entry)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Successfully updated articles.json with financial-services deep dive")
