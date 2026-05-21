import urllib.request
import json
import ssl

def fetch_npm(package_name):
    url = f"https://registry.npmjs.org/{package_name}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=5) as response:
            res = json.loads(response.read().decode('utf-8'))
            latest = res.get("dist-tags", {}).get("latest")
            # Get latest versions including next/preview/nightly if relevant
            all_tags = res.get("dist-tags", {})
            time_info = res.get("time", {})
            return {"latest": latest, "tags": all_tags, "time": time_info}
    except Exception as e:
        return {"error": str(e)}

def fetch_github(repo):
    url = f"https://api.github.com/repos/{repo}/releases"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=5) as response:
            res = json.loads(response.read().decode('utf-8'))
            if isinstance(res, list) and len(res) > 0:
                # Return top 3 releases
                releases = []
                for r in res[:5]:
                    releases.append({
                        "tag_name": r.get("tag_name"),
                        "name": r.get("name"),
                        "published_at": r.get("published_at"),
                        "body": r.get("body")[:300] if r.get("body") else ""
                    })
                return releases
            return []
    except Exception as e:
        return {"error": str(e)}

def main():
    print("--- Claude Code (NPM) ---")
    cc = fetch_npm("@anthropic-ai/claude-code")
    print(f"Latest: {cc.get('latest')}")
    print(f"Tags: {cc.get('tags')}")
    if 'time' in cc and cc.get('latest') in cc['time']:
        print(f"Published At: {cc['time'][cc.get('latest')]}")

    print("\n--- Antigravity IDE (GitHub: Dokhacgiakhoa/antigravity-ide) ---")
    ag = fetch_github("Dokhacgiakhoa/antigravity-ide")
    if isinstance(ag, list):
        for r in ag[:3]:
            print(f"Tag: {r.get('tag_name')}, Published: {r.get('published_at')}")
    else:
        print(ag)
    
    print("\n--- Cline (GitHub: cline/cline) ---")
    cl = fetch_github("cline/cline")
    if isinstance(cl, list):
        for r in cl[:3]:
            print(f"Tag: {r.get('tag_name')}, Published: {r.get('published_at')}")
    else:
        print(cl)
    
    print("\n--- Gemini CLI (GitHub: google-gemini/gemini-cli) ---")
    gc = fetch_github("google-gemini/gemini-cli")
    if isinstance(gc, list):
        for r in gc[:3]:
            print(f"Tag: {r.get('tag_name')}, Published: {r.get('published_at')}")
    else:
        print(gc)
    
    print("\n--- Codex (NPM oh-my-codex) ---")
    cx = fetch_npm("oh-my-codex")
    print(f"Latest: {cx.get('latest')}")
    if 'time' in cx and cx.get('latest') in cx['time']:
        print(f"Published At: {cx['time'][cx.get('latest')]}")

if __name__ == "__main__":
    main()
