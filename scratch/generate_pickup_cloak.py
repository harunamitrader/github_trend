import os

template_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\templates\github-daily.template.html'
output_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\articles\github\daily\2026-05-07-cloakhq-cloakbrowser.html'

with open(template_path, 'r', encoding='utf-8') as f:
    template = f.read()

art = {
    "title": "CloakBrowser",
    "dek": "ボット検知を「ソースレベル」で回避。Chromium のバイナリを直接パッチし、Playwright や Puppeteer との完全互換を維持する究極のステルスブラウザ。",
    "owner_repo": "CloakHQ/CloakBrowser",
    "repo_url": "https://github.com/CloakHQ/CloakBrowser",
    "star_count": 1421, # ~1.4k
    "serial": 460,
    "what_is_this": "ウェブスクレイピングや自動化において最大の障害となる「ボット検知」を回避するために設計された、高度にカスタマイズされた Chromium ブラウザです。JavaScript による表面的な修正ではなく、Chromium の C++ ソースコードレベルで指紋（Fingerprint）を偽装しているのが最大の特徴です。",
    "what_can_it_do": "Cloudflare Turnstile, reCAPTCHA Enterprise, Akamai, DataDome などの強力なボット対策システムを、通常の自動化ツールよりも高い成功率で突破できます。Playwright や Puppeteer のドロップイン・リプレイスメントとして機能し、既存のスクリプトを最小限の修正でステルス化できます。",
    "key_features": "バイナリレベルでの指紋パッチ（Canvas, WebGL, Audio, Fonts, GPU 等）。OS（Windows/Mac/Linux）や CPU アーキテクチャを問わず動作。自動的なカスタムバイナリのダウンロードとキャッシュ。ブラウザの内部的な振る舞いを「本物のユーザー」に限りなく近づける設計。",
    "setup_usage": "Playwright のブラウザタイプとして `CloakBrowser` を指定するだけで利用可能です。初回実行時に、各 OS に最適化されたパッチ済み Chromium バイナリが自動的にダウンロードされます。あとは通常の Playwright API を使ってブラウジングを自動化するだけです。",
    "target_audience": "高度なボット対策が施されたサイトをスクレイピングしたい開発者、AI エージェントのウェブ閲覧能力を強化したいエンジニア、アンチ検知ブラウザを自前で運用したい層。",
    "cautions": "非常に強力なツールですが、ウェブサイトの利用規約を遵守し、倫理的な範囲で利用してください。また、バイナリのダウンロードには一定の信頼が必要です。オープンソースプロジェクトであるため、ソースコードの検証が推奨されます。",
    "summary": "AI エージェントがウェブ上の情報を収集する際、ボット検知は大きな壁となります。CloakBrowser はその壁を技術の深部（バイナリレベル）から解決しようとする、非常に野心的なプロジェクトです。"
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
