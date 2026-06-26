import json
import os
import re
from datetime import datetime, timezone, timedelta

base_dir = r"C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base"
template_path = os.path.join(base_dir, "templates", "ai-tool-log.template.html")
articles_json_path = os.path.join(base_dir, "data", "articles.json")
monitor_html_path = os.path.join(base_dir, "ai-tools-monitor.html")

# 1. Create Article HTML
published_at = "2026-06-24"
created_at = "2026-06-25T04:05:00+09:00"
article_title = "Claude Code v2.1.191: サンドボックスセキュリティの強化と各種UI・エージェントバグ修正"
dek_description = "サンドボックス環境での資格情報アクセス制限（sandbox.credentials）、組織でのモデル利用制限、トランスクリプトのMarkdownコピーやセッションフォーク機能、およびNamed Subagentのセキュリティ制限やUI等のバグ修正を盛り込んだアップデート。"
tool_slug = "claudecode"
version = "v2.1.191"
article_filename = f"{published_at}-{tool_slug}-{version.lower().replace('.', '-')}.html"
article_path = os.path.join(base_dir, "articles", "tools", article_filename)
article_relative_url = f"./articles/tools/{article_filename}"

eyebrow_text = "AI Tool Log"
metadata_label_2 = "バージョン"
metadata_value_2 = version
tool_name = "Claude Code"
source_url = "https://docs.anthropic.com/en/release-notes/claude-code"
source_name = "Claude Code Release Notes"

main_changes_intro = "Claude Code v2.1.187 から v2.1.191 にかけて、セキュリティ設定の強化、組織ポリシーの適用、トランスクリプト操作の改善、およびNamed SubagentやUIに関連する多数のバグ修正が実施されました。主な変更内容は以下の通りです。"

main_changes_list = (
    "<li><strong>サンドボックスのセキュリティ強化 (v2.1.187):</strong> 新規設定 <code>sandbox.credentials</code> を追加。これを有効にすることで、サンドボックス内で実行されるコマンドから credential ファイルやシークレット環境変数へのアクセスを遮断し、セキュリティを大幅に向上させます。</li>\n"
    "            <li><strong>組織レベルのモデル制限の適用 (v2.1.187):</strong> 組織で設定された利用制限モデルを、モデルピッカー、<code>--model</code> フラグ、<code>/model</code> コマンド、および <code>ANTHROPIC_MODEL</code> 環境変数を含むプラットフォーム全域で厳格に適用します。</li>\n"
    "            <li><strong>Github App インストールフローの改善 (v2.1.187):</strong> インストール時に \"Skip for now\" オプションを選択可能にし、後から <code>/install-github-app</code> を実行してシークレット等の構成手順に戻れるように改善されました。</li>\n"
    "            <li><strong>トランスクリプト操作の改善 (v2.1.187):</strong> トランスクリプトビューアにおいて、回答を生のMarkdown形式でコピーする <code>c</code> キー、および現在のセッションから新しいセッションを分岐（フォーク）させる <code>f</code> キーのショートカットが導入されました。</li>\n"
    "            <li><strong>UIおよびエージェントのバグ修正 (v2.1.190):</strong> Named Subagent 起動時に <code>Agent(type)</code> の拒否ルールや <code>Agent(x, y)</code> の許可タイプ制限が正しく適用されない不具合を修正。その他、TUIでの重なり表示のバグや、バックグラウンドエージェント実行終了後に <code>Esc</code> や <code>Ctrl+C</code> が効かなくなる問題が解消されました。</li>"
)

impact_and_usage = (
    "今回のアップデートは、特に企業利用や本番運用の安全性を高める上で極めて重要です。<code>sandbox.credentials</code> 設定により、意図しない資格情報の漏洩リスクを未然に防ぐことが可能になります。また、モデル制限機能の全域適用により、組織内のシャドーAI利用を防ぎポリシーを徹底できます。一般開発者にとっても、トランスクリプトのMarkdownコピー（<code>c</code>）やフォーク（<code>f</code>）といったTUIの改善により、以前の会話の再利用性が劇的に向上します。"
)

