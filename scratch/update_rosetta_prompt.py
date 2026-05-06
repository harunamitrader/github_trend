import json
import sys

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

new_entry = {
    "category": "github-pickup",
    "slug": "2026-05-06-the-rosetta-prompt",
    "title": "The-Rosetta-Prompt",
    "dek": "モデルごとの「最適解」を自動反映。主要LLMプロバイダーの公式ガイドに基づきプロンプトを最適化・翻訳するエージェントシステム",
    "summary": "主要LLMプロバイダー（OpenAI, Anthropic, Google等）の公式ベストプラクティスに基づき、一つのプロンプトを各モデルに最適化された形式へ自動変換するシステム「The Rosetta Prompt」を調査。最新ドキュメントを自律的に学習するエージェント機能を備える。",
    "publishedAt": "2026-05-06",
    "repoName": "muratcankoylan/The-Rosetta-Prompt",
    "repoUrl": "https://github.com/muratcankoylan/The-Rosetta-Prompt",
    "starCount": 229,
    "articleUrl": "./articles/github/daily/2026-05-06-the-rosetta-prompt.html",
    "rank": 999,
    "createdAt": "2026-05-06T23:40:00+09:00",
    "serial": 451,
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
