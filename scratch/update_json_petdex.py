import json
import os

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_entry = {
    "category": "github-pickup",
    "originType": "pickup",
    "slug": "2026-05-07-crafter-station-petdex",
    "title": "petdex",
    "dek": "Codex に命を吹き込む、デスクトップ・ペットの百科事典。コミュニティ製アニメーションペットの閲覧・検証・配信を支える中央ギャラリー。",
    "summary": "Codex 対応のアニメーションペットを収集・公開するギャラリー「petdex」を調査。コミュニティ製のデジタルペットをプレビュー・インストールできるプラットフォームとしての機能や、自作ペットの申請プロセスについて解説します。",
    "publishedAt": "2026-05-07",
    "createdAt": "2026-05-07T09:44:00+09:00",
    "repoName": "crafter-station/petdex",
    "repoUrl": "https://github.com/crafter-station/petdex",
    "starCount": 678,
    "articleUrl": "./articles/github/daily/2026-05-07-crafter-station-petdex.html",
    "serial": 461,
    "genre": "学習ガイド・開発アセット"
}

data['articles'].insert(0, new_entry)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Successfully updated articles.json with petdex")
