import os

data_dir = r"d:\Grad\GraduationProject\data"
splits = ["train", "test", "val"]

summary = {}

for split in splits:
    split_path = os.path.join(data_dir, split)
    if not os.path.exists(split_path):
        summary[split] = "Not found"
        continue
    
    split_data = {}
    total_images = 0
    classes = os.listdir(split_path)
    for cls in classes:
        cls_path = os.path.join(split_path, cls)
        if os.path.isdir(cls_path):
            count = len([f for f in os.listdir(cls_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))])
            split_data[cls] = count
            total_images += count
    
    summary[split] = {
        "total_classes": len(split_data),
        "total_images": total_images,
        "class_counts": split_data
    }

print("Dataset Snapshot:")
for split, data in summary.items():
    print(f"\n--- {split.upper()} ---")
    if isinstance(data, str):
        print(data)
    else:
        print(f"Total Classes: {data['total_classes']}")
        print(f"Total Images: {data['total_images']}")
        print("Class Counts:")
        for cls, count in data['class_counts'].items():
            print(f"  {cls}: {count}")
