import re
from datetime import datetime

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\ai-tools-monitor.html'
with open(file_path, 'r', encoding='utf-8') as f:
    html = f.read()

now_jst = "2026-05-06 04:01 JST"
today = "2026-05-06"
article_url = "./articles/tools/2026-05-06-ai-coding-tools-multi-update.html"

# Update Report
html = re.sub(r'<span id="report-coding-date">.*?</span>', f'<span id="report-coding-date">{now_jst}</span>', html)

updates_found_html = f'''<p style="margin: 0 0 4px 0;"><strong>Updates Found (5):</strong></p>
                <ul style="margin: 0; padding-left: 20px; color: var(--text-muted);">
                  <li>Cursor (v2.5 Security Patch & Admin Controls)</li>
                  <li>Windsurf (Arena Mode & Adaptive Router)</li>
                  <li>Cline (OOM Fixes & Terminal Restore)</li>
                  <li>Claude Code (LSP Diagnostics & Session Colors)</li>
                  <li>Gemini CLI (v0.42.0-nightly: --delete flag)</li>
                </ul>'''

no_updates_html = '''<p style="margin: 0 0 4px 0;"><strong>No New Updates (4):</strong></p>
                <ul style="margin: 0; padding-left: 20px; color: var(--text-muted);">
                  <li>Antigravity (v4.3.3)</li>
                  <li>GitHub Copilot (May Update)</li>
                  <li>Codex (v0.15.3)</li>
                  <li>Grok CLI (Monitoring)</li>
                </ul>'''

html = re.sub(r'<div id="report-coding-updates">.*?</div>', f'<div id="report-coding-updates">{updates_found_html}</div>', html, flags=re.DOTALL)
html = re.sub(r'<div id="report-coding-no-updates">.*?</div>', f'<div id="report-coding-no-updates">{no_updates_html}</div>', html, flags=re.DOTALL)

# Update Tool Cards

def update_card(html, tool_id, version, title, summary_date=today):
    # Update data-latest
    html = re.sub(f'id="{tool_id}" data-category="coding" class="tool-card (.*?)" data-latest=".*?"', 
                  f'id="{tool_id}" data-category="coding" class="tool-card \\1" data-latest="{summary_date}"', html)
    
    # Update summary date
    # Find the summary section for this tool
    pattern = f'<details id="{tool_id}".*?<span class="tool-summary-date">.*?</span>'
    html = re.sub(pattern, f'<details id="{tool_id}" data-category="coding" class="tool-card card-{tool_id.split("-")[-1]}" data-latest="{summary_date}">\n              <summary class="tool-card-summary">\n                <span class="tool-name">{tool_id.replace("tool-","").replace("-"," ").title()}</span>\n                <span class="tool-summary-latest">\n                  <span class="tool-summary-date">{summary_date}</span>', html, flags=re.DOTALL)
    
    # Actually, the above re.sub is too complex and risky. Let's do it more simply.
    return html

# I'll use a more manual approach for the card updates to ensure accuracy.

# Cursor
html = re.sub(r'(<details id="tool-cursor".*?data-latest=").*?(")', f'\\1{today}\\2', html)
html = re.sub(r'(<details id="tool-cursor".*?<span class="tool-summary-date">).*?(</span>)', f'\\1{today}\\2', html, flags=re.DOTALL)
html = re.sub(r'(<details id="tool-cursor".*?<span class="tool-summary-title">).*?(</span>)', f'\\1<a href="{article_url}">v2.5: Security Patch & Admin Controls</a>\\2', html, flags=re.DOTALL)
html = re.sub(r'(<ul class="changelog-list" id="list-cursor">)', f'\\1\n                <li class="changelog-item"><span class="changelog-date">{today}</span><a href="{article_url}">v2.5: Security Patch, Model Access Controls, Spend Mgmt</a></li>', html)
html = re.sub(r'<strong id="val-cursor">.*?</strong>', f'<strong id="val-cursor">v2.5</strong>', html)

