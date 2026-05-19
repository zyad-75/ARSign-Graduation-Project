import os
import random
import shutil

data_dir = r"d:\Grad\GraduationProject\data\train"
artifact_dir = r"C:\Users\User\.gemini\antigravity\brain\98b3ba96-fdfe-4fe9-813f-4a23bb69e21e"

if not os.path.exists(artifact_dir):
    os.makedirs(artifact_dir)

# Pick 3 random classes
classes = [d for d in os.listdir(data_dir) if os.path.isdir(os.path.join(data_dir, d))]
sample_classes = random.sample(classes, min(3, len(classes)))

for cls in sample_classes:
    cls_path = os.path.join(data_dir, cls)
    images = [f for f in os.listdir(cls_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    if images:
        img = random.choice(images)
        src = os.path.join(cls_path, img)
        dst = os.path.join(artifact_dir, f"sample_{cls}_{img}")
        shutil.copy(src, dst)
        print(f"Copied sample for {cls} to {dst}")
