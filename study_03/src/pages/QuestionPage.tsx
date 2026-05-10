import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame, CATEGORY_ORDER, selectCurrentQuestion } from '../context/GameContext';
import ProgressBar from '../components/ProgressBar';
import TimerBar from '../components/TimerBar';
import ChoiceButton, { type ChoiceState } from '../components/ChoiceButton';
import MascotSpeech from '../components/MascotSpeech';

const TIMER_SEC = 15;

const CATEGORY_ANIMAL: Record<string, string> = {
  한국사: '🐯', 과학: '🦉', 지리: '🐧', 일반상식: '🦊',
};
const CATEGORY_LABEL_COLOR: Record<string, string> = {
  한국사: 'text-red-500 bg-red-50 dark:bg-red-900/20',
  과학: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
  지리: 'text-green-500 bg-green-50 dark:bg-green-900/20',
  일반상식: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
};
const CATEGORY_BAR_COLOR: Record<string, string> = {
  한국사: 'bg-red-400', 과학: 'bg-blue-400', 지리: 'bg-green-400', 일반상식: 'bg-purple-400',
};

export default function QuestionPage() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();

  const question = selectCurrentQuestion(state);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SEC);
  const answered = selectedIndex !== null;

  const catIndex   = state.currentCategoryIndex;
  const qIndex     = state.currentQuestionIndex;
  const isSpeedMode = state.gameMode === 'speed';
  const isFull     = state.gameMode === 'full';

  const currentCatLen  = (state.shuffledQuestions[catIndex] ?? []).length;
  const isLastQ        = qIndex >= currentCatLen - 1;
  const isLastCat      = catIndex >= CATEGORY_ORDER.length - 1;

  const category  = isSpeedMode ? '스피드 퀴즈' : CATEGORY_ORDER[catIndex];
  const animal    = isSpeedMode ? '🏎️' : CATEGORY_ANIMAL[CATEGORY_ORDER[catIndex]];
  const labelColor = isSpeedMode
    ? 'text-orange-500 bg-orange-50 dark:bg-orange-900/20'
    : CATEGORY_LABEL_COLOR[CATEGORY_ORDER[catIndex]];
  const barColor  = isSpeedMode ? 'bg-orange-400' : CATEGORY_BAR_COLOR[CATEGORY_ORDER[catIndex]];

  const [totalDone, totalQ] = isFull
    ? [catIndex * 10 + qIndex + 1, 40]
    : isSpeedMode
    ? [qIndex + 1, 40]
    : [qIndex + 1, 10];

  useEffect(() => {
    if (!state.nickname || state.shuffledQuestions.length === 0) navigate('/');
  }, [state.nickname, state.shuffledQuestions.length, navigate]);

  // 문제 변경 시 초기화
  useEffect(() => {
    setSelectedIndex(null);
    setHintVisible(false);
    setTimeLeft(TIMER_SEC);
  }, [qIndex, catIndex]);

  const goNext = useCallback(() => {
    if (!answered) return;
    if (isLastQ) {
      if (isFull) navigate('/category-end');
      else { dispatch({ type: 'FINISH_GAME' }); navigate('/result'); }
    } else {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  }, [answered, isLastQ, isFull, dispatch, navigate]);

  // 스피드 타이머
  useEffect(() => {
    if (!isSpeedMode || answered) return;
    if (timeLeft <= 0) {
      // 시간 초과 — 오답 처리
      setSelectedIndex(-1);
      dispatch({
        type: 'ANSWER_QUESTION',
        answer: { question_id: question!.id, selected_index: -1, is_correct: false, time_taken_ms: TIMER_SEC * 1000, hint_used: state.hintUsedForCurrent },
      });
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isSpeedMode, answered]);

  // 키보드: 1~4, Enter
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!question) return;
      if (!answered && ['1','2','3','4'].includes(e.key)) handleSelect(parseInt(e.key) - 1);
      if (answered && e.key === 'Enter') goNext();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, goNext, question]);

  if (!question) return null;

  function handleSelect(idx: number) {
    if (answered || !question) return;
    setSelectedIndex(idx);
    dispatch({
      type: 'ANSWER_QUESTION',
      answer: {
        question_id: question.id,
        selected_index: idx,
        is_correct: idx === question.answer_index,
        time_taken_ms: isSpeedMode ? (TIMER_SEC - timeLeft) * 1000 : 0,
        hint_used: state.hintUsedForCurrent,
      },
    });
  }

  function handleHint() {
    setHintVisible(true);
    dispatch({ type: 'USE_HINT' });
  }

  function getChoiceState(idx: number): ChoiceState {
    if (selectedIndex === null) return 'default';
    if (idx === question!.answer_index) return 'correct';
    if (selectedIndex >= 0 && idx === selectedIndex) return 'wrong';
    return 'default';
  }

  const isCorrect = answered && selectedIndex === question.answer_index;
  const isTimedOut = answered && selectedIndex === -1;
  const nextLabel = isLastQ
    ? (isFull ? (isLastCat ? '결과 보기 🏆' : '다음 라운드 →') : '결과 보기 🏆')
    : '다음 문제 →';

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-7 w-full max-w-lg border-2 border-indigo-100 dark:border-gray-600">

        {/* 헤더 */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${labelColor}`}>
            {animal} {category}
          </span>
          <span className="text-gray-400 dark:text-gray-500 text-sm font-bold">{qIndex + 1} / {currentCatLen}</span>
        </div>

        {/* 타이머 (스피드 모드) */}
        {isSpeedMode && !answered && (
          <div className="mb-3">
            <TimerBar totalSec={TIMER_SEC} timeLeft={timeLeft} />
          </div>
        )}
        {isSpeedMode && answered && <div className="mb-3" />}

        {/* 전체 진행률 */}
        <ProgressBar current={totalDone} total={totalQ} colorClass={barColor} />

        {/* 문제 */}
        <div className="mt-6 mb-5 text-center">
          <div className="text-5xl mb-3 animate-bounce-in">{question.emoji}</div>
          <p className="text-xl font-bold text-gray-800 dark:text-gray-100 leading-snug">
            {question.question}
          </p>
        </div>

        {/* 힌트 */}
        {!answered && !hintVisible && (
          <button
            onClick={handleHint}
            className="w-full text-sm text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl py-2 mb-4 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
          >
            💡 힌트 보기 <span className="opacity-60">(정답 시 −0.5점)</span>
          </button>
        )}
        {hintVisible && !answered && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 mb-4 text-sm text-amber-700 dark:text-amber-300 animate-fade-in">
            💡 {question.hint}
          </div>
        )}

        {/* 보기 */}
        <div className="flex flex-col gap-3" role="group" aria-label="답안 선택">
          {question.choices.map((label, i) => (
            <ChoiceButton
              key={`${question.id}-${i}`}
              index={i}
              label={label}
              state={getChoiceState(i)}
              onClick={() => handleSelect(i)}
              disabled={answered}
              aria-label={`보기 ${i + 1}: ${label}`}
            />
          ))}
        </div>

        {/* 피드백 */}
        {answered && (
          <div className="mt-5">
            {isTimedOut && (
              <div className="text-center text-gray-400 dark:text-gray-500 text-sm mb-2 animate-fade-in">
                ⏰ 시간 초과! 정답은 위에 초록색으로 표시돼요.
              </div>
            )}
            <MascotSpeech
              animal={animal === '🏎️' ? '🦊' : animal}
              text={question.explanation}
              variant={isCorrect ? 'correct' : 'wrong'}
            />
          </div>
        )}

        {/* 다음 버튼 */}
        {answered && (
          <button
            onClick={goNext}
            className="mt-5 w-full bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-bold py-4 rounded-2xl transition-all min-h-[52px] shadow-md animate-fade-in text-lg"
          >
            {nextLabel}
            <span className="text-xs opacity-50 ml-2">Enter</span>
          </button>
        )}
      </div>
    </div>
  );
}
