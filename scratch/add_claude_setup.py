import json
import os

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

articles = data.get('articles', [])

new_entry = {
    "category": "github-pickup",
    "originType": "pickup",
    "slug": "2026-05-05-lucasrosati-claude-code-memory-setup",
    "title": "claude-code-memory-setup",
    "dek": "「Claude Code の消費トークンを最大 71.5 分の 1 に」。Obsidian と Graphify を活用し、永続メモリとコードベースの知識グラフを構築する最適化ガイド。",
    "summary": "Claude Code の効率を最大化するため、Obsidian と Graphify を組み合わせて永続的なコードベース知識を構築するハックを紹介します。",
    "publishedAt": "2026-05-05",
    "createdAt": "2026-05-05T12:25:00Z",
    "repoName": "lucasrosati/claude-code-memory-setup",
    "repoUrl": "https://github.com/lucasrosati/claude-code-memory-setup",
    "starCount": 495,
    "articleUrl": "./articles/github/daily/2026-05-05-lucasrosati-claude-code-memory-setup.html",
    "serial": 429,
    "genre": "AIコーディング (ワークフロー・プロンプト・開発補助ツール)"
}

# Insert at Index 1 (after the report)
articles.insert(1, new_entry)

data['articles'] = articles

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated articles.json with claude-code-memory-setup pickup.")
