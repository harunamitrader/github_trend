import json
import sys

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

new_entry = {
    "category": "github-pickup",
    "slug": "2026-05-06-nanobrowser",
    "title": "nanobrowser",
    "dek": "自分自身のLLMキーで動かせる、ブラウザ操作の自律型AIエージェント（Chrome拡張機能版）",
    "summary": "Chrome拡張機能として動作するオープンソースのブラウザ操作AI「Nanobrowser」を調査。独自のLLM APIキーやローカルモデルを利用でき、プランナーとナビゲーターの複数エージェント構成で自律的なWeb操作を実現する。",
    "publishedAt": "2026-05-06",
    "repoName": "nanobrowser/nanobrowser",
    "repoUrl": "https://github.com/nanobrowser/nanobrowser",
    "starCount": 12894,
    "articleUrl": "./articles/github/daily/2026-05-06-nanobrowser.html",
    "rank": 999,
    "createdAt": "2026-05-06T19:55:00+09:00",
    "serial": 447,
    "originType": "pickup",
    "genre": "AIエージェント (自律基盤・特化アプリ)"
}

try:
    with open(file_path, 'r', encoding='utf-8-sig') as f:
        data = json.load(f)
    
    data['articles'].append(new_entry)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Successfully updated articles.json")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
