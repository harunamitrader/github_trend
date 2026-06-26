import json
import os

articles_path = r"C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json"

repos = [
    ("simplex-chat/simplex-chat", 1, True, "./articles/github/daily/2026-06-27-simplex-chat-simplex-chat.html"),
    ("google-labs-code/design.md", 2, False, None),
    ("commaai/openpilot", 3, True, "./articles/github/daily/2026-06-27-commaai-openpilot.html"),
    ("kunchenguid/no-mistakes", 4, False, None),
    ("grafana/grafana", 5, False, None),
    ("ripienaar/free-for-dev", 6, True, "./articles/github/daily/2026-06-27-ripienaar-free-for-dev.html"),
    ("opendatalab/MinerU", 7, True, "./articles/github/daily/2026-06-27-opendatalab-MinerU.html"),
    ("alchaincyf/zhangxuefeng-skill", 8, False, None),
    ("mauriceboe/TREK", 9, False, None),
    ("xbtlin/ai-berkshire", 10, False, None),
    ("calesthio/OpenMontage", 11, False, None),
    ("aws/agent-toolkit-for-aws", 12, False, None),
    ("NanmiCoder/MediaCrawler", 13, True, "./articles/github/daily/2026-06-27-NanmiCoder-MediaCrawler.html"),
    ("garrytan/gstack", 14, False, None),
    ("IceWhaleTech/CasaOS", 15, False, None),
    ("JCodesMore/ai-website-cloner-template", 16, False, None),
    ("Panniantong/Agent-Reach", 17, False, None)
]

with open(articles_path, "r", encoding="utf-8") as f:
    data = json.load(f)

articles = data.get("articles", [])

# repoName (小文字) から articleUrl をマッピングする辞書を作成
url_map = {}
for a in articles:
    if "repoName" in a and "articleUrl" in a:
        url_map[a["repoName"].lower()] = a["articleUrl"]

list_items = []
for repo, rank, is_new, new_url in repos:
    repo_lower = repo.lower()
    if is_new:
        # 新規追加
        # パスを相対パスに合わせる（レポート記事からは ../daily/YYYY-MM-DD-owner-repo.html になる。JSON内は ./articles/github/daily/... になっているので、置換するか直書きする）
        # レポートファイルの位置: articles/github/reports/YYYY-MM-DD-update-report.html
        # なので、daily 記事への相対パスは ../daily/YYYY-MM-DD-owner-repo.html。
        rel_url = new_url.replace("./articles/github/", "../")
        item = f'            <li>\n              <strong><a href="{rel_url}">{repo}</a></strong>\n              <span class="status-tag status-new">✨ 新規追加</span>\n            </li>'
    else:
        # 既存
        if repo_lower in url_map:
            url = url_map[repo_lower]
            # レポートからの相対パスに変換
            rel_url = url.replace("./articles/github/", "../")
            item = f'            <li>\n              <strong><a href="{rel_url}">{repo}</a></strong>\n              <span class="status-tag status-checked">✅ 記事作成済み</span>\n            </li>'
        else:
            item = f'            <li>\n              <strong>{repo}</strong>\n              <span class="status-tag status-skip">未作成</span>\n            </li>'
    list_items.append(item)

output_path = r"C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\scratch\ranking_list.txt"
with open(output_path, "w", encoding="utf-8") as out:
    out.write("\n".join(list_items))
print("Successfully wrote to scratch/ranking_list.txt")
