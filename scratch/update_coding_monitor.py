import json
import os
import re
from bs4 import BeautifulSoup

base_dir = r"C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base"
template_path = os.path.join(base_dir, "templates", "ai-tool-log.template.html")
articles_json_path = os.path.join(base_dir, "data", "articles.json")
monitor_html_path = os.path.join(base_dir, "ai-tools-monitor.html")

# 1. Create Article HTML
# Metadata
published_at = "2026-06-22"
created_at = "2026-06-24T04:05:00+09:00"
article_title = "Claude Code v2.1.186: CLIによるMCP認証の統合と非インタラクティブ対応"
dek_description = "MCP認証のCLI統合（claude mcp login）や非インタラクティブ実行のサポート、バックグラウンドセッションの自動更新など利便性を強化したアップデート。"
tool_slug = "claudecode"
version = "v2.1.186"
article_filename = f"{published_at}-{tool_slug}-{version.lower().replace('.', '-')}.html"
article_path = os.path.join(base_dir, "articles", "tools", article_filename)
article_relative_url = f"./articles/tools/{article_filename}"

eyebrow_text = "AI Tool Log"
metadata_label_2 = "バージョン"
metadata_value_2 = version
tool_name = "Claude Code"
source_url = "https://github.com/anthropics/claude-code"
source_name = "Claude Code Releases"

main_changes_intro = "Claude Code v2.1.186 では、主に MCP（Model Context Protocol）サーバーの認証フロー改善や、非インタラクティブ環境（SSHなど）での操作性向上、バックグラウンドでのセッション更新などの使い勝手の改善が行われました。主な変更点は以下の通りです。"

main_changes_list = (
    "<li><strong>MCPサーバーのCLI認証:</strong> <code>claude mcp login &lt;name&gt;</code> および <code>claude mcp logout &lt;name&gt;</code> コマンドを追加し、CLIから直接MCPサーバーのログイン/ログアウト認証を行えるようにしました。</li>\n"
    "            <li><strong>非インタラクティブ認証のサポート:</strong> <code>--no-browser</code> オプションおよび標準入力（stdin）の読み取りに対応し、SSH環境などのブラウザが使えない環境でも認証が容易になりました。</li>\n"
    "            <li><strong>バックグラウンドセッションの自動更新:</strong> バックグラウンドにあるエージェントセッションが自動的に新バージョンへ更新されるようになり、アップデート後の初回起動時の待機時間（コールドスタート）が解消されました。</li>\n"
    "            <li><strong>ワークフロー表示のフィルタリング:</strong> <code>/workflows</code> 画面で <code>f</code> キーを押すことで、ステータスによるフィルタリング（絞り込み）が可能になりました。</li>\n"
    "            <li><strong>UI/UXの細かな改善:</strong> <code>/plugin</code> 内の Installed タブに「Skills」セクションを追加。また、起動時にサブスクリプション移行の提案がトーストではなくスタートアップメッセージ枠に表示されるようになり、コマンドヘルプ（<code>/</code> メニュー）の記述も整理されました。</li>"
)

impact_and_usage = (
    "特にリモート開発やSSH経由でターミナルから操作しているユーザーにとって、ブラウザを使わずにCLIから直接MCP認証を通せるようになった点は大きな改善です。また、バックグラウンドのセッションが自動更新されるようになったことで、アップデート後の起動ストレスがなくなります。"
)

