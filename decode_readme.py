import json, base64
with open('readme_meta.json', 'r', encoding='utf-16') as f:
    data = json.load(f)
content = base64.b64decode(data['content']).decode('utf-8')
with open('readme_decoded.txt', 'w', encoding='utf-8') as f:
    f.write(content)
