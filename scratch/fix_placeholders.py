import json
import os

with open('data/articles.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

# Find the 3 articles we added today
repos_to_fix = ['alireza0/s-ui', 'antoinezambelli/forge', 'dotnet/skills']

for art in db['articles']:
    if art.get('repoName') in repos_to_fix:
        # Get data
        slug = art['title']
        dek = art['dek']
        date_str = art['publishedAt']
        owner_repo = art['repoName']
        repo_url = art['repoUrl']
        stars = f"{art['starCount']:,}"
        serial = str(art['serial'])
        
        # Determine filepath
        filepath = art['articleUrl'].replace('./', '') # articles/github/daily/2026-05-22-skills.html
        
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Replace placeholders
            content = content.replace('{{REPO_SLUG}}', slug)
            content = content.replace('{{DEK_DESCRIPTION}}', dek)
            content = content.replace('{{YYYY_MM_DD}}', date_str)
            content = content.replace('{{OWNER_REPO}}', owner_repo)
            content = content.replace('{{STAR_COUNT_COMMA}}', stars)
            content = content.replace('{{REPO_URL}}', repo_url)
            content = content.replace('{{SERIAL_NUMBER}}', serial)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed placeholders for {slug}")

print("All article placeholders fixed.")
