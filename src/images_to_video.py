import cv2
import os

IMAGES_ROOT = "data/arabic_signs"
OUTPUT_DIR = "sign_videos"

os.makedirs(OUTPUT_DIR, exist_ok=True)

FPS = 10

for letter in os.listdir(IMAGES_ROOT):
    letter_dir = os.path.join(IMAGES_ROOT, letter)
    if not os.path.isdir(letter_dir):
        continue

    images = sorted(os.listdir(letter_dir))
    if not images:
        continue

    first_img = cv2.imread(os.path.join(letter_dir, images[0]))
    h, w, _ = first_img.shape

    out_path = os.path.join(OUTPUT_DIR, f"{letter}.mp4")
    out = cv2.VideoWriter(
        out_path,
        cv2.VideoWriter_fourcc(*"mp4v"),
        FPS,
        (w, h)
    )

    for img_name in images:
        img_path = os.path.join(letter_dir, img_name)
        img = cv2.imread(img_path)
        if img is not None:
            out.write(img)

    out.release()
    print(f"✅ Created video: {out_path}")
