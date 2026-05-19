import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENCODER_PATH = os.path.join(BASE_DIR, "landmark_label_encoder.pkl")

if os.path.exists(ENCODER_PATH):
    label_encoder = joblib.load(ENCODER_PATH)
    print("Classes:", label_encoder.classes_)
else:
    print("Encoder not found at", ENCODER_PATH)
