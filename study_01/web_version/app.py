"""
Web version of the handwritten digit recognizer.
Flask backend: serves the HTML page and handles prediction requests.
"""

import os
import pickle
import base64
import numpy as np
from flask import Flask, request, jsonify, render_template
from PIL import Image
from io import BytesIO

app = Flask(__name__)

# Reuse model files from desktop_version if available, otherwise train here
DESKTOP_DIR = os.path.join(os.path.dirname(__file__), '..', 'desktop_version')
LOCAL_DIR   = os.path.dirname(__file__)

MODEL_PATH  = os.path.join(DESKTOP_DIR, 'mnist_model.pkl')
SCALER_PATH = os.path.join(DESKTOP_DIR, 'mnist_scaler.pkl')

if not os.path.exists(MODEL_PATH):
    MODEL_PATH  = os.path.join(LOCAL_DIR, 'mnist_model.pkl')
    SCALER_PATH = os.path.join(LOCAL_DIR, 'mnist_scaler.pkl')


def train_and_save_model():
    from sklearn.datasets import fetch_openml
    from sklearn.neural_network import MLPClassifier
    from sklearn.preprocessing import StandardScaler

    print("Downloading MNIST dataset (first run only, ~55 MB)...")
    mnist = fetch_openml('mnist_784', version=1, as_frame=False, parser='auto')
    X, y = mnist.data, mnist.target
    X_train, y_train = X[:60000], y[:60000]

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)

    print("Training model...")
    clf = MLPClassifier(hidden_layer_sizes=(256, 128), activation='relu',
                        max_iter=30, random_state=42, verbose=True)
    clf.fit(X_train_scaled, y_train)

    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(clf, f)
    with open(SCALER_PATH, 'wb') as f:
        pickle.dump(scaler, f)

    print("Model saved!")
    return clf, scaler


def load_or_train_model():
    if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
        print("Loading saved model...")
        with open(MODEL_PATH, 'rb') as f:
            clf = pickle.load(f)
        with open(SCALER_PATH, 'rb') as f:
            scaler = pickle.load(f)
        print("Model loaded.")
        return clf, scaler
    return train_and_save_model()


clf, scaler = load_or_train_model()


@app.route('/')
def index():
    return render_template('index.html')


def preprocess(img: Image.Image) -> np.ndarray:
    """Center the drawn digit and resize to 28x28 to match MNIST format."""
    arr = np.array(img)

    # Find bounding box of drawn pixels
    rows = np.any(arr > 10, axis=1)
    cols = np.any(arr > 10, axis=0)
    if not rows.any():
        return np.zeros((1, 784), dtype=np.float32)

    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    cropped = arr[rmin:rmax + 1, cmin:cmax + 1]

    # Place cropped digit centered in a square with 20% padding
    h, w  = cropped.shape
    pad   = max(h, w) // 4
    size  = max(h, w) + pad * 2
    canvas = np.zeros((size, size), dtype=np.uint8)
    y0 = (size - h) // 2
    x0 = (size - w) // 2
    canvas[y0:y0 + h, x0:x0 + w] = cropped

    img_out = Image.fromarray(canvas).resize((28, 28), Image.LANCZOS)
    return np.array(img_out, dtype=np.float32).flatten().reshape(1, -1)


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json.get('image', '')
    # Strip data URL header: "data:image/png;base64,..."
    if ',' in data:
        data = data.split(',')[1]

    img = Image.open(BytesIO(base64.b64decode(data))).convert('L')
    arr = preprocess(img)
    arr_scaled = scaler.transform(arr)

    prediction    = clf.predict(arr_scaled)[0]
    probabilities = clf.predict_proba(arr_scaled)[0].tolist()
    confidence    = max(probabilities) * 100

    return jsonify({
        'prediction':    prediction,
        'confidence':    round(confidence, 1),
        'probabilities': [round(p * 100, 1) for p in probabilities],
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)
