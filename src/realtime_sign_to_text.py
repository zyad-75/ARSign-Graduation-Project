import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf
import joblib

# ===== LOAD MODEL =====
model = tf.keras.models.load_model("landmark_dl_model.h5")
scaler = joblib.load("landmark_scaler.pkl")
label_encoder = joblib.load("landmark_label_encoder.pkl")

# ===== MediaPipe =====
mp_hands = mp.solutions.hands
mp_draw = mp.solutions.drawing_utils

hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.8,
    min_tracking_confidence=0.8
)

cap = cv2.VideoCapture(0)

# ===== Settings =====
CONF_THRESHOLD = 0.80
STABLE_FRAMES = 10

stable_letter = ""
stable_count = 0
current_letter = ""
output_text = ""

def extract_features(hand_landmarks):
    features = []
    ref_x = hand_landmarks.landmark[0].x
    ref_y = hand_landmarks.landmark[0].y

    for lm in hand_landmarks.landmark:
        features.append(lm.x - ref_x)
        features.append(lm.y - ref_y)

    return np.array(features).reshape(1, -1)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = hands.process(rgb)

    if result.multi_hand_landmarks:
        for hand_landmarks in result.multi_hand_landmarks:
            mp_draw.draw_landmarks(
                frame,
                hand_landmarks,
                mp_hands.HAND_CONNECTIONS
            )

            features = extract_features(hand_landmarks)
            features = scaler.transform(features)

            preds = model.predict(features, verbose=0)
            class_id = np.argmax(preds)
            confidence = np.max(preds)

            if confidence > CONF_THRESHOLD:
                predicted_label = label_encoder.inverse_transform([class_id])[0]

                if predicted_label == stable_letter:
                    stable_count += 1
                else:
                    stable_letter = predicted_label
                    stable_count = 0

                if stable_count > STABLE_FRAMES:
                    current_letter = stable_letter

            cv2.putText(
                frame,
                f"Letter: {current_letter}",
                (10, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2
            )

            cv2.putText(
                frame,
                f"Confidence: {confidence:.2f}",
                (10, 80),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (255, 255, 0),
                2
            )

    cv2.putText(
        frame,
        f"Text: {output_text}",
        (10, 130),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 200, 255),
        2
    )

    cv2.putText(
        frame,
        "Press S to add | C to clear | Q to quit",
        (10, 460),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.6,
        (200, 200, 200),
        2
    )

    cv2.imshow("Real-time Sign to Text", frame)

    key = cv2.waitKey(1) & 0xFF

    if key == ord('s'):
        if current_letter != "":
            output_text += current_letter

    if key == ord('c'):
        output_text = ""

    if key == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
