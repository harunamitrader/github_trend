import json
import os

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

articles = data.get('articles', [])

new_entry = {
    "category": "ai-tool-log",
    "originType": "tool-log",
    "slug": "2026-05-06-ai-coding-tools-multi-update",
    "title": "AI Coding Tools Update: Cursor v2.5 Security Patch, Windsurf Arena Mode, and Cline OOM Fixes",
    "dek": "AI コーディングツールの主要なアップデートをまとめました。Cursor の重大な脆弱性修正、Windsurf のエージェント比較機能(Arena)、Cline のメモリ使用量改善など、信頼性と使い勝手を向上させる更新が相次いでいます。",
    "summary": "Cursor v2.5 のセキュリティパッチ、Windsurf の Arena Mode、Cline のメモリ不足修正など、主要な AI コーディングツールの 2026年5月初週アップデートをまとめました。",
    "publishedAt": "2026-05-06",
    "createdAt": "2026-05-06T04:00:00Z",
    "toolName": "Cursor, Windsurf, Cline, Claude Code, Gemini CLI",
    "articleUrl": "./articles/tools/2026-05-06-ai-coding-tools-multi-update.html"
}

# Insert at Index 0 (since it's a new day, or Index 1 if there's a report)
articles.insert(0, new_entry)

data['articles'] = articles

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated articles.json with coding tools multi-update.")
