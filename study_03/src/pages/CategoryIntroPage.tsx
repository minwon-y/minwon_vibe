import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame, CATEGORY_ORDER } from '../context/GameContext';

const CATEGORY_META = {
  한국사:   { animal: '🐯', badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',    desc: '고대부터 근현대까지', greeting: '어흥! 역사는 나한테 맡겨! 같이 풀어보자구~ 🐾' },
  과학:     { animal: '🦉', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',  desc: '물리 · 화학 · 생물 · 지구과학', greeting: '후후~ 과학은 재미있어! 차근차근 생각해봐요 🔭' },
  지리:     { animal: '🐧', badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', desc: '세계의 땅과 나라들', greeting: '뒤뚱뒤뚱~ 세계 여행을 시작해볼까요? 🌍' },
  일반상식: { animal: '🦊', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', desc: '알아두면 쓸모 있는 상식', greeting: '저는 뭐든 다 알고 있어요! 따라와봐~ 🌟' },
} as const;

export default function CategoryIntroPage() {
  const { state } = useGame();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  const catIndex = state.currentCategoryIndex;
  const category = CATEGORY_ORDER[catIndex];
  const meta = CATEGORY_META[category];

  useEffect(() => {
    if (!state.nickname) { navigate('/'); return; }
  }, [state.nickname, navigate]);

  useEffect(() => {
    if (countdown <= 0) { navigate('/quiz'); return; }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10 w-full max-w-md text-center border-2 border-dashed border-indigo-200 dark:border-gray-600">

        <div className={`inline-block px-5 py-1.5 rounded-full text-sm font-bold mb-6 ${meta.badge}`}>
          Round {catIndex + 1} / {CATEGORY_ORDER.length}
        </div>

        <div className="text-8xl mb-4 animate-bounce-in">{meta.animal}</div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{category}</h2>
        <p className="text-gray-400 dark:text-gray-500 mb-4">{meta.desc} — 10문제</p>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl px-5 py-4 mb-6 text-gray-600 dark:text-gray-300 text-base">
          {meta.greeting}
        </div>

        <p className="text-gray-300 dark:text-gray-600 text-sm mb-4">
          {countdown > 0 ? `${countdown}초 후 자동 시작...` : '고고!'}
        </p>

        <button
          onClick={() => navigate('/quiz')}
          className="w-full bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-bold py-4 rounded-2xl transition-all text-xl min-h-[56px] shadow-md"
          aria-label="지금 바로 시작"
        >
          지금 시작! ✨
        </button>
      </div>
    </div>
  );
}
