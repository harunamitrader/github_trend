import json
import os

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_entry = {
    "category": "github-pickup",
    "originType": "pickup",
    "slug": "2026-05-07-anthropics-cwc-long-running-agents",
    "title": "cwc-long-running-agents",
    "dek": "エージェントを「止まらないエンジニア」へ。長時間・多セッションにわたる複雑なタスクを Claude に完遂させるための、Anthropic 公式ハーネス実装例。",
    "summary": "複雑な開発プロジェクトを AI エージェントに長時間自律遂行させるための公式ハーネス実装「cwc-long-running-agents」を調査。Git 履歴や進捗ノートを活用したセッション引き継ぎ、評価用エージェントによる自己検証など、Claude の能力を極限まで引き出す規律あるワークフローを解説します。",
    "publishedAt": "2026-05-07",
    "createdAt": "2026-05-07T09:47:00+09:00",
    "repoName": "anthropics/cwc-long-running-agents",
    "repoUrl": "https://github.com/anthropics/cwc-long-running-agents",
    "starCount": 29,
    "articleUrl": "./articles/github/daily/2026-05-07-anthropics-cwc-long-running-agents.html",
    "serial": 462,
    "genre": "AIエージェント (自律基盤・特化アプリ)"
}

data['articles'].insert(0, new_entry)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Successfully updated articles.json with cwc-long-running-agents")
