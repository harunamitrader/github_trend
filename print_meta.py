import json
with open('repo_meta.json', 'r', encoding='utf-16') as f:
    data = json.load(f)
print(f"stars: {data.get('stargazers_count')}")
print(f"desc: {data.get('description')}")
print(f"owner: {data.get('owner', {}).get('login')}")
print(f"name: {data.get('name')}")
