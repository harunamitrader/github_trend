import os
import glob
import re
import markdown

SHUHO_DIR = "AI-shuho"
HTML_FILE = "my-tools.html"
TEMPLATE_FILE = "templates/shuho.template.html"
OUTPUT_DIR = "articles/shuho"

def generate_shuho_html():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    files = sorted(glob.glob(os.path.join(SHUHO_DIR, "*.md")), reverse=True)
    
    with open(TEMPLATE_FILE, "r", encoding="utf-8") as f:
        template_content = f.read()
    
    list_items_html = []
    
    for file_path in files:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Extract title and date
        lines = content.split('\n')
        title_line = lines[0] if lines else ""
        
        # Default
        filename_base = os.path.basename(file_path).replace(".md", "")
        date_range = "作業記録"
        title_str = "作業記録"
        
        match = re.match(r"##\s+(.*)", title_line)
        if match:
            title_str = match.group(1).strip()
            # Try to extract something like W17（4/20〜4/26）
            date_match = re.search(r"(W\d+（.*?）)", title_str)
            if date_match:
                date_range = date_match.group(1)
        
        body_content = '\n'.join(lines[1:]).strip()
        # Convert [AI Name] to h4 headers
        body_content = re.sub(r"^\[(.*?)\]$", r"#### \1", body_content, flags=re.MULTILINE)
        
        html_body = markdown.markdown(body_content, extensions=['tables'])
        
        # Generate individual page
        individual_page_content = template_content.replace("{{TITLE}}", title_str)
        individual_page_content = individual_page_content.replace("{{DATE_RANGE}}", date_range)
        individual_page_content = individual_page_content.replace("{{BODY}}", html_body)
        
        output_path = os.path.join(OUTPUT_DIR, f"{filename_base}.html")
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(individual_page_content)
            
        # Create list item for my-tools.html
        relative_link = f"./articles/shuho/{filename_base}.html"
        item_html = f"""
            <a href="{relative_link}" class="shuho-link-card">
              <span class="shuho-date">{date_range}</span>
              <h3 class="shuho-title">{title_str}</h3>
            </a>"""
        list_items_html.append(item_html)
        
    all_items_html = "\n".join(list_items_html)
    
    # Read my-tools.html
    with open(HTML_FILE, "r", encoding="utf-8") as f:
        html_content = f.read()
        
    # Replace between markers
    start_marker = "<!-- SHUHO-START -->"
    end_marker = "<!-- SHUHO-END -->"
    
    pattern = re.compile(rf"({start_marker}).*?({end_marker})", re.DOTALL)
    
    if pattern.search(html_content):
        new_html = pattern.sub(rf"\1\n{all_items_html}\n              \2", html_content)
        # Also need to update styles in my-tools.html for the new link cards
        # (I'll do this in a separate step or just include it in the replace)
        with open(HTML_FILE, "w", encoding="utf-8") as f:
            f.write(new_html)
        print(f"Successfully generated {len(files)} individual shuho pages and updated {HTML_FILE}.")
    else:
        print(f"Error: Could not find markers in {HTML_FILE}.")

if __name__ == "__main__":
    generate_shuho_html()
