import json
import os

new_articles_minimal = [
    {"slug": "2026-03-chatgpt-gpt54-thinking", "title": "GPT-5.4 移行", "date": "2026-03-11", "tool": "chatgpt"},
    {"slug": "2026-03-chatgpt-googledrive", "title": "Google Drive 統合刷新", "date": "2026-03-25", "tool": "chatgpt"},
    {"slug": "2026-03-chatgpt-largepaste", "title": "5,000文字自動添付", "date": "2026-03-01", "tool": "chatgpt"},
    {"slug": "2026-03-chatgpt-shopping", "title": "買い物エージェント強化", "date": "2026-03-05", "tool": "chatgpt"},
    {"slug": "2026-03-perplexity-computer-launch", "title": "Perplexity Computer 発表", "date": "2026-03-24", "tool": "perplexity"},
    {"slug": "2026-03-perplexity-iphone-comet", "title": "iPhone Comet ブラウザ開始", "date": "2026-03-15", "tool": "perplexity"},
    {"slug": "2026-03-perplexity-deepresearch", "title": "Deep Research Opus 4.5 導入", "date": "2026-03-10", "tool": "perplexity"},
    {"slug": "2026-03-claude-models-api", "title": "Models API 発表", "date": "2026-03-25", "tool": "claude"},
    {"slug": "2026-03-claude-marketplace-open", "title": "Claude Marketplace 開店", "date": "2026-03-06", "tool": "claude"},
    {"slug": "2026-03-claude-persistent-memory", "title": "永続メモリ提供（全ユーザー）", "date": "2026-03-20", "tool": "claude"},
    {"slug": "2026-03-claude-visualizations", "title": "インライン可視化 (Artifacts)", "date": "2026-03-01", "tool": "claude"},
    {"slug": "2026-03-gemini-lyria-launch", "title": "Lyria 3 音楽生成公開", "date": "2026-03-25", "tool": "gemini"},
    {"slug": "2026-03-gemini-ai-studio-billing", "title": "AI Studio 課金プラン開始", "date": "2026-03-23", "tool": "gemini"},
    {"slug": "2026-03-gemini-embedding-v2", "title": "Multimodal Embedding-2", "date": "2026-03-10", "tool": "gemini"},
    {"slug": "2026-03-gemini-v31-pro-preview", "title": "v3.1 Pro 統合完了", "date": "2026-03-09", "tool": "gemini"},
    {"slug": "2026-03-grok-4-reasoning-phd", "title": "Grok-4 PhD 推論発表", "date": "2026-03-20", "tool": "grok"},
    {"slug": "2026-03-grok-4-20-beta2", "title": "Grok 4.20 Beta 2 改善", "date": "2026-03-04", "tool": "grok"},
    {"slug": "2026-03-grok-cli-v10-rc5", "title": "v1.0.0-rc5: Grok-3 mini 対応", "date": "2026-03-23", "tool": "grokcli"},
    {"slug": "2026-03-grok-cli-v10-rc4", "title": "v1.0.0-rc4: マルチエージェント対応", "date": "2026-03-23", "tool": "grokcli"},
    {"slug": "2026-03-grok-cli-v10-rc3", "title": "v1.0.0-rc3: JSON 出力対応", "date": "2026-03-22", "tool": "grokcli"},
    {"slug": "2026-03-obsidian-v1127-release", "title": "v1.12.7: CLI 統合", "date": "2026-03-24", "tool": "obsidian"},
    {"slug": "2026-03-obsidian-v1120-iphone-share", "title": "v1.12.0: Share Extension 改良", "date": "2026-03-10", "tool": "obsidian"},
    {"slug": "2026-03-notebooklm-cinematic-video", "title": "Cinematic Video 概要生成", "date": "2026-03-24", "tool": "notebooklm"},
    {"slug": "2026-03-notebooklm-epub-support", "title": "EPUB フォーマット対応", "date": "2026-03-15", "tool": "notebooklm"},
    {"slug": "2026-03-notebooklm-infographics", "title": "インフォグラフィック 10 Styles", "date": "2026-03-10", "tool": "notebooklm"},
    {"slug": "2026-03-openclaw-teams-official", "title": "Teams 公式 SDK 移行", "date": "2026-03-24", "tool": "openclaw"},
    {"slug": "2026-03-openclaw-control-ui-tabs", "title": "Control UI タブ管理導入", "date": "2026-03-15", "tool": "openclaw"},
    {"slug": "2026-03-openclaw-openai-compat-v1", "title": "OpenAI /v1/embeddings 対応", "date": "2026-03-05", "tool": "openclaw"}
]

# Re-constructing the tool cards content
def get_card(tool_id, tool_name, status):
    items = sorted([a for a in new_articles_minimal if a['tool'] == tool_id], key=lambda x: x['date'], reverse=True)
    list_html = '<ul class="changelog-list">\n'
    for item in items:
        list_html += f'                <li class="changelog-item"><span class="changelog-date">{item["date"]}</span><a href="./articles/tools/{item["slug"]}.html">{item["title"]}</a></li>\n'
    list_html += '              </ul>'
    latest_date = items[0]["date"] if items else "2026-03-26"
    return f"""
            <div id="tool-{tool_id}" class="tool-card card-{tool_id}">
              <div class="tool-name">{tool_name}</div>
              <div class="tool-status">{status}</div>
                {list_html}
              <div class="tool-meta">
                <span class="latest-tag">Latest: <strong>{latest_date}</strong></span>
                <span class="status-tag status-active">Active</span>
              </div>
            </div>"""

# 256 行まであるファイルを読み込み、そこから後ろを再構築。
# Note: 256行目までには既存のツール（ClaudeCode〜GitHub Copilot, Codex, OpenClaw, NotebookLM）が入っている。
# 残りは: ChatGPT, Perplexity, Claude, Gemini, Grok, Grok CLI, Obsidian

additional_cards = ""
additional_cards += get_card("chatgpt", "ChatGPT", "OpenAI Release Notes 監視中")
additional_cards += get_card("perplexity", "Perplexity", "Perplexity Blog 監視中")
additional_cards += get_card("claude", "Claude", "Anthropic News 監視中")
additional_cards += get_card("gemini", "Gemini", "AI Studio Changelog 監視中")
additional_cards += get_card("grok", "Grok", "xAI Blog 監視中")
additional_cards += get_card("grokcli", "Grok CLI", "GitHub CHANGELOG.md 監視中")
additional_cards += get_card("obsidian", "Obsidian", "obsidian.md/changelog 監視中")

footer = """
          </div>
        </section>
      </main>
      <footer class="footer">
        <p>© 2026 harunami AI base - All rights reserved.</p>
      </footer>
    </div>
  </body>
</html>"""

# Read current (broken) file
with open("ai-tools-monitor.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

# If NotebookLM block is open but meta is missing, fix it
content = "".join(lines)
# In my view_file, NotebookLM ended at line 254: </ul>
# We need to add the closing div for notebooklm card
if 'id="tool-notebooklm"' in content and '<div class="tool-meta">' not in content[content.find('id="tool-notebooklm"'):]:
    content += """              <div class="tool-meta">
                <span class="latest-tag">Latest: <strong>2026-03-24</strong></span>
                <span class="status-tag status-active">Active</span>
              </div>
            </div>"""

# Append additional cards and footer
final_html = content + additional_cards + footer

with open("ai-tools-monitor.html", "w", encoding="utf-8") as f:
    f.write(final_html)

print("HTML structure repaired and re-constructed.")
