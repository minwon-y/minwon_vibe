"""
Handwritten Digit Recognizer
- Draw a digit on the canvas using your mouse
- Click 'Recognize' to predict the digit
- Uses MNIST dataset + scikit-learn MLP neural network
"""

import tkinter as tk
import numpy as np
import pickle
import os
from PIL import Image, ImageDraw


MODEL_PATH = os.path.join(os.path.dirname(__file__), 'mnist_model.pkl')
SCALER_PATH = os.path.join(os.path.dirname(__file__), 'mnist_scaler.pkl')

CANVAS_SIZE = 280   # Display canvas size (pixels)
MNIST_SIZE  = 28    # MNIST image size


def train_and_save_model():
    """Download MNIST, train an MLP classifier, and save model + scaler to disk."""
    from sklearn.datasets import fetch_openml
    from sklearn.neural_network import MLPClassifier
    from sklearn.preprocessing import StandardScaler

    print("Downloading MNIST dataset (first run only, ~55 MB)...")
    mnist = fetch_openml('mnist_784', version=1, as_frame=False, parser='auto')
    X, y = mnist.data, mnist.target

    X_train, y_train = X[:60000], y[:60000]

    print("Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)

    print("Training MLP neural network (this may take a few minutes)...")
    clf = MLPClassifier(
        hidden_layer_sizes=(256, 128),
        activation='relu',
        max_iter=30,
        random_state=42,
        verbose=True,
    )
    clf.fit(X_train_scaled, y_train)

    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(clf, f)
    with open(SCALER_PATH, 'wb') as f:
        pickle.dump(scaler, f)

    print("Model saved!")
    return clf, scaler


def load_or_train_model():
    """Load a pre-trained model from disk, or train one if not found."""
    if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
        print("Loading saved model...")
        with open(MODEL_PATH, 'rb') as f:
            clf = pickle.load(f)
        with open(SCALER_PATH, 'rb') as f:
            scaler = pickle.load(f)
        print("Model loaded.")
        return clf, scaler
    return train_and_save_model()


class DigitRecognizerApp:
    def __init__(self, root: tk.Tk, clf, scaler):
        self.root   = root
        self.clf    = clf
        self.scaler = scaler

        self.root.title("Handwritten Digit Recognizer")
        self.root.resizable(False, False)

        self._build_ui()
        self._reset_canvas()

    # ------------------------------------------------------------------
    # UI construction
    # ------------------------------------------------------------------

    def _build_ui(self):
        # Title label
        tk.Label(
            self.root, text="Draw a digit (0–9)", font=('Arial', 13, 'bold')
        ).pack(pady=(12, 4))

        # Drawing canvas (black background, white strokes)
        self.canvas = tk.Canvas(
            self.root,
            width=CANVAS_SIZE, height=CANVAS_SIZE,
            bg='black', cursor='crosshair',
            highlightthickness=2, highlightbackground='#444'
        )
        self.canvas.pack(padx=16)

        self.canvas.bind('<B1-Motion>',       self._on_drag)
        self.canvas.bind('<ButtonRelease-1>', self._on_release)

        # Button row
        btn_frame = tk.Frame(self.root)
        btn_frame.pack(pady=10)

        tk.Button(
            btn_frame, text='Recognize', command=self._predict,
            width=12, height=2, bg='#4CAF50', fg='white', font=('Arial', 11, 'bold')
        ).pack(side=tk.LEFT, padx=6)

        tk.Button(
            btn_frame, text='Clear', command=self._reset_canvas,
            width=12, height=2, bg='#f44336', fg='white', font=('Arial', 11, 'bold')
        ).pack(side=tk.LEFT, padx=6)

        # Prediction result label
        self.result_var = tk.StringVar(value="Draw a digit and click Recognize")
        tk.Label(
            self.root, textvariable=self.result_var,
            font=('Arial', 15), fg='#222', pady=8
        ).pack()

        # Probability bar chart (10 labels, one per digit)
        prob_frame = tk.LabelFrame(self.root, text='Confidence per digit', padx=8, pady=6)
        prob_frame.pack(padx=16, pady=(0, 14), fill=tk.X)

        self.prob_bars  = []
        self.prob_labels = []
        for digit in range(10):
            row = tk.Frame(prob_frame)
            row.pack(fill=tk.X, pady=1)
            tk.Label(row, text=str(digit), width=2, font=('Courier', 10, 'bold')).pack(side=tk.LEFT)
            bar_bg = tk.Frame(row, bg='#ddd', width=200, height=14)
            bar_bg.pack(side=tk.LEFT, padx=4)
            bar_bg.pack_propagate(False)
            bar = tk.Frame(bar_bg, bg='#2196F3', width=0, height=14)
            bar.pack(side=tk.LEFT)
            pct_lbl = tk.Label(row, text='0.0%', width=6, font=('Arial', 9))
            pct_lbl.pack(side=tk.LEFT)
            self.prob_bars.append(bar)
            self.prob_labels.append(pct_lbl)

    # ------------------------------------------------------------------
    # Canvas drawing helpers
    # ------------------------------------------------------------------

    def _reset_canvas(self):
        """Clear canvas and reset the internal PIL image."""
        self.canvas.delete('all')
        self.pil_image = Image.new('L', (CANVAS_SIZE, CANVAS_SIZE), 0)
        self.pil_draw  = ImageDraw.Draw(self.pil_image)
        self.last_x = self.last_y = None
        self.result_var.set("Draw a digit and click Recognize")
        for bar, lbl in zip(self.prob_bars, self.prob_labels):
            bar.config(width=0)
            lbl.config(text='0.0%')

    def _on_drag(self, event):
        """Paint a thick white stroke on both the tkinter canvas and the PIL image."""
        brush = 14
        x, y = event.x, event.y
        if self.last_x is not None:
            self.canvas.create_line(
                self.last_x, self.last_y, x, y,
                fill='white', width=brush * 2,
                capstyle=tk.ROUND, smooth=True
            )
            self.pil_draw.line(
                [self.last_x, self.last_y, x, y],
                fill=255, width=brush * 2
            )
        self.last_x, self.last_y = x, y

    def _on_release(self, event):
        self.last_x = self.last_y = None

    # ------------------------------------------------------------------
    # Prediction
    # ------------------------------------------------------------------

    def _preprocess(self, img: Image.Image) -> np.ndarray:
        """Center the drawn digit and resize to 28x28 to match MNIST format."""
        arr  = np.array(img)
        rows = np.any(arr > 10, axis=1)
        cols = np.any(arr > 10, axis=0)
        if not rows.any():
            return np.zeros((1, 784), dtype=np.float32)

        rmin, rmax = np.where(rows)[0][[0, -1]]
        cmin, cmax = np.where(cols)[0][[0, -1]]
        cropped = arr[rmin:rmax + 1, cmin:cmax + 1]

        h, w   = cropped.shape
        pad    = max(h, w) // 4
        size   = max(h, w) + pad * 2
        canvas = np.zeros((size, size), dtype=np.uint8)
        y0 = (size - h) // 2
        x0 = (size - w) // 2
        canvas[y0:y0 + h, x0:x0 + w] = cropped

        out = Image.fromarray(canvas).resize((MNIST_SIZE, MNIST_SIZE), Image.LANCZOS)
        return np.array(out, dtype=np.float32).flatten().reshape(1, -1)

    def _predict(self):
        """Center-crop the drawn image to 28×28, run inference, and display results."""
        img_array  = self._preprocess(self.pil_image)
        img_scaled = self.scaler.transform(img_array)

        prediction   = self.clf.predict(img_scaled)[0]
        probabilities = self.clf.predict_proba(img_scaled)[0]
        confidence   = probabilities.max() * 100

        self.result_var.set(f"Predicted digit:  {prediction}    (confidence: {confidence:.1f}%)")

        # Update probability bars
        max_bar_width = 200
        for digit in range(10):
            pct = probabilities[digit] * 100
            bar_w = int(max_bar_width * probabilities[digit])
            color = '#FF5722' if str(digit) == str(prediction) else '#2196F3'
            self.prob_bars[digit].config(width=bar_w, bg=color)
            self.prob_labels[digit].config(text=f'{pct:.1f}%')


# ----------------------------------------------------------------------
# Entry point
# ----------------------------------------------------------------------

if __name__ == '__main__':
    clf, scaler = load_or_train_model()

    root = tk.Tk()
    DigitRecognizerApp(root, clf, scaler)
    root.mainloop()
