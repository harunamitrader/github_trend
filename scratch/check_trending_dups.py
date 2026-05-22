import json

path = r"C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json"
with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

existing_repo_names = set()
existing_repo_urls = set()
for art in data["articles"]:
    rn = art.get("repoName")
    if rn:
        existing_repo_names.add(rn.lower())
    ru = art.get("repoUrl")
    if ru:
        existing_repo_urls.add(ru.lower())

trending_repos = [
    "tinyhumansai/openhuman",
    "Imbad0202/academic-research-skills",
    "HKUDS/CLI-Anything",
    "K-Dense-AI/scientific-agent-skills",
    "supertone-inc/supertonic",
    "ggml-org/llama.cpp",
    "ruvnet/RuView",
    "CloakHQ/CloakBrowser",
    "tech-leads-club/agent-skills",
    "BigBodyCobain/Shadowbroker",
    "humanlayer/12-factor-agents",
    "NVlabs/Sana",
    "microsoft/ai-agents-for-beginners",
    "ZhuLinsen/daily_stock_analysis",
    "plausible/analytics"
]

print("Duplicate check results:")
for rank, repo in enumerate(trending_repos, 1):
    repo_url = f"https://github.com/{repo}".lower()
    status = "EXISTING" if repo.lower() in existing_repo_names or repo_url in existing_repo_urls else "NEW"
    print(f"Rank {rank}: {repo} -> {status}")
