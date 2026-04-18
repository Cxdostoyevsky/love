import json
import re

with open('book/白痴（陀思妥耶夫斯基文集2015）.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract quotes marked with > 📌
quotes = []

# Let's find all blocks starting with > 📌
# Some are single line, some might be multiple lines.
lines = content.split('\n')
current_quote = []
current_context = "摘录"

for i, line in enumerate(lines):
    if line.startswith('> 📌'):
        if current_quote:
            quotes.append({
                "text": '\n'.join(current_quote).strip(),
                "context": "经典摘录"
            })
            current_quote = []
        
        text = line.replace('> 📌', '').strip()
        if text:
            current_quote.append(text)
    elif line.startswith('> [!note] 💭 我的想法'):
        if current_quote:
            quotes.append({
                "text": '\n'.join(current_quote).strip(),
                "context": "经典摘录"
            })
            current_quote = []
        
        # Next lines starting with > are the thought
        thought_lines = []
        j = i + 1
        while j < len(lines) and lines[j].startswith('>'):
            thought_lines.append(lines[j].replace('>', '', 1).strip())
            j += 1
        
        if thought_lines:
            quotes.append({
                "text": '\n'.join(thought_lines).strip(),
                "context": "我的想法"
            })
    elif line.startswith('> ') and not line.startswith('> 📌') and not line.startswith('> [!note]') and not line.startswith('> -') and not line.startswith('> ⏱'):
        if current_quote:
            current_quote.append(line.replace('> ', '', 1).strip())
    elif not line.startswith('>') and line.strip() != '' and not line.startswith('#') and not line.startswith('-') and not line.startswith('doc_type') and not line.startswith('bookId') and not line.startswith('reviewCount') and not line.startswith('noteCount') and not line.startswith('author') and not line.startswith('cover') and not line.startswith('progress') and not line.startswith('readingTime') and not line.startswith('readingDate') and not line.startswith('finishedDate') and not line.startswith('isbn') and not line.startswith('lastReadDate') and not line.startswith('---'):
        # This might be a plain text quote
        if current_quote:
            quotes.append({
                "text": '\n'.join(current_quote).strip(),
                "context": "经典摘录"
            })
            current_quote = []
        
        # Check if it's not a header or metadata
        if len(line.strip()) > 10:
            quotes.append({
                "text": line.strip(),
                "context": "经典摘录"
            })

if current_quote:
    quotes.append({
        "text": '\n'.join(current_quote).strip(),
        "context": "经典摘录"
    })

# Filter out empty quotes and duplicates
unique_quotes = []
seen = set()
for q in quotes:
    text = q['text']
    if text and text not in seen:
        seen.add(text)
        unique_quotes.append(q)

with open('src/data/notes.json', 'r', encoding='utf-8') as f:
    notes_data = json.load(f)

# Find the 白痴 entry
idiot_entry = next((item for item in notes_data if item["book"] == "白痴"), None)

if idiot_entry:
    # We will merge the existing thoughts with the newly extracted ones
    # Actually, the newly extracted ones include the thoughts (with context "我的想法")
    # Let's just replace the quotes array with the new one, but keep the specific contexts if they existed
    existing_thoughts = {q['text']: q['context'] for q in idiot_entry['quotes']}
    
    for q in unique_quotes:
        # If this text matches an existing thought, use its specific context
        for ext_text, ext_ctx in existing_thoughts.items():
            if ext_text in q['text'] or q['text'] in ext_text:
                q['context'] = ext_ctx
                break
                
    idiot_entry["quotes"] = unique_quotes
else:
    notes_data.append({
        "book": "白痴",
        "quotes": unique_quotes
    })

with open('src/data/notes.json', 'w', encoding='utf-8') as f:
    json.dump(notes_data, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(unique_quotes)} quotes/thoughts.")
