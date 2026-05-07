import json
import os

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_entry = {
    "category": "github-pickup",
    "originType": "pickup",
    "slug": "2026-05-07-edtechre-pybroker",
    "title": "pybroker",
    "dek": "機械学習とバックテストを直結。NumPy と Numba による高速処理を実現した、アルゴリズム取引戦略開発のための Python フレームワーク。",
    "summary": "アルゴリズム取引の戦略開発とバックテストに特化した「PyBroker」を調査。機械学習モデルの組み込みを前提とした設計や、Numba による高速化、ウォークフォワード分析による頑健性検証など、クオンツ・エンジニア向けの強力な機能を解説します。",
    "publishedAt": "2026-05-07",
    "createdAt": "2026-05-07T12:02:00+09:00",
    "repoName": "edtechre/pybroker",
    "repoUrl": "https://github.com/edtechre/pybroker",
    "starCount": 3284,
    "articleUrl": "./articles/github/daily/2026-05-07-edtechre-pybroker.html",
    "serial": 463,
    "genre": "金融・トレード分析"
}

data['articles'].insert(0, new_entry)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Successfully updated articles.json with pybroker")
