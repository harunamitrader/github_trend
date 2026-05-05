import re

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\ai-tools-monitor.html'
with open(file_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Fix the corrupted tags like P26-05-06"> before <summary>
# It seems I replaced the opening <details ...> tag with just P26-05-06"> in some cases.
# I need to restore the proper <details> tag.

# The corrupted lines look like:
# P26-05-06">
#               <summary class="tool-card-summary">

# I'll use a regex to find these and restore the correct tag based on the next summary.

def restore_tags(html):
    # Map of tool names to their IDs and categories
    tools = [
        ("Claude Code", "tool-claude-code", "coding"),
        ("Cursor", "tool-cursor", "coding"),
        ("Windsurf", "tool-windsurf", "coding"),
        ("Cline", "tool-cline", "coding"),
        ("Gemini CLI", "tool-geminicli", "coding"),
        ("NotebookLM", "tool-notebooklm", "others"),
        ("ChatGPT", "tool-chatgpt", "others"),
        ("Claude", "tool-claude", "others"),
        ("Gemini", "tool-gemini", "others"),
        ("Obsidian", "tool-obsidian", "others"),
    ]
    
    for name, tool_id, cat in tools:
        # Pattern: P26-05-06"> followed by whitespaces and <summary ...> <span class="tool-name">NAME</span>
        pattern = rf'P26-05-06">\s+<summary class="tool-card-summary">\s+<span class="tool-name">{name}</span>'
        replacement = f'<details id="{tool_id}" data-category="{cat}" class="tool-card card-{tool_id.replace("tool-","")}" data-latest="2026-05-06">\n              <summary class="tool-card-summary">\n                <span class="tool-name">{name}</span>'
        
        # Special case for card class mapping if needed
        # Actually most are card-{tool_id_suffix}
        
        html = re.sub(pattern, replacement, html)
        
    return html

html = restore_tags(html)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Fixed corrupted tags in ai-tools-monitor.html.")
