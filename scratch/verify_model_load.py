import tensorflow as tf
import joblib
import numpy as np
import os

BASE_DIR = os.getcwd()
MODEL_PATH = os.path.join(BASE_DIR, "landmark_dl_model.h5")
SCALER_PATH = os.path.join(BASE_DIR, "landmark_scaler.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "landmark_label_encoder.pkl")

print(f"Loading model from {MODEL_PATH}")
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    label_encoder = joblib.load(ENCODER_PATH)
    print("Model and assets loaded successfully!")
    
    # Test a dummy prediction
    dummy_input = np.zeros((1, 42))
    dummy_scaled = scaler.transform(dummy_input)
    preds = model.predict(dummy_scaled)
    class_id = np.argmax(preds)
    label = label_encoder.inverse_transform([class_id])[0]
    print(f"Dummy prediction successful! Label for zeros: {label}")

except Exception as e:
    print(f"Error: {e}")
