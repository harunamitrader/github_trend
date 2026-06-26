import json
import os
import re
from datetime import datetime, timezone, timedelta

base_dir = r"C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base"
template_path = os.path.join(base_dir, "templates", "ai-tool-log.template.html")
articles_json_path = os.path.join(base_dir, "data", "articles.json")
monitor_html_path = os.path.join(base_dir, "ai-tools-monitor.html")

# Define timezone helper
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

# Load article template
with open(template_path, 'r', encoding='utf-8') as f:
    template_content = f.read()

# Define updates
updates_data = [
    {
        "published_at": "2026-06-24",
        "created_at": "2026-06-25T04:22:00+09:00",
        "article_title": "ChatGPT: GPT-5.5 Instant 会話品質の向上と1万文字以上の自動ファイル添付化",
        "dek_description": "GPT-5.5 Instantにおける会話ターン間のコンテキスト維持能力や複雑な指示追従性の強化、およびFree/Goユーザー向けの入力欄スマート化アップデート。",
        "tool_slug": "chatgpt",
        "tool_name": "ChatGPT",
        "version": "GPT-5.5 Instant Update",
        "source_url": "https://help.openai.com/en/articles/9686456-chatgpt-release-notes",
        "source_name": "ChatGPT Release Notes",
        "metadata_label_2": "アップデート",
        "metadata_value_2": "モデル品質・UI改善",
        "main_changes_intro": "OpenAI は ChatGPT において、会話品質のブラッシュアップと、ユーザーインターフェースの使い勝手を向上させるための変更を実施しました。主な内容は以下の通りです。",
        "main_changes_list": (
            "<li><strong>GPT-5.5 Instant の会話品質向上:</strong> ユーザーのゴール特定、ターンをまたいだ文脈の維持、および複雑な複数制約の命令に対する追従性が強化されました。また、出力のフォーマットもより一貫性があるものに改善されています。</li>\n"
            "            <li><strong>長文ペーストの自動添付ファイル化:</strong> ChatGPT Free および Go ユーザーを対象に、プロンプト欄へ 10,000 文字以上のテキストを貼り付けた際、自動的に添付ファイル（テキストファイル等）として格納されるようになりました。これにより、入力枠が乱雑になるのを防ぎ、UI をクリーンに維持します。</li>"
        ),
        "impact_and_usage": (
            "GPT-5.5 Instant の品質向上により、複数回のやり取りを重ねるブレインストーミングや、細かい条件指定のあるコード生成などで、より意図に沿った返答が得られるようになります。また、長文のログやソースコードをプロンプトに貼り付ける際、自動的に添付ファイル化されるため、メッセージ送信時の見通しが良くなり、ChatGPT がコンテキストウィンドウを効率的に処理する助けになります。"
        ),
        "summary_text": (
            "ChatGPT は、中核モデルである GPT-5.5 Instant のさらなる洗練と、長文貼り付け時の UI スマート化によって、日常的な会話から複雑なドキュメント・コードの読み込みまで、よりスムーズな操作体験を提供します。"
        )
    },
    {
        "published_at": "2026-06-24",
        "created_at": "2026-06-25T04:23:00+09:00",
        "article_title": "Gemini 3.5 Flash: 内蔵Computer Useツールのプレビュー提供と3.5 Proのリリース延期",
        "dek_description": "Gemini 3.5 Flashに画面認識・操作を行う「Computer Use」機能が内蔵ツールとして実装。一方、開発中のGemini 3.5 Proは品質チューニングのため7月へ公開が延期されました。",
        "tool_slug": "gemini",
        "tool_name": "Gemini",
        "version": "v3.5 Flash Update",
        "source_url": "https://support.google.com/gemini/answer/14743243",
        "source_name": "Gemini Release Updates",
        "metadata_label_2": "アップデート",
        "metadata_value_2": "Computer Use プレビュー",
        "main_changes_intro": "Google は、軽量・高速モデルの Gemini 3.5 Flash に対し、画面を操作する強力な新機能「Computer Use」を追加するとともに、上位モデルのリリース計画を更新しました。主な内容は以下の通りです。",
        "main_changes_list": (
            "<li><strong>Computer Use 内蔵ツールのプレビュー開始:</strong> Gemini 3.5 Flash に、直接画面を「見て、推論し、操作（クリック・タイプ・スクロールなど）する」機能がパブリックプレビューとして実装されました。ブラウザやモバイル、デスクトップ環境でネイティブに動作します。</li>\n"
            "            <li><strong>Gemini 3.5 Pro リリース時期の延期:</strong> 当初 6 月リリースをターゲットとしていた Gemini 3.5 Pro ですが、初期テスターのフィードバック反映と、複雑なタスクでのさらなる最適化を行うため、リリースが 2026 年 7 月へ延期されました。</li>\n"
            "            <li><strong>DiffusionGemma 26B-A4B 公開:</strong> ディフュージョン（拡散）技術をテキスト生成に応用した、超高速な推論が可能な実験的オープンウェイトモデルが DeepMind より公開されました。</li>"
        ),
        "impact_and_usage": (
            "Gemini 3.5 Flash に Computer Use が内蔵されたことで、これまで専用モデルを呼び出す必要があった画面操作・エージェント開発が、高速な軽量モデルで直接開発可能になります。これにより、RPA 的な自動化ワークフローや自律型エージェントの作成がより低コストで迅速に実現できます。また、3.5 Pro のリリース延期は待たれるものの、7 月にさらに洗練されたモデルが登場することが期待されます。"
        ),
        "summary_text": (
            "Google は Gemini 3.5 Flash への Computer Use 実装を通じて軽量モデルでの自律操作サポートを推し進めており、7 月予定 of Gemini 3.5 Pro のリリースと合わせ、エージェント型プラットフォームとしての地位を強めています。"
        )
    },
    {
        "published_at": "2026-06-23",
        "created_at": "2026-06-25T04:24:00+09:00",
        "article_title": "Claude: Slack統合の自律エージェント「Claude Tag」を発表",
        "dek_description": "Slackのチャンネルから直接動作し、会話の文脈把握からタスク分解、組織をまたいだプロジェクト操作までを自律的にこなすエンタープライズ向け仮想同僚エージェント。",
        "tool_slug": "claude",
        "tool_name": "Claude",
        "version": "Claude Tag Launch",
        "source_url": "https://www.anthropic.com/news",
        "source_name": "Anthropic News",
        "metadata_label_2": "アップデート",
        "metadata_value_2": "Slack 自律エージェント",
        "main_changes_intro": "Anthropic は、ビジネスチャットツール Slack 内でチームメンバーとして協働する、新しい自律エージェント機能「Claude Tag」を発表しました。主な特徴は以下の通りです。",
        "main_changes_list": (
            "<li><strong>Slack へのシームレスな統合:</strong> チャンネル内のメッセージやスレッドの内容をリアルタイムで把握し、チームメンバーからの指示や会話の文脈に基づいてサポートを開始します。</li>\n"
            "            <li><strong>タスク of 分解と自律実行:</strong> 提示された大きな課題を、具体的な小タスクへ自律的に分解し、組織内のさまざまなプロジェクトフォルダや連携ツールを横断して実行することができます。</li>\n"
            "            <li><strong>仮想チームメイトとしての動作:</strong> 人間からのフィードバックを求める「Human-in-the-loop」設計を備えつつ、自律的にアウトプットの作成や状況報告を行います。</li>"
        ),
        "impact_and_usage": (
            "Claude Tag の登場により、Slack を中核とするコラボレーションフローにおいて、ミーティング議事録からのタスクリスト作成、進捗管理、関連ファイルや API 連携を通じた簡単なコーディングやデータ加工などが自動化されます。まるで優秀なアシスタントがチームの会話を監視し、指示される前に動いてくれるような作業効率化が期待できます。"
        ),
        "summary_text": (
            "Anthropic は Slack への自律エージェント「Claude Tag」の統合により、単なるチャットボットとしての Claude から、チームの一員として協働する仮想コワーカー（同僚）への進化を加速させています。"
        )
    }
]

