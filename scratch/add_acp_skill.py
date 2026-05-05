import json
import os

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

articles = data.get('articles', [])

new_entry = {
    "category": "github-pickup",
    "originType": "pickup",
    "slug": "2026-05-06-rainhoole-hermes-agent-acp-skill",
    "title": "hermes-agent-acp-skill",
    "dek": "「エージェントが、他のエージェントを指揮する」。Hermes, Codex, Claude Code を連携させ、マルチエージェント間の高度なタスク委譲を実現するスキルセット。",
    "summary": "複数の AI エージェントを連携させてタスクを委譲・調整するための Hermes 向けスキル「hermes-agent-acp-skill」の概要と特徴をまとめました。",
    "publishedAt": "2026-05-06",
    "createdAt": "2026-05-06T00:30:00Z",
    "repoName": "Rainhoole/hermes-agent-acp-skill",
    "repoUrl": "https://github.com/Rainhoole/hermes-agent-acp-skill",
    "starCount": 13,
    "articleUrl": "./articles/github/daily/2026-05-06-rainhoole-hermes-agent-acp-skill.html",
    "serial": 433,
    "genre": "AIエージェント (自律基盤・特化アプリ)"
}

# Insert at Index 0 (since it's a new day, or Index 1 if there's a report)
# Let's see if there's a 2026-05-06 report. Likely not yet.
articles.insert(0, new_entry)

data['articles'] = articles

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated articles.json with hermes-agent-acp-skill pickup.")
