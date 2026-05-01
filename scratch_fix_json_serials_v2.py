import json
path = 'data/articles.json'
with open(path, encoding='utf-8') as f:
    data = json.load(f)
for a in data['articles']:
    if a.get('repoName') == 'blinkospace/blinko':
        a['serial'] = 397
    if a.get('repoName') == 'jo-inc/camofox-browser':
        a['serial'] = 398
with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print("Updated serials in articles.json")
