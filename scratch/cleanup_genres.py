import json

mapping = {
    "AI学習リポジトリ (教育・ロードマップ・論文集)": "学習ガイド・開発アセット",
    "開発エコシステム (ライブラリ・フレームワーク)": "AI基盤・データ基盤・業務アプリ",
    "AIモデル・生成AI・基盤モデル": "AI基盤・データ基盤・業務アプリ",
    "クリエイティブ・マルチメディア": "メディア作成・マルチモーダル・UI",
    "トレード (自動取引・分析ツール)": "金融・トレード分析",
    "汎用AI (チャット・検索・ディープリサーチ)": "AI基盤・データ基盤・業務アプリ",
    "開発支援・各種ツール": "学習ガイド・開発アセット"
}

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

def cleanup_genres():
    with open('data/articles.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    modified_count = 0
    for article in data['articles']:
        genre = article.get('genre')
        if not genre:
            continue
            
        if genre in mapping:
            article['genre'] = mapping[genre]
            modified_count += 1
        elif genre not in valid_genres:
            # Fallback for any other unknown ones
            print(f"Warning: Unknown genre '{genre}' found in article '{article.get('slug', 'unknown')}'.")
            
    if modified_count > 0:
        with open('data/articles.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Successfully updated {modified_count} articles to standard genres.")
    else:
        print("No articles needed updating.")

if __name__ == "__main__":
    cleanup_genres()
