import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf
import joblib
import os
import base64

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

class SignToTextWSManager:
    def __init__(self):
        self.hands = mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=1,
            min_detection_confidence=0.5, # Increased for better stability
            min_tracking_confidence=0.5
        )
        self.last_letter = ""
        self.last_emitted_letter = "" # Track what we actually sent to UI
        self.stable_count = 0
        self.CONF_THRESHOLD = 0.60 # Increased threshold to avoid noise
        self.no_hand_count = 0
        self.space_emitted = True

    def process_frame(self, base64_image: str):
        if base64_image.startswith('data:image'):
            base64_image = base64_image.split(',')[1]
        
        try:
            img_data = base64.b64decode(base64_image)
            np_arr = np.frombuffer(img_data, np.uint8)
            frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            if frame is None:
                print("[BACKEND] Warning: Failed to decode frame")
                return None

            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            result = self.hands.process(rgb)

            if result.multi_hand_landmarks:
                self.no_hand_count = 0
                self.space_emitted = False
                hand_landmarks = result.multi_hand_landmarks[0]
                features = []
                
                # Use landmark 0 (wrist) as reference
                ref_x = hand_landmarks.landmark[0].x
                ref_y = hand_landmarks.landmark[0].y

                for lm in hand_landmarks.landmark:
                    features.append(lm.x - ref_x)
                    features.append(lm.y - ref_y)

                if len(features) != 42:
                    return None

                features = np.array(features, dtype=np.float32).reshape(1, -1)
                
                try:
                    features = scaler.transform(features)
                    preds = model.predict(features, verbose=0)
                except Exception as e:
                    print(f"[BACKEND] Prediction Error: {e}")
                    return None

                class_id = np.argmax(preds)
                confidence = np.max(preds)
                letter_id = label_encoder.inverse_transform([class_id])[0]
                letter = LABEL_TO_ARABIC.get(letter_id, letter_id)

                if confidence > self.CONF_THRESHOLD:
                    if letter == self.last_letter:
                        self.stable_count += 1
                    else:
                        self.last_letter = letter
                        self.stable_count = 0

                    if self.stable_count >= 1:
                        if letter != self.last_emitted_letter:
                            try:
                                print(f"[BACKEND] EMITTING: {letter} (Conf: {confidence:.2f})")
                            except:
                                print(f"[BACKEND] EMITTING: [Arabic Char] (Conf: {confidence:.2f})")
                            
                            self.last_emitted_letter = letter
                            return letter
                else:
                    self.stable_count = 0
            else:
                self.no_hand_count += 1
                if self.no_hand_count >= 10: # Increased from 5 to avoid accidental spaces
                    self.last_emitted_letter = ""
                    if not self.space_emitted:
                        self.space_emitted = True
                        print("[BACKEND] Space inserted (Hand removed)")
                        return " "
        except Exception as e:
            import traceback
            print(f"[BACKEND] Critical Exception in process_frame: {e}")
            traceback.print_exc()
        
        return None

    def close(self):
        if hasattr(self, 'hands') and self.hands:
            self.hands.close()