# 1. Generate Article HTML Files
created_articles = []
for up in updates_data:
    filename = f"{up['published_at']}-{up['tool_slug']}-{up['version'].lower().replace('.', '-').replace(' ', '-')}.html"
    filepath = os.path.join(base_dir, "articles", "tools", filename)
    relative_url = f"./articles/tools/{filename}"
    
    html = template_content
    html = html.replace("{{DEK_DESCRIPTION}}", up['dek_description'])
    html = html.replace("{{ARTICLE_TITLE}}", up['article_title'])
    html = html.replace("{{EYEBROW_TEXT}}", "AI Tool Log")
    html = html.replace("{{YYYY_MM_DD}}", up['published_at'])
    html = html.replace("{{METADATA_LABEL_2}}", up['metadata_label_2'])
    html = html.replace("{{METADATA_VALUE_2}}", up['metadata_value_2'])
    html = html.replace("{{TOOL_NAME}}", up['tool_name'])
    html = html.replace("{{MAIN_CHANGES_INTRO}}", up['main_changes_intro'])
    html = html.replace("{{MAIN_CHANGES_LIST}}", up['main_changes_list'])
    html = html.replace("{{IMPACT_AND_USAGE}}", up['impact_and_usage'])
    html = html.replace("{{SUMMARY}}", up['summary_text'])
    html = html.replace("{{SOURCE_URL}}", up['source_url'])
    html = html.replace("{{SOURCE_NAME}}", up['source_name'])
    
    with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
        f.write(html)
    print(f"Created article: {filepath}")
    
    created_articles.append({
        "slug": f"{up['published_at']}-{up['tool_slug']}-{up['version'].lower().replace('.', '-').replace(' ', '-')}",
        "title": up['article_title'],
        "dek": up['dek_description'],
        "publishedAt": up['published_at'],
        "createdAt": up['created_at'],
        "toolName": up['tool_name'],
        "version": up['version'],
        "articleUrl": relative_url,
        "tool_slug": up['tool_slug']
    })

# 2. Update articles.json
with open(articles_json_path, 'r', encoding='utf-8') as f:
    articles_data = json.load(f)

