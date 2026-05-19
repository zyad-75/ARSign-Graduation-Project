import joblib
import os

ENCODER_PATH = "landmark_label_encoder.pkl"
if os.path.exists(ENCODER_PATH):
    label_encoder = joblib.load(ENCODER_PATH)
    print("Labels in encoder:", label_encoder.classes_)
else:
    print("Encoder file not found.")
