# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## study_01 / desktop_version — 데스크톱 손글씨 숫자 인식기

tkinter 기반 GUI 앱. 마우스로 캔버스에 숫자를 그리고 버튼을 눌러 인식.

## How to Run

```powershell
# 콘솔 창 포함 (디버깅용)
python digit_recognizer.py

# 콘솔 창 없이 (일반 실행)
& "C:\Users\byngm\AppData\Local\Programs\Python\Python39\pythonw.exe" digit_recognizer.py
```

또는 `숫자인식기 실행.bat` 더블클릭.

## Dependencies

```
pip install numpy scikit-learn Pillow pandas
```

## Architecture

**`digit_recognizer.py`** — 단일 파일 앱.

- `load_or_train_model()` — `mnist_model.pkl` / `mnist_scaler.pkl` 있으면 로드, 없으면 MNIST 다운로드 후 학습 (첫 실행 시 ~55MB + 수 분 소요)
- `DigitRecognizerApp` — 280×280 캔버스에 그린 후 "Recognize" 클릭 시 28×28 리사이즈 → `MLPClassifier` 예측 → 신뢰도 막대 업데이트
- tkinter 캔버스(표시용)와 PIL 이미지(추론용)를 동시에 유지하는 이중 버퍼 구조
