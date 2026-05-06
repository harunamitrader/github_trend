import json
import os

articles_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'
report_template_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\templates\github-report.template.html'
output_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\articles\github\reports\2026-05-07-update-report.html'

with open(articles_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Repos from trending scrape
trending_repos = [
    "Hmbown/DeepSeek-TUI",
    "addyosmani/agent-skills",
    "PriorLabs/TabPFN",
    "docusealco/docuseal",
    "LearningCircuit/local-deep-research",
    "LadybirdBrowser/ladybird",
    "InsForge/InsForge",
    "virattt/dexter",
    "anthropics/financial-services",
    "ruvnet/ruflo",
    "cheahjs/free-llm-api-resources",
    "shiyu-coder/Kronos",
    "bwya77/vscode-dark-islands",
    "bytedance/deer-flow",
    "D4Vinci/Scrapling"
]

# Find info for each
repo_info = []
newly_added = [
    "addyosmani/agent-skills",
    "LadybirdBrowser/ladybird",
    "InsForge/InsForge",
    "anthropics/financial-services",
    "cheahjs/free-llm-api-resources"
]

for repo in trending_repos:
    info = {"name": repo, "url": None, "status": "no-article"}
    for art in data['articles']:
        if art.get('repoName') == repo:
            info["url"] = art['articleUrl']
            if repo in newly_added:
                info["status"] = "✨ 新規追加"
            else:
                info["status"] = "✅ 記事作成済み"
            break
    repo_info.append(info)

# Generate list HTML
list_html = ""
for i, info in enumerate(repo_info, 1):
    status_class = "status-added" if "新規" in info["status"] else "status-done" if "作成済み" in info["status"] else "status-none"
    if info["url"]:
        # Relative path correction for report -> daily
        # report is in articles/github/reports/
        # daily is in articles/github/daily/
        # so ../daily/ is correct
        url = info["url"].replace('./articles/github/daily/', '../daily/')
        list_html += f'<li><a href="{url}">{info["name"]}</a> <span class="status-badge {status_class}">{info["status"]}</span></li>\n'
    else:
        list_html += f'<li>{info["name"]} <span class="status-badge {status_class}">{info["status"]}</span></li>\n'

with open(report_template_path, 'r', encoding='utf-8') as f:
    template = f.read()

summary_text = "本日の調査では、シニアエンジニアの規律を AI に導入する「agent-skills」、独立系ブラウザ「Ladybird」、AI ネイティブなバックエンド「InsForge」、金融実務特化の「financial-services」、そして LLM API の無料リソース集の 5 件を新規に記事化しました。開発プロセスの標準化からインフラ、専門実務まで、AI 活用のレイヤーが着実に深まっていることを感じさせるラインナップです。"

content = template
content = content.replace('{{YYYY_MM_DD}}', '2026-05-07')
content = content.replace('{{SUMMARY_TEXT}}', summary_text)
content = content.replace('{{RANKING_LIST}}', list_html)
content = content.replace('{{FUTURE_TEXT}}', "AI エージェントが単なるコード生成を超え、エンジニアリングの規律やバックエンド管理、さらには金融などの専門実務を肩代わりするフェーズに入っています。今後、これらの要素が統合されることで、真に自律的なソフトウェア開発・運用環境が構築されていくでしょう。")
content = content.replace('{{BACK_LINK_URL}}', '../../github-trend.html')

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(content)

# Update articles.json with report entry
new_report = {
    "category": "github-update-report",
    "slug": "2026-05-07-update-report",
    "title": "2026-05-07 GitHub Trending 更新レポート",
    "dek": "本日調査したGitHubトレンドの全順位と、新規作成された記事のまとめ",
    "summary": summary_text,
    "publishedAt": "2026-05-07",
    "articleUrl": "./articles/github/reports/2026-05-07-update-report.html",
    "serial": 36
}
data['articles'].insert(0, new_report)

with open(articles_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Successfully created report and updated articles.json")
