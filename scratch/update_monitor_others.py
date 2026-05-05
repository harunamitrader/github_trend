import re
from datetime import datetime

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\ai-tools-monitor.html'
with open(file_path, 'r', encoding='utf-8') as f:
    html = f.read()

now_jst = "2026-05-06 04:16 JST"
today = "2026-05-06"
article_url = "./articles/tools/2026-05-06-ai-others-tools-multi-update.html"

# Update Report
html = re.sub(r'<span id="report-others-date">.*?</span>', f'<span id="report-others-date">{now_jst}</span>', html)

updates_found_html = f'''<p style="margin: 0 0 4px 0;"><strong>Updates Found (6):</strong></p>
                <ul style="margin: 0; padding-left: 20px; color: var(--text-muted);">
                  <li>Claude (Claude Opus 4.7 for Financial Services)</li>
                  <li>Gemini (API Webhooks & File Search Multimodal)</li>
                  <li>ChatGPT (Memory Sources & Gmail Personalization)</li>
                  <li>NotebookLM (Google Classroom for Students)</li>
                  <li>Obsidian (Mobile 2.0 & Keychain Security)</li>
                  <li>Perplexity (Computer in Microsoft Teams)</li>
                </ul>'''

no_updates_html = '''<p style="margin: 0 0 4px 0;"><strong>No New Updates (2):</strong></p>
                <ul style="margin: 0; padding-left: 20px; color: var(--text-muted);">
                  <li>Grok (Monitoring)</li>
                  <li>OpenClaw (v2026.5.4-beta.1)</li>
                </ul>'''

html = re.sub(r'<div id="report-others-updates">.*?</div>', f'<div id="report-others-updates">{updates_found_html}</div>', html, flags=re.DOTALL)
html = re.sub(r'<div id="report-others-no-updates">.*?</div>', f'<div id="report-others-no-updates">{no_updates_html}</div>', html, flags=re.DOTALL)

# Update Tool Cards

# Claude
html = re.sub(r'(<details id="tool-claude".*?data-latest=").*?(")', f'\\1{today}\\2', html)
html = re.sub(r'(<details id="tool-claude".*?<span class="tool-summary-date">).*?(</span>)', f'\\1{today}\\2', html, flags=re.DOTALL)
html = re.sub(r'(<details id="tool-claude".*?<span class="tool-summary-title">).*?(</span>)', f'\\1<a href="{article_url}">Claude Opus 4.7 for Financial Services 発表</a>\\2', html, flags=re.DOTALL)
html = re.sub(r'(<ul class="changelog-list" id="list-claude">)', f'\\1\n                <li class="changelog-item"><span class="changelog-date">{today}</span><a href="{article_url}">Claude Opus 4.7: 金融特化モデルを公開、財務分析性能を強化</a></li>', html)
html = re.sub(r'<strong id="val-claude">.*?</strong>', f'<strong id="val-claude">Opus 4.7</strong>', html)

# Gemini
html = re.sub(r'(<details id="tool-gemini".*?data-latest=").*?(")', f'\\1{today}\\2', html)
html = re.sub(r'(<details id="tool-gemini".*?<span class="tool-summary-date">).*?(</span>)', f'\\1{today}\\2', html, flags=re.DOTALL)
html = re.sub(r'(<details id="tool-gemini".*?<span class="tool-summary-title">).*?(</span>)', f'\\1<a href="{article_url}">API Webhooks & File Search 強化</a>\\2', html, flags=re.DOTALL)
html = re.sub(r'(<ul class="changelog-list">)', f'\\1\n                <li class="changelog-item"><span class="changelog-date">{today}</span><a href="{article_url}">API: Webhooks 対応、File Search のマルチモーダル検索と引用を強化</a></li>', html)
html = re.sub(r'<strong id="val-gemini">.*?</strong>', f'<strong id="val-gemini">API Update</strong>', html)

# ChatGPT
html = re.sub(r'(<details id="tool-chatgpt".*?data-latest=").*?(")', f'\\1{today}\\2', html)
html = re.sub(r'(<details id="tool-chatgpt".*?<span class="tool-summary-date">).*?(</span>)', f'\\1{today}\\2', html, flags=re.DOTALL)
html = re.sub(r'(<details id="tool-chatgpt".*?<span class="tool-summary-title">).*?(</span>)', f'\\1<a href="{article_url}">Memory Sources & Gmail 連携強化</a>\\2', html, flags=re.DOTALL)
html = re.sub(r'(<ul class="changelog-list" id="list-chatgpt">)', f'\\1\n                <li class="changelog-item"><span class="changelog-date">{today}</span><a href="{article_url}">Memory Sources: 回答の情報源を可視化。Gmail 連携によるパーソナライズを強化</a></li>', html)
html = re.sub(r'<strong id="val-chatgpt">.*?</strong>', f'<strong id="val-chatgpt">Memory Update</strong>', html)

# NotebookLM
html = re.sub(r'(<details id="tool-notebooklm".*?data-latest=").*?(")', f'\\1{today}\\2', html)
html = re.sub(r'(<details id="tool-notebooklm".*?<span class="tool-summary-date">).*?(</span>)', f'\\1{today}\\2', html, flags=re.DOTALL)
html = re.sub(r'(<details id="tool-notebooklm".*?<span class="tool-summary-title">).*?(</span>)', f'\\1<a href="{article_url}">Google Classroom 連携を学生向けに開放</a>\\2', html, flags=re.DOTALL)
html = re.sub(r'(<ul class="changelog-list" id="list-notebooklm">)', f'\\1\n                <li class="changelog-item"><span class="changelog-date">{today}</span><a href="{article_url}">Google Classroom: 18歳以上の学生向けに講義資料からのノート構築を開放</a></li>', html)
html = re.sub(r'Latest: <strong>Source Auto-Labeling</strong>', f'Latest: <strong>Classroom Sync</strong>', html)

# Obsidian
html = re.sub(r'(<details id="tool-obsidian".*?data-latest=").*?(")', f'\\1{today}\\2', html)
html = re.sub(r'(<details id="tool-obsidian".*?<span class="tool-summary-date">).*?(</span>)', f'\\1{today}\\2', html, flags=re.DOTALL)
html = re.sub(r'(<details id="tool-obsidian".*?<span class="tool-summary-title">).*?(</span>)', f'\\1<a href="{article_url}">Mobile 2.0 & Keychain セキュリティ機能</a>\\2', html, flags=re.DOTALL)
html = re.sub(r'(<ul class="changelog-list" id="list-obsidian">)', f'\\1\n                <li class="changelog-item"><span class="changelog-date">{today}</span><a href="{article_url}">Mobile 2.0: ウィジェット対応。Keychain による API キー管理の安全化</a></li>', html)
html = re.sub(r'Latest: <strong>CLI Refresh</strong>', f'Latest: <strong>Keychain</strong>', html)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated ai-tools-monitor.html with others tools updates.")
