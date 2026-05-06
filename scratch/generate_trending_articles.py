import os

template_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\templates\github-daily.template.html'
output_dir = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\articles\github\daily'

with open(template_path, 'r', encoding='utf-8') as f:
    template = f.read()

articles = [
    {
        "slug": "2026-05-07-cheahjs-free-llm-api-resources",
        "title": "free-llm-api-resources",
        "dek": "開発のコスト障壁を打破。LLM API の無料枠やトライアル特典を提供するサービスを網羅した、開発者必携のリソース・ディレクトリ。",
        "repoName": "cheahjs/free-llm-api-resources",
        "repoUrl": "https://github.com/cheahjs/free-llm-api-resources",
        "starCount": 20387,
        "rank": 11,
        "genre": "学習ガイド・開発アセット",
        "summary": "開発者がコストを抑えて LLM アプリケーションを構築・実験できるよう、永続的な無料枠や初回トライアルクレジットを提供する API プロバイダーを網羅したリスト。テキスト生成から埋め込み、マルチモーダル API までカテゴリ別に整理されており、個人開発やプロトタイピングの強い味方となります。",
        "this_is_what": "主要な LLM プロバイダー（OpenAI, Anthropic, Google, Groq, Mistral 等）が提供している無料の API アクセス枠や、特定のプラットフォーム経由で利用可能な無料推論リソースをまとめたキュレーション・リポジトリです。",
        "core_features": "<li><strong>プロバイダー分類:</strong> 永続的な無料枠を持つサービスと、初回限定クレジットを提供するサービスを明確に区別して掲載。</li><li><strong>多種多様なモデル:</strong> テキスト LLM だけでなく、画像生成、音声処理、埋め込み（Embeddings）モデルの無料枠もカバー。</li><li><strong>コミュニティ駆動:</strong> 常に最新の提供状況が反映されるよう、コミュニティからの情報提供によって頻繁に更新されています。</li>",
        "impact": "高額な API 費用がハードルとなっていた個人開発者や学生にとって、実用的なアプリ構築を始めるための「地図」として機能します。特に最近増加している、推論速度に特化したプロバイダーの無料枠なども網羅されており、最新技術の試作コストを劇的に下げることができます。",
        "future": "LLM 市場の競争激化に伴い、各社が開発者獲得のために提供する無料枠は刻々と変化しています。このリポジトリは、そうした流動的なリソース状況を把握するための標準的なリファレンスとしての地位を確立していくでしょう。"
    },
    {
        "slug": "2026-05-07-anthropics-financial-services",
        "title": "financial-services",
        "dek": "金融実務に Claude の知性を。投資銀行、PE、リサーチ業務を自動化・高度化するための公式エージェント、スキル、データコネクタ集。",
        "repoName": "anthropics/financial-services",
        "repoUrl": "https://github.com/anthropics/financial-services",
        "starCount": 8933,
        "rank": 9,
        "genre": "AIエージェント (自律基盤・特化アプリ)",
        "summary": "金融業界（投資銀行、株式リサーチ、プライベート・エクイティ、ウェルス・マネジメント等）の専門的なワークフローを Claude で実行するための公式リソース集。DCF モデリング、LBO 分析、ディールトラッキング、コンプライアンスチェックなどの複雑なタスクを、Claude Code や Claude Cowork で実行可能な形式で提供します。",
        "this_is_what": "Anthropic が公式に提供する、金融サービス業界向けの参照エージェント、ツール、およびデータ連携用のテンプレート集です。金融実務者が AI を業務に導入する際の「標準的な設計図」となります。",
        "core_features": "<li><strong>専門ワークフローの自動化:</strong> 財務諸表の分析、バリュエーション（DCF/LBO）、ピッチブック作成支援など、金融特有のタスクに最適化されたプロンプトとスキルを提供。</li><li><strong>柔軟なカスタマイズ:</strong> すべてのリソースは Markdown と JSON で構成されており、各金融機関独自のコンプライアンス要件や内部プロセスに合わせて容易に調整可能。</li><li><strong>データ連携の標準化:</strong> 外部の金融データソースや社内データベースと Claude を安全に連携させるための、公式推奨のコネクタ構成例を収録。</li>",
        "impact": "高度な専門知識を必要とする金融業務において、AI が単なる「チャット」を超えて「実務実行エージェント」として機能することを示しています。これにより、アナリストの単純作業が削減され、より高度な意思決定や戦略立案に注力できる環境が整います。",
        "future": "金融業界における AI 活用のデファクトスタンダード（標準）を目指す動きと言えます。今後、より多くの実務用スキルが追加され、Claude が金融プロフェッショナルの「必須の同僚（Coworker）」としての地位を固める契機となるでしょう。"
    },
    {
        "slug": "2026-05-07-insforge-insforge",
        "title": "InsForge",
        "dek": "AI エージェントが自らバックエンドを構築。Postgres を基盤に、認証・DB・ストレージをセマンティックに制御する、次世代の AI ネイティブ・バックエンド・プラットフォーム。",
        "repoName": "InsForge/InsForge",
        "repoUrl": "https://github.com/InsForge/InsForge",
        "starCount": 8348,
        "rank": 7,
        "genre": "AI基盤・データ基盤・業務アプリ",
        "summary": "AI コーディングエージェントが、アプリケーションのバックエンド（認証、データベース、ストレージ、サーバーレス関数）を自律的にプロビジョニングし、管理できるように設計されたオープンソースプラットフォーム。Postgres を核としたセマンティックレイヤーを提供し、AI がシステムの構造を深く理解して操作することを可能にします。",
        "this_is_what": "AI エージェントがフルスタック開発を行う際に、最も「扱いやすい」形でバックエンド機能を提供する、AI ネイティブな開発プラットフォームです。MCP（Model Context Protocol）にも対応しており、エージェントとの高い親和性を誇ります。",
        "core_features": "<li><strong>AI 専用セマンティックレイヤー:</strong> バックエンドの各機能を、AI が理解・操作しやすい抽象化されたメタデータ形式で公開。</li><li><strong>統合インフラ:</strong> 認証、リレーショナル DB、オブジェクトストレージ、バックエンド関数を一つの Postgres ベースのシステムに統合。</li><li><strong>エージェントによる自動管理:</strong> エージェントが要件に応じてテーブルを作成し、権限を設定し、API を公開する一連のプロセスを自動化。</li>",
        "impact": "これまでの AI コーディングは「コードを書く」ことに主眼がありましたが、InsForge は「インフラと機能を管理・運用する」段階へと引き上げます。これにより、エージェントが自律的に動く Web アプリケーションの「頭脳」と「体（バックエンド）」が直結されることになります。",
        "future": "AI が単なるアシスタントではなく、DevOps やインフラ管理を含む「自律的なエンジニア」として振る舞うための標準基盤となる可能性があります。MCP との連携により、多様な AI ツールから利用可能な汎用バックエンドとしての普及が期待されます。"
    },
    {
        "slug": "2026-05-07-ladybirdbrowser-ladybird",
        "title": "ladybird",
        "dek": "既存の巨人の肩に乗らない、真の独立。Chromium も Firefox も使わず、ゼロから独自のレンダリング・JS エンジンを構築する、完全新規のオープンソース・ブラウザ。",
        "repoName": "LadybirdBrowser/ladybird",
        "repoUrl": "https://github.com/LadybirdBrowser/ladybird",
        "starCount": 62921,
        "rank": 6,
        "genre": "メディア作成・マルチモーダル・UI",
        "summary": "既存のブラウザエンジン（Blink, WebKit, Gecko 等）を一切使用せず、C++ でレンダリングエンジン（LibWeb）や JavaScript エンジン（LibJS）をゼロから開発している、完全に独立した新しいウェブブラウザプロジェクト。企業の利益に左右されない、純粋にオープンなウェブ体験の提供を目指しています。",
        "this_is_what": "非営利団体 Ladybird Browser Initiative によって開発されている、モダンで標準準拠なブラウザです。「ウェブブラウザの多様性を取り戻す」ことを究極の目標としています。",
        "core_features": "<li><strong>完全独自エンジン:</strong> 依存関係を持たない独自実装により、既存エンジンのバグや設計上の制限に縛られないクリーンな開発を実現。</li><li><strong>高いセキュリティ意識:</strong> 最新の C++ 標準とマルチプロセスアーキテクチャを採用し、堅牢で安全なブラウジング体験を追求。</li><li><strong>非営利・コミュニティ主導:</strong> 広告ビジネスやユーザー追跡に依存せず、寄付と貢献者による開発を継続する透明性の高い運営。</li>",
        "impact": "ブラウザ市場が Chromium ベースに寡占化される中で、第三の選択肢（独立した実装）が存在することは、ウェブ標準の健全な発展にとって極めて重要です。Ladybird は、オープンなウェブの自由を守るための技術的砦として大きな注目を集めています。",
        "future": "2026 年のアルファ版、2028 年の安定版リリースに向けて開発が加速しています。AI 全盛期において、ブラウザが「AI エージェントの活動場所」となる中、完全に透明で制御可能なエンジンの存在は、エージェント技術の発展にも寄与する可能性があります。"
    },
    {
        "slug": "2026-05-07-addyosmani-agent-skills",
        "title": "agent-skills",
        "dek": "AI に「シニアエンジニアの規律」を。仕様策定、テスト、レビュー、デプロイなど、実務で不可欠な開発プロセスを AI エージェントに実行させるためのエンジニアリング・スキル集。",
        "repoName": "addyosmani/agent-skills",
        "repoUrl": "https://github.com/addyosmani/agent-skills",
        "starCount": 30111,
        "rank": 2,
        "genre": "AIコーディング (ワークフロー・プロンプト・開発補助ツール)",
        "summary": "AI コーディングエージェントが、単に動くコードを書くだけでなく、プロフェッショナルなソフトウェア開発ライフサイクル（SDLC）を遵守できるようにするための「スキル（命令セット）」と「スラッシュコマンド」のコレクション。Google のエンジニアリング・マネージャー Addy Osmani 氏によって公開されました。",
        "this_is_what": "Claude Code, Cursor, Windsurf, GitHub Copilot 等の主要な AI ツールで利用可能な、高品質な開発ワークフローを定義したリソース集です。AI が「勝手にコードを書き換えて壊す」ことを防ぎ、規律ある開発を実現します。",
        "core_features": "<li><strong>20 種類以上のエンジニアリング・スキル:</strong> `/spec`（仕様策定）、`/plan`（計画）、`/test`（テスト）、`/review`（レビュー）などのコマンドを通じて、AI にシニアレベルの思考と手順を強制。</li><li><strong>チェックポイントと終了条件:</strong> 各工程において「何を達成すべきか」が明確に定義されており、AI がプロセスを省略することを防ぐ。</li><li><strong>ツール横断的な互換性:</strong> どの AI コーディングツールでも機能するよう設計されており、開発環境を問わず「プロフェッショナルな AI ワークフロー」を導入可能。</li>",
        "impact": "AI コーディングの質を「ジュニアレベルのパッチ当て」から「シニアレベルの統合開発」へと引き上げます。特に大規模なプロダクションコードを扱う際、AI がテストやレビューのプロセスを自律的に実行することで、人間側の監督負荷を劇的に軽減します。",
        "future": "AI が開発チームの「完全なメンバー」として機能するために必要な、共通の「プロトコル（作法）」となっていくでしょう。今後、より多くの開発現場で「標準スキルセット」として採用されることが予想されます。"
    }
]

