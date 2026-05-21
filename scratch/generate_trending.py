import json
import os
from datetime import datetime, timezone, timedelta

JST = timezone(timedelta(hours=+9), 'JST')
now = datetime.now(JST)
date_str = now.strftime('%Y-%m-%d')
time_str = now.strftime('%Y-%m-%dT%H:%M:%S+09:00')

repos = [
    {
        "slug": f"{date_str}-s-ui",
        "title": "s-ui",
        "dek": "SagerNet / Sing-Box 向けの高度な Web パネルを提供するプロキシ管理インターフェース",
        "repoName": "alireza0/s-ui",
        "repoUrl": "https://github.com/alireza0/s-ui",
        "starCount": 8910,
        "genre": "スクレイピング・情報収集・セキュリティ",
        "serial": 585,
        "rank": 18
    },
    {
        "slug": f"{date_str}-forge",
        "title": "forge",
        "dek": "LLMのツール呼び出しとマルチステップの自律エージェントワークフローを構築するためのPythonフレームワーク",
        "repoName": "antoinezambelli/forge",
        "repoUrl": "https://github.com/antoinezambelli/forge",
        "starCount": 1438,
        "genre": "AIエージェント (自律基盤・特化アプリ)",
        "serial": 586,
        "rank": 12
    },
    {
        "slug": f"{date_str}-skills",
        "title": "skills",
        "dek": "AIコーディングエージェントが .NET や C# で開発を行うのを支援するための専用スキルセット・プロンプト集",
        "repoName": "dotnet/skills",
        "repoUrl": "https://github.com/dotnet/skills",
        "starCount": 2142,
        "genre": "AIコーディング (ワークフロー・プロンプト・開発補助ツール)",
        "serial": 587,
        "rank": 4
    }
]

# Read template
with open('templates/github-daily.template.html', 'r', encoding='utf-8') as f:
    template_html = f.read()

articles_data = []

# Generate Articles
for r in repos:
    html = template_html
    html = html.replace('{{title}}', r['title'])
    html = html.replace('{{dek}}', r['dek'])
    html = html.replace('{{date}}', date_str)
    html = html.replace('{{RANK_OR_PICKUP}}', f"Rank {r['rank']}")
    html = html.replace('{{serial}}', str(r['serial']))
    html = html.replace('{{repoName}}', r['repoName'])
    html = html.replace('{{repoUrl}}', r['repoUrl'])
    html = html.replace('{{starCount}}', f"{r['starCount']:,}")
    
    file_path = f"articles/github/daily/{r['slug']}.html"
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html)
        
    entry = {
        "title": r['title'],
        "dek": r['dek'],
        "summary": r['dek'],
        "category": "github-trending",
        "genre": r['genre'],
        "originType": "trending",
        "rank": r['rank'],
        "serial": r['serial'],
        "publishedAt": date_str,
        "createdAt": time_str,
        "repoName": r['repoName'],
        "repoUrl": r['repoUrl'],
        "articleUrl": f"./articles/github/daily/{r['slug']}.html",
        "starCount": r['starCount']
    }
    articles_data.append(entry)

# Generate Report
report_serial = 51
report_slug = f"{date_str}-update-report"
report_title = f"GitHub Trending Updates for {date_str}"
with open('templates/github-report.template.html', 'r', encoding='utf-8') as f:
    report_html = f.read()

# Build ranking list
ranking_html = ""
for r in reversed(repos): # Higher rank (smaller number) first
    ranking_html += f"  <li><strong>Rank {r['rank']}:</strong> <a href=\"../../articles/github/daily/{r['slug']}.html\">{r['repoName']}</a> - {r['dek']}</li>\n"

report_html = report_html.replace('{{date}}', date_str)
report_html = report_html.replace('{{serial}}', str(report_serial))
report_html = report_html.replace('{{ranking_list}}', ranking_html.strip())

with open(f"articles/github/reports/{report_slug}.html", 'w', encoding='utf-8') as f:
    f.write(report_html)

report_entry = {
    "title": report_title,
    "summary": f"{date_str} の GitHub Trending 更新レポートです。",
    "category": "github-update-report",
    "serial": report_serial,
    "publishedAt": date_str,
    "createdAt": time_str,
    "articleUrl": f"./articles/github/reports/{report_slug}.html"
}
articles_data.insert(0, report_entry) # Put report at top, though articles_data itself is reversed
articles_data.reverse() # Reverse so that highest serial is at index 0 when prepended

# Update articles.json
with open('data/articles.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

db['articles'] = articles_data + db['articles']

with open('data/articles.json', 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

print("Generated 3 articles and 1 report.")
