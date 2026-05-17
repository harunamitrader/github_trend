import json
import datetime
import os

TEMPLATE = """<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="{{DEK_DESCRIPTION}}" />
    <meta name="theme-color" content="#f7fbff" />
    <title>{{REPO_SLUG}}</title>
    <link rel="icon" href="../../../favicon.svg" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@600..800&family=Noto+Sans+JP:wght@100..900&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="../../../styles.css" />
  </head>
  <body>
    <article class="article-shell">
      <div class="article-topline">
        <a class="article-back" href="../../../github-trend.html">← 記事一覧へ戻る</a>
        <p class="eyebrow">GitHub Watcher</p>
      </div>

      <h1 class="article-title">{{REPO_SLUG}}</h1>
      <p class="article-dek">{{DEK_DESCRIPTION}}</p>

      <div class="article-meta-grid">
        <div class="article-meta-item">
          <span class="meta-label">記事作成日</span>
          <strong>{{YYYY_MM_DD}}</strong>
        </div>
        <div class="article-meta-item">
          <span class="meta-label">種別</span>
          <strong>{{RANK_OR_PICKUP}}</strong>
        </div>
        <div class="article-meta-item">
          <span class="meta-label">対象 repo</span>
          <strong><a href="{{REPO_URL}}" target="_blank" rel="noreferrer">{{OWNER_REPO}}</a></strong>
        </div>
        <div class="article-meta-item">
          <span class="meta-label">Star数</span>
          <strong>{{STAR_COUNT_COMMA}}</strong>
        </div>
      </div>

      <div class="article-body">
        <h2>これは何か</h2>
        <p>{{WHAT_IS_THIS}}</p>

        <h2>何ができるか</h2>
        <p>{{WHAT_CAN_IT_DO}}</p>

        <h2>目立つポイント</h2>
        <p>{{KEY_FEATURES}}</p>

        <h2>セットアップや使い方の流れ</h2>
        <p>{{SETUP_USAGE}}</p>

        <h2>どんな人向けか</h2>
        <p>{{TARGET_AUDIENCE}}</p>

        <h2>注意点</h2>
        <p>{{CAUTIONS}}</p>

        <h2>まとめ</h2>
        <p>{{SUMMARY}}</p>

        <h2>参照リンク</h2>
        <div class="source-item">
          <a href="{{REPO_URL}}" target="_blank" rel="noreferrer">{{REPO_URL}}</a>
        </div>
      </div>
      <div class="article-footer">
        <p class="article-serial">Shared GitHub Serial: #{{SERIAL_NUMBER}}</p>
      </div>
    </article>
  </body>
</html>"""

