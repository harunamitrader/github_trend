import os

template_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\templates\github-daily.template.html'
output_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\articles\github\daily\2026-05-07-anthropics-cwc-long-running-agents.html'

with open(template_path, 'r', encoding='utf-8') as f:
    template = f.read()

art = {
    "title": "cwc-long-running-agents",
    "dek": "エージェントを「止まらないエンジニア」へ。長時間・多セッションにわたる複雑なタスクを Claude に完遂させるための、Anthropic 公式ハーネス実装例。",
    "owner_repo": "anthropics/cwc-long-running-agents",
    "repo_url": "https://github.com/anthropics/cwc-long-running-agents",
    "star_count": 29,
    "serial": 462,
    "what_is_this": "長時間（数時間から数日）にわたって稼働する AI エージェントが、コンテキストの喪失や迷走を防ぎながら複雑なタスクを完遂できるようにするための「ハーネス（制御機構）」の実装例です。Anthropic のエンジニアリングチームが提唱する「品質ループ（Quality Loop）」の概念を具現化したリポジトリです。",
    "what_can_it_do": "エージェントが自ら進捗を記録し、Git 履歴を活用してセッションを跨いだ作業の引き継ぎを行うための構造を提供します。また、独立した評価用エージェント（Evaluator）を動かし、客観的な視点で成果物の品質をチェックする「自己検証」の仕組みを導入できます。",
    "key_features": "Default-FAIL 原則（証拠がない限り不合格とする評価基準）。Fresh-context 評価（編集権限のないクリーンな環境での検証）。エージェントによる自動進捗ノート（handoff）の作成と管理。Claude Code 等のツールと組み合わせて利用可能な設計。",
    "setup_usage": "リポジトリをクローンし、提供されているスクリプトやプロンプトテンプレートを参考に、自身のエージェントワークフローに組み込みます。特に、エージェントが `/spec` や `/plan` などの段階を経て作業を進める「規律」を定義する際に役立ちます。",
    "target_audience": "大規模なリファクタリングや新機能実装など、長時間かかるタスクを AI エージェントに任せたい開発者、エージェントの自律性と信頼性を高めたいエンジニア。",
    "cautions": "このリポジトリは Anthropic のワークショップ用教材としての側面が強く、そのまま動かすアプリというよりは「設計思想とコード片」の提供に主眼が置かれています。自身の環境への適応には一定の実装が必要です。",
    "summary": "AI エージェントが実務で「使える」ようになるためには、単なる指示の実行ではなく、プロフェッショナルなエンジニアと同等の「規律と検証」が必要です。その最先端の知見が詰まった、開発者必見のリソースです。"
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
