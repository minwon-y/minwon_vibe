# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 공통 환경

- Python 3.9.10 — `C:\Users\byngm\AppData\Local\Programs\Python\Python39\python.exe`
- pythonw (콘솔 없이 실행) — `C:\Users\byngm\AppData\Local\Programs\Python\Python39\pythonw.exe`
- Git — `C:\Program Files\Git\bin\git.exe` (PATH 미등록 → 매 세션마다 아래 명령 필요)

```powershell
$env:PATH += ";C:\Program Files\Git\bin"
```

## Git 규칙

- 원격 저장소: https://github.com/minwon-y/minwon_vibe.git (branch: `master`)
- 커밋 후 푸시까지 함께 진행

```powershell
$env:PATH += ";C:\Program Files\Git\bin"
git add .
git commit -m "message"
git push
```

- `*.pkl` (모델 바이너리), `.claude/` (Claude 내부 설정) 는 `.gitignore` 로 제외

## 프로젝트 관리 규칙

- 새 프로젝트는 `study_NN/` 폴더로 추가 (예: `study_02/`, `study_03/`)
- 각 폴더 안에 반드시 `CLAUDE.md` 를 만들어 아래 템플릿을 따를 것
- 새 프로젝트 시작 시 루트 CLAUDE.md 의 **프로젝트 목록** 업데이트

## 프로젝트 목록

| 폴더 | 주제 | 상태 |
|------|------|------|
| [study_01](study_01/CLAUDE.md) | 손글씨 숫자 인식 (MNIST + tkinter + Flask) | 데스크톱 완성 / 웹 개발 중 |
| [study_02](study_02/CLAUDE.md) | My Daily Todo (순수 HTML/CSS/JS 할 일 관리 웹앱) | 완성 |
| [study_03](study_03/CLAUDE.md) | 상식 퀴즈 게임 (React + Vite + TypeScript + Tailwind) | 1단계 골격 완성 |

## study_01 — 손글씨 숫자 인식기

두 가지 버전이 같은 MNIST MLP 모델(pkl)을 공유한다.

### 데스크톱 버전 실행
```powershell
cd study_01/desktop_version
python digit_recognizer.py            # 콘솔 있음
# 또는 더블클릭: 숫자인식기 실행.bat  # 콘솔 없음
```

### 웹 버전 실행 (개발 중)
```powershell
cd study_01/web_version
pip install flask numpy scikit-learn pillow
python app.py    # http://localhost:5000
```

### 의존성
```
numpy, scikit-learn, Pillow, pandas   # 공통
flask                                  # 웹 버전 추가
```

### 아키텍처
- `desktop_version/digit_recognizer.py` — 단일 파일 앱. `load_or_train_model()`이 pkl 없으면 MNIST 다운로드(~55 MB) 후 학습(수 분 소요). `DigitRecognizerApp`은 280×280 tkinter 캔버스로 입력받아 28×28로 리사이즈 후 MLPClassifier에 전달. tkinter 캔버스(표시용)와 PIL Image(추론용)를 이중 버퍼로 운용.
- `web_version/app.py` — Flask 서버. 데스크톱 버전의 pkl을 우선 참조하고 없으면 자체 경로에서 찾음. HTML5 Canvas 드로잉 → base64 → PIL → 28×28 → MLPClassifier.
- `web_version/templates/index.html` — 단일 페이지 UI (Flask Jinja2 템플릿).

## study_02 — My Daily Todo

### 실행
```
study_02/index.html 을 브라우저로 열기 (서버 불필요)
```
`index.html`은 `<meta http-equiv="refresh">`로 `web_version/`에 즉시 리다이렉트된다. 실제 앱 파일은 `web_version/` 안에 있다.

### 아키텍처
- `web_version/index.html` — 앱 HTML 구조 (모바일·데스크톱 2컬럼 반응형)
- `web_version/style.css` — CSS 변수 기반 파스텔 테마, 다크모드(`body.dark`) 지원
- `web_version/app.js` — 전체 앱 로직. 상태(`todos[]`, `currentFilter`, `currentSort`)를 `localStorage('myDailyTodos')`에 즉시 저장. 카테고리 자동 감지는 키워드 사전(`KEYWORDS`)으로 구현.
- 카테고리: 업무(🐻) / 개인(🐰) / 공부(🦔)
- 외부 라이브러리 없음, Google Fonts(Jua)만 CDN 사용

## 각 study 폴더 CLAUDE.md 작성 템플릿

```markdown
# CLAUDE.md

## study_NN — 프로젝트 이름

한 줄 설명.

## How to Run
(실행 명령어)

## Dependencies
(pip install ...)

## Architecture
(주요 파일 및 구조 설명)
```
