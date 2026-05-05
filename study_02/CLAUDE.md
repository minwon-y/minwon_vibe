# CLAUDE.md

## study_02 — My Daily Todo

카테고리·필터·진행률을 갖춘 개인용 할 일 관리 웹앱 (순수 HTML/CSS/JS).

## How to Run

`index.html` 을 브라우저에서 직접 열면 됩니다 (서버 불필요).

## Dependencies

없음 — 외부 라이브러리 미사용.

## Architecture

```
study_02/
├── index.html   마크업 (레이아웃 구조)
├── style.css    스타일 (CSS 변수, 반응형)
└── app.js       동작 로직
```

- 카테고리: 업무(파랑 `#3b82f6`) / 개인(초록 `#22c55e`) / 공부(주황 `#f97316`)
- 상태: localStorage 에 저장 (추후 구현 예정)
