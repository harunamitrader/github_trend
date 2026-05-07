import json
import os

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_entry = {
    "category": "github-pickup",
    "originType": "pickup",
    "slug": "2026-05-07-yichengyang-ethan-oracle3",
    "title": "oracle3",
    "dek": "予測市場のための自律型トレードエージェント。Wang Transform を核とした価格理論と、Polymarket 等への自動接続機能を備えた実践的フレームワーク。",
    "summary": "予測市場（Prediction Markets）特化の自律型トレードエージェント「oracle3」を調査。学術的な価格理論を背景にした裁定取引戦略や、マルチプラットフォーム対応の実行エンジンなど、クオンツ・エージェントの最前線を解説します。",
    "publishedAt": "2026-05-07",
    "createdAt": "2026-05-07T20:21:00+09:00",
    "repoName": "YichengYang-Ethan/oracle3",
    "repoUrl": "https://github.com/YichengYang-Ethan/oracle3",
    "starCount": 167,
    "articleUrl": "./articles/github/daily/2026-05-07-yichengyang-ethan-oracle3.html",
    "serial": 466,
    "genre": "金融・トレード分析"
}

data['articles'].insert(0, new_entry)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Successfully updated articles.json with oracle3")
