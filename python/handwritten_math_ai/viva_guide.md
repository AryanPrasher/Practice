VIVA NOTES - HANDWRITTEN MATH CONVERTER PROJECT

What does the project do?
You draw numbers, math symbols, or alphabets on the website, click convert, and it recognizes what you drew. It can read digits (0-9), math signs (+, -, *, /), and both uppercase and lowercase letters (A-Z, a-z).

How does it work?

Step 1 - You draw on the website
You use the canvas tool to draw your math problem.

Step 2 - Your drawing goes to our Python program
JavaScript on the website sends your drawing to Flask. Flask is a Python tool that runs on the computer and acts like a web server.

Step 3 - We find each symbol you drew
OpenCV is a library that looks at your drawing. It turns it into black and white. Then it finds each separate shape you drew like each number or symbol. It sorts them left to right like reading.

Step 4 - Recognize what each shape is
We have a model file (math_model.h5) that was trained to recognize 66 different characters (numbers, math signs, and letters). Each shape gets resized to 28x28 pixels. Then TensorFlow checks what it is and guesses the most likely character.

Step 5 - Convert to LaTeX
We take each recognized symbol and convert it to LaTeX format so it looks like proper math. Plus stays as plus, but multiply becomes × symbol. We send everything back to your website.

Libraries used

Flask - Makes a web server so your website can talk to Python
OpenCV - Processes images and finds shapes in them
TensorFlow - Loads the trained model and recognizes symbols
NumPy - Works with numbers and image data
JavaScript - Captures what you draw on the canvas

What is the model file (math_model.h5)?
Its a trained file that learned from thousands of image examples. It knows how to recognize digits 0-9 and math symbols. We load it once and reuse it to recognize your drawings.

What is LaTeX?
Its a language for writing math formulas nicely. Instead of typing a messy fraction like 2/3, LaTeX shows it as a real fraction symbol. We use it to make your handwritten math look professional.

Key parts of the code

get_model() - Loads the trained model one time and keeps using it
predict() - The main function that does all the recognition when you click convert
cv2.threshold() - Turns the image into black and white
cv2.findContours() - Finds each symbol you drew
model.predict() - Actually guesses what each symbol is
LABELS dictionary - Maps numbers to symbols like 0 maps to '0', 10 maps to '+'

Important terms explained

Segmentation - Breaking one big image into separate pieces each symbol
Contours - The edges or outline of each shape in the image
Base64 - A way to send images as text through the internet
Bounding Box - A rectangle drawn around each symbol
Threshold - Making an image pure black and white
Balanced Dataset - We limited the number of digits so the AI doesn't get overwhelmed and forgets what letters look like. This makes the AI equally good at both.
Synthetic Generation - Creating "fake" but realistic handwriting-like images to train the AI when real data is hard to find.

Things we could add later

Support more symbols like fractions or square roots
Make it more accurate by training with more examples
Recognize when numbers are next to each other like 23 instead of 2 and 3
Add buttons to undo or clear the drawing
5. Draw multiple lines or words
6. Support for more complex math like fractions or integrals
