import json
import os
import re

base_dir = r"C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base"
template_path = os.path.join(base_dir, "templates", "ai-tool-log.template.html")
articles_json_path = os.path.join(base_dir, "data", "articles.json")
monitor_html_path = os.path.join(base_dir, "ai-tools-monitor.html")

# 1. Create Article HTML
# Metadata
published_at = "2026-06-22"
created_at = "2026-06-24T04:20:00+09:00"
article_title = "OpenClaw v2026.6.10-beta.2: 会話用自動ファストモードと各種モデルルーティング改善"
dek_description = "会話用自動ファストモード（fast talks auto mode）の追加や、Zai/GLMなどのモデルルーティング信頼性向上、フック合成時の信頼ポリシー維持などを盛り込んだベータアップデート。"
tool_slug = "openclaw"
version = "v2026.6.10-beta.2"
article_filename = f"{published_at}-{tool_slug}-{version.lower().replace('.', '-')}.html"
article_path = os.path.join(base_dir, "articles", "tools", article_filename)
article_relative_url = f"./articles/tools/{article_filename}"

eyebrow_text = "AI Tool Log"
metadata_label_2 = "バージョン"
metadata_value_2 = version
tool_name = "OpenClaw"
source_url = f"https://github.com/openclaw/openclaw/releases/tag/{version}"
source_name = f"OpenClaw {version} Release Notes"

main_changes_intro = "OpenClaw v2026.6.10-beta.2 では、対話ターンにおける実行パフォーマンスを最適化する「自動ファストモード」の追加や、各種LLMプロバイダー（Zai、GLMなど）との連携動作の堅牢化、およびセッション・ポリシー管理の安全性が改善されました。主な変更点は以下の通りです。"

main_changes_list = (
    "<li><strong>会話用自動ファストモード (Automatic fast mode for talks):</strong> 短いチャットターンに対して自動でファストモードを適用し、長時間の実行時はフォールバック境界を適用した通常モードに自動的に戻る切り替え機構を実装しました。</li>\n"
    "            <li><strong>モデルルーティングとフェイルオーバーの改善:</strong> Zaiモデル合成、Zhipu GLMの過負荷時フェイルオーバー判定、およびライブ検出モデルにおけるネイティブな <code>/think</code> 推論レベルの解釈が、アクティブなモデルカタログに従うよう信頼性を高めました。</li>\n"
    "            <li><strong>セッションとチャンネル状態のクリーン化:</strong> チャンネル切り替え時に古い origin 情報をリセットしてリークを防ぐとともに、cron 配信のコンテキストが正確に対象セッションへバインドされるように修正しました。</li>\n"
    "            <li><strong>フック合成時のポリシー整合性:</strong> フックレジストリが合成された場合でも、承認を要する機密フローの実行に必要な「信頼されたポリシー（trusted policies）」が失われないよう保護機構を導入しました。</li>"
)

impact_and_usage = (
    "短い対話におけるレスポンス速度が向上し、長時間のタスクとのバランスが自動で保たれるようになります。また、Zai や GLM-5 などの新しい推論モデルの呼び出しや failover 周辺の動作が安定したことで、多様な API 環境での予期せぬハングやエラーが減少します。フックを利用した承認プロンプトを運用している環境でもポリシー紛失によるクラッシュを防げます。"
)

summary_text = (
    "v2026.6.10-beta.2 は、対話的な自動実行（fast talks）のユーザー体験向上と、モデルカタログ・ポリシー管理の安全性を大きく前進させた実用的なベータアップデートです。"
)

# Load template
with open(template_path, 'r', encoding='utf-8') as f:
    template_content = f.read()

# Replace placeholders
html_content = template_content
html_content = html_content.replace("{{DEK_DESCRIPTION}}", dek_description)
html_content = html_content.replace("{{ARTICLE_TITLE}}", article_title)
html_content = html_content.replace("{{EYEBROW_TEXT}}", eyebrow_text)
html_content = html_content.replace("{{YYYY_MM_DD}}", published_at)
html_content = html_content.replace("{{METADATA_LABEL_2}}", metadata_label_2)
html_content = html_content.replace("{{METADATA_VALUE_2}}", metadata_value_2)
html_content = html_content.replace("{{TOOL_NAME}}", tool_name)
html_content = html_content.replace("{{MAIN_CHANGES_INTRO}}", main_changes_intro)
html_content = html_content.replace("{{MAIN_CHANGES_LIST}}", main_changes_list)
html_content = html_content.replace("{{IMPACT_AND_USAGE}}", impact_and_usage)
html_content = html_content.replace("{{SUMMARY}}", summary_text)
html_content = html_content.replace("{{SOURCE_URL}}", source_url)
html_content = html_content.replace("{{SOURCE_NAME}}", source_name)

