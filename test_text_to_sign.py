import os
import sys

# Add the project root to sys.path
sys.path.append(r'd:\Grad\GraduationProject')

from src.text_to_sign import text_to_sign

def test_logic():
    # Test 1: Known letters (fingerspelling fallback)
    print("Testing fingerspelling fallback...")
    text_to_sign("أب", "outputs/test_fallback.webm")
    
    # Test 2: Potential word (if any exist in sign_videos, though we saw Dal.mp4 etc.)
    # In my logic, Dal.mp4 in sign_videos would be picked up if I search for 'Dal'
    # But get_word_video_path looks for f"{word}.mp4"
    # Let's try 'Dal' (if normalized)
    print("Testing word video lookup (if file exists)...")
    text_to_sign("دال", "outputs/test_word.webm")
    
    print("Check outputs/ directory for results.")

if __name__ == "__main__":
    if not os.path.exists("outputs"):
        os.makedirs("outputs")
    test_logic()