summary_text = (
    "v2.1.186 は、ターミナル作業における摩擦（ブラウザ認証や起動待機）を減らし、実用的な運用性をさらに高める堅実なアップデートです。"
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

# Save article HTML (UTF-8 without BOM)
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

# 配列の末尾に追加する
data["articles"].append(new_entry)

with open(articles_json_path, 'w', encoding='utf-8', newline='\n') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
print("Updated articles.json")


# 3. Update ai-tools-monitor.html
# BeautifulSoupを使うとHTMLフォーマットが変わる可能性があるため、注意深く行う。
# 今回は文字列置換もしくは正規表現を使う方が、インデントや元のフォーマットを壊さないため安全。
with open(monitor_html_path, 'r', encoding='utf-8') as f:
    html_src = f.read()

# summaryの置換
# 変更前:
# <span class="tool-summary-date">2026-06-22</span><span class="tool-summary-title"><a href="./articles/tools/2026-06-22-claudecode-v2-1-185.html">v2.1.185: 安定性の向上とマイナーバグ修正</a></span>
# 変更後:
# <span class="tool-summary-date">2026-06-22</span><span class="tool-summary-title"><a href="./articles/tools/2026-06-22-claudecode-v2-1-186.html">v2.1.186: CLIによるMCP認証の統合と非インタラクティブ対応</a></span>
pattern_summary = r'(<details id="tool-claude-code"[^>]*>.*?<span class="tool-summary-date">)2026-06-22(</span><span class="tool-summary-title"><a href=")[^"]+(">)[^<]+(</a></span>)'
replacement_summary = r'\g<1>2026-06-22\g<2>' + article_relative_url + r'\g<3>' + f"{version}: CLIでのMCP認証統合と非インタラクティブ対応" + r'\g<4>'
html_src = re.sub(pattern_summary, replacement_summary, html_src, flags=re.DOTALL)

# list-claude-codeの先頭に新要素を追加
# 変更前:
# <ul class="changelog-list" id="list-claude-code">
# <li class="changelog-item"><span class="changelog-date">2026-06-22</span><a href="./articles/tools/2026-06-22-claudecode-v2-1-185.html">v2.1.185: 安定性の向上とマイナーバグ修正</a></li>
# 変更後:
# <ul class="changelog-list" id="list-claude-code">
# <li class="changelog-item"><span class="changelog-date">2026-06-22</span><a href="./articles/tools/2026-06-22-claudecode-v2-1-186.html">v2.1.186: CLIによるMCP認証の統合と非インタラクティブ対応</a></li>
# <li class="changelog-item"><span class="changelog-date">2026-06-22</span><a href="./articles/tools/2026-06-22-claudecode-v2-1-185.html">v2.1.185: 安定性の向上とマイナーバグ修正</a></li>
new_li = f'                <li class="changelog-item"><span class="changelog-date">2026-06-22</span><a href="{article_relative_url}">{version}: CLIでのMCP認証統合と非インタラクティブ対応</a></li>'
html_src = html_src.replace(
    '<ul class="changelog-list" id="list-claude-code">',
    f'<ul class="changelog-list" id="list-claude-code">\n{new_li}'
)

# val-claude-codeの置換
# 変更前:
# <strong id="val-claude-code">v2.1.185</strong>
# 変更後:
# <strong id="val-claude-code">v2.1.186</strong>
html_src = html_src.replace(
    '<strong id="val-claude-code">v2.1.185</strong>',
    f'<strong id="val-claude-code">{version}</strong>'
)

# レポート部分の置換
# 変更前:
# <span id="report-coding-date">2026-06-23 04:00 JST</span>
# 変更後:
# <span id="report-coding-date">2026-06-24 04:00 JST</span>
html_src = html_src.replace(
    '<span id="report-coding-date">2026-06-23 04:00 JST</span>',
    '<span id="report-coding-date">2026-06-24 04:00 JST</span>'
)

# updates found と no updates の置換
# 変更前:
#               <div id="report-coding-updates">
#                   <p style="margin: 0 0 4px 0;"><strong>Updates Found (0):</strong></p>
#                   <ul style="margin: 0; padding-left: 20px; color: var(--text);">
#                   </ul>
#                 </div>
#               <div id="report-coding-no-updates" style="margin-top: 8px;">
#                   <p style="margin: 0 0 4px 0;"><strong>No New Updates (8):</strong></p>
#                   <ul style="margin: 0; padding-left: 20px; color: var(--text-muted);">
#                     <li>Claude Code (v2.1.185)</li>
#                     <li>Antigravity (v2.1.4)</li>
#                     <li>Cursor (Cursor Automations)</li>
#                     <li>Windsurf (v3.2.16)</li>
#                     <li>Cline (v3.0.29)</li>
#                     <li>Gemini CLI (v0.48.0-preview.0)</li>
#                     <li>GitHub Copilot (Auto mode & Desktop GA)</li>
#                     <li>Codex (v0.141.0-alpha.6)</li>
#                   </ul>
#                 </div>
#
# 変更後:
#               <div id="report-coding-updates">
#                   <p style="margin: 0 0 4px 0;"><strong>Updates Found (1):</strong></p>
#                   <ul style="margin: 0; padding-left: 20px; color: var(--text);">
#                     <li>Claude Code (v2.1.186)</li>
#                   </ul>
#                 </div>
#               <div id="report-coding-no-updates" style="margin-top: 8px;">
#                   <p style="margin: 0 0 4px 0;"><strong>No New Updates (7):</strong></p>
#                   <ul style="margin: 0; padding-left: 20px; color: var(--text-muted);">
#                     <li>Antigravity (v2.1.4)</li>
#                     <li>Cursor (Cursor Automations)</li>
#                     <li>Windsurf (v3.2.16)</li>
#                     <li>Cline (v3.0.29)</li>
#                     <li>Gemini CLI (v0.48.0-preview.0)</li>
#                     <li>GitHub Copilot (Auto mode & Desktop GA)</li>
#                     <li>Codex (v0.141.0-alpha.6)</li>
#                   </ul>
#                 </div>

html_src = html_src.replace(
    '                  <p style="margin: 0 0 4px 0;"><strong>Updates Found (0):</strong></p>\n                  <ul style="margin: 0; padding-left: 20px; color: var(--text);">\n                  </ul>',
    '                  <p style="margin: 0 0 4px 0;"><strong>Updates Found (1):</strong></p>\n                  <ul style="margin: 0; padding-left: 20px; color: var(--text);">\n                    <li>Claude Code (v2.1.186)</li>\n                  </ul>'
)

html_src = html_src.replace(
    '                  <p style="margin: 0 0 4px 0;"><strong>No New Updates (8):</strong></p>\n                  <ul style="margin: 0; padding-left: 20px; color: var(--text-muted);">\n                    <li>Claude Code (v2.1.185)</li>\n                    <li>Antigravity (v2.1.4)</li>',
    '                  <p style="margin: 0 0 4px 0;"><strong>No New Updates (7):</strong></p>\n                  <ul style="margin: 0; padding-left: 20px; color: var(--text-muted);">\n                    <li>Antigravity (v2.1.4)</li>'
)

with open(monitor_html_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(html_src)
print("Updated ai-tools-monitor.html")
