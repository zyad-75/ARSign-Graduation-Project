import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf
import joblib
import os

# ==============================
# تحميل الملفات بمسار صحيح
# ==============================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "landmark_dl_model.h5")
SCALER_PATH = os.path.join(BASE_DIR, "landmark_scaler.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "landmark_label_encoder.pkl")

model = tf.keras.models.load_model(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
label_encoder = joblib.load(ENCODER_PATH)

mp_hands = mp.solutions.hands

LABEL_TO_ARABIC = {
    "Alef": "ا", "Beh": "ب", "Teh": "ت", "Theh": "ث",
    "Jeem": "ج", "Hah": "ح", "Khah": "خ",
    "Dal": "د", "thal": "ذ", "Reh": "ر", "Zain": "ز",
    "Seen": "س", "Sheen": "ش", "Sad": "ص", "Dad": "ض",
    "Tah": "ط", "Zah": "ظ", "Ain": "ع", "Ghain": "غ",
    "Feh": "ف", "Qaf": "ق", "Kaf": "ك",
    "Lam": "ل", "Meem": "م", "Noon": "ن",
    "Heh": "ه", "Waw": "و", "Yeh": "ي",
    "Al": "ال", "Laa": "لا", "Teh_Marbuta": "ة"
}


# ==============================
# Video Processing Function
# ==============================

def process_video(video_path):

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        print("❌ Cannot open video")
        return ""

    hands = mp_hands.Hands(
        static_image_mode=False,
        max_num_hands=1,
        min_detection_confidence=0.6,
        min_tracking_confidence=0.6
    )

    full_text = ""
    last_letter = ""
    stable_count = 0

    print("🎥 Processing:", video_path)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = hands.process(rgb)

        if result.multi_hand_landmarks:
            hand_landmarks = result.multi_hand_landmarks[0]

            features = []
            ref_x = hand_landmarks.landmark[0].x
            ref_y = hand_landmarks.landmark[0].y

            for lm in hand_landmarks.landmark:
                features.append(lm.x - ref_x)
                features.append(lm.y - ref_y)

            features = np.array(features).reshape(1, -1)
            features = scaler.transform(features)

            preds = model.predict(features, verbose=0)
            class_id = np.argmax(preds)
            confidence = np.max(preds)

            if confidence > 0.75:
                letter_id = label_encoder.inverse_transform([class_id])[0]
                letter = LABEL_TO_ARABIC.get(letter_id, letter_id)

                try:
                    print("Detected:", letter, "Confidence:", confidence)
                except:
                    print("Detected: [Arabic Char] Confidence:", confidence)

                if letter == last_letter:
                    stable_count += 1
                else:
                    stable_count = 0

                if stable_count == 3:
                    full_text += letter
                    last_letter = letter
                    print("✅ Added:", letter)

    cap.release()

    print("📝 Final Text:", full_text)
    return full_text