import urllib.request
import json

repos = [
    "NanmiCoder/MediaCrawler",
    "opendatalab/MinerU",
    "ripienaar/free-for-dev",
    "commaai/openpilot",
    "simplex-chat/simplex-chat"
]

for repo in repos:
    url = f"https://api.github.com/repos/{repo}"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0"}
    )
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            print(f"{repo}: {data['stargazers_count']}")
    except Exception as e:
        print(f"Failed for {repo}: {e}")
