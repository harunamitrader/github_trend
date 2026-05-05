import json
import os

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

articles = data.get('articles', [])

trending_repos = [
    "virattt/dexter",
    "Flowseal/zapret-discord-youtube",
    "fspecii/ace-step-ui",
    "jellyfin/jellyfin",
    "cocoindex-io/cocoindex",
    "docusealco/docuseal"
]

unwritten = []
for repo in trending_repos:
    found = False
    repo_lower = repo.lower()
    for a in articles:
        if a.get('repoName', '').lower() == repo_lower:
            found = True
            break
    if not found:
        unwritten.append(repo)

print(f"Unwritten repos from 10-15: {unwritten}")
