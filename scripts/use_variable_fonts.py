import os
import glob
import re

TARGET_FILES = [
    "index.html",
    "github-trend.html",
    "ai-tools-monitor.html",
    "my-tools.html",
    "links.html",
    "templates/github-daily.template.html",
    "templates/shuho.template.html"
]

# Current static-like link query
OLD_FONT_QUERY = 'family=Manrope:wght@600;700;800&family=Noto+Sans+JP:wght@400;500;700;900'
# New Variable Font link query
NEW_FONT_QUERY = 'family=Manrope:wght@600..800&family=Noto+Sans+JP:wght@100..900'

def process_file(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content.replace(OLD_FONT_QUERY, NEW_FONT_QUERY)
    
    if content != new_content:
        with open(filepath, 'w', encoding='utf-8', newline='') as f:
            f.write(new_content)
        return True
    return False

# 1. Update main HTML files
for f in TARGET_FILES:
    process_file(f)

# 2. Update all daily articles
count = 0
for f in glob.glob("articles/github/daily/*.html"):
    if process_file(f):
        count += 1

print(f"Variable Font link updated. {count} articles updated.")
