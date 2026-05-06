import sys

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

try:
    with open(file_path, 'rb') as f:
        content = f.read()
    
    # Remove BOM
    if content.startswith(b'\xef\xbb\xbf'):
        content = content[3:]
    
    text = content.decode('utf-8', errors='replace')
    
    # Fix the broken line 4
    lines = text.splitlines()
    if len(lines) >= 4 and '"description":' in lines[3]:
        # Try to restore the line. It seems it's missing the closing quote.
        line = lines[3].rstrip()
        if not line.endswith('"') and not line.endswith('",'):
            if line.endswith(','):
                lines[3] = line[:-1] + '",'
            else:
                lines[3] = line + '",'
        print(f"Fixed line 4: {lines[3]}")
    
    # Join back
    text = '\n'.join(lines)
    
    # Now try to parse
    import json
    data = json.loads(text, strict=False)
    
    # Remove corrupted last entry if needed
    if 'articles' in data and len(data['articles']) > 0 and isinstance(data['articles'][-1], str):
        data['articles'].pop()
    
    # Add new entry (I'll define it here again)
    new_entry = {
        "category": "github-pickup",
        "slug": "2026-05-06-browserbase-stagehand",
        "title": "stagehand",
        "dek": "自然言語とコードを組み合わせてブラウザを自律操作する、Browser Agentのための次世代SDK",
        "summary": "自然言語でのブラウザ操作とコードによる精密な制御を統合したSDK「Stagehand」を調査。自己修復機能やキャッシング、構造化データの抽出機能を備え、AIエージェントのブラウザ操作を劇的に簡略化する。",
        "publishedAt": "2026-05-06",
        "repoName": "browserbase/stagehand",
        "repoUrl": "https://github.com/browserbase/stagehand",
        "starCount": 22493,
        "articleUrl": "./articles/github/daily/2026-05-06-browserbase-stagehand.html",
        "rank": 999,
        "createdAt": "2026-05-06T19:48:00+09:00",
        "serial": 446,
        "originType": "pickup",
        "genre": "AIエージェント (自律基盤・特化アプリ)"
    }
    data['articles'].append(new_entry)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Successfully fixed and updated articles.json")

except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
