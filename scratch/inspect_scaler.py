import joblib
import os

SCALER_PATH = "landmark_scaler.pkl"

if os.path.exists(SCALER_PATH):
    scaler = joblib.load(SCALER_PATH)
    if hasattr(scaler, 'n_features_in_'):
        print("Scaler features:", scaler.n_features_in_)
    else:
        print("Scaler has no n_features_in_ attribute.")
else:
    print("Scaler file not found.")