for art in articles:
    content = template
    content = content.replace('{{ARTICLE_TITLE}}', art['title'])
    content = content.replace('{{DEK_DESCRIPTION}}', art['dek'])
    content = content.replace('{{YYYY_MM_DD}}', '2026-05-07')
    content = content.replace('{{METADATA_LABEL_1}}', 'Rank')
    content = content.replace('{{METADATA_VALUE_1}}', f'No.{art["rank"]}')
    content = content.replace('{{METADATA_LABEL_2}}', 'GitHub')
    content = content.replace('{{METADATA_VALUE_2}}', art['repoName'])
    content = content.replace('{{METADATA_LABEL_3}}', 'Genre')
    content = content.replace('{{METADATA_VALUE_3}}', art['genre'])
    content = content.replace('{{METADATA_LABEL_4}}', 'Stars')
    content = content.replace('{{METADATA_VALUE_4}}', f'{art["starCount"]:,}')
    content = content.replace('{{EYEBROW_TEXT}}', 'GitHub Watcher')
    content = content.replace('{{SUMMARY_TEXT}}', art['summary'])
    content = content.replace('{{THIS_IS_WHAT_TEXT}}', art['this_is_what'])
    content = content.replace('{{CORE_FEATURES_LIST}}', art['core_features'])
    content = content.replace('{{IMPACT_TEXT}}', art['impact'])
    content = content.replace('{{FUTURE_TEXT}}', art['future'])
    content = content.replace('{{GITHUB_URL}}', art['repoUrl'])
    content = content.replace('{{BACK_LINK_URL}}', '../../github-trend.html')

    file_name = f"{art['slug']}.html"
    file_path = os.path.join(output_dir, file_name)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Created {file_name}")
