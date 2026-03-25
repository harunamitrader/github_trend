import requests
import json
from datetime import datetime

repos = [
    ("cline", "cline/cline"),
    ("gemini-cli", "google/gemini-cli"),
    ("claude-code", "anthropic-ai/claude-code"),
    ("openclaw", "benny-macho/openclaw"),
    ("grok-cli", "x-ai/grok-cli"),
]

results = {}
for name, repo in repos:
    try:
        url = f"https://api.github.com/repos/{repo}/releases/latest"
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            data = r.json()
            results[name] = {"version": data.get("tag_name"), "date": data.get("published_at")[:10]}
        else:
            results[name] = {"version": "Unknown", "date": "Unknown"}
    except:
        results[name] = {"version": "Error", "date": "Error"}

print(json.dumps(results, indent=2))
