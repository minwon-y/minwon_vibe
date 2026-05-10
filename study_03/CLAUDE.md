# CLAUDE.md

## study_03 — 상식 퀴즈 게임

한국사·과학·지리·일반상식 4개 카테고리, 카테고리당 10문제(총 40문제)를 푸는 웹 퀴즈 게임.

## How to Run

```powershell
cd study_03
npm install
npm run dev   # http://localhost:5173
```

## Dependencies

```
react, react-dom, react-router-dom
tailwindcss (@tailwindcss/vite 플러그인 방식)
vite, typescript
```

## Architecture

**라우팅 플로우**
```
/ (StartPage)
  → /category-intro?round=0  (CategoryIntroPage)
  → /quiz?round=0            (QuestionPage)
  → /category-end?round=0   (CategoryEndPage)
  → /category-intro?round=1  ... (round 1~3 반복)
  → /result                  (ResultPage)
  → /ranking                 (RankingPage)
```

**주요 파일**
- `src/types/quiz.ts` — `Question`, `UserAnswer`, `GameSession`, `RankingEntry` 인터페이스. `Category`/`Difficulty` 유니온 타입.
- `src/data/questions.json` — 40문제 (카테고리별 10문제, easy 4/medium 4/hard 2 비율)
- `src/components/ProgressBar.tsx` — current/total props로 진행률 표시
- `src/components/ChoiceButton.tsx` — `ChoiceState('default'|'selected'|'correct'|'wrong')`에 따라 색상 변경
- 닉네임은 `sessionStorage('nickname')`, 랭킹은 `localStorage('quizRanking')`에 저장

**현재 단계 (3단계 완성)**
- 게임 로직, 즉시 피드백, 랭킹 시스템, UI 폴리싱 모두 구현 완료

## 문제 작성 할루시네이션 검증 체크리스트

questions.json에 문제를 추가하거나 수정할 때 아래 4가지를 반드시 확인한다.

1. **정답이 하나뿐인가?**
   - 다른 해석이 가능한 경우 조건을 명시한다
   - 예: "면적 기준", "2024년 기준", "대한민국 기준"

2. **최상급 표현에 기준이 있는가?**
   - "가장 큰", "최초의", "세계 최대" 등의 표현에는 측정 기준을 명시한다
   - 예: "육지 면적 기준 세계 최대", "상업 운항 기준 최초"

3. **시간과 범위가 명확한가?**
   - 변할 수 있는 정보(인구, 순위, 기록 등)는 시점을 명시한다
   - 지리적·분류적 범위를 한정한다
   - 예: "2023년 기준", "동남아시아 내륙국 중"

4. **교차 검증했는가?**
   - 의심스러운 정보는 2개 이상의 출처를 확인한다
   - 논란이 있는 내용은 주류 학설 기준으로 작성한다
   - 해설(explanation)에 판단 근거를 1줄 이상 남긴다
