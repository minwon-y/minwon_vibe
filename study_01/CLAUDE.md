# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## study_01 — Handwritten Digit Recognizer

마우스로 숫자를 그리면 AI가 0~9 중 어떤 숫자인지 인식하는 tkinter GUI 앱.

## How to Run

```powershell
# Console visible (debugging)
python digit_recognizer.py

# No console window (normal use)
& "C:\Users\byngm\AppData\Local\Programs\Python\Python39\pythonw.exe" digit_recognizer.py
```

또는 `숫자인식기 실행.bat` 더블클릭.

## Dependencies

```
pip install numpy scikit-learn Pillow pandas
```

## Architecture

**`digit_recognizer.py`** — 단일 파일 앱.

- `load_or_train_model()` — `mnist_model.pkl` / `mnist_scaler.pkl` 이 있으면 로드, 없으면 MNIST 다운로드 후 학습 (첫 실행 시 ~55MB 다운로드 + 수 분 소요). 모델 파일은 `.gitignore` 로 Git 제외.
- `DigitRecognizerApp` — 280×280 검은 캔버스에 그린 후 "Recognize" 클릭 시 28×28로 리사이즈 → `MLPClassifier` 로 예측 → 결과 및 신뢰도 막대 업데이트.
- tkinter 캔버스(표시용)와 PIL 이미지(추론용)를 동시에 유지하는 이중 버퍼 구조.
