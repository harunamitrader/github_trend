import json
import sys

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

new_entry = {
    "category": "github-pickup",
    "slug": "2026-05-06-browserbase-stagehand",
    "title": "stagehand",
    "dek": "自然言語とコードを組み合わせてブラウザを自律操作する、Browser Agentのための次世代SDK",
    "summary": "自然言語でのブラウザ操作とコードによる精密な制御を統合したSDK「Stagehand」を調査。自己修復機能やキャッシング、構造化データの抽出機能を備え、AIエージェントのブラウザ操作を劇的に簡略化する。",
    "publishedAt": "2026-05-06",
    "repoName": "browserbase/stagehand",
    "repoUrl": "https://github.com/browserbase/stagehand",
    "starCount": 22493,
    "articleUrl": "./articles/github/daily/2026-05-06-browserbase-stagehand.html",
    "rank": 999,
    "createdAt": "2026-05-06T19:48:00+09:00",
    "serial": 446,
    "originType": "pickup",
    "genre": "AIエージェント (自律基盤・特化アプリ)"
}

try:
    with open(file_path, 'r', encoding='utf-8-sig') as f:
        data = json.load(f)
    
    data['articles'].append(new_entry)
    
    # Write without BOM as per rules
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Successfully updated articles.json")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
