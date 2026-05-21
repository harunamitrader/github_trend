import json

repos = [
    "tinyhumansai/openhuman",
    "HKUDS/CLI-Anything",
    "Imbad0202/academic-research-skills",
    "obra/superpowers",
    "anthropics/claude-plugins-official",
    "rohitg00/agentmemory",
    "CloakHQ/CloakBrowser",
    "rtk-ai/rtk",
    "msitarzewski/agency-agents",
    "colbymchenry/codegraph",
    "multica-ai/andrej-karpathy-skills",
    "humanlayer/12-factor-agents",
    "Diolinux/PhotoGIMP",
    "Alishahryar1/free-claude-code",
    "pascalorg/editor",
    "frappe/erpnext",
    "microsoft/ai-agents-for-beginners",
    "HKUDS/ViMax"
]

with open("C:/Users/sgmxk/Desktop/AI/repos/github/harunamitrader/harunami_AI_base/data/articles.json", "r", encoding="utf-8") as f:
    data = json.load(f)

repo_map = {}
for a in data.get("articles", []):
    name = a.get("repoName")
    if name:
        repo_map[name.lower()] = a.get("articleUrl")

print("RESULTS:")
for r in repos:
    url = repo_map.get(r.lower())
    print(f"{r} -> {url}")
