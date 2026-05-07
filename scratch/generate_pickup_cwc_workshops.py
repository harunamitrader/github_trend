import os

template_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\templates\github-daily.template.html'
output_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\articles\github\daily\2026-05-07-anthropics-cwc-workshops.html'

with open(template_path, 'r', encoding='utf-8') as f:
    template = f.read()

art = {
    "title": "cwc-workshops",
    "dek": "Claude と共に次世代のエージェントを創る。Anthropic 公式ワークショップ「Code with Claude」のハンズオン教材・実践モジュール集。",
    "owner_repo": "anthropics/cwc-workshops",
    "repo_url": "https://github.com/anthropics/cwc-workshops",
    "star_count": 1515,
    "serial": 464,
    "what_is_this": "Anthropic が開催した公式ワークショップ「Code with Claude (CWC)」で使用された学習用リポジトリです。最新の Claude モデルやエージェント機能を使いこなし、実用的な AI アプリケーションや自律型エージェントを構築するためのハンズオン教材がまとめられています。",
    "what_can_it_do": "複雑なプロンプトの分解（Decomposition）、Model Context Protocol (MCP) を使ったツール連携、エージェントの性能評価（Evaluation）、そして特定のユースケース（SRE 業務やデータ分析等）に特化した Managed Agent の構築手法を段階的に学ぶことができます。",
    "key_features": "用途に合わせたモデル選択（Extended Thinking 等）の最適化ガイド。大規模プロンプトを小さな「スキル」に分割するマルチエージェント設計。MCP サーバーを介した外部ツール操作の実践。 grader（評価器）を用いた定量的な改善サイクル。",
    "setup_usage": "各モジュールのディレクトリ（`rightmodel/`, `agent-decomposition/` 等）に移動し、README の指示に従って環境を構築します。Claude Code 等を併用しながら、提供されたコードやプロンプトを改変して学習を進めます。",
    "target_audience": "Claude の最新機能をエンジニアリングに活かしたい開発者、自律型 AI エージェントの設計・評価手法を体系的に学びたい層。",
    "cautions": "現在は「アーカイブ」扱いの非推奨リポジトリとなっており、プルリクエスト等の受付は行われていません。教材としての価値は非常に高いですが、最新の SDK バージョンとの差分には注意が必要です。",
    "summary": "Anthropic のエンジニアがどのような思想でエージェントを設計しているのか、その「手の内」を垣間見ることができる極めて貴重な学習リソースです。"
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
