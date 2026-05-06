import json
import sys

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

new_entry = {
    "category": "github-pickup",
    "slug": "2026-05-06-500-ai-agents-projects",
    "title": "500-AI-Agents-Projects",
    "dek": "500種類以上のAIエージェント活用事例と実装コードを網羅した、AI開発者のための究極のリソース集",
    "summary": "500件以上のAIエージェント活用事例を網羅した巨大なキュレーションリポジトリを調査。業界別のユースケースから、LangGraph等を用いた具体的な実装コード、チュートリアルまで、エージェント開発に必要なリソースがワンストップで提供されている。",
    "publishedAt": "2026-05-06",
    "repoName": "ashishpatel26/500-AI-Agents-Projects",
    "repoUrl": "https://github.com/ashishpatel26/500-AI-Agents-Projects",
    "starCount": 29948,
    "articleUrl": "./articles/github/daily/2026-05-06-500-ai-agents-projects.html",
    "rank": 999,
    "createdAt": "2026-05-06T21:45:00+09:00",
    "serial": 449,
    "originType": "pickup",
    "genre": "学習ガイド・開発アセット"
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
