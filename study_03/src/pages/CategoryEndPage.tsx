import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame, CATEGORY_ORDER, selectCategoryScore } from '../context/GameContext';

const CATEGORY_ANIMAL: Record<string, string> = {
  한국사: '🐯', 과학: '🦉', 지리: '🐧', 일반상식: '🦊',
};

export default function CategoryEndPage() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();

  const catIndex  = state.currentCategoryIndex;
  const category  = CATEGORY_ORDER[catIndex];
  const score     = selectCategoryScore(state, catIndex);
  const isLastCat = catIndex >= CATEGORY_ORDER.length - 1;
  const animal    = CATEGORY_ANIMAL[category];

  useEffect(() => {
    if (!state.nickname) navigate('/');
  }, [state.nickname, navigate]);

  function handleNext() {
    if (isLastCat) {
      dispatch({ type: 'FINISH_GAME' });
      navigate('/result');
    } else {
      dispatch({ type: 'NEXT_CATEGORY' });
      navigate('/category-intro');
    }
  }

  const stars   = score >= 9 ? '⭐⭐⭐' : score >= 7 ? '⭐⭐' : score >= 5 ? '⭐' : '';
  const comment = score >= 9 ? '완벽해! 천재 등장~! 🎊'
                : score >= 7 ? '잘했어! 꽤 많이 알고 있구나! 👍'
                : score >= 5 ? '절반 넘었어! 조금만 더 공부하면 될 것 같아! 💪'
                : '괜찮아, 다음엔 더 잘할 수 있어! 화이팅! 🌱';

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10 w-full max-w-md text-center border-2 border-dashed border-indigo-200 dark:border-gray-600">

        <div className="text-7xl mb-3 animate-bounce-in">{animal}</div>
        <p className="text-gray-400 dark:text-gray-500 mb-1">Round {catIndex + 1} 완료!</p>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">{category}</h2>

        <p className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
          {score}
          <span className="text-3xl text-gray-300 dark:text-gray-600"> / 10</span>
        </p>

        {stars && <p className="text-3xl mt-2 mb-3">{stars}</p>}

        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl px-5 py-3 mb-8 text-gray-600 dark:text-gray-300">
          {comment}
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-bold py-4 rounded-2xl transition-all text-xl min-h-[56px] shadow-md"
          aria-label={isLastCat ? '최종 결과 보기' : '다음 카테고리로 이동'}
        >
          {isLastCat ? '최종 결과 보기 🏆' : '다음 라운드 →'}
        </button>
      </div>
    </div>
  );
}
