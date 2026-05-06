import json
import sys

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

new_entry = {
    "category": "github-pickup",
    "slug": "2026-05-06-pdfcraft",
    "title": "pdfcraft",
    "dek": "サーバーへのアップロード不要。ブラウザ完結で90種類以上の操作ができる、プライバシー重視の究極PDFツールキット",
    "summary": "90種類以上のツールをブラウザ完結で提供するプライバシー重視のPDFツールキット「PDFCraft」を調査。WASMを活用した完全クライアントサイド動作により、ファイルのアップロードなしで高度な変換や編集を可能にしている。",
    "publishedAt": "2026-05-06",
    "repoName": "PDFCraftTool/pdfcraft",
    "repoUrl": "https://github.com/PDFCraftTool/pdfcraft",
    "starCount": 4959,
    "articleUrl": "./articles/github/daily/2026-05-06-pdfcraft.html",
    "rank": 999,
    "createdAt": "2026-05-06T21:54:00+09:00",
    "serial": 450,
    "originType": "pickup",
    "genre": "AI基盤・データ基盤・業務アプリ"
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