# Deduplicate slugs
existing_slugs = {a.get("slug") for a in articles_data["articles"]}
for new_art in created_articles:
    articles_data["articles"] = [x for x in articles_data["articles"] if x.get("slug") != new_art["slug"]]
    
    entry = {
        "category": "ai-tool-log",
        "slug": new_art["slug"],
        "title": new_art["title"],
        "dek": new_art["dek"],
        "publishedAt": new_art["publishedAt"],
        "createdAt": new_art["createdAt"],
        "toolName": new_art["toolName"],
        "version": new_art["version"],
        "articleUrl": new_art["articleUrl"]
    }
    articles_data["articles"].append(entry)

# Sort articles
articles_data["articles"].sort(key=get_dt, reverse=True)

with open(articles_json_path, 'w', encoding='utf-8', newline='\n') as f:
    json.dump(articles_data, f, indent=2, ensure_ascii=False)
print("Updated articles.json")

# 3. Update ai-tools-monitor.html
with open(monitor_html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

# Add id="list-gemini" if not present
if '<ul class="changelog-list">' in html_content:
    gemini_pattern = r'(<details id="tool-gemini"[^>]*>.*?<div class="tool-details-body">.*?<ul class="changelog-list")>'
    html_content = re.sub(gemini_pattern, r'\1 id="list-gemini">', html_content, flags=re.DOTALL)

for new_art in created_articles:
    slug = new_art["tool_slug"]
    pub_date = new_art["publishedAt"]
    url = new_art["articleUrl"]
    title_short = f"{new_art['version']}: {new_art['title'].split(': ', 1)[-1] if ': ' in new_art['title'] else new_art['title']}"
    
    # Update <details id="tool-[slug]" data-category="others" class="tool-card card-[slug]" data-latest="[old]">
    latest_pattern = f'(<details id="tool-{slug}" data-category="others" class="tool-card card-{slug}" data-latest=")[^"]+(")'
    html_content = re.sub(latest_pattern, rf'\g<1>{pub_date}\g<2>', html_content)
    
    # Update summary title and date
    # Make sure we only match inside <details id="tool-[slug]"> ... </details> block and handle any whitespace
    # Using a non-greedy dotall capture but scoped inside tool-[slug] block to avoid matching other tool cards
    summary_pattern = rf'(<details id="tool-{slug}" data-category="others"[^>]*>.*?<span class="tool-summary-date">)[^<]+(</span>\s*<span class="tool-summary-title">\s*<a href=")[^"]+(">)[^<]+(</a>\s*</span>)'
    html_content = re.sub(summary_pattern, rf'\g<1>{pub_date}\g<2>{url}\g<3>{title_short}\g<4>', html_content, flags=re.DOTALL)
    
    # Prepend to list
    list_pattern = rf'(<ul class="changelog-list" id="list-{slug}">)'
    new_li = f'\n                <li class="changelog-item"><span class="changelog-date">{pub_date}</span><a href="{url}">{title_short}</a></li>'
    html_content = re.sub(list_pattern, rf'\1{new_li}', html_content)
    
    # Update latest tag value <strong id="val-[slug]">[old]</strong>
    val_pattern = rf'<strong id="val-{slug}">[^<]+</strong>'
    html_content = re.sub(val_pattern, f'<strong id="val-{slug}">{new_art["version"]}</strong>', html_content)

# Update Verification Report Section
# Set date
html_content = re.sub(
    r'<span id="report-others-date">[^<]+</span>',
    '<span id="report-others-date">2026-06-25 04:30 JST</span>',
    html_content
)

# Updates found block
updates_found_html = """<div id="report-others-updates">
                <p style="margin: 0 0 4px 0;"><strong>Updates Found (3):</strong></p>
                <ul style="margin: 0; padding-left: 20px; color: var(--text);">
                  <li>ChatGPT (GPT-5.5 Instant Update)</li>
                  <li>Gemini (v3.5 Flash Update)</li>
                  <li>Claude (Claude Tag Launch)</li>
                </ul>
              </div>"""

# Replace the entire report-others-updates block
html_content = re.sub(
    r'<div id="report-others-updates">.*?</div>',
    updates_found_html,
    html_content,
    flags=re.DOTALL
)

# No updates block
no_updates_html = """<div id="report-others-no-updates" style="margin-top: 8px;">
                <p style="margin: 0 0 4px 0;"><strong>No New Updates (5):</strong></p>
                <ul style="margin: 0; padding-left: 20px; color: var(--text-muted);">
                  <li>Grok (Imagine Video 1.5)</li>
                  <li>Perplexity (IPO計画・訴訟進展)</li>
                  <li>NotebookLM (Research Agent)</li>
                  <li>Obsidian (v1.13.1)</li>
                  <li>OpenClaw (v2026.6.10)</li>
                </ul>
              </div>"""

# Replace the entire report-others-no-updates block
html_content = re.sub(
    r'<div id="report-others-no-updates"[^>]*>.*?</div>',
    no_updates_html,
    html_content,
    flags=re.DOTALL
)

with open(monitor_html_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(html_content)
print("Updated ai-tools-monitor.html")