# Windsurf
html = re.sub(r'(<details id="tool-windsurf".*?data-latest=").*?(")', f'\\1{today}\\2', html)
html = re.sub(r'(<details id="tool-windsurf".*?<span class="tool-summary-date">).*?(</span>)', f'\\1{today}\\2', html, flags=re.DOTALL)
html = re.sub(r'(<details id="tool-windsurf".*?<span class="tool-summary-title">).*?(</span>)', f'\\1<a href="{article_url}">Arena Mode & Adaptive Model Router</a>\\2', html, flags=re.DOTALL)
html = re.sub(r'(<ul class="changelog-list" id="list-windsurf">)', f'\\1\n                <li class="changelog-item"><span class="changelog-date">{today}</span><a href="{article_url}">Arena Mode (Agent Comparison), Adaptive Model Router</a></li>', html)
html = re.sub(r'<strong id="val-windsurf">.*?</strong>', f'<strong id="val-windsurf">Arena Update</strong>', html)

# Cline
html = re.sub(r'(<details id="tool-cline".*?data-latest=").*?(")', f'\\1{today}\\2', html)
html = re.sub(r'(<details id="tool-cline".*?<span class="tool-summary-date">).*?(</span>)', f'\\1{today}\\2', html, flags=re.DOTALL)
html = re.sub(r'(<details id="tool-cline".*?<span class="tool-summary-title">).*?(</span>)', f'\\1<a href="{article_url}">OOM Fixes & Terminal Restore</a>\\2', html, flags=re.DOTALL)
html = re.sub(r'(<ul class="changelog-list" id="list-cline">)', f'\\1\n                <li class="changelog-item"><span class="changelog-date">{today}</span><a href="{article_url}">OOM Fixes (8GB heap), Terminal Restore, New Models</a></li>', html)
html = re.sub(r'<strong id="val-cline">.*?</strong>', f'<strong id="val-cline">v3.83.0+</strong>', html)

# Claude Code
html = re.sub(r'(<details id="tool-claude-code".*?data-latest=").*?(")', f'\\1{today}\\2', html)
html = re.sub(r'(<details id="tool-claude-code".*?<span class="tool-summary-date">).*?(</span>)', f'\\1{today}\\2', html, flags=re.DOTALL)
html = re.sub(r'(<details id="tool-claude-code".*?<span class="tool-summary-title">).*?(</span>)', f'\\1<a href="{article_url}">LSP 診断表示改善、セッションカラー割り当て</a>\\2', html, flags=re.DOTALL)
html = re.sub(r'(<ul class="changelog-list" id="list-claude-code">)', f'\\1\n                <li class="changelog-item"><span class="changelog-date">{today}</span><a href="{article_url}">v2.1.127+: LSP 診断表示、セッションカラー、MCP 安定化</a></li>', html)
html = re.sub(r'<strong id="val-claude-code">.*?</strong>', f'<strong id="val-claude-code">v2.1.130</strong>', html)

# Gemini CLI
html = re.sub(r'(<details id="tool-geminicli".*?data-latest=").*?(")', f'\\1{today}\\2', html)
html = re.sub(r'(<details id="tool-geminicli".*?<span class="tool-summary-date">).*?(</span>)', f'\\1{today}\\2', html, flags=re.DOTALL)
html = re.sub(r'(<details id="tool-geminicli".*?<span class="tool-summary-title">).*?(</span>)', f'\\1<a href="{article_url}">v0.42.0-nightly: --delete flag 追加</a>\\2', html, flags=re.DOTALL)
html = re.sub(r'(<ul class="changelog-list" id="list-geminicli">)', f'\\1\n                <li class="changelog-item"><span class="changelog-date">{today}</span><a href="{article_url}">v0.42.0-nightly: /exit --delete、API タイムアウト保護</a></li>', html)
html = re.sub(r'<strong id="val-geminicli">.*?</strong>', f'<strong id="val-geminicli">v0.42.0-n</strong>', html)


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated ai-tools-monitor.html with coding tools updates.")
