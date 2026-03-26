import json
import os
import re

json_path = "data/articles.json"
html_path = "ai-tools-monitor.html"

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

# 1. ARTICLES JSON
with open(json_path, "r", encoding="utf-8") as f:
    orig_data = json.load(f)

summary_slugs = ["2026-03-chatgpt-gpt54", "2026-03-perplexity-iphone-comet", "2026-03-claude-api-update", "2026-03-gemini-billing-update", "2026-03-grok-4-reasoning", "2026-03-obsidian-v1-12", "2026-03-notebooklm-video", "2026-03-openclaw-teams", "2026-03-grok-cli-v1-rc"]
# Remove these specific old ones
filtered_articles = [a for a in orig_data["articles"] if a["slug"] not in summary_slugs]

new_full_entries = []
for na in new_articles_minimal:
    # Full metadata creation
    new_full_entries.append({
        "category": "ai-tool-log",
        "slug": na["slug"],
        "title": f"[{na['tool'].upper()}] {na['title']}",
        "dek": f"{na['tool']} の 2026年3月 リリース実績。",
        "summary": f"{na['tool']} {na['title']}",
        "publishedAt": na["date"],
        "repoName": "harunami_AI_base",
        "repoUrl": "https://github.com/harunamitrader/harunami_AI_base",
        "articleUrl": f"./articles/tools/{na['slug']}.html"
    })

orig_data["articles"] = new_full_entries + filtered_articles
# Sort by publishedAt decending
orig_data["articles"].sort(key=lambda x: x["publishedAt"], reverse=True)

with open(json_path, "w", encoding="utf-8") as f:
    json.dump(orig_data, f, indent=2, ensure_ascii=False)

# 2. HTML (Using clean string splitting instead of regex for card body)
with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

for tool_id in ["chatgpt", "perplexity", "claude", "gemini", "grok", "grokcli", "obsidian", "notebooklm", "openclaw"]:
    items = sorted([a for a in new_articles_minimal if a["tool"] == tool_id], key=lambda x: x["date"], reverse=True)
    list_html = '<ul class="changelog-list">\n'
    for item in items:
        list_html += f'                <li class="changelog-item"><span class="changelog-date">{item["date"]}</span><a href="./articles/tools/{item["slug"]}.html">{item["title"]}</a></li>\n'
    list_html += '              </ul>'
    
    latest_date = items[0]["date"]
    
    # 2a. Update Card
    # Find tool-xxx block precisely
    start_tag = f'id="tool-{tool_id}"'
    if start_tag in html:
        # We find the specific card block
        block_start = html.find(f'<div id="tool-{tool_id}"')
        block_end = html.find('</div>\n            </div>', block_start) # Finding next structural end
        if block_end == -1: block_end = html.find('</div>', block_start + 100)
        
        # Replace the entire card HTML with a clean template
        new_card = f"""            <div id="tool-{tool_id}" class="tool-card card-{tool_id}">
              <div class="tool-name">{tool_id.capitalize()}</div>
              <div class="tool-status">監視中</div>
                {list_html}
              <div class="tool-meta">
                <span class="latest-tag">Latest: <strong>{latest_date}</strong></span>
                <span class="status-tag status-active">Active</span>
              </div>
            </div>"""
        
        # We need to find the specific range to replace
        # Simplified: find tool-status and tool-meta
        p_status = html.find('<div class="tool-status">', block_start)
        p_meta = html.find('<div class="tool-meta">', block_start)
        # Content between status-end and meta-start should be the list
        status_end = html.find('</div>', p_status) + 6
        html = html[:status_end] + "\n                " + list_html + "\n              " + html[p_meta:]

    # 2b. Update Index
    index_re = re.compile(rf'(<a href="#tool-{tool_id}"\s+class="tool-index-item" data-latest=").*?("><span class="tool-index-name">.*?</span><span class="tool-index-date">).*?(</span></a>)')
    html = index_re.sub(rf'\1{latest_date}\2{latest_date}\3', html)

# Clean up any duplicated </ul> tags from previous broken run
html = html.replace('</ul><ul class="changelog-list">', '')

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html)

print("HTML/JSON integration fixed.")
