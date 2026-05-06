import os

template_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\templates\github-daily.template.html'
output_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\articles\github\daily\2026-05-07-ekkolearnai-hermes-web-ui.html'

with open(template_path, 'r', encoding='utf-8') as f:
    template = f.read()

art = {
    "title": "hermes-web-ui",
    "dek": "AI エージェントをブラウザから完全制御。Telegram や Discord など多プラットフォーム連携を統合管理する、Hermes Agent 専用の高機能ダッシュボード。",
    "owner_repo": "EKKOLearnAI/hermes-web-ui",
    "repo_url": "https://github.com/EKKOLearnAI/hermes-web-ui",
    "star_count": 3712,  # Approximately 3.7k
    "serial": 459,
    "what_is_this": "自律型 AI エージェント「Hermes Agent」を視覚的に操作・管理するための、レスポンシブな Web ダッシュボードです。CLI（コマンドライン）での操作をリッチな GUI に置き換え、エージェントの活動状況をリアルタイムで把握できます。",
    "what_can_it_do": "リアルタイムの AI チャット、ファイル管理、 cron ジョブのスケジュール管理、そして Telegram, Discord, Slack, WhatsApp などの主要なメッセージングプラットフォームとの連携設定を一元的に行えます。エージェントの利用コストやトレンドのモニタリングも可能です。",
    "key_features": "SSE（Server-Sent Events）によるリアルタイムストリーミングチャット。マルチセッション管理と Markdown レンダリング。多言語・多プラットフォーム対応の柔軟なゲートウェイ設定。MCP（Model Context Protocol）との高い親和性も期待されます。",
    "setup_usage": "バックエンドの Hermes Agent を起動した状態で、Node.js 環境にてリポジトリをクローンし、依存関係をインストールして `npm run dev` 等でダッシュボードを起動します。設定画面から各種 API キーを入力して各プラットフォームと接続します。",
    "target_audience": "自律型 AI エージェントを複数の SNS やチャットアプリで運用したい開発者、エージェントの稼働状況をブラウザから手軽に管理したいユーザー。",
    "cautions": "複数のプラットフォームと連携するため、各サービスの API キーの管理とセキュリティ設定（認証等）を適切に行う必要があります。自己ホスト環境での運用が基本となります。",
    "summary": "エージェントが「道具」から「自律的なサービス」へと進化する中で、その司令塔となるダッシュボードの重要性は増しています。Hermes Web UI は、その管理コストを大幅に下げてくれる強力なツールです。"
}

content = template
content = content.replace('{{REPO_SLUG}}', art['title'])
content = content.replace('{{DEK_DESCRIPTION}}', art['dek'])
content = content.replace('{{YYYY_MM_DD}}', '2026-05-07')
content = content.replace('{{RANK_OR_PICKUP}}', '<strong>Pickup</strong>')
content = content.replace('{{REPO_URL}}', art['repo_url'])
content = content.replace('{{OWNER_REPO}}', art['owner_repo'])
content = content.replace('{{STAR_COUNT_COMMA}}', f"{art['star_count']:,}")
content = content.replace('{{WHAT_IS_THIS}}', art['what_is_this'])
content = content.replace('{{WHAT_CAN_IT_DO}}', art['what_can_it_do'])
content = content.replace('{{KEY_FEATURES}}', art['key_features'])
content = content.replace('{{SETUP_USAGE}}', art['setup_usage'])
content = content.replace('{{TARGET_AUDIENCE}}', art['target_audience'])
content = content.replace('{{CAUTIONS}}', art['cautions'])
content = content.replace('{{SUMMARY}}', art['summary'])
content = content.replace('{{SERIAL_NUMBER}}', str(art['serial']))

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Created {output_path}")
