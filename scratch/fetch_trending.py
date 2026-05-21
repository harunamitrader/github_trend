import re
import json

with open('scratch/trending.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

repos = []
# Match <h2 class="h3 lh-condensed"> ... href="/owner/repo"
# This perfectly matches the trending repo links
matches = re.findall(r'<h2 class="h3 lh-condensed">\s*<a[^>]*href="/([^/"]+/[^/"]+)"', html)
for match in matches:
    repo = match.strip()
    if repo not in repos:
        repos.append(repo)

print(f'Found {len(repos)} trending repos.')

existing_repos = set()
try:
    with open('data/articles.json', 'r', encoding='utf-8') as f:
        for line in f:
            m = re.search(r'"repoName":\s*"([^"]+)"', line)
            if m:
                existing_repos.add(m.group(1).lower())
except Exception as e:
    pass

results = []
rank = 1
for repo in repos:
    if repo.lower() not in existing_repos:
        results.append({'rank': rank, 'repo': repo})
    rank += 1

print('New repos:')
for r in results[:5]:
    print(f"{r['rank']}:{r['repo']}")
