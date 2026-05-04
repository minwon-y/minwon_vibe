# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## study_01 — 손글씨 숫자 인식기

마우스로 숫자를 그리면 AI가 0~9 중 어떤 숫자인지 인식하는 앱.  
동일한 기능을 데스크톱(tkinter)과 웹(브라우저) 두 가지 버전으로 개발.

## 구조

```
study_01/
├── desktop_version/   # tkinter GUI 앱
│   └── CLAUDE.md
├── web_version/       # 브라우저 기반 앱
│   └── CLAUDE.md
└── CLAUDE.md          # 이 파일
```

## 공통 모델

두 버전 모두 MNIST 데이터셋으로 학습한 MLP 분류기를 사용.  
모델 파일(`*.pkl`)은 용량이 크므로 Git에서 제외 — 첫 실행 시 자동 생성.
