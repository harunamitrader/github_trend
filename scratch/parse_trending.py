import re
import os

content_path = r"C:\Users\sgmxk\.gemini\antigravity-cli\brain\89394da7-e41c-48b8-84f5-d08d22768cac\.system_generated\steps\776\content.md"

if not os.path.exists(content_path):
    print("File not found")
    exit(1)

with open(content_path, "r", encoding="utf-8") as f:
    html = f.read()

# h2 class="h3 lh-condensed" の中にある a タグの href を抽出
pattern = re.compile(r'<h2 class="h3 lh-condensed">.*?href="/([^/"]+/[^/"]+)"', re.DOTALL)
matches = pattern.findall(html)

print(f"Found {len(matches)} matches:")
for idx, match in enumerate(matches, 1):
    # 余分なクエリパラメータなどを除く
    match_clean = match.split("?")[0].strip()
    print(f"{idx}: {match_clean}")
