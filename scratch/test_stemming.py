import sys
import os

# Add backend directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from animation_mapper import get_animation_sequence

def test_stemming():
    test_cases = ["همشي", "البيت", "مدرستنا", "السلام"]
    for text in test_cases:
        sequence = get_animation_sequence(text)
        print(f"Input: {text}")
        for item in sequence:
            if item.get('type') == 'word' and item.get('value') != 'idle':
                 print(f"  Matched: {item['label']} -> Animation: {item['value']}")
            elif item.get('type') == 'char':
                 print(f"  Spelled: {item['value']}")
        print("-" * 20)

if __name__ == "__main__":
    test_stemming()
