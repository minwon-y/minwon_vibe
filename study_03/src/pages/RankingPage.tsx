import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { loadRanking, getMyRank, type RankingEntry } from '../services/ranking';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, '0')}`;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const RANK_MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function RankingPage() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();

  const myEntryId = state.startedAt
    ? sessionStorage.getItem(`entryId_${state.startedAt}`)
    : null;

  const allRanking: RankingEntry[] = loadRanking();
  const top100 = allRanking.slice(0, 100);
  const myFullRank = myEntryId ? getMyRank(myEntryId) : null;
  const myInTop100 = myFullRank !== null && myFullRank > 0 && myFullRank <= 100;

  function handleReset() {
    dispatch({ type: 'RESET' });
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-2xl">

        {/* 타이틀 */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🏆</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">전체 랭킹 TOP 100</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            전체 {allRanking.length.toLocaleString()}명
          </p>
        </div>

        {allRanking.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-gray-500 py-12">
            아직 기록이 없습니다.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 dark:text-gray-500 border-b dark:border-gray-700 text-left">
                  <th className="pb-3 pr-3 font-normal w-10">순위</th>
                  <th className="pb-3 pr-3 font-normal">닉네임</th>
                  <th className="pb-3 pr-3 font-normal text-right">총점</th>
                  <th className="pb-3 pr-3 font-normal text-right">소요시간</th>
                  <th className="pb-3 font-normal text-right">날짜</th>
                </tr>
              </thead>
              <tbody>
                {top100.map((entry, i) => {
                  const rank = i + 1;
                  const isMe = entry.id === myEntryId;
                  return (
                    <tr
                      key={entry.id}
                      className={`border-b dark:border-gray-700 last:border-0 transition-colors ${
                        isMe
                          ? 'bg-yellow-50 dark:bg-yellow-900/20'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/40'
                      }`}
                    >
                      <td className="py-2.5 pr-3">
                        <span className="font-bold text-gray-500 dark:text-gray-400 text-base">
                          {RANK_MEDAL[rank] ?? rank}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3">
                        <span className={`font-semibold ${
                          isMe
                            ? 'text-yellow-700 dark:text-yellow-400'
                            : 'text-gray-800 dark:text-gray-100'
                        }`}>
                          {entry.nickname}
                          {isMe && (
                            <span className="ml-1.5 text-xs px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 rounded-full">
                              나
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3 text-right">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {entry.totalScore}
                        </span>
                        <span className="text-gray-400 text-xs"> /40</span>
                      </td>
                      <td className="py-2.5 pr-3 text-right text-gray-500 dark:text-gray-400 tabular-nums">
                        {formatTime(entry.playTimeSec)}
                      </td>
                      <td className="py-2.5 text-right text-gray-400 dark:text-gray-500">
                        {formatDate(entry.playedAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 내 순위가 TOP 100 밖일 때 별도 표시 */}
        {myFullRank && !myInTop100 && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl text-sm text-center animate-fade-in">
            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
              내 순위: {myFullRank.toLocaleString()}위
            </span>
            <span className="text-gray-400 text-xs ml-1">
              / {allRanking.length.toLocaleString()}명
            </span>
          </div>
        )}

        <button
          onClick={handleReset}
          className="mt-5 w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[44px]"
          aria-label="처음으로 돌아가기"
        >
          다시하기
        </button>
      </div>
    </div>
  );
}
