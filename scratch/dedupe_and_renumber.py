import json
import os
import re

def main():
    json_path = 'data/articles.json'
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 1. Fix typo in github-update-report
    for a in data.get('articles', []):
        if a.get('category') == 'github-update-report':
            if a.get('repoName') == 'agithub-trend-daily-writer':
                a['repoName'] = ''
                a['repoUrl'] = ''

    # 2. Extract github-trending and github-pickup
    target_categories = ['github-trending', 'github-pickup']
    target_articles = [a for a in data.get('articles', []) if a.get('category') in target_categories]
    other_articles = [a for a in data.get('articles', []) if a.get('category') not in target_categories]

    # 3. Deduplicate (case-insensitive repoName)
    # Group by lower(repoName)
    repo_map = {}
    for a in target_articles:
        repo = a.get('repoName', '').strip().lower()
        if not repo:
            continue
        if repo not in repo_map:
            repo_map[repo] = []
        repo_map[repo].append(a)

    deduped_articles = []
    deleted_html_files = []
    for repo, items in repo_map.items():
        # Sort items by serial (to find newest)
        def get_serial(x):
            try: return int(str(x.get('serial', 0)).replace('#', ''))
            except: return 0
            
        items.sort(key=get_serial)
        # Keep the newest (last in sorted list)
        newest = items[-1]
        deduped_articles.append(newest)
        
        # Delete older HTML files
        for old_item in items[:-1]:
            old_url = old_item.get('articleUrl', '')
            if old_url:
                old_path = old_url.replace('./', '')
                if os.path.exists(old_path):
                    deleted_html_files.append(old_path)
                    os.remove(old_path)

    # Add back articles that might not have a repoName (though they should)
    for a in target_articles:
        if not a.get('repoName', '').strip():
            deduped_articles.append(a)

    # 4. Sort and Renumber
    def get_serial(x):
        try: return int(str(x.get('serial', 0)).replace('#', ''))
        except: return 0

    deduped_articles.sort(key=get_serial)

    changes_count = 0
    for i, a in enumerate(deduped_articles):
        new_serial = i + 1
        old_serial = get_serial(a)
        if new_serial != old_serial:
            a['serial'] = new_serial
            # Update HTML file
            html_url = a.get('articleUrl', '')
            if html_url:
                html_path = html_url.replace('./', '')
                if os.path.exists(html_path):
                    with open(html_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Update Shared GitHub Serial: #OLD to #NEW
                    # The exact string in template is "Shared GitHub Serial: #{{SERIAL_NUMBER}}"
                    # We can use regex to replace it
                    new_content = re.sub(r'Shared GitHub Serial: #\d+', f'Shared GitHub Serial: #{new_serial}', content)
                    
                    if new_content != content:
                        with open(html_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        changes_count += 1

    # Reconstruct data['articles']
    # deduped_articles are now sorted ascending by serial.
    # The convention in articles.json is descending (newest first).
    deduped_articles.sort(key=get_serial, reverse=True)
    
    # We should preserve the relative ordering of other_articles and deduped_articles
    # Usually, the whole articles array is sorted by createdAt or something.
    # Let's just combine and sort by createdAt descending.
    all_articles = deduped_articles + other_articles
    
    def get_created_at(x):
        return x.get('createdAt', '')
        
    all_articles.sort(key=get_created_at, reverse=True)
    
    data['articles'] = all_articles

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Deleted duplicate HTML files: {len(deleted_html_files)}")
    print(f"Updated serials in HTML files: {changes_count}")
    print(f"Total target articles after deduplication: {len(deduped_articles)}")

if __name__ == '__main__':
    main()
