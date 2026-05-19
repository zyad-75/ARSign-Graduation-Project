import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
import joblib
import os

# ========= LOAD DATA =========
DATA_DIR = "landmark_dataset"

X = np.load(os.path.join(DATA_DIR, "X.npy"))
y = np.load(os.path.join(DATA_DIR, "y.npy"))

print("X shape:", X.shape)   # (N, 42)
print("y shape:", y.shape)

# ========= ENCODE LABELS =========
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)
num_classes = len(label_encoder.classes_)

y_cat = to_categorical(y_encoded, num_classes)

# ========= SCALE FEATURES =========
scaler = StandardScaler()
X = scaler.fit_transform(X)

# ========= TRAIN / VAL SPLIT =========
X_train, X_val, y_train, y_val = train_test_split(
    X, y_cat,
    test_size=0.2,
    random_state=42,
    stratify=y_encoded
)

# ========= BUILD DEEP MODEL =========
model = tf.keras.Sequential([
    tf.keras.layers.Dense(128, activation="relu", input_shape=(42,)),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Dropout(0.3),

    tf.keras.layers.Dense(256, activation="relu"),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Dropout(0.4),

    tf.keras.layers.Dense(128, activation="relu"),
    tf.keras.layers.Dropout(0.3),

    tf.keras.layers.Dense(num_classes, activation="softmax")
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# ========= CALLBACKS =========
callbacks = [
    EarlyStopping(
        monitor="val_loss",
        patience=10,
        restore_best_weights=True
    ),
    ModelCheckpoint(
        "landmark_dl_model.h5",
        monitor="val_accuracy",
        save_best_only=True
    )
]

# ========= TRAIN =========
history = model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=100,
    batch_size=32,
    callbacks=callbacks
)

# ========= SAVE TOOLS =========
joblib.dump(scaler, "landmark_scaler.pkl")
joblib.dump(label_encoder, "landmark_label_encoder.pkl")

print("\n✅ Deep Learning landmark model trained and saved")
