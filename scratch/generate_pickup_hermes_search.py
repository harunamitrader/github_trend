import os

template_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\templates\github-daily.template.html'
output_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\articles\github\daily\2026-05-07-robbyczgw-cla-hermes-web-search-plus.html'

with open(template_path, 'r', encoding='utf-8') as f:
    template = f.read()

art = {
    "title": "hermes-web-search-plus",
    "dek": "Hermes Agent に「最強の検索能力」を。10 種類以上のプロバイダーを自動使い分け、ウェブ情報の抽出・要約を極限まで高度化する特化型プラグイン。",
    "owner_repo": "robbyczgw-cla/hermes-web-search-plus",
    "repo_url": "https://github.com/robbyczgw-cla/hermes-web-search-plus",
    "star_count": 151,
    "serial": 465,
    "what_is_this": "自律型 AI エージェントフレームワーク「Hermes Agent」のウェブ検索・情報抽出機能を劇的に強化するための、インテリジェントなプラグインです。単一の検索エンジンに依存せず、複数のプロバイダーをクエリの意図に応じて動的に切り替える「自動ルーティング」機能を備えています。",
    "what_can_it_do": "Serper, Brave, Tavily, Exa, Perplexity などの主要な検索・リサーチ API 10 種類以上に対応。質問の内容（最新ニュース、専門論文、一般的なウェブ情報など）を解析し、最適なプロバイダーを自動選択します。また、抽出された URL からクリーンな Markdown コンテンツを生成する高度なスクレイピング機能も統合されています。",
    "key_features": "意図に基づく自動ルーティング（Auto-Routing）。失敗時の代替プロバイダーへの自動フォールバック。Exa を活用した「深層推論（Deep Reasoning）」モード。API コールを節約するローカルキャッシュ。詳細な診断レポート（なぜその検索エンジンを選んだか）の出力。",
    "setup_usage": "Hermes Agent のプラグインディレクトリにクローン、またはパッケージとしてインストール。各種検索 API のキーを設定ファイルに記述するだけで、エージェントが既存の検索ツールよりも賢くウェブを探索できるようになります。",
    "target_audience": "Hermes Agent を使って高度な調査・要約タスクを行いたい開発者、検索の精度や信頼性を極限まで高めたいエージェントエンジニア。",
    "cautions": "複数の外部 API を利用するため、各サービスの利用料金やレート制限に注意が必要です。また、特定のプロバイダーがダウンしている場合、ルーティング設定によっては挙動が変わる可能性があります。",
    "summary": "エージェントが「ネットで調べる」という行為の質を、ルーティングと抽出の技術によって一段上のレベルへ引き上げる、非常に実用性の高い拡張ツールです。"
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
