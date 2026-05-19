import tensorflow as tf
import os

model_path = r"d:\Grad\GraduationProject\landmark_dl_model.h5"
if os.path.exists(model_path):
    model = tf.keras.models.load_model(model_path)
    model.summary()
    print("\n--- Layer Details ---")
    for layer in model.layers:
        config = layer.get_config()
        activation = config.get('activation', 'None')
        print(f"Layer: {layer.name}, Units: {config.get('units', 'N/A')}, Activation: {activation}")
    
    print("\n--- Compile Info ---")
    print(f"Loss: {model.loss}")
    print(f"Optimizer: {model.optimizer}")
else:
    print("Model not found")
