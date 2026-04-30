import os
import glob
import re
import markdown

SHUHO_DIR = "AI-shuho"
HTML_FILE = "my-tools.html"

def generate_shuho_html():
    files = sorted(glob.glob(os.path.join(SHUHO_DIR, "*.md")), reverse=True)
    
    html_cards = []
    
    for file_path in files:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Extract title and date
        # Example title line: ## 2026年 W14（3/30〜4/5） 作業記録
        lines = content.split('\n')
        title_line = lines[0] if lines else ""
        
        # Default date/title if not found
        date_str = os.path.basename(file_path).replace(".md", "")
        title_str = "作業記録"
        
        match = re.match(r"##\s+(.*)", title_line)
        if match:
            title_str = match.group(1).strip()
            # Try to extract something like W14（3/30〜4/5） for the short date
            date_match = re.search(r"(W\d+（.*?）)", title_str)
            if date_match:
                date_str = date_match.group(1)
        
        # Remove the title line from content for processing the body
        body_content = '\n'.join(lines[1:]).strip()
        
        # Convert [AI Name] to h4 headers for better styling
        body_content = re.sub(r"^\[(.*?)\]$", r"#### \1", body_content, flags=re.MULTILINE)
        
        # Convert markdown to html, enabling tables
        html_body = markdown.markdown(body_content, extensions=['tables'])
        
        card_html = f"""
              <article class="shuho-card">
                <div class="shuho-date">{date_str}</div>
                <h3 class="shuho-title">{title_str}</h3>
                <div class="shuho-content">
{html_body}
                </div>
              </article>"""
        html_cards.append(card_html)
        
    all_cards_html = "\n".join(html_cards)
    
    # Read my-tools.html
    with open(HTML_FILE, "r", encoding="utf-8") as f:
        html_content = f.read()
        
    # Replace between markers
    start_marker = "<!-- SHUHO-START -->"
    end_marker = "<!-- SHUHO-END -->"
    
    pattern = re.compile(rf"({start_marker}).*?({end_marker})", re.DOTALL)
    
    if pattern.search(html_content):
        new_html = pattern.sub(rf"\1\n{all_cards_html}\n              \2", html_content)
        with open(HTML_FILE, "w", encoding="utf-8") as f:
            f.write(new_html)
        print(f"Successfully updated {HTML_FILE} with {len(files)} shuho entries.")
    else:
        print(f"Error: Could not find markers {start_marker} and {end_marker} in {HTML_FILE}.")

if __name__ == "__main__":
    generate_shuho_html()
