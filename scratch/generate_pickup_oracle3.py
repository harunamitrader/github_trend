import os

template_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\templates\github-daily.template.html'
output_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\articles\github\daily\2026-05-07-yichengyang-ethan-oracle3.html'

with open(template_path, 'r', encoding='utf-8') as f:
    template = f.read()

art = {
    "title": "oracle3",
    "dek": "予測市場のための自律型トレードエージェント。Wang Transform を核とした価格理論と、Polymarket 等への自動接続機能を備えた実践的フレームワーク。",
    "owner_repo": "YichengYang-Ethan/oracle3",
    "repo_url": "https://github.com/YichengYang-Ethan/oracle3",
    "star_count": 167,
    "serial": 466,
    "what_is_this": "Polymarket や Kalshi といった予測市場（Prediction Markets）での取引を自動化・高度化するための自律型エージェント・フレームワークです。学術的な価格理論（Wang Transform）を実務的なトレードパイプラインに統合しており、定量的アプローチによる自律運用を可能にします。",
    "what_can_it_do": "複数の予測市場プラットフォームに接続し、確率の公理に基づいた裁定取引（Arbitrage）や、モデル駆動型のクオンツ戦略を実行できます。ケリー基準（Kelly Criterion）による動的なポジションサイジングや、ポートフォリオのリアルタイム監視、ペーパートレード（デモ取引）機能も備えています。",
    "key_features": "Wang Transform を用いた公正価値（Fair Value）とグリークスの算出。8種類の裁定取引戦略と2種類のモデル駆動戦略。Polymarket, Kalshi, Solana 系市場へのマルチプラットフォーム対応。asyncio による並行処理を駆使した高速な実行エンジン。",
    "setup_usage": "Python 環境にてクローンし、必要なライブラリをインストール。各取引所の API キーを設定し、CLI ツール（Click ベース）を通じて戦略の選択、バックテスト、またはライブ取引を開始します。",
    "target_audience": "予測市場のボラティリティを定量的手法で攻略したいトレーダー、金融工学の知見を実運用のエージェントに落とし込みたいエンジニア。",
    "cautions": "予測市場には高い流動性リスクやカウンターパーティリスクが存在します。本ツールのアルゴリズムや戦略は利益を保証するものではなく、特にリアル資金での運用には慎重な検証とリスク管理が不可欠です。",
    "summary": "AI エージェントが「意思決定」だけでなく「資本投下」まで自律的に行う未来を、予測市場というフロンティアで具現化した野心的なプロジェクトです。"
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
