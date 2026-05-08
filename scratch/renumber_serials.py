import json
import os
import re

DATA_FILE = 'data/articles.json'

def main():
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Extract target articles
    target_articles = []
    for article in data['articles']:
        if article.get('category') in ['github-pickup', 'github-trending']:
            target_articles.append(article)
            
    # Sort by current serial
    target_articles.sort(key=lambda x: int(x.get('serial', 0)))
    
    updates_count = 0
    for i, article in enumerate(target_articles):
        new_serial = i + 1
        old_serial = int(article.get('serial', 0))
        
        if old_serial != new_serial:
            # Update the JSON entry
            article['serial'] = new_serial
            updates_count += 1
            
            # Update the HTML file
            file_url = article.get('articleUrl', '')
            if file_url.startswith('./'):
                file_url = file_url[2:]
            
            file_path = os.path.join(os.getcwd(), file_url)
            if os.path.exists(file_path):
                with open(file_path, 'r', encoding='utf-8') as html_file:
                    content = html_file.read()
                
                # Replace the serial in the HTML footer
                # Pattern: Shared GitHub Serial: #<number>
                new_content = re.sub(
                    r'Shared GitHub Serial: #\d+', 
                    f'Shared GitHub Serial: #{new_serial}', 
                    content
                )
                
                with open(file_path, 'w', encoding='utf-8') as html_file:
                    html_file.write(new_content)
            else:
                print(f"File not found: {file_path}")

    # Save the updated JSON
    if updates_count > 0:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write('\n')
        print(f"Updated {updates_count} articles to new serials.")
    else:
        print("No serials needed updating.")

if __name__ == '__main__':
    main()
