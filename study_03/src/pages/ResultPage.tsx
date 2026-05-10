import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame, CATEGORY_ORDER, selectCategoryScore, selectTotalScore } from '../context/GameContext';
import { addEntry, loadRanking, getMyRank } from '../services/ranking';

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function grade(score: number) {
  if (score >= 36) return { label: '상식왕 👑',        color: 'text-yellow-500', mascot: '🦁' };
  if (score >= 28) return { label: '상식인 🎓',         color: 'text-indigo-500 dark:text-indigo-400', mascot: '🦊' };
  if (score >= 20) return { label: '상식 견습생 📚',    color: 'text-blue-500 dark:text-blue-400', mascot: '🐧' };
  return              { label: '상식 도전자 🌱',         color: 'text-green-500 dark:text-green-400', mascot: '🐣' };
}

const CATEGORY_BADGE: Record<string, string> = {
  한국사:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  과학:     'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  지리:     'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  일반상식: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

const CATEGORY_ANIMAL: Record<string, string> = {
  한국사: '🐯', 과학: '🦉', 지리: '🐧', 일반상식: '🦊',
};

export default function ResultPage() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  const [totalEntries, setTotalEntries] = useState(0);
  const [myRank, setMyRank] = useState<number | null>(null);

  useEffect(() => {
    if (!state.nickname) { navigate('/'); return; }
  }, [state.nickname, navigate]);

  const totalScore = selectTotalScore(state);
  const playTimeSec = state.finishedAt && state.startedAt
    ? Math.floor((state.finishedAt - state.startedAt) / 1000) : 0;
  const { label, color, mascot } = grade(totalScore);

  useEffect(() => {
    if (!state.finishedAt || !state.nickname || !state.startedAt) return;
    const guardKey = `ranked_${state.startedAt}`;
    const existingId = sessionStorage.getItem(`entryId_${state.startedAt}`);
    if (sessionStorage.getItem(guardKey)) {
      if (existingId) { setMyRank(getMyRank(existingId)); setTotalEntries(loadRanking().length); }
      return;
    }
    sessionStorage.setItem(guardKey, '1');
    const categoryScores: Record<string, number> = {};
    CATEGORY_ORDER.forEach((cat, i) => { categoryScores[cat] = selectCategoryScore(state, i); });
    const entry = addEntry({ nickname: state.nickname, totalScore, categoryScores, playTimeSec, playedAt: new Date().toISOString() });
    sessionStorage.setItem(`entryId_${state.startedAt}`, entry.id);
    setMyRank(getMyRank(entry.id));
    setTotalEntries(loadRanking().length);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleReset() { dispatch({ type: 'RESET' }); navigate('/'); }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 w-full max-w-md border-2 border-dashed border-indigo-200 dark:border-gray-600">

        <div className="text-center mb-6">
          <div className="text-7xl mb-3 animate-bounce-in">{mascot}</div>
          <p className={`text-3xl font-bold mb-1 ${color}`}>{label}</p>
          <p className="text-gray-400 dark:text-gray-500">{state.nickname} 님의 최종 점수</p>
          <p className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mt-3">
            {totalScore}
            <span className="text-3xl text-gray-300 dark:text-gray-600"> / 40</span>
          </p>
          {playTimeSec > 0 && (
            <p className="text-gray-400 dark:text-gray-500 mt-1">⏱ {formatTime(playTimeSec)}</p>
          )}
          {myRank && (
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              전체 랭킹 <span className="font-bold text-indigo-500">{myRank.toLocaleString()}</span> / {totalEntries.toLocaleString()}위
            </p>
          )}
        </div>

        <table className="w-full text-base mb-6">
          <thead>
            <tr className="text-gray-300 dark:text-gray-600 border-b dark:border-gray-700">
              <th className="text-left pb-2 font-normal">카테고리</th>
              <th className="text-right pb-2 font-normal">점수</th>
            </tr>
          </thead>
          <tbody>
            {CATEGORY_ORDER.map((cat, i) => (
              <tr key={cat} className="border-b dark:border-gray-700 last:border-0">
                <td className="py-2.5">
                  <span className={`inline-block px-3 py-0.5 rounded-full text-sm font-bold ${CATEGORY_BADGE[cat]}`}>
                    {CATEGORY_ANIMAL[cat]} {cat}
                  </span>
                </td>
                <td className="py-2.5 text-right font-bold text-gray-700 dark:text-gray-200 text-lg">
                  {selectCategoryScore(state, i)} / 10
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex gap-3">
          <button onClick={handleReset}
            className="flex-1 border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-bold py-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95 min-h-[52px]">
            다시하기
          </button>
          <button onClick={() => navigate('/ranking')}
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 min-h-[52px] shadow-md">
            랭킹 보기 🏆
          </button>
        </div>
      </div>
    </div>
  );
}
