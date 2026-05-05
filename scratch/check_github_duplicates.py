import json
import os

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

articles = data.get('articles', [])

seen_repo_names = {}
seen_repo_urls = {}
duplicates = []

for i in range(len(articles) - 1, -1, -1):
    article = articles[i]
    category = article.get('category')
    if category not in ['github-trending', 'github-pickup']:
        continue
        
    repo_name = article.get('repoName')
    repo_url = article.get('repoUrl')
    
    if not repo_name and not repo_url:
        continue
        
    is_duplicate = False
    
    if repo_name:
        repo_name_lower = repo_name.lower()
        if repo_name_lower in seen_repo_names:
            orig_idx = seen_repo_names[repo_name_lower]
            duplicates.append({
                'new_idx': i,
                'old_idx': orig_idx,
                'article': article,
                'old_article': articles[orig_idx],
                'reason': f'Duplicate repoName: {repo_name}'
            })
            is_duplicate = True
        else:
            seen_repo_names[repo_name_lower] = i
            
    if not is_duplicate and repo_url:
        repo_url_lower = repo_url.lower().rstrip('/')
        if repo_url_lower in seen_repo_urls:
            orig_idx = seen_repo_urls[repo_url_lower]
            duplicates.append({
                'new_idx': i,
                'old_idx': orig_idx,
                'article': article,
                'old_article': articles[orig_idx],
                'reason': f'Duplicate repoUrl: {repo_url}'
            })
            is_duplicate = True
        else:
            seen_repo_urls[repo_url_lower] = i

if duplicates:
    print(f"Found {len(duplicates)} GitHub duplicates.")
    for d in duplicates:
        print(f"NEW Index {d['new_idx']} ({d['article'].get('publishedAt')}, Serial {d['article'].get('serial')}) duplicate of OLD Index {d['old_idx']} ({d['old_article'].get('publishedAt')}, Serial {d['old_article'].get('serial')})")
        print(f"  Reason: {d['reason']}")
        print(f"  New: {d['article'].get('title')}")
        print(f"  Old: {d['old_article'].get('title')}")
else:
    print("No GitHub duplicates found.")
