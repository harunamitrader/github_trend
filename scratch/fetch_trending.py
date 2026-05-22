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

existing_repo_names = set()
existing_repo_urls = set()
try:
    with open('data/articles.json', 'r', encoding='utf-8') as f:
        db = json.load(f)
        for art in db.get('articles', []):
            repo_name = art.get('repoName', '').strip().lower()
            repo_url = art.get('repoUrl', '').strip().lower()
            if repo_name:
                existing_repo_names.add(repo_name)
            if repo_url:
                existing_repo_urls.add(repo_url)
except Exception as e:
    pass

results = []
rank = 1
for repo in repos:
    repo_url = f'https://github.com/{repo}'.lower()
    if repo.lower() not in existing_repo_names and repo_url not in existing_repo_urls:
        results.append({'rank': rank, 'repo': repo})
    rank += 1

print('New repos:')
for r in results[:5]:
    print(f"{r['rank']}:{r['repo']}")
