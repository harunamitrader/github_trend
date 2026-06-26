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
created_at = "2026-06-25T04:20:00+09:00"
article_title = "OpenClaw v2026.6.10: 会話用自動ファストモードと各種モデルルーティング・セッション状態の改善"
dek_description = "短いターンでの「自動ファストモード（automatic fast mode）」の導入、Zaiモデル・GLM過負荷フェイルオーバー等のモデルルーティングの信頼性向上、およびチャネル切り替え時の状態初期化等のバグ修正を盛り込んだ stable アップデート。"
tool_slug = "openclaw"
version = "v2026.6.10"
article_filename = f"{published_at}-{tool_slug}-{version.lower().replace('.', '-')}.html"
article_path = os.path.join(base_dir, "articles", "tools", article_filename)
article_relative_url = f"./articles/tools/{article_filename}"

eyebrow_text = "AI Tool Log"
metadata_label_2 = "バージョン"
metadata_value_2 = version
tool_name = "OpenClaw"
source_url = "https://github.com/openclaw/openclaw/releases"
source_name = "OpenClaw GitHub Releases"

main_changes_intro = "OpenClaw v2026.6.10 では、会話の短文化に対応した「自動ファストモード」の導入や、対応する基盤モデルの推論・フェイルオーバー動作の信頼性向上、およびセッション・チャネル管理における各種不具合の修正が行われました。主な変更内容は以下の通りです。"

main_changes_list = (
    "<li><strong>自動ファストモード (automatic fast mode):</strong> 短いやり取りを行う会話ターン向けにファストモードを自動適用する機能。処理が長引いたり複雑化したりした場合は、通常の推論モードへ自動的にフォールバックします。</li>\n"
    "            <li><strong>モデルルーティングの信頼性向上:</strong> Zai モデルの合成フロー、GLM 過負荷時の自動フェイルオーバー、およびネイティブ推論レベルの選定ロジックを強化し、設定したモデルカタログへより厳密に適合するようになりました。</li>\n"
    "            <li><strong>チャネル・セッション状態の不具合修正:</strong> チャネルを切り替えた際に、古いセッションのオリジンフィールドが正しく初期化されるように修正。また、cron スケジュールによるメッセージ配信の検知機能が対象セッションに正しく紐付くよう改善されました。</li>\n"
    "            <li><strong>実行安定性とデータの整合性:</strong> サブエージェントの完了通知保留の維持、メディアインデックスの整合性確保、モデルのエイリアス解決の均一化、およびチャット履歴トランスクリプトが空で出力されるエラーを防止する対策が施されました。</li>\n"
    "            <li><strong>セキュリティポリシーの維持:</strong> フック合成の際、認証を必要とする承認フローで必要なツールポリシー（Trusted policies）が途切れずに正しく引き継がれるようになりました。</li>"
)

impact_and_usage = (
    "自動ファストモードの導入により、ちょっとした確認や指示といった短い対話のレスポンスが高速化されると同時に、複雑なタスクではしっかりとリソースを割くため、ユーザー体験の向上が期待できます。また、clickhouse 等を用いた大規模なセッションログ監視や、複数のエージェントが動き回るマルチエージェント環境において、チャネル切替時のゴミデータの初期化やフック合成時のポリシー維持は、システムの堅牢性を大きく高めます。"
)

summary_text = (
    "OpenClaw v2026.6.10 は、自動ファストモードによるレスポンス最適化と、エージェント実行・モデルルーティングにまつわる多数のバグを解消した、安定性と速度の両面を強化したマイルストーンリリースです。"
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
    # 変更前:
    # <details id="tool-openclaw" data-category="others" class="tool-card card-openclaw" data-latest="2026-06-22">
    # 変更後:
    # <details id="tool-openclaw" data-category="others" class="tool-card card-openclaw" data-latest="2026-06-24">
    html_src = html_src.replace(
        '<details id="tool-openclaw" data-category="others" class="tool-card card-openclaw" data-latest="2026-06-22">',
        f'<details id="tool-openclaw" data-category="others" class="tool-card card-openclaw" data-latest="{published_at}">'
    )

    # summary inner span updating
    pattern_summary = r'(<details id="tool-openclaw"[^>]*>.*?<span class="tool-summary-date">)[^<]+(</span><span class="tool-summary-title"><a href=")[^"]+(">)[^<]+(</a></span>)'
    replacement_summary = r'\g<1>' + published_at + r'\g<2>' + article_relative_url + r'\g<3>' + f"{version}: 会話用自動ファストモードと各種モデルルーティング・セッション状態の改善" + r'\g<4>'
    html_src = re.sub(pattern_summary, replacement_summary, html_src, flags=re.DOTALL)

    # list-openclaw new item prepend
    new_li = f'                <li class="changelog-item"><span class="changelog-date">{published_at}</span><a href="{article_relative_url}">{version}: 会話用自動ファストモードと各種モデルルーティング・セッション状態の改善</a></li>'
    html_src = html_src.replace(
        '<ul class="changelog-list" id="list-openclaw">',
        f'<ul class="changelog-list" id="list-openclaw">\n{new_li}'
    )

    # val-openclaw tag updating
    html_src = re.sub(
        r'<strong id="val-openclaw">[^<]+</strong>',
        f'<strong id="val-openclaw">{version}</strong>',
        html_src
    )

    # report others date updating to 2026-06-25 04:15 JST
    html_src = re.sub(
        r'<span id="report-others-date">[^<]+</span>',
        f'<span id="report-others-date">2026-06-25 04:15 JST</span>',
        html_src
    )

    # updates found section update for others
    # 変更前:
    #                 <ul style="margin: 0; padding-left: 20px; color: var(--text);">
    #                   <li>OpenClaw (v2026.6.9)</li>
    #                 </ul>
    # 変更後:
    #                 <ul style="margin: 0; padding-left: 20px; color: var(--text);">
    #                   <li>OpenClaw (v2026.6.10)</li>
    #                 </ul>
    html_src = html_src.replace(
        '                <ul style="margin: 0; padding-left: 20px; color: var(--text);">\n                  <li>OpenClaw (v2026.6.9)</li>\n                </ul>',
        f'                <ul style="margin: 0; padding-left: 20px; color: var(--text);">\n                  <li>OpenClaw ({version})</li>\n                </ul>'
    )

    with open(monitor_html_path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(html_src)
    print("Updated ai-tools-monitor.html")

except Exception as e:
    print(f"Error: {e}")
