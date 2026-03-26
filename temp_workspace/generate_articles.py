import os
import json

base_dir = r"c:\Users\sgmxk\Desktop\AI\harunami_ai_base_project\harunami_ai_base\articles\tools"
os.makedirs(base_dir, exist_ok=True)

template = """<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | harunami AI base</title>
    <link rel="stylesheet" href="../../styles.css">
</head>
<body class="theme-aitools">
    <nav class="top-nav">
        <a href="../../index.html" class="nav-item">Home</a>
        <a href="../../ai-tools-monitor.html" class="nav-item active">AI Tools</a>
    </nav>
    <div class="shell">
        <article class="article-card">
            <header class="article-header">
                <p class="eyebrow">{eyebrow}</p>
                <h1>{title}</h1>
                <p class="article-meta">Published: {date} | Model: {model}</p>
            </header>
            <div class="article-body">
                {body}
            </div>
            <footer class="article-footer">
                <p>Source: <a href="{source_url}" target="_blank">{source_name}</a></p>
            </div>
        </article>
        <footer class="footer"><p>harunami AI base</p></footer>
    </div>
</body>
</html>"""

articles_data = [
    # ChatGPT
    {
        "slug": "2026-03-chatgpt-gpt54-thinking", "title": "ChatGPT 3月アップデート: GPT-5.4 系列 導入と世代交代", "eyebrow": "Tool Update: ChatGPT", "date": "2026-03-11", "model": "GPT-5.4 Thinking", "source_url": "https://openai.com/blog", "source_name": "OpenAI Blog",
        "body": "GPT-5.1 系列が引退し、最新の GPT-5.4 系列への移行が完了しました。推論能力とコンテキストウィンドウが大幅に強化されています。"
    },
    {
        "slug": "2026-03-chatgpt-googledrive", "title": "ChatGPT 3月アップデート: Google Drive 統合の刷新", "eyebrow": "Tool Update: ChatGPT", "date": "2026-03-25", "model": "ChatGPT UI", "source_url": "https://openai.com/blog", "source_name": "OpenAI Blog",
        "body": "Docs, Sheets, Slides を単一のインターフェースで扱えるようになり、資産の参照や共有がさらにスムーズになりました。"
    },
    {
        "slug": "2026-03-chatgpt-largepaste", "title": "ChatGPT 3月アップデート: 5,000文字以上の自動添付機能", "eyebrow": "Tool Update: ChatGPT", "date": "2026-03-01", "model": "ChatGPT UI", "source_url": "https://openai.com/blog", "source_name": "OpenAI Blog",
        "body": "大型のペーストを検知すると自動的にテキストファイル化して添付。プロンプトの読みやすさが劇的に向上しています。"
    },
    {
        "slug": "2026-03-chatgpt-shopping", "title": "ChatGPT 3月アップデート: 買い物エージェント機能の強化", "eyebrow": "Tool Update: ChatGPT", "date": "2026-03-05", "model": "ChatGPT Agent", "source_url": "https://openai.com/blog", "source_name": "OpenAI Blog",
        "body": "他製品の比較や画像検索、会話形式でのブラウジングをサポート。買い物エージェントとしての実用性が飛躍しました。"
    },
    # Perplexity
    {
        "slug": "2026-03-perplexity-computer-launch", "title": "Perplexity Computer 発表: マルチモデル・オーケストレーション", "eyebrow": "Tool Update: Perplexity", "date": "2026-03-24", "model": "Perplexity Computer", "source_url": "https://www.perplexity.ai/blog", "source_name": "Perplexity Blog",
        "body": "タスクに合わせて GPT-5.4 や Claude 4.6 などを自動割当する新システム『Computer』がローンチされました。"
    },
    {
        "slug": "2026-03-perplexity-iphone-comet", "title": "Perplexity AI 3月更新: iPhone 用 ブラウザ Comet 提供開始", "eyebrow": "Tool Update: Perplexity", "date": "2026-03-15", "model": "Comet Browser", "source_url": "https://www.perplexity.ai/blog", "source_name": "Perplexity Blog",
        "body": "モバイルでのリサーチ体験を極める AI 専用ブラウザ Comet が iPhone でも利用可能になりました。"
    },
    {
        "slug": "2026-03-perplexity-deepresearch", "title": "Perplexity AI 3月更新: Deep Research Opus 4.5 導入", "eyebrow": "Tool Update: Perplexity", "date": "2026-03-10", "model": "Opus 4.5", "source_url": "https://www.perplexity.ai/blog", "source_name": "Perplexity Blog",
        "body": "専門的な調査機能 Deep Research において、最新モデル Opus 4.5 が利用可能になり、推論精度に磨きがかかりました。"
    },
    # Claude
    {
        "slug": "2026-03-claude-models-api", "title": "Claude 3月アップデート: Models API 発表とメディア上限緩和", "eyebrow": "Tool Update: Claude", "date": "2026-03-25", "model": "Claude Models API", "source_url": "https://www.anthropic.com/claude", "source_name": "Anthropic Site",
        "body": "コンテキストウィンドウの仕様をクエリできる新 API の提供と、最大 600 枚の画像入力対応を開始しました。"
    },
    {
        "slug": "2026-03-claude-marketplace-open", "title": "Claude 3月アップデート: Claude Marketplace が正式オープン", "eyebrow": "Tool Update: Claude", "date": "2026-03-06", "model": "Claude Ecosystem", "source_url": "https://www.anthropic.com/claude", "source_name": "Anthropic Site",
        "body": "外部プロダクトやスキルを一括で購入・管理できるマーケットプレイスが登場。拡張性が一段と高まっています。"
    },
    {
        "slug": "2026-03-claude-persistent-memory", "title": "Claude 3月アップデート: 全ユーザーへ永続メモリを提供", "eyebrow": "Tool Update: Claude", "date": "2026-03-20", "model": "Persistent Memory", "source_url": "https://www.anthropic.com/claude", "source_name": "Anthropic Site",
        "body": "無料ユーザーを含む全層に、文脈や好みをセッションを跨いで保持する「永続メモリ」の展開が完了しました。"
    },
    {
        "slug": "2026-03-claude-visualizations", "title": "Claude 3月アップデート: インライン可視化 (Artifacts強化)", "eyebrow": "Tool Update: Claude", "date": "2026-03-01", "model": "Claude Visualizations", "source_url": "https://www.anthropic.com/claude", "source_name": "Anthropic Site",
        "body": "チャートや図解を対話の途中に自動生成する機能が強化。複雑なデータの理解を視覚的にサポートします。"
    },
    # Gemini
    {
        "slug": "2026-03-gemini-lyria-launch", "title": "Google Gemini 3月更新: Lyria 3 音楽・音声生成公開", "eyebrow": "Tool Update: Gemini", "date": "2026-03-25", "model": "Lyria 3 Pro", "source_url": "https://ai.google.dev/changelog", "source_name": "Google Developers",
        "body": "テキストや画像から高品質な 48kHz 音響を生成する Lyria 3 プレビューが開発者向けに公開されました。"
    },
    {
        "slug": "2026-03-gemini-ai-studio-billing", "title": "Google Gemini 3月更新: AI Studio で新課金プラン開始", "eyebrow": "Tool Update: Gemini", "date": "2026-03-23", "model": "AI Studio Billing", "source_url": "https://ai.google.dev/changelog", "source_name": "Google Developers",
        "body": "Prepay/Postpay に対応し、商用サービスへのスケーリングが容易になりました。予算上限設定も可能です。"
    },
    {
        "slug": "2026-03-gemini-embedding-v2", "title": "Google Gemini 3月更新: Multimodal Embedding-2 登場", "eyebrow": "Tool Update: Gemini", "date": "2026-03-10", "model": "Embedding-2", "source_url": "https://ai.google.dev/changelog", "source_name": "Google Developers",
        "body": "テキスト、画像、ビデオ、オーディオをひとつのベクトル空間で扱う、高度なマルチモーダル埋め込みモデルが提供開始。"
    },
    {
        "slug": "2026-03-gemini-v31-pro-preview", "title": "Google Gemini 3月更新: v3.1 Pro プレビュー統合完了", "eyebrow": "Tool Update: Gemini", "date": "2026-03-09", "model": "Gemini 3.1 Pro", "source_url": "https://ai.google.dev/changelog", "source_name": "Google Developers",
        "body": "最新モデルへの統合が完了。レスポンス速度と命令遵守率がさらに改善されています。"
    },
    # Grok
    {
        "slug": "2026-03-grok-4-reasoning-phd", "title": "xAI Grok-4 発表: 科学的推論を PhD レベルへ", "eyebrow": "Tool Update: Grok (xAI)", "date": "2026-03-20", "model": "Grok-4", "source_url": "https://x.ai/blog", "source_name": "xAI Blog",
        "body": "科学分野での最高峰の推論性能を目指す Grok-4 が発表。複雑な多段階推論に特化しています。"
    },
    {
        "slug": "2026-03-grok-4-20-beta2", "title": "xAI Grok-4.20 Beta 2: 命令遵守と画像検索の改善", "eyebrow": "Tool Update: Grok (xAI)", "date": "2026-03-04", "model": "Grok 4.20 Beta 2", "source_url": "https://x.ai/blog", "source_name": "xAI Blog",
        "body": "API 利用者向けに Beta 2 を放出。画像生成のトリガー精度とハルシネーション抑制が見直されています。"
    },
    # Grok CLI
    {
        "slug": "2026-03-grok-cli-v10-rc5", "title": "Grok CLI 3月更新: v1.0.0-rc5 公開", "eyebrow": "Tool Update: Grok CLI", "date": "2026-03-23", "model": "v1.0.0-rc5", "source_url": "https://github.com/superagent-ai/grok-cli", "source_name": "Grok CLI GitHub",
        "body": "Grok-3 mini サポートと、推論設定 `reasoningEffort` のバグ修正を含むリリース候補第 5 版です。"
    },
    {
        "slug": "2026-03-grok-cli-v10-rc4", "title": "Grok CLI 3月更新: マルチエージェント対応と TUI 刷新", "eyebrow": "Tool Update: Grok CLI", "date": "2026-03-23", "model": "v1.0.0-rc4", "source_url": "https://github.com/superagent-ai/grok-cli", "source_name": "Grok CLI GitHub",
        "body": "マルチエージェント API に正式対応。アニメーション付きのスムーズなターミナル UI へ刷新されました。"
    },
    {
        "slug": "2026-03-grok-cli-v10-rc3", "title": "Grok CLI 3月更新: Headless モードと JSON 出力対応", "eyebrow": "Tool Update: Grok CLI", "date": "2026-03-22", "model": "v1.0.0-rc3", "source_url": "https://github.com/superagent-ai/grok-cli", "source_name": "Grok CLI GitHub",
        "body": "自動化ツールからの利用を想定した JSON モードを搭載。コマンドラインでの実用性がさらに高まりました。"
    },
    # Obsidian
    {
        "slug": "2026-03-obsidian-v1127-release", "title": "Obsidian 3月更新: v1.12.7 公開 (CLI 統合)", "eyebrow": "Tool Update: Obsidian", "date": "2026-03-24", "model": "v1.12.7", "source_url": "https://obsidian.md/changelog", "source_name": "Obsidian Blog",
        "body": "ターミナルからの操作を高速化する専用 CLI ツールが同梱されました。パワーユーザー必須の機能です。"
    },
    {
        "slug": "2026-03-obsidian-v1120-iphone-share", "title": "Obsidian 3月更新: v1.12.0 iPhone 保存拡張の導入", "eyebrow": "Tool Update: Obsidian", "date": "2026-03-10", "model": "v1.12.0", "source_url": "https://obsidian.md/changelog", "source_name": "Obsidian Blog",
        "body": "iOS 向け Share extension が改良。他アプリからの情報クリップ速度が大幅に改善されました。"
    },
    # NotebookLM
    {
        "slug": "2026-03-notebooklm-cinematic-video", "title": "NotebookLM 3月更新: Cinematic Video 概要生成", "eyebrow": "Tool Update: NotebookLM", "date": "2026-03-24", "model": "Gemini / Veo 3", "source_url": "https://blog.google/products/google-labs/", "source_name": "Google Labs Blog",
        "body": "リサーチ内容をプロ品質のビデオに変換する機能を搭載。視覚的な要約を自動で行います。"
    },
    {
        "slug": "2026-03-notebooklm-epub-support", "title": "NotebookLM 3月更新: EPUB フォーマットに完全対応", "eyebrow": "Tool Update: NotebookLM", "date": "2026-03-15", "model": "NotebookLM UI", "source_url": "https://blog.google/products/google-labs/", "source_name": "Google Labs Blog",
        "body": "多くの要望があった電子書籍 (EPUB) ファイルのアップロードをサポート。長文リサーチが捗ります。"
    },
    {
        "slug": "2026-03-notebooklm-infographics", "title": "NotebookLM 3月更新: インフォグラフィック機能の強化", "eyebrow": "Tool Update: NotebookLM", "date": "2026-03-10", "model": "NotebookLM UI", "source_url": "https://blog.google/products/google-labs/", "source_name": "Google Labs Blog",
        "body": "10 種の新しいデザインスタイルを追加。情報のビジュアル展開がより自由になりました。"
    },
    # OpenClaw
    {
        "slug": "2026-03-openclaw-teams-official", "title": "OpenClaw 3月更新: Microsoft Teams 公式 SDK 移行", "eyebrow": "Tool Update: OpenClaw", "date": "2026-03-24", "model": "OpenClaw Teams", "source_url": "https://github.com/lucianlamp/openclaw", "source_name": "OpenClaw GitHub",
        "body": "Teams 公式 SDK への移行により、ウェルカムカードやタイピング表示などリッチな対話が可能になりました。"
    },
    {
        "slug": "2026-03-openclaw-control-ui-tabs", "title": "OpenClaw 3月更新: Control UI のタブ化管理を導入", "eyebrow": "Tool Update: OpenClaw", "date": "2026-03-15", "model": "Control UI", "source_url": "https://github.com/lucianlamp/openclaw", "source_name": "OpenClaw GitHub",
        "body": "スキルの状態（準備・無効など）をタブで一括管理できる新インターフェース。設定効率が格段にあがりました。"
    },
    {
        "slug": "2026-03-openclaw-openai-compat-v1", "title": "OpenClaw 3月更新: OpenAI API (/v1/embeddings) 対応", "eyebrow": "Tool Update: OpenClaw", "date": "2026-03-05", "model": "API Compatibility", "source_url": "https://github.com/lucianlamp/openclaw", "source_name": "OpenClaw GitHub",
        "body": "embeddings エンドポイント対応により、既存のベクターDBエコシステムとの連携が可能になりました。"
    }
]

# Generate HTML Files
for art in articles_data:
    filename = f"{art['slug']}.html"
    filepath = os.path.join(base_dir, filename)
    content = template.format(
        title=art['title'],
        eyebrow=art['eyebrow'],
        date=art['date'],
        model=art['model'],
        body=art['body'],
        source_url=art['source_url'],
        source_name=art['source_name']
    )
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Generated {len(articles_data)} article files.")
