from backend.animation_mapper import get_animation_sequence
import json
import os

DICTIONARY_PATH = "backend/word_dictionary.json"

test_cases = [
    "السلام",
    "كلمة_جديدة_جدا"  # This word should trigger auto-store
]

print("--- Testing Animation Sequence & Auto-Store ---")

for text in test_cases:
    print(f"\nProcessing Text: {text}")
    sequence = get_animation_sequence(text)
    for item in sequence:
        print(f"  - {item}")

# Verify if the new word was added to the JSON
if os.path.exists(DICTIONARY_PATH):
    with open(DICTIONARY_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
        if "كلمه_جديده_جدا" in data or "كلمة_جديدة_جدا" in data:
            print(f"\n✅ Success: New word stored in dictionary!")
        else:
            print(f"\n❌ Failure: New word not found in dictionary.")
else:
    print(f"\n❌ Failure: Dictionary file not found.")

