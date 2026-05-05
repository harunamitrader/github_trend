import json
import os

base_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base'
file_path = os.path.join(base_path, 'data', 'articles.json')

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

articles = data.get('articles', [])

# Indices to delete (from previous analysis)
# We use indices based on the original list.
# 1: 1jehuang/jcode (2026-05-05)
# 2: msitarzewski/agency-agents (2026-05-05)
# 3: browserbase/skills (2026-05-05)
# 4: soxoj/maigret (2026-05-05)
# 16: koala73/worldmonitor (2026-05-03)

target_indices = [1, 2, 3, 4, 16]
to_delete = []

for idx in target_indices:
    if idx < len(articles):
        to_delete.append(articles[idx])

# Delete HTML files
for a in to_delete:
    url = a.get('articleUrl')
    if url:
        # Normalize path
        rel_path = url.replace('./', '').replace('/', os.sep)
        abs_path = os.path.join(base_path, rel_path)
        if os.path.exists(abs_path):
            print(f"Deleting file: {abs_path}")
            os.remove(abs_path)
        else:
            print(f"File not found: {abs_path}")

# Remove from articles array
new_articles = [a for i, a in enumerate(articles) if i not in target_indices]
data['articles'] = new_articles

# Save back
with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Removed {len(target_indices)} articles from articles.json.")
