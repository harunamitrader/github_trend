import json

with open('data/articles.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for a in data.get('articles', []):
    repo = a.get('repoName', '').lower()
    if repo in ['browserbase/skills', 'himself65/finance-skills', 'agithub-trend-daily-writer']:
        print(f"{a.get('serial', 'None')} - {a.get('category')} - {a.get('repoName')} - {a.get('title')}")
