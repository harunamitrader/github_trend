import json
import os

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# The report is at Index 0
report = data['articles'][0]
if report.get('category') == 'github-update-report':
    report['summary'] = "本日の調査で上位 15 件のトレンドを巡回し、qBittorrent の 1 件を新規に記事化しました。skills、maigret、jcode、agency-agents については既に記事が存在するため、紹介を継続しています。"
    print("Updated report summary in articles.json")

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
