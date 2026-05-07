import os

template_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\templates\github-daily.template.html'
output_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\articles\github\daily\2026-05-07-edtechre-pybroker.html'

with open(template_path, 'r', encoding='utf-8') as f:
    template = f.read()

art = {
    "title": "pybroker",
    "dek": "機械学習とバックテストを直結。NumPy と Numba による高速処理を実現した、アルゴリズム取引戦略開発のための Python フレームワーク。",
    "owner_repo": "edtechre/pybroker",
    "repo_url": "https://github.com/edtechre/pybroker",
    "star_count": 3284, # ~3.3k
    "serial": 463,
    "what_is_this": "アルゴリズム取引の戦略開発とバックテストに特化したオープンソースの Python フレームワークです。特に機械学習（ML）モデルを取引戦略に組み込むワークフローを強力にサポートしており、データ収集からモデル学習、パフォーマンス評価までを一気通貫で行えます。",
    "what_can_it_do": "NumPy や Numba（JIT コンパイル）を活用した超高速なバックテストエンジンにより、大規模なデータセットでも短時間で検証可能です。また、ウォークフォワード分析（Walkforward Analysis）やブートストラップ法を用いた統計的な評価指標算出により、戦略の頑健性を客観的に判断できます。",
    "key_features": "機械学習フレームワークとのネイティブな親和性。並列計算による複数銘柄の同時バックテスト。Alpaca や Yahoo Finance 等からのデータ自動取得とキャッシュ。ポジションサイジングやストップロスの高度な制御。",
    "setup_usage": "Python 環境にて `pip install pybroker` でインストール。Pandas DataFrames や外部 API からデータをロードし、独自の取引ルール（または ML モデルによる予測）を定義して、バックテストエンジンを実行します。",
    "target_audience": "データサイエンスの手法を取引戦略に導入したいクオンツ、Python で独自の自動売買システムを構築したいエンジニア、既存のバックテストツールの速度に不満がある層。",
    "cautions": "金融市場での取引にはリスクが伴います。PyBroker によるバックテスト結果は将来の利益を保証するものではなく、実運用前には十分なリスク管理と検証が必要です。",
    "summary": "AI・機械学習が投資判断の重要性を増す中で、それらを「取引戦略」として具現化し、高速かつ厳密に検証できる PyBroker は、現代のトレーダーにとって非常に価値のあるツールです。"
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
