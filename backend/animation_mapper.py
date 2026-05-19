import re
import json
import os

# Path to the persistent dictionary
DICTIONARY_PATH = os.path.join(os.path.dirname(__file__), "word_dictionary.json")

def load_dictionary():
    if not os.path.exists(DICTIONARY_PATH):
        return {}
    try:
        with open(DICTIONARY_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return {}

def save_dictionary(dictionary):
    with open(DICTIONARY_PATH, "w", encoding="utf-8") as f:
        json.dump(dictionary, f, ensure_ascii=False, indent=4)

def normalize_text(text):
    text = re.sub(r'[ًٌٍَُِّْـ]', '', text)
    text = re.sub('[إأآا]', 'ا', text)
    text = re.sub('[يى]', 'ي', text)
    text = re.sub('[ة]', 'ه', text)
    return text

def light_stem(word):
    """Simple light stemmer for Arabic to remove common prefixes and suffixes."""
    # Special case for Egyptian future prefix 'ه' which is very common in user's example
    if word.startswith('ه') and len(word) > 3:
        word = word[1:]
    
    # Common prefixes
    prefixes = ['وال', 'بال', 'كال', 'فال', 'لل', 'ال', 'و', 'ف', 'ب']
    for p in prefixes:
        if word.startswith(p) and len(word) > len(p) + 1:
            word = word[len(p):]
            break
            
    # Common suffixes
    suffixes = ['هما', 'هم', 'هن', 'كم', 'كن', 'نا', 'ها', 'ان', 'ون', 'ين', 'ات', 'ية', 'يه', 'ة', 'ه', 'ي', 'ك']
    for s in suffixes:
        if word.endswith(s) and len(word) > len(s) + 1:
            word = word[:-len(s)]
            break
            
    return word

def get_animation_sequence(text: str) -> list:
    dictionary = load_dictionary()
    normalized = normalize_text(text)
    words = normalized.split()
    sequence = []
    
    for word in words:
        # 1. Exact match (normalized)
        if word in dictionary:
            sequence.append({"type": "word", "value": dictionary[word], "label": word})
        else:
            # 2. Try light stemming
            stemmed = light_stem(word)
            if stemmed in dictionary:
                sequence.append({"type": "word", "value": dictionary[stemmed], "label": word})
            else:
                # 3. Fallback: Fingerspelling
                for char in word:
                    sequence.append({"type": "char", "value": char, "label": char})
            
        # 4. Small pause between words
        sequence.append({"type": "word", "value": "idle"})
        
    return sequence

