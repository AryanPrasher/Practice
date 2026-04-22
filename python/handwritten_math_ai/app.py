# LIBRARIES USED:
# Flask - creates a web server to run the app
# OpenCV (cv2) - processes images and finds shapes
# TensorFlow - loads and uses the trained AI model to recognize symbols
# NumPy - works with arrays and numbers
# base64 - converts image data to text format for sending

import os
import cv2
import numpy as np
import base64
from flask import Flask, render_template, request, jsonify
import tensorflow as tf

app = Flask(__name__)

# Path to our trained model (the AI brain)
MODEL_PATH = 'models/math_model.h5'
model = None

# Map numbers to symbols: 0-9 are digits, 10-13 are +, -, *, /
LABELS = {
    0: '0', 1: '1', 2: '2', 3: '3', 4: '4',
    5: '5', 6: '6', 7: '7', 8: '8', 9: '9',
    10: '+', 11: '-', 12: '*', 13: '/'
}

def load_trained_model():
    """Load the AI model from file (only once)"""
    global model
    if model is None:
        if os.path.exists(MODEL_PATH):
            model = tf.keras.models.load_model(MODEL_PATH)
        else:
            print("ERROR: Model file not found!")
    return model

@app.route('/')
def index():
    """Show the main page"""
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """Main function: receives drawing, recognizes symbols, returns text"""
    
    # Step 1: Get image from website (sent as base64 text)
    data = request.json['image']
    # Convert text back to image using base64
    encoded_data = data.split(',')[1]
    image_data = base64.b64decode(encoded_data)
    nparr = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Step 2: Process image - convert to black and white
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # Make drawn lines white, background black (easier for AI to read)
    _, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY_INV)
    
    # Step 3: Find each symbol user drew
    # cv2.findContours finds all connected shapes in the image
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Get rectangle around each shape
    boxes = []
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        # Only keep shapes bigger than noise (at least 5x5 pixels)
        if w > 5 and h > 5:
            boxes.append((x, y, w, h))
    
    # Sort left to right (like reading)
    boxes.sort(key=lambda b: b[0])
    
    # Step 4: Recognize each symbol
    results = []
    model = load_trained_model()
    
    if model is None:
        return jsonify({'error': 'Model not loaded!'})
    
    for x, y, w, h in boxes:
        # Get just this one symbol
        symbol_image = binary[y:y+h, x:x+w]
        
        # Resize to 28x28 (size AI was trained on)
        # Add padding around it
        pad = 4
        symbol_image = cv2.copyMakeBorder(symbol_image, pad, pad, pad, pad, 
                                         cv2.BORDER_CONSTANT, value=0)
        symbol_image = cv2.resize(symbol_image, (28, 28))
        
        # Prepare for AI: reshape to right format and normalize values
        symbol_array = symbol_image.reshape(1, 28, 28, 1).astype('float32') / 255.0
        
        # Step 5: Use AI to recognize this symbol
        # model.predict() returns probability for each possible symbol
        prediction = model.predict(symbol_array, verbose=0)
        best_guess = np.argmax(prediction)  # Get the highest probability
        symbol = LABELS[best_guess]
        
        results.append(symbol)
    
    # Return results to website
    recognized_text = " ".join(results)
    eval_text = "".join(results) # without spaces for testing validity
    
    valid_chars = set("0123456789+-*/")
    is_valid = all(char in valid_chars for char in eval_text)
    
    answer_text = ""
    try:
        if eval_text and is_valid:
            ans = eval(eval_text)
            if isinstance(ans, float) and ans.is_integer():
                ans = int(ans)
            # Limit decimals to 2 places if it's a float
            elif isinstance(ans, float):
                ans = round(ans, 2)
                
            answer_text = f"{recognized_text} = {ans}"
        else:
            answer_text = f"{recognized_text} (Not a math expression)"
    except Exception as e:
        answer_text = f"Found '{recognized_text}' but couldn't calculate it."
        
    return jsonify({
        'text': answer_text,
        'symbols': results
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
