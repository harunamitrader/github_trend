import json
from collections import Counter

json_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

articles = data['articles']

serial_counts = Counter()
for a in articles:
    cat = a.get('category', 'unknown')
    serial = a.get('serial', 'MISSING')
    serial_counts[(cat, serial)] += 1

dups = {k: v for k, v in serial_counts.items() if v > 1}

print("--- Duplicate Serial Breakdown ---")
for (cat, serial), count in dups.items():
    print(f"Category: {cat}, Serial: {serial}, Count: {count}")

# Check for specific recent ones
print("\n--- Recent Serials Check ---")
for s in range(460, 475):
    for cat in ['github-trending', 'github-pickup', 'ai-tool-log']:
        count = serial_counts.get((cat, s), 0)
        if count > 0:
            print(f"{cat} Serial {s}: {count}")

for s in range(30, 40):
    count = serial_counts.get(('github-update-report', s), 0)
    if count > 0:
            print(f"github-update-report Serial {s}: {count}")
