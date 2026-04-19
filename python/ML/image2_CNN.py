import numpy as np
import cv2
import matplotlib.pyplot as plt
import urllib.request
import tensorflow as tf

layers = tf.keras.layers
models = tf.keras.models

# Download another image (CAT)
url = "https://upload.wikimedia.org/wikipedia/commons/8/8d/President_Barack_Obama.jpg"
urllib.request.urlretrieve(url, "face.jpg")

# Read and preprocess image
image = cv2.imread("cat.jpg")
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
image_resized = cv2.resize(image_rgb, (128, 128))
gray = cv2.cvtColor(image_resized, cv2.COLOR_RGB2GRAY)

# Show original + grayscale
plt.figure(figsize=(10, 4))

plt.subplot(1, 2, 1)
plt.imshow(image_resized)
plt.title("Original Image (Cat)")
plt.axis("off")

plt.subplot(1, 2, 2)
plt.imshow(gray, cmap="gray")
plt.title("Grayscale")
plt.axis("off")

plt.show()

# Convolution kernel (edge detection)
kernel = np.array([
    [-1, -1, -1],
    [-1,  8, -1],
    [-1, -1, -1]
], dtype=np.float32)

# Convolution + ReLU
convolution_output = cv2.filter2D(gray, -1, kernel)
relu_output = np.maximum(0, convolution_output)

# Max Pooling
def max_pooling(feature_map, size=2, stride=2):
    h, w = feature_map.shape
    output_h = (h - size) // stride + 1
    output_w = (w - size) // stride + 1
    pooled = np.zeros((output_h, output_w))

    for i in range(output_h):
        for j in range(output_w):
            region = feature_map[i*stride:i*stride+size, j*stride:j*stride+size]
            pooled[i, j] = np.max(region)

    return pooled

pooled_output = max_pooling(relu_output)
flatten_output = pooled_output.flatten()

# Shapes
print("Grayscale:", gray.shape)
print("Convolution:", convolution_output.shape)
print("ReLU:", relu_output.shape)
print("Pooling:", pooled_output.shape)
print("Flatten:", flatten_output.shape)

# Visualization
plt.figure(figsize=(14, 8))

plt.subplot(2, 2, 1)
plt.imshow(gray, cmap="gray")
plt.title("Input")

plt.subplot(2, 2, 2)
plt.imshow(convolution_output, cmap="gray")
plt.title("Convolution")

plt.subplot(2, 2, 3)
plt.imshow(relu_output, cmap="gray")
plt.title("ReLU")

plt.subplot(2, 2, 4)
plt.imshow(pooled_output, cmap="gray")
plt.title("Pooling")

plt.tight_layout()
plt.show()

print("First 20 values:", flatten_output[:20])

# Prepare input for CNN
x = gray.astype("float32") / 255.0
x = np.expand_dims(x, axis=-1)
x = np.expand_dims(x, axis=0)

print("Input shape:", x.shape)

# CNN Model
model = models.Sequential([
    layers.Conv2D(8, (3, 3), activation='relu', input_shape=(128, 128, 1)),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(16, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Flatten(),
    layers.Dense(32, activation='relu'),
    layers.Dense(2, activation='softmax')
])

model.summary()

# Prediction
output = model.predict(x)
print("Output:", output)
print("Predicted class:", np.argmax(output))