summary_text = (
    "Claude Code v2.1.191 は、サンドボックスでの防御力を強め、組織ガバナンスとTUI操作性をブラッシュアップした、開発者と管理者の両者にとって実用的な価値の高い堅実なアップデートです。"
)

try:
    # Read Template
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

    # Check for duplicate slug
    data["articles"] = [x for x in data["articles"] if x.get("slug") != f"{published_at}-{tool_slug}-{version.lower().replace('.', '-')}"]

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

    # Sort articles based on createdAt descending (aware datetime sorting helper)
    jst = timezone(timedelta(hours=9))
    def get_dt(x):
        try:
            if 'createdAt' in x and x['createdAt']:
                dt = datetime.fromisoformat(x['createdAt'])
                if dt.tzinfo is None:
                    dt = dt.replace(tzinfo=jst)
                return dt
            else:
                dt = datetime.fromisoformat(x['publishedAt'] + 'T00:00:00')
                return dt.replace(tzinfo=jst)
        except Exception:
            return datetime(2020, 1, 1, tzinfo=jst)
            
    data["articles"].sort(key=get_dt, reverse=True)

    with open(articles_json_path, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("Updated articles.json")

    # 3. Update ai-tools-monitor.html
    with open(monitor_html_path, 'r', encoding='utf-8') as f:
        html_src = f.read()

    # summary data-latest updating
    html_src = html_src.replace(
        '<details id="tool-claude-code" data-category="coding" class="tool-card card-claude-code" data-latest="2026-06-22">',
        f'<details id="tool-claude-code" data-category="coding" class="tool-card card-claude-code" data-latest="{published_at}">'
    )

    # summary inner span updating
    pattern_summary = r'(<details id="tool-claude-code"[^>]*>.*?<span class="tool-summary-date">)[^<]+(</span><span class="tool-summary-title"><a href=")[^"]+(">)[^<]+(</a></span>)'
    replacement_summary = r'\g<1>' + published_at + r'\g<2>' + article_relative_url + r'\g<3>' + f"{version}: サンドボックスセキュリティの強化と各種UI・エージェントバグ修正" + r'\g<4>'
    html_src = re.sub(pattern_summary, replacement_summary, html_src, flags=re.DOTALL)

    # list-claude-code new item prepend
    new_li = f'                <li class="changelog-item"><span class="changelog-date">{published_at}</span><a href="{article_relative_url}">{version}: サンドボックスセキュリティの強化と各種UI・エージェントバグ修正</a></li>'
    html_src = html_src.replace(
        '<ul class="changelog-list" id="list-claude-code">',
        f'<ul class="changelog-list" id="list-claude-code">\n{new_li}'
    )

    # val-claude-code tag updating
    html_src = html_src.replace(
        '<strong id="val-claude-code">v2.1.186</strong>',
        f'<strong id="val-claude-code">{version}</strong>'
    )

    # report coding date updating to 2026-06-25 04:00 JST
    html_src = html_src.replace(
        '<span id="report-coding-date">2026-06-24 04:00 JST</span>',
        '<span id="report-coding-date">2026-06-25 04:00 JST</span>'
    )

    # updates found section update
    html_src = html_src.replace(
        '                  <p style="margin: 0 0 4px 0;"><strong>Updates Found (1):</strong></p>\n                  <ul style="margin: 0; padding-left: 20px; color: var(--text);">\n                    <li>Claude Code (v2.1.186)</li>\n                  </ul>',
        f'                  <p style="margin: 0 0 4px 0;"><strong>Updates Found (1):</strong></p>\n                  <ul style="margin: 0; padding-left: 20px; color: var(--text);">\n                    <li>Claude Code ({version})</li>\n                  </ul>'
    )

    with open(monitor_html_path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(html_src)
    print("Updated ai-tools-monitor.html")

except Exception as e:
    print(f"Error: {e}")
