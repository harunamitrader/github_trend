import json
import sys

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

new_entry = {
    "category": "github-pickup",
    "slug": "2026-05-06-taste-skill",
    "title": "taste-skill",
    "dek": "AIが生成する「退屈で汎用的なデザイン」を打破し、プレミアムなUI/UXを実現するための命令セット集",
    "summary": "AIコーディングアシスタントのデザインセンスを劇的に向上させる命令セット集「Taste-Skill」を調査。AI特有の凡庸なスタイルを回避し、洗練されたレイアウトやアニメーションをフロントエンド実装に反映させるためのルール群を提供する。",
    "publishedAt": "2026-05-06",
    "repoName": "Leonxlnx/taste-skill",
    "repoUrl": "https://github.com/Leonxlnx/taste-skill",
    "starCount": 15689,
    "articleUrl": "./articles/github/daily/2026-05-06-taste-skill.html",
    "rank": 999,
    "createdAt": "2026-05-06T21:43:00+09:00",
    "serial": 448,
    "originType": "pickup",
    "genre": "AIコーディング (ワークフロー・プロンプト・開発補助ツール)"
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
