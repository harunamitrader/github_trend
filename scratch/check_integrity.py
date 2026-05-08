import json
from collections import Counter

json_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

articles = data['articles']

# 1. Duplicate Slugs
slugs = [a.get('slug', 'MISSING') for a in articles]
dup_slugs = [s for s, count in Counter(slugs).items() if count > 1 and s != 'MISSING']

# 2. Duplicate Serials (per category group)
watcher_serials = [a.get('serial', 'MISSING') for a in articles if a.get('category') in ['github-trending', 'github-pickup']]
dup_watcher_serials = [s for s, count in Counter(watcher_serials).items() if count > 1 and s != 'MISSING']

tool_serials = [a.get('serial', 'MISSING') for a in articles if a.get('category') == 'ai-tool-log']
dup_tool_serials = [s for s, count in Counter(tool_serials).items() if count > 1 and s != 'MISSING']

report_serials = [a.get('serial', 'MISSING') for a in articles if a.get('category') == 'github-update-report']
dup_report_serials = [s for s, count in Counter(report_serials).items() if count > 1 and s != 'MISSING']

# 3. Duplicate repoNames (trending/pickup only)
repo_names = [a.get('repoName', 'MISSING') for a in articles if a.get('category') in ['github-trending', 'github-pickup'] and a.get('repoName')]
dup_repos = [r for r, count in Counter(repo_names).items() if count > 1 and r != 'MISSING']

print("--- Article Integrity Check ---")
print(f"Total articles: {len(articles)}")
print(f"Duplicate Slugs: {dup_slugs}")
print(f"Duplicate Watcher Serials: {dup_watcher_serials}")
print(f"Duplicate Tool Serials: {dup_tool_serials}")
print(f"Duplicate Report Serials: {dup_report_serials}")
print(f"Duplicate Repo Names: {dup_repos}")

# 4. Check for broken fields
missing_fields = []
for i, a in enumerate(articles):
    required = ['category', 'slug', 'serial', 'articleUrl']
    for f in required:
        if f not in a:
            missing_fields.append((i, a.get('slug', 'N/A'), f))

print(f"Articles with missing required fields: {len(missing_fields)}")
if missing_fields:
    # Print specific counts
    missing_slug_count = sum(1 for m in missing_fields if m[2] == 'slug')
    missing_serial_count = sum(1 for m in missing_fields if m[2] == 'serial')
    print(f"  - Missing slug: {missing_slug_count}")
    print(f"  - Missing serial: {missing_serial_count}")
    
    for m in missing_fields[:10]:
         print(f"  - Index {m[0]} ({m[1]}): missing {m[2]}")
