import numpy as np
import tensorflow as tf
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
import os

from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, classification_report

# ========= LOAD DATA =========
X = np.load("landmark_dataset/X.npy")
y = np.load("landmark_dataset/y.npy")

scaler = joblib.load("landmark_scaler.pkl")
label_encoder = joblib.load("landmark_label_encoder.pkl")
model = tf.keras.models.load_model("landmark_dl_model.h5")

# ========= PREPROCESS =========
X = scaler.transform(X)
y_encoded = label_encoder.transform(y)

X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded,
    test_size=0.2,
    random_state=42,
    stratify=y_encoded
)

# ========= PREDICTION =========
y_probs = model.predict(X_test)
y_pred = np.argmax(y_probs, axis=1)

# ========= CONFUSION MATRIX =========
cm = confusion_matrix(y_test, y_pred)

plt.figure(figsize=(14, 12))
sns.heatmap(
    cm,
    annot=False,
    cmap="Blues",
    xticklabels=label_encoder.classes_,
    yticklabels=label_encoder.classes_
)
plt.xlabel("Predicted Label")
plt.ylabel("True Label")
plt.title("Confusion Matrix - Landmark Deep Learning Model")
plt.tight_layout()

# Save instead of show
output_path = r"C:\Users\User\.gemini\antigravity\brain\98b3ba96-fdfe-4fe9-813f-4a23bb69e21e\confusion_matrix.png"
plt.savefig(output_path)
print(f"Confusion Matrix saved to: {output_path}")
