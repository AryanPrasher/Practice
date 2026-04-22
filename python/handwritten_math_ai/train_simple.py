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

def generate_letters():
    """
    Generate uppercase (A-Z) and lowercase (a-z) letters
    Each letter gets 500 variations for deep learning
    """
    print("Generating letters (A-Z, a-z) with variations...")
    data = []
    labels = []
    
    try:
        # We try to use a thicker font size to look like handwriting marker
        font_large = ImageFont.truetype("arial.ttf", 24)
        font_small = ImageFont.truetype("arial.ttf", 20)
    except:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # Uppercase letters (A-Z) - labels 14-39
    for i, letter in enumerate('ABCDEFGHIJKLMNOPQRSTUVWXYZ'):
        for _ in range(500):
            img = Image.new('L', (28, 28), 0)
            draw = ImageDraw.Draw(img)
            
            # Randomly pick small or large font for variety
            f = font_large if np.random.random() > 0.5 else font_small
            
            off_x = np.random.randint(-4, 5)
            off_y = np.random.randint(-4, 5)
            draw.text((6 + off_x, 1 + off_y), letter, fill=255, font=f)
            
            angle = np.random.randint(-15, 16)
            img = img.rotate(angle)
            
            data.append(np.array(img))
            labels.append(14 + i)
    
    # Lowercase letters (a-z) - labels 40-65
    for i, letter in enumerate('abcdefghijklmnopqrstuvwxyz'):
        for _ in range(500):
            img = Image.new('L', (28, 28), 0)
            draw = ImageDraw.Draw(img)
            
            f = font_large if np.random.random() > 0.5 else font_small
            
            off_x = np.random.randint(-4, 5)
            off_y = np.random.randint(-4, 5)
            draw.text((6 + off_x, 1 + off_y), letter, fill=255, font=f)
            
            angle = np.random.randint(-15, 16)
            img = img.rotate(angle)
            
            data.append(np.array(img))
            labels.append(40 + i)
    
    return np.array(data), np.array(labels)

def train():
    # 1. Load MNIST digits (0-9)
    print("Loading Digit Dataset (0-9)...")
    (x_digits, y_digits), _ = mnist.load_data()
    
    # Limit digits to 2000 per class so letters aren't ignored
    # This "balances" the brain so it doesn't just think everything is a number
    balanced_x = []
    balanced_y = []
    for digit in range(10):
        # Find indices where label is this digit
        idxs = np.where(y_digits == digit)[0][:2000]
        balanced_x.append(x_digits[idxs])
        balanced_y.append(y_digits[idxs])
    
    x_digits = np.concatenate(balanced_x)
    y_digits = np.concatenate(balanced_y)
    
    # 2. Generate math symbols
    s_data, s_labels = generate_symbols()
    
    # 3. Generate letters
    l_data, l_labels = generate_letters()
    
    # Combine digits, symbols, and letters into one big training list
    x_train = np.concatenate([x_digits, s_data, l_data])
    y_train = np.concatenate([y_digits, s_labels, l_labels])
    
    # Preprocess: Scale pixels from 0-255 to 0-1 (Neural networks love 0 to 1)
    x_train = x_train.reshape(-1, 28, 28, 1).astype('float32') / 255.0
    
    # 4. Build the AI Model (Convolutional Neural Network)
    model = models.Sequential([
        # Layer 1: Looks for basic strokes and lines
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
        layers.MaxPooling2D((2, 2)),
        
        # Layer 2: Combines strokes into shapes (like curves of an 'A' or '8')
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        
        # Layer 3: Decision making layers
        layers.Flatten(),
        layers.Dense(128, activation='relu'), # Increased from 64 to 128 for more memory
        layers.Dropout(0.2),                   # Prevents memorizing (overfitting)
        layers.Dense(66, activation='softmax') # 66 output nodes (0-65 labels)
    ])
    
    # Compile the brain
    model.compile(optimizer='adam',
                  loss='sparse_categorical_crossentropy',
                  metrics=['accuracy'])
    
    # 5. Train the AI
    # We use more epochs (trips through data) now that we have more classes
    print("Training the AI (this takes around 3-5 minutes)...")
    model.fit(x_train, y_train, epochs=8, batch_size=32, shuffle=True)
    
    # 6. Save the model to a file
    if not os.path.exists('models'):
        os.makedirs('models')
    model.save(MODEL_NAME)
    print(f"Success! AI model saved as {MODEL_NAME}")
    print("It can now recognize Digits, Math symbols, and Alphabets (A-Z, a-z).")

if __name__ == "__main__":
    train()