repos_data = [
    {
        "slug": "dograh",
        "owner_repo": "dograh-hq/dograh",
        "rank": 9,
        "stars": 1550,
        "genre": "AIエージェント (自律基盤・特化アプリ)",
        "dek": "完全にオープンソースで提供される、リアルタイムな音声エージェント構築プラットフォーム。",
        "what_is_this": "LLMベースの音声AIエージェントを構築するためのオープンソースプラットフォームです。高価なクローズドAPIに依存せず、独自の声やロジックを持つ音声AIを自社環境にデプロイできるように設計されています。",
        "what_can_it_do": "音声認識(STT)、推論(LLM)、音声合成(TTS)をリアルタイムに統合し、低遅延での自然な音声対話エージェントを構築・実行できます。",
        "key_features": "<ul><li><strong>エンドツーエンドの音声対応</strong>: STTとTTSのパイプラインが既に統合されており、スムーズな会話が可能。</li><li><strong>完全にオープンソース</strong>: 拡張や自己ホスティングが容易で、ベンダーロックインを回避。</li><li><strong>カスタマイズ性</strong>: プロンプトや使用モデルを自由に選択可能。</li></ul>",
        "setup_usage": "Dockerを使用して環境を素早く立ち上げることが可能です。リポジトリをクローンし、環境変数を設定した上で <code>docker-compose up</code> を実行することで、ローカルで音声エージェントをテストできます。",
        "target_audience": "カスタマーサポートの自動化、音声インターフェースを持つアプリケーション、または独自のAIアシスタントを自前で構築したい開発者や企業。",
        "cautions": "音声処理はレイテンシ（遅延）に非常に敏感です。快適な対話を実現するためには、推論用の高速なGPUサーバーや、エッジ側に近いロケーションでのデプロイが推奨されます。",
        "summary": "<code>dograh</code> は、音声AIエージェントの構築ハードルを大幅に下げるオープンソースプラットフォームです。自由度の高さから、様々な業界での音声アシスタントのプロトタイピングや実運用に活躍するでしょう。"
    },
    {
        "slug": "agents-towards-production",
        "owner_repo": "NirDiamant/agents-towards-production",
        "rank": 8,
        "stars": 19845,
        "genre": "学習ガイド・開発アセット",
        "dek": "プロトタイプから本番環境まで、生成AIエージェントを構築するためのエンドツーエンドのチュートリアル集。",
        "what_is_this": "LLMエージェントを単なるデモレベル（プロトタイプ）から、エンタープライズの「本番環境（Production）」で稼働する堅牢なシステムへと昇華させるための実践的なコード付きチュートリアル集です。",
        "what_can_it_do": "評価（Evaluation）、監視（Observability）、フォールバックメカニズム、エージェントのルーティング、状態管理など、本番運用に不可欠な高度なアーキテクチャパターンを具体的なコードを通して学ぶことができます。",
        "key_features": "<ul><li><strong>実践的なコードファースト</strong>: 理論だけでなく、そのまま動かせるPython/TypeScriptのサンプルコードを多数収録。</li><li><strong>本番向けパターンの網羅</strong>: エラーハンドリングやリトライ、プロンプトのバージョン管理など、実運用で直面する課題に対する解決策を提供。</li><li><strong>段階的な学習</strong>: 基礎的なエージェント構築から始まり、徐々に高度なシステムへと拡張していくステップバイステップの構成。</li></ul>",
        "setup_usage": "各チュートリアルフォルダ（Notebooks または ソースコードディレクトリ）に移動し、要件定義ファイル（<code>requirements.txt</code> など）に従って依存関係をインストール。その後、Notebookを順に実行するか、スクリプトを走らせて動作を確認します。",
        "target_audience": "LLMアプリのデモは作れたが、そこから本番環境へのデプロイ・安定稼働にハードルを感じているソフトウェアエンジニアやAIリサーチャー。",
        "cautions": "チュートリアルで紹介されているパターンは一般的ですが、実際のプロダクトに組み込む際は、自社のシステム構成やセキュリティ要件に合わせてアーキテクチャを調整する必要があります。",
        "summary": "AIエージェントの「本番導入」に立ちはだかる壁を突破するための、まさに必読のリソースです。概念実証（PoC）で終わらせないためのベストプラクティスが詰まっています。"
    },
    {
        "slug": "agent-skills",
        "owner_repo": "tech-leads-club/agent-skills",
        "rank": 7,
        "stars": 3427,
        "genre": "AIコーディング (ワークフロー・プロンプト・開発補助ツール)",
        "dek": "Claude Code や Cursor 等のAIコーディングエージェント向け、検証済みの拡張スキル（ツール）レジストリ。",
        "what_is_this": "Antigravity、Claude Code、Cursor、GitHub Copilot などのAIコーディングエージェントが利用できる、安全で検証済みの「スキル（機能拡張）」を集約・提供するオープンなレジストリ（保存庫）です。",
        "what_can_it_do": "データベース操作、クラウド環境の制御、特定のAPI連携など、AIエージェント単体では実行できない高度な操作を、検証済みの安全なスクリプト（スキル）としてエージェントに読み込ませて実行させることができます。",
        "key_features": "<ul><li><strong>マルチエージェント対応</strong>: 複数の主要なコーディングAIエージェントで共通して利用できる汎用的なフォーマット。</li><li><strong>セキュリティ重視</strong>: 提供されるスキルは検証済みであり、AIが予期せぬ破壊的な動作をしないように制御されています。</li><li><strong>エコシステムの拡張</strong>: コミュニティ主導で日々新しいスキルが追加され、エージェントの能力が無限に拡張されます。</li></ul>",
        "setup_usage": "各AIエージェントのプラグイン/スキル追加機能（例: <code>mcp</code> や <code>.agents/plugins</code> ディレクトリ）を使用して、本レジストリから必要なスキルをインポートします。設定ファイルにスキルのURLやパスを記述するだけで利用開始できます。",
        "target_audience": "AIコーディングエージェントの能力を最大限に引き出し、開発ワークフローを極限まで自動化したいパワーユーザーや開発チーム。",
        "cautions": "AIエージェントに強力なスキル（DB書き込みなど）を与える際は、必ず動作範囲を制限（サンドボックス化）するか、実行前に人間（Human-in-the-loop）の承認フローを設けることを強く推奨します。",
        "summary": "<code>agent-skills</code> は、AIエージェントを単なる「コード生成機」から「自律的なシステム管理者・開発アシスタント」へと進化させる強力な拡張パーツ群です。エコシステムの中心的な役割を担う可能性があります。"
    },
    {
        "slug": "Shadowbroker",
        "owner_repo": "BigBodyCobain/Shadowbroker",
        "rank": 6,
        "stars": 6957,
        "genre": "スクレイピング・情報収集・セキュリティ",
        "dek": "プライベートジェット、人工衛星、地震データなどを統合し、AIエージェントによる解析を可能にするオープンソースOSINTプラットフォーム。",
        "what_is_this": "世界中に散らばる公開情報（OSINT: オープンソース・インテリジェンス）を一つのインターフェースに統合するプラットフォームです。富裕層のプライベートジェットの軌跡から人工衛星の動き、地震イベントまで、あらゆる動的データを可視化します。",
        "what_can_it_do": "バラバラに存在するトラッキングデータを一元化してマップ等に表示します。最大の特長は、AIエージェントを接続し、これら膨大なデータストリームの中から「これまで見過ごされていた相関関係」を自動的に発見・解析させることができる点です。",
        "key_features": "<ul><li><strong>多様なデータソースの統合</strong>: 航空機、衛星、自然災害など、多岐にわたるリアルタイムAPIを単一プラットフォームに集約。</li><li><strong>AIエージェントファースト</strong>: 人間が見るためのUIだけでなく、AIエージェントがデータをパースして自律的にインサイトを抽出できるよう設計。</li><li><strong>高度な情報への民主化アクセス</strong>: 従来は国家機関や専門企業しかアグリゲートしていなかったレベルの情報をオープンソースで提供。</li></ul>",
        "setup_usage": "リポジトリをクローンし、必要な外部APIキー（フライトトラッキングAPIなど）を環境変数に設定します。提供されるスクリプトを起動することで、データの収集・集約サーバーと可視化用のUIが立ち上がります。",
        "target_audience": "データジャーナリスト、セキュリティ研究者、地政学的リスクのアナリスト、およびOSINTデータを用いたAI解析モデルを構築したい開発者。",
        "cautions": "収集するデータの性質上、各データプロバイダー（API提供元）の利用規約（TOS）を遵守する必要があります。また、個人のプライバシーに関わる情報を扱う場合は倫理的な配慮が不可欠です。",
        "summary": "<code>Shadowbroker</code> は、世界の動的な事象を一つのレンズで捉える強力なOSINTツールです。AIエージェントと組み合わせることで、人間には到底不可能な規模でのデータ相関分析を実現するポテンシャルを秘めています。"
    },
    {
        "slug": "cal.diy",
        "owner_repo": "calcom/cal.diy",
        "rank": 3,
        "stars": 43177,
        "genre": "AI基盤・データ基盤・業務アプリ",
        "dek": "「絶対的に誰でも」使えることを目指した、超シンプルでセルフホスト可能な日程調整インフラストラクチャ。",
        "what_is_this": "人気のオープンソース日程調整ツール「Cal.com」チームが開発した、究極まで無駄を削ぎ落としたDIY型の日程調整システム（インフラ）です。",
        "what_can_it_do": "複雑なSaaSに依存することなく、個人や小さなチームが自分たちの日程調整ページ（カレンダーの空き枠表示、予約受付）を驚くほど簡単に自前でホストして公開することができます。",
        "key_features": "<ul><li><strong>極限のシンプルさ</strong>: 大規模なエンタープライズ機能（複数人の複雑なルーティング等）を省き、コアな日程調整機能に特化。</li><li><strong>デプロイの容易さ</strong>: Vercelやローカル環境など、最小限の設定で瞬時に立ち上げ可能。</li><li><strong>完全な所有権</strong>: 自身のカレンダーデータや予約データを第三者のSaaSに渡すことなく、完全にコントロールできる。</li></ul>",
        "setup_usage": "リポジトリをクローンし、自身のカレンダープロバイダー（Google Calendar等）のAPI認証情報を `.env` に設定します。<code>npm install</code> と <code>npm run dev</code> を実行するだけで、ローカルに予約ページが立ち上がります。本番環境へもワンクリックに近い形でデプロイ可能です。",
        "target_audience": "高額な日程調整SaaSのサブスクリプションを避けたいフリーランサー、開発者、または自社サービスにシンプルな日程調整機能をサクッと組み込みたいチーム。",
        "cautions": "あくまで「DIY（Do It Yourself）」を前提とした軽量版であるため、組織全体での複雑な権限管理や、高度なチームスケジューリング機能が必要な場合は、本家の Cal.com を使用する方が適しています。",
        "summary": "<code>cal.diy</code> は、「日程調整」という現代に不可欠な機能を、完全にオープンかつフリーなインフラとして個人の手に取り戻す素晴らしいプロジェクトです。開発者体験（DX）の高さも際立っています。"
    }
]

