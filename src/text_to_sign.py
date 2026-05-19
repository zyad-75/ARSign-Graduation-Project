import cv2
import os
import re
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SIGN_IMAGE_DIR = os.path.join(BASE_DIR, "data", "arabic_signs")
WORD_SIGN_VIDEO_DIR = os.path.join(BASE_DIR, "sign_videos")
OUTPUT_VIDEO = os.path.join(BASE_DIR, "output_sign_video.webm")

FPS = 25
LETTER_DURATION = 1.0   # ثانية لكل حرف
PAUSE_DURATION = 0.4    # ثانية سكون بين الحروف
WORD_PAUSE_DURATION = 0.6 # ثانية سكون بين الكلمات

ARABIC_TO_SIGN = {
    "ا": "Alef", "ب": "Beh", "ت": "Teh", "ث": "Theh",
    "ج": "Jeem", "ح": "Hah", "خ": "Khah",
    "د": "Dal", "ذ": "thal", "ر": "Reh", "ز": "Zain",
    "س": "Seen", "ش": "Sheen", "ص": "Sad", "ض": "Dad",
    "ط": "Tah", "ظ": "Zah", "ع": "Ain", "غ": "Ghain",
    "ف": "Feh", "ق": "Qaf", "ك": "Kaf",
    "ل": "Lam", "م": "Meem", "ن": "Noon",
    "ه": "Heh", "و": "Waw", "ي": "Yeh"
}

def normalize(text):
    text = re.sub(r'[ًٌٍَُِّْـ]', '', text)
    text = re.sub('[إأآا]', 'ا', text)
    text = re.sub('[يى]', 'ي', text)
    text = re.sub('[ة]', 'ه', text)
    return text

def get_word_video_path(word):
    # Mapping some common words to specific files if they differ from the word itself
    # Check if a video exists for the word
    video_path = os.path.join(WORD_SIGN_VIDEO_DIR, f"{word}.mp4")
    if os.path.exists(video_path):
        return video_path
    
    # Check if it matches a sign in ARABIC_TO_SIGN (some signs are stored as mp4s in sign_videos)
    # but the user wants word-based logic primarily.
    return None

def text_to_sign(text, output_path=None):
    if output_path is None:
        output_path = OUTPUT_VIDEO

    normalized_text = normalize(text)
    words = normalized_text.split()

    frames = []
    target_size = (640, 480) # Default size if no video or image is loaded yet
    blank = None

    for i, word in enumerate(words):
        video_path = get_word_video_path(word)
        
        if video_path:
            # Word-based logic: Load video
            cap = cv2.VideoCapture(video_path)
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                # Resize to maintain consistency if needed
                if target_size:
                    frame = cv2.resize(frame, target_size)
                frames.append(frame)
                if blank is None:
                    target_size = (frame.shape[1], frame.shape[0])
                    blank = np.zeros((target_size[1], target_size[0], 3), dtype=np.uint8)
            cap.release()
        else:
            # Fallback: Fingerspelling for the word
            for ch in word:
                if ch not in ARABIC_TO_SIGN:
                    continue
                
                letter = ARABIC_TO_SIGN[ch]
                folder = os.path.join(SIGN_IMAGE_DIR, letter)
                
                if not os.path.exists(folder):
                    continue

                imgs = sorted(os.listdir(folder))
                if not imgs:
                    continue
                    
                img = cv2.imread(os.path.join(folder, imgs[0]))
                if img is None:
                    continue

                if blank is None:
                    h, w, _ = img.shape
                    target_size = (w, h)
                    blank = np.zeros((h, w, 3), dtype=np.uint8)
                
                img = cv2.resize(img, target_size)
                
                repeat = int(FPS * LETTER_DURATION)
                for _ in range(repeat):
                    frames.append(img)

                pause = int(FPS * PAUSE_DURATION)
                for _ in range(pause):
                    frames.append(blank)

        # Pause between words
        if i < len(words) - 1 and blank is not None:
            word_pause = int(FPS * WORD_PAUSE_DURATION)
            for _ in range(word_pause):
                frames.append(blank)

    if not frames:
        print("⚠️ No frames generated.")
        return

    h, w, _ = frames[0].shape
    
    # Use VP8/WebM for browser compatibility
    fourcc = cv2.VideoWriter_fourcc(*'VP80')
    if output_path.endswith('.mp4'):
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')

    out = cv2.VideoWriter(output_path, fourcc, FPS, (w, h))

    for f in frames:
        out.write(f)

    out.release()
    print(f"✅ Sign video created at {output_path}")

if __name__ == "__main__":
    test_text = input("✍️ Enter Arabic text: ")
    text_to_sign(test_text)