# Save article HTML
os.makedirs(os.path.dirname(article_path), exist_ok=True)
with open(article_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(html_content)
print(f"Created article: {article_path}")


# 2. Update articles.json
with open(articles_json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_entry = {
    "category": "ai-tool-log",
    "slug": f"{published_at}-{tool_slug}-{version.lower().replace('.', '-')}",
    "title": article_title,
    "dek": dek_description,
    "publishedAt": published_at,
    "createdAt": created_at,
    "toolName": tool_name,
    "version": version,
    "articleUrl": article_relative_url
}

data["articles"].append(new_entry)

with open(articles_json_path, 'w', encoding='utf-8', newline='\n') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
print("Updated articles.json")


# 3. Update ai-tools-monitor.html
with open(monitor_html_path, 'r', encoding='utf-8') as f:
    html_src = f.read()

# details element update
html_src = html_src.replace(
    '<details id="tool-openclaw" data-category="others" class="tool-card card-openclaw" data-latest="2026-06-21">',
    f'<details id="tool-openclaw" data-category="others" class="tool-card card-openclaw" data-latest="{published_at}">'
)

# summary update
# group \g<4> inside replace to avoid overflow
pattern_summary = r'(<details id="tool-openclaw"[^>]*>.*?<span class="tool-summary-date">)2026-06-21(</span><span class="tool-summary-title"><a href=")[^"]+(">)[^<]+(</a></span>)'
replacement_summary = r'\g<1>' + published_at + r'\g<2>' + article_relative_url + r'\g<3>' + f"{version}: 会話用自動ファストモードと各種モデルルーティング改善" + r'\g<4>'
html_src = re.sub(pattern_summary, replacement_summary, html_src, flags=re.DOTALL)

# list-openclaw update
new_li = f'                <li class="changelog-item"><span class="changelog-date">{published_at}</span><a href="{article_relative_url}">{version}: 会話用自動ファストモードと各種モデルルーティング改善</a></li>'
html_src = html_src.replace(
    '<ul class="changelog-list" id="list-openclaw">',
    f'<ul class="changelog-list" id="list-openclaw">\n{new_li}'
)

# val-openclaw update
html_src = html_src.replace(
    '<strong id="val-openclaw">v2026.6.9</strong>',
    f'<strong id="val-openclaw">{version}</strong>'
)

# report-others-date update
html_src = html_src.replace(
    '<span id="report-others-date">2026-06-23 04:15 JST</span>',
    '<span id="report-others-date">2026-06-24 04:15 JST</span>'
)

# report-others-updates and report-others-no-updates
html_src = html_src.replace(
    '              <div id="report-others-updates">\n                  <p style="margin: 0 0 4px 0;"><strong>Updates Found (1):</strong></p>\n                  <ul style="margin: 0; padding-left: 20px; color: var(--text);">\n                    <li>OpenClaw (v2026.6.9)</li>\n                  </ul>\n                </div>',
    '              <div id="report-others-updates">\n                  <p style="margin: 0 0 4px 0;"><strong>Updates Found (1):</strong></p>\n                  <ul style="margin: 0; padding-left: 20px; color: var(--text);">\n                    <li>OpenClaw (v2026.6.10-beta.2)</li>\n                  </ul>\n                </div>'
)

html_src = html_src.replace(
    '              <div id="report-others-no-updates" style="margin-top: 8px;">\n                  <p style="margin: 0 0 4px 0;"><strong>No New Updates (7):</strong></p>\n                  <ul style="margin: 0; padding-left: 20px; color: var(--text-muted);">\n                    <li>ChatGPT (Scheduled Tasks)</li>\n                    <li>Claude (Managed Agents)</li>\n                    <li>Gemini (Spreadsheet & Speech API)</li>\n                    <li>Grok (Imagine Video 1.5)</li>\n                    <li>Perplexity (IPO)</li>\n                    <li>NotebookLM (Research Agent)</li>\n                    <li>Obsidian (v1.13.1)</li>\n                  </ul>\n                </div>',
    '              <div id="report-others-no-updates" style="margin-top: 8px;">\n                  <p style="margin: 0 0 4px 0;"><strong>No New Updates (7):</strong></p>\n                  <ul style="margin: 0; padding-left: 20px; color: var(--text-muted);">\n                    <li>ChatGPT (Scheduled Tasks)</li>\n                    <li>Claude (Managed Agents)</li>\n                    <li>Gemini (Spreadsheet & Speech API)</li>\n                    <li>Grok (Imagine Video 1.5)</li>\n                    <li>Perplexity (IPO)</li>\n                    <li>NotebookLM (Research Agent)</li>\n                    <li>Obsidian (v1.13.1)</li>\n                  </ul>\n                </div>'
)

with open(monitor_html_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(html_src)
print("Updated ai-tools-monitor.html")
