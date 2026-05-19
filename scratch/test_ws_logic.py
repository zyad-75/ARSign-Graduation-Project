import base64
import numpy as np
import cv2
from backend.ws_sign_to_text import SignToTextWSManager

# Create a dummy image
img = np.zeros((100, 100, 3), dtype=np.uint8)
_, buffer = cv2.imencode('.jpg', img)
dummy_b64 = "data:image/jpeg;base64," + base64.b64encode(buffer).decode()

manager = SignToTextWSManager()

print("--- Testing Logic (Simulating frames) ---")

# Mocking the hands result to simulate a stable recognition
# We have to patch manager.hands.process or monkeypatch the logic
# To keep it simple, I'll just check if it handles None/Empty cases correctly
# and then I'll manually trigger the internal logic blocks

print("Processing empty frame...")
res = manager.process_frame(dummy_b64)
print(f"Result: {res}")

# Since we don't have a hand in the dummy image, it should return None 
# or space after 5 frames.
for i in range(6):
    res = manager.process_frame(dummy_b64)
    print(f"Frame {i+1} result: {res}")

print("--- Mocking a stable letter 'Alef' ---")
# Manually simulate what happens when hand is detected
manager.no_hand_count = 0
manager.space_emitted = False

def simulate_recognition(letter, frames=5):
    print(f"Simulating '{letter}' for {frames} frames...")
    for i in range(frames):
        # We manually bypass the predict call for this test
        # and just apply the logic from line 90+
        manager.last_letter = letter # This doesn't test the transition, let's do more
        
        # Internal logic simulation:
        # if letter == self.last_letter: stable_count += 1
        # if stable_count >= 1: ...
        
        # Testing the specific fix:
        res = None
        if letter == manager.last_letter:
            manager.stable_count += 1
        else:
            manager.last_letter = letter
            manager.stable_count = 0
            
        if manager.stable_count >= 1:
            if letter != manager.last_emitted_letter:
                print(f"  [EMIT] {letter}")
                manager.last_emitted_letter = letter
                res = letter
            else:
                # print(f"  [SKIP] duplicate")
                pass
        print(f"  Frame {i} -> {res}")

simulate_recognition("ا", 3)
simulate_recognition("ب", 3)
simulate_recognition("ب", 2) # Should SKIP these
manager.no_hand_count = 10 # Simulate hand removed
manager.last_emitted_letter = "" 
simulate_recognition("ب", 2) # Should EMIT again after break
