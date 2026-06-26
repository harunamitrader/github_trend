import json
import os

articles_path = r"C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json"

repos = [
    "simplex-chat/simplex-chat",
    "google-labs-code/design.md",
    "commaai/openpilot",
    "kunchenguid/no-mistakes",
    "grafana/grafana",
    "ripienaar/free-for-dev",
    "opendatalab/MinerU",
    "alchaincyf/zhangxuefeng-skill",
    "mauriceboe/TREK",
    "xbtlin/ai-berkshire",
    "calesthio/OpenMontage",
    "aws/agent-toolkit-for-aws",
    "NanmiCoder/MediaCrawler",
    "garrytan/gstack",
    "IceWhaleTech/CasaOS",
    "JCodesMore/ai-website-cloner-template",
    "Panniantong/Agent-Reach"
]

if not os.path.exists(articles_path):
    print("articles.json not found")
    exit(1)

with open(articles_path, "r", encoding="utf-8") as f:
    articles_data = json.load(f)

# articles 配下の repoName や repoUrl を調べる
existing_repos = set()
for article in articles_data.get("articles", []):
    if "repoName" in article:
        existing_repos.add(article["repoName"].lower())
    if "repoUrl" in article:
        # url から owner/repo を抽出
        url = article["repoUrl"].lower()
        if "github.com/" in url:
            parts = url.split("github.com/")[1].split("?")[0].strip("/").split("/")
            if len(parts) >= 2:
                existing_repos.add(f"{parts[0]}/{parts[1]}".lower())

print("Duplicate Check:")
for idx, repo in enumerate(repos, 1):
    is_dup = repo.lower() in existing_repos
    status = "Duplicate" if is_dup else "New"
    print(f"{idx}: {repo} -> {status}")
