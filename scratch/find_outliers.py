import json

valid_genres = [
    "AIコーディング (CLI本体・拡張機能)",
    "AIコーディング (ワークフロー・プロンプト・開発補助ツール)",
    "AIエージェント (自律基盤・特化アプリ)",
    "AI基盤・データ基盤・業務アプリ",
    "金融・トレード分析",
    "メディア作成・マルチモーダル・UI",
    "ナレッジ管理・RAG解析",
    "スクレイピング・情報収集・セキュリティ",
    "学習ガイド・開発アセット"
]

def find_outliers():
    with open('data/articles.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    outliers = []
    for article in data['articles']:
        genre = article.get('genre')
        if genre and genre not in valid_genres:
            outliers.append(article)
            
    for o in outliers:
        print(f"{o['slug']}: {o['genre']}")

if __name__ == "__main__":
    find_outliers()
