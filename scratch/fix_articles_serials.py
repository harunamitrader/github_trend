import json

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# The new ones are at index 0 and 1
# 0: Others update
# 1: Coding update

data['articles'][0]['serial'] = 435
data['articles'][1]['serial'] = 434

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Added serial numbers 434 and 435 to articles.json.")
