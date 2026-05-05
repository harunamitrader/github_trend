import json
file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)
articles = data.get('articles', [])
for a in articles[:15]:
    print(f"Serial {a.get('serial')}, Title {a.get('title')}, Date {a.get('publishedAt')}, Category {a.get('category')}")
