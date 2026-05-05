import json
import os

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

articles = data.get('articles', [])

new_entry = {
    "category": "ai-tool-log",
    "originType": "tool-log",
    "slug": "2026-05-06-ai-others-tools-multi-update",
    "title": "AI Tools Others Update: Claude Opus 4.7 for Finance, Gemini API Webhooks, and ChatGPT Memory Sources",
    "dek": "汎用 AI ツールの 2026年5月初週のアップデートをまとめました。金融特化型モデル Claude Opus 4.7 の発表、Gemini API の Webhooks 対応、ChatGPT のパーソナライズ機能強化など、利便性と実用性を高める更新が続いています。",
    "summary": "Claude Opus 4.7 (金融特化)、Gemini API Webhooks、ChatGPT Memory Sources、NotebookLM の学生向け Classroom 連携など、汎用 AI ツールの 2026年5月初週アップデートをまとめました。",
    "publishedAt": "2026-05-06",
    "createdAt": "2026-05-06T04:15:00Z",
    "toolName": "Claude, Gemini, ChatGPT, NotebookLM, Obsidian",
    "articleUrl": "./articles/tools/2026-05-06-ai-others-tools-multi-update.html"
}

# Insert at Index 0 (or after the coding update if already there)
articles.insert(0, new_entry)

data['articles'] = articles

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated articles.json with others tools multi-update.")
