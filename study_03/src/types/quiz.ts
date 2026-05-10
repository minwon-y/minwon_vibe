export type Category = '한국사' | '과학' | '지리' | '일반상식';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'full' | 'category' | 'speed';

export interface Question {
  id: string;
  category: Category;
  emoji: string;
  question: string;
  choices: [string, string, string, string];
  answer_index: 0 | 1 | 2 | 3;
  hint: string;
  explanation: string;
  difficulty: Difficulty;
}

export interface UserAnswer {
  question_id: string;
  selected_index: number; // -1 = 시간 초과
  is_correct: boolean;
  time_taken_ms: number;
  hint_used: boolean;
}

export interface GameSession {
  nickname: string;
  answers: UserAnswer[];
  started_at: number;
  finished_at?: number;
}
