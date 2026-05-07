import json
import os

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_entry = {
    "category": "github-pickup",
    "originType": "pickup",
    "slug": "2026-05-07-robbyczgw-cla-hermes-web-search-plus",
    "title": "hermes-web-search-plus",
    "dek": "Hermes Agent に「最強の検索能力」を。10 種類以上のプロバイダーを自動使い分け、ウェブ情報の抽出・要約を極限まで高度化する特化型プラグイン。",
    "summary": "Hermes Agent 用の高度なウェブ検索拡張「hermes-web-search-plus」を調査。10種類以上のプロバイダー（Serper, Brave, Tavily等）をクエリの意図に応じて動的にルーティングし、高精度な情報抽出と要約を実現するプラグインの機能を解説します。",
    "publishedAt": "2026-05-07",
    "createdAt": "2026-05-07T20:11:00+09:00",
    "repoName": "robbyczgw-cla/hermes-web-search-plus",
    "repoUrl": "https://github.com/robbyczgw-cla/hermes-web-search-plus",
    "starCount": 151,
    "articleUrl": "./articles/github/daily/2026-05-07-robbyczgw-cla-hermes-web-search-plus.html",
    "serial": 465,
    "genre": "AIエージェント (自律基盤・特化アプリ)"
}

data['articles'].insert(0, new_entry)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Successfully updated articles.json with hermes-web-search-plus")
