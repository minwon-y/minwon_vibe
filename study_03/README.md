# 상식 퀴즈 게임

한국사 · 과학 · 지리 · 일반상식 4개 카테고리에서 카테고리당 10문제씩, 총 40문제를 풀어보는 웹 퀴즈 게임입니다.
매 게임마다 카테고리 내 문제 순서가 랜덤으로 섞이며, 답안 선택 즉시 정답 여부와 해설을 확인할 수 있습니다.
게임 결과는 localStorage에 저장되어 전체 랭킹을 조회할 수 있습니다.

## 실행 방법

```bash
npm install
npm run dev   # http://localhost:5173
```

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 19 + TypeScript |
| 빌드 | Vite 8 |
| 스타일 | Tailwind CSS v4 (`@tailwindcss/vite`) |
| 라우팅 | react-router-dom v7 |
| 상태 관리 | React Context + useReducer (외부 라이브러리 없음) |
| 데이터 저장 | localStorage (랭킹), sessionStorage (세션 가드) |

## 폴더 구조

```
src/
  context/
    GameContext.tsx       # GameProvider, useGame, 셀렉터, 액션
  services/
    ranking.ts            # 랭킹 CRUD (localStorage, 최대 500개)
  hooks/
    useDarkMode.ts        # 다크모드 토글 + 퍼시스턴스
  data/
    questions.json        # 40문제 (카테고리당 10개, easy·medium·hard 비율)
  types/
    quiz.ts               # Question, UserAnswer, GameSession
  pages/
    StartPage.tsx         # 닉네임 입력 (2~12자 검증)
    CategoryIntroPage.tsx # 라운드 안내 + 3초 자동 시작
    QuestionPage.tsx      # 문제 풀이 + 즉시 피드백 + 키보드(1~4, Enter)
    CategoryEndPage.tsx   # 카테고리 점수 표시
    ResultPage.tsx        # 총점 / 등급 / 소요시간 / 랭킹 순위
    RankingPage.tsx       # TOP 100 표 + 본인 강조 + 100위 밖 별도 표시
  components/
    ProgressBar.tsx       # 카테고리 컬러 진행률 바
    ChoiceButton.tsx      # 정답(✓ 초록 펄스) / 오답(✗ 빨강 흔들림) 애니메이션
    DarkModeToggle.tsx    # 라이트/다크 모드 전환 버튼
```

## 향후 확장 아이디어

1. **타임어택 모드** — 문제당 30초 제한 타이머 추가, 남은 시간에 따라 보너스 점수 부여
2. **온라인 랭킹** — Express + SQLite 백엔드(`server/`)로 전환해 기기 간 랭킹 공유
3. **문제 에디터** — 관리자 페이지에서 questions.json을 브라우저에서 직접 편집·추가
