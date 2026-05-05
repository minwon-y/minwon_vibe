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

| 폴더 | 주제 |
|------|------|
| [study_01](study_01/CLAUDE.md) | 손글씨 숫자 인식 (MNIST + tkinter) |
| [study_02](study_02/CLAUDE.md) | My Daily Todo (순수 HTML/CSS/JS 할 일 관리 웹앱) |

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
