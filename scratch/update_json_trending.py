import json
import os
from datetime import datetime

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_articles = [
    {
        "category": "github-trending",
        "originType": "trending",
        "slug": "2026-05-07-addyosmani-agent-skills",
        "title": "agent-skills",
        "dek": "AI に「シニアエンジニアの規律」を。仕様策定、テスト、レビュー、デプロイなど、実務で不可欠な開発プロセスを AI エージェントに実行させるためのエンジニアリング・スキル集。",
        "summary": "Google の Addy Osmani 氏が公開した、AI コーディングエージェントのための SDLC 遵守スキル集「agent-skills」を調査。仕様、計画、テスト、レビュー、シップなど、プロフェッショナルな開発プロセスをエージェントに自律実行させるためのワークフローを提供します。",
        "publishedAt": "2026-05-07",
        "createdAt": "2026-05-07T04:50:00+09:00",
        "repoName": "addyosmani/agent-skills",
        "repoUrl": "https://github.com/addyosmani/agent-skills",
        "starCount": 30111,
        "articleUrl": "./articles/github/daily/2026-05-07-addyosmani-agent-skills.html",
        "rank": 2,
        "serial": 458,
        "genre": "AIコーディング (ワークフロー・プロンプト・開発補助ツール)"
    },
    {
        "category": "github-trending",
        "originType": "trending",
        "slug": "2026-05-07-ladybirdbrowser-ladybird",
        "title": "ladybird",
        "dek": "既存の巨人の肩に乗らない、真の独立。Chromium も Firefox も使わず、ゼロから独自のレンダリング・JS エンジンを構築する、完全新規のオープンソース・ブラウザ。",
        "summary": "既存のブラウザエンジンを一切使わずゼロから開発されている独立系ブラウザ「Ladybird」を調査。LibWeb レンダリングエンジンや LibJS などの独自実装により、広告や追跡に縛られない純粋なオープンウェブの実現を目指すプロジェクトの全貌に迫ります。",
        "publishedAt": "2026-05-07",
        "createdAt": "2026-05-07T04:49:00+09:00",
        "repoName": "LadybirdBrowser/ladybird",
        "repoUrl": "https://github.com/LadybirdBrowser/ladybird",
        "starCount": 62921,
        "articleUrl": "./articles/github/daily/2026-05-07-ladybirdbrowser-ladybird.html",
        "rank": 6,
        "serial": 457,
        "genre": "メディア作成・マルチモーダル・UI"
    },
    {
        "category": "github-trending",
        "originType": "trending",
        "slug": "2026-05-07-insforge-insforge",
        "title": "InsForge",
        "dek": "AI エージェントが自らバックエンドを構築。Postgres を基盤に、認証・DB・ストレージをセマンティックに制御する、次世代の AI ネイティブ・バックエンド・プラットフォーム。",
        "summary": "AI エージェントが自律的にバックエンド（DB、認証、ストレージ等）を構築・管理できるプラットフォーム「InsForge」を調査。Postgres を核としたセマンティックレイヤーにより、AI がシステム構造を理解してフルスタック開発を行うための基盤を提供します。",
        "publishedAt": "2026-05-07",
        "createdAt": "2026-05-07T04:48:00+09:00",
        "repoName": "InsForge/InsForge",
        "repoUrl": "https://github.com/InsForge/InsForge",
        "starCount": 8348,
        "articleUrl": "./articles/github/daily/2026-05-07-insforge-insforge.html",
        "rank": 7,
        "serial": 456,
        "genre": "AI基盤・データ基盤・業務アプリ"
    },
    {
        "category": "github-trending",
        "originType": "trending",
        "slug": "2026-05-07-anthropics-financial-services",
        "title": "financial-services",
        "dek": "金融実務に Claude の知性を。投資銀行、PE、リサーチ業務を自動化・高度化するための公式エージェント、スキル、データコネクタ集。",
        "summary": "Anthropic が公式公開した金融サービス向け Claude リソース「financial-services」を調査。DCF 分析や LBO モデル、ディールトラッキングなど、金融専門業務を Claude Code や Claude Cowork で自動化・高度化するための公式テンプレートとスキルの活用法をまとめました。",
        "publishedAt": "2026-05-07",
        "createdAt": "2026-05-07T04:47:00+09:00",
        "repoName": "anthropics/financial-services",
        "repoUrl": "https://github.com/anthropics/financial-services",
        "starCount": 8933,
        "articleUrl": "./articles/github/daily/2026-05-07-anthropics-financial-services.html",
        "rank": 9,
        "serial": 455,
        "genre": "AIエージェント (自律基盤・特化アプリ)"
    },
    {
        "category": "github-trending",
        "originType": "trending",
        "slug": "2026-05-07-cheahjs-free-llm-api-resources",
        "title": "free-llm-api-resources",
        "dek": "開発のコスト障壁を打破。LLM API の無料枠やトライアル特典を提供するサービスを網羅した、開発者必携のリソース・ディレクトリ。",
        "summary": "LLM API の無料枠や初回クレジットを提供するプロバイダーを網羅したディレクトリ「free-llm-api-resources」を調査。OpenAI, Google, Groq 等の最新提供状況から、個人開発やプロトタイピングのコストを劇的に下げるためのリソース活用術を解説します。",
        "publishedAt": "2026-05-07",
        "createdAt": "2026-05-07T04:46:00+09:00",
        "repoName": "cheahjs/free-llm-api-resources",
        "repoUrl": "https://github.com/cheahjs/free-llm-api-resources",
        "starCount": 20387,
        "articleUrl": "./articles/github/daily/2026-05-07-cheahjs-free-llm-api-resources.html",
        "rank": 11,
        "serial": 454,
        "genre": "学習ガイド・開発アセット"
    }
]

# Insert at the top (serial desc)
for article in reversed(new_articles):
    data['articles'].insert(0, article)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Successfully updated articles.json")
