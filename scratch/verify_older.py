import json
file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)
articles = data.get('articles', [])
for i in [172, 174, 175, 176]:
    if i < len(articles):
        a = articles[i]
        print(f"Index {i}: {a.get('title')}, {a.get('category')}, {a.get('repoName')}, {a.get('repoUrl')}")
