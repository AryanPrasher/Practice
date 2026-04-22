import os
import numpy as np
import tensorflow as tf
# These help the AI learn by providing specialized "brain layers"
layers = tf.keras.layers
models = tf.keras.models
mnist = tf.keras.datasets.mnist
from PIL import Image, ImageDraw, ImageFont

# Set the path names
MODEL_NAME = 'models/math_model.h5'

def generate_symbols():
    """
    Generate math symbols (+, -, *, /)
    Each symbol gets 800 variations with random distortions
    """
    print("Generating math symbols (+, -, *, /) with distortions...")
    symbols = ['+', '-', '*', '/']
    data = []
    labels = []
    
    try:
        font = ImageFont.truetype("arial.ttf", 22)
    except:
        font = ImageFont.load_default()

    for i, symbol in enumerate(symbols):
        for _ in range(800):
            # Create a blank black image
            img = Image.new('L', (28, 28), 0)
            draw = ImageDraw.Draw(img)
            
            # Random position (mimics messy handwriting)
            off_x = np.random.randint(-3, 4)
            off_y = np.random.randint(-3, 4)
            draw.text((7 + off_x, 1 + off_y), symbol, fill=255, font=font)
            
            # Random rotation
            angle = np.random.randint(-20, 21)
            img = img.rotate(angle)
            
            data.append(np.array(img))
            labels.append(10 + i) # Labels 10-13
            
    return np.array(data), np.array(labels)

def train():
    # 1. Load MNIST digits (0-9)
    print("Loading Digit Dataset (0-9)...")
    (x_digits, y_digits), _ = mnist.load_data()
    
    # 2. Generate math symbols
    s_data, s_labels = generate_symbols()
    
    # Combine digits and symbols into one big training dataset
    x_train = np.concatenate([x_digits, s_data])
    y_train = np.concatenate([y_digits, s_labels])
    
    # Preprocess: Scale pixels from 0-255 to 0-1 (Neural networks love 0 to 1)
    x_train = x_train.reshape(-1, 28, 28, 1).astype('float32') / 255.0
    
    # 3. Build the AI Model (Convolutional Neural Network)
    model = models.Sequential([
        # Layer 1: Looks for basic strokes and lines
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
        layers.MaxPooling2D((2, 2)),
        
        # Layer 2: Combines strokes into shapes
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        
        # Layer 3: Decision making layers
        layers.Flatten(),
        layers.Dense(64, activation='relu'),
        layers.Dense(14, activation='softmax') # 14 output nodes (0-9 digits + 4 math signs)
    ])
    
    # Compile the brain
    model.compile(optimizer='adam',
                  loss='sparse_categorical_crossentropy',
                  metrics=['accuracy'])
    
    # 4. Train the AI
    print("Training the AI (this takes around 2-3 minutes)...")
    model.fit(x_train, y_train, epochs=5, batch_size=32, shuffle=True)
    
    # 5. Save the model to a file
    if not os.path.exists('models'):
        os.makedirs('models')
    model.save(MODEL_NAME)
    print(f"Success! AI model saved as {MODEL_NAME}")
    print("It can now recognize Digits (0-9) and Math symbols (+, -, *, /).")

if __name__ == "__main__":
    train()
