import os

filepath = 'articles/github/reports/2026-05-22-update-report.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix all remaining broken links: ../../articles/ -> ../../../articles/
# First, replace any that might have been partially fixed or missed.
# Let's just do a clean pass:
# We want all of them to be ../../../articles/
# So we replace ../../articles/ with ../../../articles/
# But we must be careful not to turn ../../../ into ../../../../
content = content.replace('href="../../articles/', 'href="../../../articles/')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print('All links fixed successfully.')
