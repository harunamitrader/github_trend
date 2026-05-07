import json
import os

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_entry = {
    "category": "github-pickup",
    "originType": "pickup",
    "slug": "2026-05-07-cloakhq-cloakbrowser",
    "title": "CloakBrowser",
    "dek": "ボット検知を「ソースレベル」で回避。Chromium のバイナリを直接パッチし、Playwright や Puppeteer との完全互換を維持する究極のステルスブラウザ。",
    "summary": "ボット検知回避に特化した Chromium ベースのステルスブラウザ「CloakBrowser」を調査。JavaScript による表面的な偽装ではなく、C++ ソースコードレベルでの指紋パッチにより、Playwright や Puppeteer の自動化を極限まで検知不能にする技術を解説します。",
    "publishedAt": "2026-05-07",
    "createdAt": "2026-05-07T09:40:00+09:00",
    "repoName": "CloakHQ/CloakBrowser",
    "repoUrl": "https://github.com/CloakHQ/CloakBrowser",
    "starCount": 1421,
    "articleUrl": "./articles/github/daily/2026-05-07-cloakhq-cloakbrowser.html",
    "serial": 460,
    "genre": "スクレイピング・情報収集・セキュリティ"
}

data['articles'].insert(0, new_entry)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Successfully updated articles.json with CloakBrowser")
