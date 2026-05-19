import uuid
import os
from src.text_to_sign import text_to_sign

OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_sign_video(text: str) -> str:
    filename = f"{uuid.uuid4()}.webm"
    output_path = os.path.join(OUTPUT_DIR, filename)

    text_to_sign(text, output_path)

    return filename
