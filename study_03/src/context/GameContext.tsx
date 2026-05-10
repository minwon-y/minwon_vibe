import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Question, UserAnswer, Category, GameMode } from '../types/quiz';
import rawQuestions from '../data/questions.json';

export const CATEGORY_ORDER: Category[] = ['한국사', '과학', '지리', '일반상식'];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── 상태 ────────────────────────────────────────────────────────────────────

export interface GameState {
  nickname: string;
  gameMode: GameMode;
  currentCategoryIndex: number;
  currentQuestionIndex: number;
  shuffledQuestions: Question[][];
  answers: UserAnswer[];
  startedAt: number;
  finishedAt: number | null;
  hintUsedForCurrent: boolean;
}

const INITIAL_STATE: GameState = {
  nickname: '',
  gameMode: 'full',
  currentCategoryIndex: 0,
  currentQuestionIndex: 0,
  shuffledQuestions: [],
  answers: [],
  startedAt: 0,
  finishedAt: null,
  hintUsedForCurrent: false,
};

// ── 액션 ────────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_NICKNAME'; nickname: string }
  | { type: 'START_GAME'; gameMode: GameMode; selectedCategoryIndex?: number }
  | { type: 'USE_HINT' }
  | { type: 'ANSWER_QUESTION'; answer: UserAnswer }
  | { type: 'NEXT_QUESTION' }
  | { type: 'NEXT_CATEGORY' }
  | { type: 'FINISH_GAME' }
  | { type: 'RESET' };

// ── 리듀서 ──────────────────────────────────────────────────────────────────

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_NICKNAME':
      return { ...state, nickname: action.nickname };

    case 'START_GAME': {
      const all = rawQuestions as Question[];
      let shuffledQuestions: Question[][];
      let currentCategoryIndex = 0;

      if (action.gameMode === 'full') {
        shuffledQuestions = CATEGORY_ORDER.map((cat) =>
          shuffle(all.filter((q) => q.category === cat))
        );
      } else if (action.gameMode === 'category') {
        const idx = action.selectedCategoryIndex ?? 0;
        shuffledQuestions = CATEGORY_ORDER.map((cat, i) =>
          i === idx ? shuffle(all.filter((q) => q.category === cat)) : []
        );
        currentCategoryIndex = idx;
      } else {
        // speed: 전체 40문제 랜덤 섞어서 하나의 배열로
        shuffledQuestions = [shuffle(all)];
      }

      return {
        ...INITIAL_STATE,
        nickname: state.nickname,
        gameMode: action.gameMode,
        shuffledQuestions,
        currentCategoryIndex,
        startedAt: Date.now(),
      };
    }

    case 'USE_HINT':
      return { ...state, hintUsedForCurrent: true };

    case 'ANSWER_QUESTION':
      return { ...state, answers: [...state.answers, action.answer] };

    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        hintUsedForCurrent: false,
      };

    case 'NEXT_CATEGORY':
      return {
        ...state,
        currentCategoryIndex: state.currentCategoryIndex + 1,
        currentQuestionIndex: 0,
        hintUsedForCurrent: false,
      };

    case 'FINISH_GAME':
      return { ...state, finishedAt: Date.now() };

    case 'RESET':
      return INITIAL_STATE;

    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────────────────────

interface ContextValue {
  state: GameState;
  dispatch: React.Dispatch<Action>;
}

const GameContext = createContext<ContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame(): ContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}

// ── 셀렉터 ──────────────────────────────────────────────────────────────────

export function selectCurrentQuestion(state: GameState): Question | null {
  const cat = state.shuffledQuestions[state.currentCategoryIndex];
  return cat?.[state.currentQuestionIndex] ?? null;
}

/** 점수: 정답 = 1점, 힌트 사용 후 정답 = 0.5점 */
export function selectCategoryScore(state: GameState, categoryIndex: number): number {
  if (state.gameMode === 'speed') {
    return state.answers.reduce((s, a) => s + (a.is_correct ? (a.hint_used ? 0.5 : 1) : 0), 0);
  }
  const cat = state.shuffledQuestions[categoryIndex];
  if (!cat || cat.length === 0) return 0;
  const ids = new Set(cat.map((q) => q.id));
  return state.answers.reduce((s, a) => {
    if (!ids.has(a.question_id) || !a.is_correct) return s;
    return s + (a.hint_used ? 0.5 : 1);
  }, 0);
}

export function selectTotalScore(state: GameState): number {
  return state.answers.reduce((s, a) => s + (a.is_correct ? (a.hint_used ? 0.5 : 1) : 0), 0);
}
