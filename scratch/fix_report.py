import re
import json
import os
from datetime import datetime

date_str = '2026-05-22'

# Read local trending html
with open('scratch/trending.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

repos_in_order = []
matches = re.findall(r'<h2 class="h3 lh-condensed">\s*<a[^>]*href="/([^/"]+/[^/"]+)"', html)
for match in matches:
    repo = match.strip()
    if repo not in repos_in_order:
        repos_in_order.append(repo)

# Read articles.json
with open('data/articles.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

# Find new repos we added today
new_repos = ['alireza0/s-ui', 'antoinezambelli/forge', 'dotnet/skills']

# Map existing repos to article urls
repo_to_url = {}
for art in db['articles']:
    rname = art.get('repoName', '').lower()
    if rname:
        repo_to_url[rname] = art.get('articleUrl', '')

ranking_list_items = ''
for i, repo in enumerate(repos_in_order):
    lower_repo = repo.lower()
    
    # Try to find url
    url = repo_to_url.get(lower_repo, '')
    
    if lower_repo in new_repos:
        status_tag = '<span class="status-tag status-new">✨ 新規追加</span>'
        link = f'<strong><a href="../../{url[2:] if url.startswith("./") else url}">{repo}</a></strong>'
    elif lower_repo in repo_to_url:
        status_tag = '<span class="status-tag status-checked">✅ 記事作成済み</span>'
        link = f'<strong><a href="../../{url[2:] if url.startswith("./") else url}">{repo}</a></strong>'
    else:
        status_tag = '<span class="status-tag status-skip">未作成</span>'
        link = f'<strong>{repo}</strong>'
        
    ranking_list_items += f'            <li>\n              {link}\n              {status_tag}\n            </li>\n'

# Read template
with open('templates/github-report.template.html', 'r', encoding='utf-8') as f:
    report_html = f.read()

report_html = report_html.replace('{{YYYY_MM_DD}}', date_str)
report_html = report_html.replace('{{TOTAL_COUNT}}', str(len(repos_in_order)))
report_html = report_html.replace('{{NEW_COUNT}}', str(len(new_repos)))
report_html = report_html.replace('{{RANKING_LIST_ITEMS}}', ranking_list_items.strip())
report_html = report_html.replace('{{FUTURE_OUTLOOK}}', '引き続き、AI、開発ツールを中心としたトレンドを追跡します。')

out_path = f'articles/github/reports/{date_str}-update-report.html'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(report_html)

print('Report regenerated successfully.')
