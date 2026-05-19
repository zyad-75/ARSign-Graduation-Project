import os
import cv2
import mediapipe as mp
import numpy as np

DATA_DIR = "data/train"          # الصور
SAVE_DIR = "landmark_dataset"    # الناتج

os.makedirs(SAVE_DIR, exist_ok=True)

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=1,
    min_detection_confidence=0.6
)

def extract_features(hand_landmarks):
    features = []
    ref_x = hand_landmarks.landmark[0].x
    ref_y = hand_landmarks.landmark[0].y

    for lm in hand_landmarks.landmark:
        features.append(lm.x - ref_x)
        features.append(lm.y - ref_y)

    return features

X = []
y = []

for label in os.listdir(DATA_DIR):
    class_dir = os.path.join(DATA_DIR, label)
    if not os.path.isdir(class_dir):
        continue

    print(f"📂 Processing class: {label}")

    for img_name in os.listdir(class_dir):
        img_path = os.path.join(class_dir, img_name)

        img = cv2.imread(img_path)
        if img is None:
            continue

        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        result = hands.process(rgb)

        if result.multi_hand_landmarks:
            hand_landmarks = result.multi_hand_landmarks[0]
            features = extract_features(hand_landmarks)

            X.append(features)
            y.append(label)

hands.close()

X = np.array(X)
y = np.array(y)

np.save(os.path.join(SAVE_DIR, "X.npy"), X)
np.save(os.path.join(SAVE_DIR, "y.npy"), y)

print("\n✅ Landmark dataset created successfully")
print("X shape:", X.shape)
print("y shape:", y.shape)
