import json
import os

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Find and remove the deep dive entry
slug_to_remove = "2026-05-07-anthropics-financial-services-deep-dive"
data['articles'] = [art for art in data['articles'] if art.get('slug') != slug_to_remove]

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Successfully removed {slug_to_remove} from articles.json")
