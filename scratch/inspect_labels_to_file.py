import joblib
import os

ENCODER_PATH = "landmark_label_encoder.pkl"
output_file = "scratch/labels_output.txt"

try:
    if os.path.exists(ENCODER_PATH):
        label_encoder = joblib.load(ENCODER_PATH)
        labels = list(label_encoder.classes_)
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(str(labels))
        print("Success")
    else:
        with open(output_file, "w") as f:
            f.write("Encoder file not found.")
        print("Failed")
except Exception as e:
    with open(output_file, "w") as f:
        f.write(f"Error: {str(e)}")
    print("Error")
