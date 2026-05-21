import urllib.request
import json
import ssl
import sys

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {"User-Agent": "Mozilla/5.0"}

def fetch_json(url):
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=5) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        return {"error": str(e)}

def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
        
    out_lines = []
    
    # OpenClaw Releases (check OpenClaw organization or user repos if known)
    # Let's search GitHub for openclaw/openclaw
    out_lines.append("--- OpenClaw Releases ---")
    openclaw_releases = fetch_json("https://api.github.com/repos/OpenClaw/OpenClaw/releases")
    if isinstance(openclaw_releases, list):
        for r in openclaw_releases[:3]:
            out_lines.append(f"Tag: {r.get('tag_name')}, Published: {r.get('published_at')}")
            out_lines.append(r.get("body")[:300] if r.get("body") else "")
            out_lines.append("-" * 10)
    else:
        out_lines.append(str(openclaw_releases))

    # Obsidian Releases
    out_lines.append("\n--- Obsidian Releases ---")
    obsidian_releases = fetch_json("https://api.github.com/repos/obsidianmd/obsidian-releases/releases")
    if isinstance(obsidian_releases, list):
        for r in obsidian_releases[:3]:
            out_lines.append(f"Tag: {r.get('tag_name')}, Published: {r.get('published_at')}")
            out_lines.append(r.get("body")[:300] if r.get("body") else "")
            out_lines.append("-" * 10)
    else:
        out_lines.append(str(obsidian_releases))

    with open("C:/Users/sgmxk/Desktop/AI/repos/github/harunamitrader/harunami_AI_base/scratch/others_releases.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(out_lines))
    print("Wrote output to others_releases.txt")

if __name__ == "__main__":
    main()
