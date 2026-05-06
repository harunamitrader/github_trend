import json
import os

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_article = {
    "category": "ai-tool-log",
    "originType": "tool-log",
    "slug": "2026-05-07-ai-others-tools-multi-update",
    "title": "AI Others Tools Update: OpenClaw v2026.5.6 and xAI-Anthropic Partnership",
    "dek": "2026年5月7日の汎用AIツールのアップデートをまとめました。OpenClaw の安定性向上アップデートや xAI (Grok) と Anthropic の提携発表など、インフラとエコシステムの拡大が加速しています。",
    "summary": "OpenClaw v2026.5.6 (安定性向上)、xAI と Anthropic の計算資源提携など、汎用 AI ツールの 2026年5月7日アップデートをまとめました。",
    "publishedAt": "2026-05-07",
    "createdAt": "2026-05-07T04:15:00Z",
    "toolName": "OpenClaw, Grok (xAI), Claude",
    "articleUrl": "./articles/tools/2026-05-07-ai-others-tools-multi-update.html",
    "serial": 453
}

# Add at the beginning
data['articles'].insert(0, new_article)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Successfully updated articles.json")
