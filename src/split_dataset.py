import os
import shutil
import random

# ========= PATHS =========
SOURCE_DIR = r"data/arabic_signs"   # الداتا الأصلية (folders الحروف)
TARGET_DIR = r"data"                # هنطلع فيها train / val / test

# ========= RATIOS =========
TRAIN_RATIO = 0.7
VAL_RATIO = 0.15
TEST_RATIO = 0.15

random.seed(42)

# ========= CREATE SPLIT FOLDERS =========
for split in ["train", "val", "test"]:
    os.makedirs(os.path.join(TARGET_DIR, split), exist_ok=True)

# ========= SPLIT DATA =========
for class_name in os.listdir(SOURCE_DIR):
    class_path = os.path.join(SOURCE_DIR, class_name)

    if not os.path.isdir(class_path):
        continue

    images = [
        img for img in os.listdir(class_path)
        if img.lower().endswith((".jpg", ".png", ".jpeg"))
    ]

    if len(images) == 0:
        print(f"⚠️ No images found in {class_name}")
        continue

    random.shuffle(images)

    total = len(images)
    train_end = int(total * TRAIN_RATIO)
    val_end = train_end + int(total * VAL_RATIO)

    splits = {
        "train": images[:train_end],
        "val": images[train_end:val_end],
        "test": images[val_end:]
    }

    for split, split_images in splits.items():
        split_class_dir = os.path.join(TARGET_DIR, split, class_name)
        os.makedirs(split_class_dir, exist_ok=True)

        for img in split_images:
            src = os.path.join(class_path, img)
            dst = os.path.join(split_class_dir, img)
            shutil.copy2(src, dst)

    print(f"✅ {class_name}: {len(images)} images split successfully")

print("\n🎉 Dataset splitting completed successfully!")