def main():
    date_str = "2026-05-18"
    time_str = "2026-05-18T04:45:01+09:00"
    
    with open('data/articles.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    def safe_int(v):
        try:
            return int(str(v).replace('#', ''))
        except:
            return 0
    serials = [safe_int(d.get('serial', 0)) for d in data.get('articles', []) if d.get('category') in ['github-trending', 'github-pickup']]
    current_serial = max(serials) if serials else 0
    
    report_serials = [safe_int(d.get('serial', 0)) for d in data.get('articles', []) if d.get('category') == 'github-update-report']
    report_serial = (max(report_serials) if report_serials else 0) + 1
    
    # We will write in reverse order so the highest rank (3) gets the highest serial and appears at the top
    # Wait, reverse of repos_data is cal.diy (rank 3), Shadowbroker (rank 6) etc... 
    # The array repos_data is ordered rank 9, 8, 7, 6, 3. 
    # If we loop in order (9->3), rank 9 gets serial+1, rank 3 gets serial+5. 
    # When we prepend to json, we should prepend rank 9, then rank 8, ... then rank 3. 
    # So rank 3 will be index 0, which is perfect.

    new_articles = []
    
    for item in repos_data:
        current_serial += 1
        html_content = TEMPLATE.replace("{{DEK_DESCRIPTION}}", item['dek'])
        html_content = html_content.replace("{{REPO_SLUG}}", item['slug'])
        html_content = html_content.replace("{{YYYY_MM_DD}}", date_str)
        html_content = html_content.replace("{{RANK_OR_PICKUP}}", f"#{item['rank']}")
        html_content = html_content.replace("{{REPO_URL}}", f"https://github.com/{item['owner_repo']}")
        html_content = html_content.replace("{{OWNER_REPO}}", item['owner_repo'])
        html_content = html_content.replace("{{STAR_COUNT_COMMA}}", f"{item['stars']:,}")
        html_content = html_content.replace("{{WHAT_IS_THIS}}", item['what_is_this'])
        html_content = html_content.replace("{{WHAT_CAN_IT_DO}}", item['what_can_it_do'])
        html_content = html_content.replace("{{KEY_FEATURES}}", item['key_features'])
        html_content = html_content.replace("{{SETUP_USAGE}}", item['setup_usage'])
        html_content = html_content.replace("{{TARGET_AUDIENCE}}", item['target_audience'])
        html_content = html_content.replace("{{CAUTIONS}}", item['cautions'])
        html_content = html_content.replace("{{SUMMARY}}", item['summary'])
        html_content = html_content.replace("{{SERIAL_NUMBER}}", str(current_serial))
        
        file_path = f"articles/github/daily/{date_str}-{item['slug']}.html"
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(html_content)
            
        new_entry = {
            "title": item['slug'],
            "summary": item['dek'],
            "category": "github-trending",
            "genre": item['genre'],
            "originType": "trending",
            "rank": item['rank'],
            "serial": current_serial,
            "publishedAt": date_str,
            "createdAt": time_str,
            "repoName": item['owner_repo'],
            "repoUrl": f"https://github.com/{item['owner_repo']}",
            "articleUrl": f"./{file_path}",
            "starCount": item['stars']
        }
        # Insert at the beginning so the latest (highest rank) ends up at index 0
        data['articles'].insert(0, new_entry)
        
    # Generate Update Report
    total_count = 18
    new_count = 5
    
    all_repos = ['tinyhumansai/openhuman', 'HKUDS/CLI-Anything', 'calcom/cal.diy', 'oven-sh/bun', 'Anil-matcha/Open-Generative-AI', 'BigBodyCobain/Shadowbroker', 'tech-leads-club/agent-skills', 'NirDiamant/agents-towards-production', 'dograh-hq/dograh', 'K-Dense-AI/scientific-agent-skills', 'Light-Heart-Labs/DreamServer', 'KeygraphHQ/shannon', 'TryGhost/Ghost', 'medusajs/medusa', 'knadh/listmonk', 'plausible/analytics', 'colbymchenry/codegraph', 'microsoft/ai-agents-for-beginners']
    
    new_slugs = {item['owner_repo']: item['slug'] for item in repos_data}
    
    ranking_list_html = ""
    for r in all_repos:
        if r in new_slugs:
            ranking_list_html += f'            <li><strong><a href="../daily/{date_str}-{new_slugs[r]}.html">{r}</a></strong> <span class="status-tag status-new">✨ 新規追加</span></li>\n'
        else:
            ranking_list_html += f'            <li><strong>{r}</strong> <span class="status-tag status-skip">未作成</span></li>\n'
            
    with open('templates/github-report.template.html', 'r', encoding='utf-8') as f:
        report_template = f.read()
        
    report_html = report_template.replace('{{YYYY_MM_DD}}', date_str)
    report_html = report_html.replace('{{TOTAL_COUNT}}', str(total_count))
    report_html = report_html.replace('{{NEW_COUNT}}', str(new_count))
    report_html = report_html.replace('{{RANKING_LIST_ITEMS}}', ranking_list_html)
    report_html = report_html.replace('{{FUTURE_OUTLOOK}}', '引き続き、AIエージェントや実践的なOSINTなど、実用性の高いツールが人気を集めています。')
    
    report_path = f"articles/github/reports/{date_str}-update-report.html"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report_html)
        
    report_entry = {
        "title": f"{date_str} アップデートレポート",
        "summary": "本日調査したGitHubトレンドの全順位と、新規作成された記事のまとめ",
        "category": "github-update-report",
        "genre": "アップデートレポート",
        "originType": "report",
        "serial": report_serial,
        "publishedAt": date_str,
        "createdAt": time_str,
        "repoName": "",
        "repoUrl": "",
        "articleUrl": f"./{report_path}",
        "starCount": 0
    }
    data['articles'].insert(0, report_entry)

    with open('data/articles.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    main()
