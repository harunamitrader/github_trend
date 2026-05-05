import json
file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)
articles = data.get('articles', [])
max_serial = 0
for a in articles:
    if a.get('category') in ['github-trending', 'github-pickup']:
        s = a.get('serial')
        if s is not None:
            try:
                val = int(s)
                if val > max_serial:
                    max_serial = val
            except:
                pass
print(max_serial)
