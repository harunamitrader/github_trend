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

# The target part of the URL in the <link> tag
OLD_FONT_QUERY = 'family=IBM+Plex+Sans+JP:wght@400;500;600;700&family=Manrope:wght@600;700;800'
NEW_FONT_QUERY = 'family=Manrope:wght@600;700;800&family=Noto+Sans+JP:wght@400;500;700;900'

def process_file(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Update Font Link
    new_content = content.replace(OLD_FONT_QUERY, NEW_FONT_QUERY)
    
    # 2. Update styles.css specific part if it's styles.css
    if filepath == "styles.css":
        new_content = new_content.replace(
            'font-family: "IBM Plex Sans JP", "Inter", system-ui, sans-serif;',
            'font-family: "Noto Sans JP", sans-serif;\n  font-weight: 500;'
        )
    
    if content != new_content:
        with open(filepath, 'w', encoding='utf-8', newline='') as f:
            f.write(new_content)
        return True
    return False

# 1. Process styles.css
process_file("styles.css")

# 2. Process main HTML files
for f in TARGET_FILES:
    process_file(f)

# 3. Process all daily articles
count = 0
for f in glob.glob("articles/github/daily/*.html"):
    if process_file(f):
        count += 1

print(f"Font replacement completed. {count} articles updated.")
