import json
file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)
articles = data.get('articles', [])
for i in [176, 185]:
    if i < len(articles):
        a = articles[i]
        print(f"Index {i}: {a.get('title')}, {a.get('publishedAt')}, {a.get('category')}, {a.get('repoName')}")
