import re

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\ai-tools-monitor.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Update OpenClaw card
content = re.sub(r'(id="tool-openclaw"[^>]*data-latest=")[^"]*(")', r'\12026-05-07\2', content)
content = re.sub(
    r'(<details id="tool-openclaw".*?<span class="tool-summary-date">)[^<]*(</span><span class="tool-summary-title">).*?(</span>)',
    r'\12026-05-07\2<a href="./articles/tools/2026-05-07-ai-others-tools-multi-update.html">v2026.5.6: Codex/OAuth 修正、fetch 安定化</a>\3',
    content, flags=re.DOTALL
)
new_li_openclaw = '<li class="changelog-item"><span class="changelog-date">2026-05-07</span><a href="./articles/tools/2026-05-07-ai-others-tools-multi-update.html">v2026.5.6: Codex/OAuth 修正、fetch 安定化</a></li>'
content = re.sub(r'(<ul class="changelog-list" id="list-openclaw">)', r'\1\n                ' + new_li_openclaw, content)
content = re.sub(r'(<strong id="val-openclaw">)[^<]*(</strong>)', r'\1v2026.5.6\2', content)

# Update Grok card
content = re.sub(r'(id="tool-grok"[^>]*data-latest=")[^"]*(")', r'\12026-05-07\2', content)
content = re.sub(
    r'(<details id="tool-grok".*?<span class="tool-summary-date">)[^<]*(</span><span class="tool-summary-title">).*?(</span>)',
    r'\12026-05-07\2<a href="./articles/tools/2026-05-07-ai-others-tools-multi-update.html">Compute Partnership with Anthropic</a>\3',
    content, flags=re.DOTALL
)
new_li_grok = '<li class="changelog-item"><span class="changelog-date">2026-05-07</span><a href="./articles/tools/2026-05-07-ai-others-tools-multi-update.html">Partnership: Anthropic との計算資源提携を発表</a></li>'
content = re.sub(r'(<ul class="changelog-list" id="list-grok">)', r'\1\n                ' + new_li_grok, content)
content = re.sub(r'(<strong id="val-grok">)[^<]*(</strong>)', r'\1Partnership\2', content)

# Update Report
now_jst = "2026-05-07 04:18 JST"
content = re.sub(r'(<span id="report-others-date">).*?(</span>)', r'\1' + now_jst + r'\2', content)

updates_html = """<p style="margin: 0 0 4px 0;"><strong>Updates Found (2):</strong></p>
                <ul style="margin: 0; padding-left: 20px; color: var(--text-muted);">
                  <li>OpenClaw (v2026.5.6: Codex & Stability)</li>
                  <li>Grok (xAI) (Compute Partnership with Anthropic)</li>
                </ul>"""
content = re.sub(r'(<div id="report-others-updates">).*?(</div>)', r'\1' + updates_html + r'\2', content, flags=re.DOTALL)

no_updates_html = """<p style="margin: 0 0 4px 0;"><strong>No New Updates (6):</strong></p>
                <ul style="margin: 0; padding-left: 20px; color: var(--text-muted);">
                  <li>ChatGPT (Monitoring)</li>
                  <li>Claude (Monitoring)</li>
                  <li>Gemini (Monitoring)</li>
                  <li>Perplexity (Monitoring)</li>
                  <li>NotebookLM (Monitoring)</li>
                  <li>Obsidian (v1.12.7)</li>
                </ul>"""
content = re.sub(r'(<div id="report-others-no-updates"[^>]*>).*?(</div>)', r'\1' + no_updates_html + r'\2', content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated ai-tools-monitor.html")
