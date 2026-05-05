import json
import os

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

articles = data.get('articles', [])

new_entries = [
    {
        "category": "github-trending",
        "originType": "trending",
        "slug": "2026-05-05-jellyfin-jellyfin",
        "title": "jellyfin",
        "dek": "「あなたのメディアを、完全にあなたの手に」。プライバシーを重視し、あらゆるデバイスでメディアをストリーミング可能なオープンソースのメディアサーバー基盤。",
        "summary": "映画、音楽、写真などのパーソナルメディアを集中管理し、Web ブラウザ、モバイル、スマート TV などからストリーミング再生できる無料のメディアサーバーソフト「Jellyfin」の概要と特徴をまとめました。",
        "publishedAt": "2026-05-05",
        "repoName": "jellyfin/jellyfin",
        "repoUrl": "https://github.com/jellyfin/jellyfin",
        "starCount": 51124,
        "articleUrl": "./articles/github/daily/2026-05-05-jellyfin-jellyfin.html",
        "serial": 427,
        "genre": "メディア作成・マルチモーダル・UI",
        "rank": 13
    },
    {
        "category": "github-trending",
        "originType": "trending",
        "slug": "2026-05-05-cocoindex-io-cocoindex",
        "title": "cocoindex",
        "dek": "「長期タスクを完遂する AI エージェントのために」。エージェントの思考プロセスを最適化し、長時間の推論とタスク実行を支えるインクリメンタルエンジン。",
        "summary": "複雑で長時間に及ぶタスクを扱う AI エージェント向けの実行エンジンおよびデータインデックス基盤「CocoIndex」の特徴とメリットについて解説します。",
        "publishedAt": "2026-05-05",
        "repoName": "cocoindex-io/cocoindex",
        "repoUrl": "https://github.com/cocoindex-io/cocoindex",
        "starCount": 7944,
        "articleUrl": "./articles/github/daily/2026-05-05-cocoindex-io-cocoindex.html",
        "serial": 426,
        "genre": "AIエージェント (自律基盤・特化アプリ)",
        "rank": 14
    },
    {
        "category": "github-trending",
        "originType": "trending",
        "slug": "2026-05-05-docusealco-docuseal",
        "title": "docuseal",
        "dek": "「DocuSign を、オープンソースで自由に」。デジタル署名の作成・署名・管理をセルフホスト可能なデジタルドキュメント基盤。",
        "summary": "DocuSign の代替となるオープンソースの電子署名プラットフォーム「DocuSeal」の機能と、セルフホストによる運用の利点について紹介します。",
        "publishedAt": "2026-05-05",
        "repoName": "docusealco/docuseal",
        "repoUrl": "https://github.com/docusealco/docuseal",
        "starCount": 13147,
        "articleUrl": "./articles/github/daily/2026-05-05-docusealco-docuseal.html",
        "serial": 425,
        "genre": "AI基盤・データ基盤・業務アプリ",
        "rank": 15
    }
]

# Insert after the report entry (Index 0)
# The report entry for 2026-05-05 is at Index 0.
for entry in new_entries:
    articles.insert(1, entry)

# Update report summary (at Index 0)
if articles[0].get('category') == 'github-update-report' and articles[0].get('publishedAt') == '2026-05-05':
    articles[0]['summary'] = "本日の調査で上位 15 件のトレンドを巡回し、qBittorrent、docuseal、cocoindex、jellyfin の 4 件を新規に記事化しました。デジタル署名基盤やメディアサーバー、そしてエージェント向けのインクリメンタルエンジンなど、実用性の高いツールが揃った結果となりました。"

data['articles'] = articles

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated articles.json with 3 new entries and updated report summary.")
