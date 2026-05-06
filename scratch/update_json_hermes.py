import json
import os

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_entry = {
    "category": "github-pickup",
    "originType": "pickup",
    "slug": "2026-05-07-ekkolearnai-hermes-web-ui",
    "title": "hermes-web-ui",
    "dek": "AI エージェントをブラウザから完全制御。Telegram や Discord など多プラットフォーム連携を統合管理する、Hermes Agent 専用の高機能ダッシュボード。",
    "summary": "自律型 AI エージェント「Hermes Agent」を視覚的に管理できる高機能 Web ダッシュボード「hermes-web-ui」を調査。Telegram、Discord、Slack 等の多プラットフォーム連携を一元化し、リアルタイムチャットやジョブ管理を GUI で提供する「エージェントの司令塔」の実力を解説します。",
    "publishedAt": "2026-05-07",
    "createdAt": "2026-05-07T05:12:00+09:00",
    "repoName": "EKKOLearnAI/hermes-web-ui",
    "repoUrl": "https://github.com/EKKOLearnAI/hermes-web-ui",
    "starCount": 3712,
    "articleUrl": "./articles/github/daily/2026-05-07-ekkolearnai-hermes-web-ui.html",
    "serial": 459,
    "genre": "AIエージェント (自律基盤・特化アプリ)"
}

data['articles'].insert(0, new_entry)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Successfully updated articles.json with hermes-web-ui")
