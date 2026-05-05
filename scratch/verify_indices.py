import json

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

articles = data.get('articles', [])

target_indices = [1, 2, 3, 4, 16]

for idx in target_indices:
    if idx < len(articles):
        a = articles[idx]
        print(f"Index {idx}: Serial {a.get('serial')}, Title {a.get('title')}, repoName {a.get('repoName')}, articleUrl {a.get('articleUrl')}")
    else:
        print(f"Index {idx} out of range")
