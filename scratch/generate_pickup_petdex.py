import os

template_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\templates\github-daily.template.html'
output_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\articles\github\daily\2026-05-07-crafter-station-petdex.html'

with open(template_path, 'r', encoding='utf-8') as f:
    template = f.read()

art = {
    "title": "petdex",
    "dek": "Codex に命を吹き込む、デスクトップ・ペットの百科事典。コミュニティ製アニメーションペットの閲覧・検証・配信を支える中央ギャラリー。",
    "owner_repo": "crafter-station/petdex",
    "repo_url": "https://github.com/crafter-station/petdex",
    "star_count": 678,
    "serial": 461,
    "what_is_this": "Codex（デスクトップ AI アシスタント）で利用可能なアニメーションペットを収集・公開している公式ギャラリープロジェクトです。コミュニティの開発者が作成した様々なデジタルペットを一堂に会し、ユーザーが手軽に新しい「相棒」を見つけられるプラットフォームとして機能します。",
    "what_can_it_do": "Web ブラウザ上で承認済みのペットパックを閲覧し、待機中や移動中などのすべてのアニメーション状態をプレビューできます。個別の ZIP パッケージとしてのダウンロードや、全ペットの一括インストールにも対応しています。また、自作のペットパックが Codex の規格に準拠しているかを検証し、ギャラリーへ申請する機能も備えています。",
    "key_features": "ブラウザベースのリッチなプレビュー機能。CLI ツールによるシームレスなインストール体験。アニメ、ロボット、オリジナル IP など多種多様なコレクション。コミュニティ投稿を支えるバリデーション（検証）システム。",
    "setup_usage": "Petdex のウェブサイト（crafter.run 等）にアクセスし、好みのペットを選択してダウンロードするか、Codex の CLI ツールを使用して直接インストールします。自作したい場合はリポジトリのドキュメントに従い、画像を規格に合わせてパッキングして申請します。",
    "target_audience": "Codex のデスクトップ体験をパーソナライズしたいユーザー、自分の描いたキャラクターを AI アシスタントのペットとして配布したいクリエイター。",
    "cautions": "ペットパックはコミュニティから提供されているため、使用前にアニメーションの動作を確認することをお勧めします。また、Codex のバージョンによって対応するペットの規格が異なる場合があります。",
    "summary": "開発効率を追求する AI ツールの世界において、デスクトップに彩りと癒やしを与える「遊び心」を支える重要なプロジェクトです。AI との共同生活をより楽しく、親しみやすいものに変えてくれます。"
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
