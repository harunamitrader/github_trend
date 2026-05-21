import urllib.request
import json
import os
import sys

repos = [
    "frappe/erpnext",
    "multica-ai/andrej-karpathy-skills",
    "anthropics/claude-plugins-official"
]

token = os.environ.get("GITHUB_TOKEN")
headers = {
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "Antigravity-Agent"
}
if token:
    headers["Authorization"] = f"token {token}"

for repo in repos:
    print(f"Fetching metadata for {repo}...")
    # Repo Metadata
    url = f"https://api.github.com/repos/{repo}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            # Save metadata
            slug = repo.replace("/", "_")
            with open(f"C:/Users/sgmxk/Desktop/AI/repos/github/harunamitrader/harunami_AI_base/scratch/{slug}_meta.json", "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"  Stars: {data.get('stargazers_count')}")
    except Exception as e:
        print(f"  Error fetching metadata: {e}")

    # README
    url_readme = f"https://api.github.com/repos/{repo}/readme"
    req_readme = urllib.request.Request(url_readme, headers=headers)
    try:
        with urllib.request.urlopen(req_readme) as response:
            data_readme = json.loads(response.read().decode())
            content_b64 = data_readme.get("content", "")
            import base64
            readme_text = base64.b64decode(content_b64).decode("utf-8", errors="ignore")
            slug = repo.replace("/", "_")
            with open(f"C:/Users/sgmxk/Desktop/AI/repos/github/harunamitrader/harunami_AI_base/scratch/{slug}_readme.md", "w", encoding="utf-8") as f:
                f.write(readme_text)
            print(f"  Readme saved.")
    except Exception as e:
        print(f"  Error fetching readme: {e}")
