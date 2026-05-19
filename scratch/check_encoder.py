import joblib
import os

encoder_path = "landmark_label_encoder.pkl"
if os.path.exists(encoder_path):
    label_encoder = joblib.load(encoder_path)
    print("Classes:", label_encoder.classes_)
else:
    print("Encoder not found")
