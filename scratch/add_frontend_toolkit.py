import json
import os

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

articles = data.get('articles', [])

new_entry = {
    "category": "github-pickup",
    "originType": "pickup",
    "slug": "2026-05-05-wilwaldon-Claude-Code-Frontend-Design-Toolkit",
    "title": "Claude-Code-Frontend-Design-Toolkit",
    "dek": "「Claude Code に、プロ級のデザインセンスを」。フロントエンド開発の質を劇的に向上させるためのスキル、MCP、CLAUDE.md 設定を集約した総合ツールキット。",
    "summary": "Claude Code のフロントエンド出力品質を向上させるためのリソース集「Claude-Code-Frontend-Design-Toolkit」の概要と活用法をまとめました。",
    "publishedAt": "2026-05-05",
    "createdAt": "2026-05-05T15:16:00Z",
    "repoName": "wilwaldon/Claude-Code-Frontend-Design-Toolkit",
    "repoUrl": "https://github.com/wilwaldon/Claude-Code-Frontend-Design-Toolkit",
    "starCount": 106,
    "articleUrl": "./articles/github/daily/2026-05-05-wilwaldon-Claude-Code-Frontend-Design-Toolkit.html",
    "serial": 431,
    "genre": "AIコーディング (ワークフロー・プロンプト・開発補助ツール)"
}

# Insert at Index 1 (after the report, before other pickups of today)
articles.insert(1, new_entry)

data['articles'] = articles

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated articles.json with frontend design toolkit pickup.")
