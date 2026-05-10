import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GameMode } from '../types/quiz';
import { useGame, CATEGORY_ORDER } from '../context/GameContext';

const MODES: { mode: GameMode; emoji: string; title: string; desc: string; color: string }[] = [
  { mode: 'full',     emoji: '🌟', title: '전체 플레이',   desc: '4개 카테고리를 순서대로\n한국사 → 과학 → 지리 → 일반상식',   color: 'border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20' },
  { mode: 'category', emoji: '🎯', title: '카테고리 선택', desc: '원하는 카테고리 하나만\n골라서 10문제 도전!',                  color: 'border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20' },
  { mode: 'speed',    emoji: '⚡', title: '스피드 퀴즈',   desc: '40문제 랜덤 순서로\n문제당 15초 제한!',                        color: 'border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20' },
];

const CATEGORY_META = [
  { emoji: '🐯', label: '한국사',   color: 'border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20' },
  { emoji: '🦉', label: '과학',     color: 'border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20' },
  { emoji: '🐧', label: '지리',     color: 'border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20' },
  { emoji: '🦊', label: '일반상식', color: 'border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20' },
];

export default function ModePage() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [selectedCatIdx, setSelectedCatIdx] = useState<number | null>(null);

  if (!state.nickname) { navigate('/'); return null; }

  function handleStart() {
    if (!selectedMode) return;
    if (selectedMode === 'category' && selectedCatIdx === null) return;
    dispatch({ type: 'START_GAME', gameMode: selectedMode, selectedCategoryIndex: selectedCatIdx ?? undefined });
    if (selectedMode === 'speed') navigate('/quiz');
    else navigate('/category-intro');
  }

  const canStart = selectedMode !== null && (selectedMode !== 'category' || selectedCatIdx !== null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 w-full max-w-lg border-2 border-dashed border-indigo-200 dark:border-gray-600">

        <div className="text-center mb-6">
          <p className="text-gray-400 dark:text-gray-500 mb-1">반가워요, {state.nickname}!</p>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">어떤 방식으로 플레이할까요?</h2>
        </div>

        {/* 모드 선택 */}
        <div className="flex flex-col gap-3 mb-5">
          {MODES.map(({ mode, emoji, title, desc, color }) => (
            <button
              key={mode}
              onClick={() => { setSelectedMode(mode); setSelectedCatIdx(null); }}
              className={`text-left border-2 rounded-2xl px-5 py-4 transition-all active:scale-95
                ${selectedMode === mode
                  ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'
                  : `border-gray-200 dark:border-gray-600 ${color}`}
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{emoji}</span>
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-100 text-lg">{title}</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm whitespace-pre-line">{desc}</p>
                </div>
                {selectedMode === mode && <span className="ml-auto text-indigo-500 text-xl">✓</span>}
              </div>
            </button>
          ))}
        </div>

        {/* 카테고리 선택 (category 모드일 때만) */}
        {selectedMode === 'category' && (
          <div className="mb-5 animate-fade-in">
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 text-center">카테고리를 선택하세요</p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORY_META.map(({ emoji, label, color }, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCatIdx(idx)}
                  className={`border-2 rounded-2xl px-4 py-3 text-center transition-all active:scale-95
                    ${selectedCatIdx === idx
                      ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'
                      : `border-gray-200 dark:border-gray-600 ${color}`}
                  `}
                >
                  <div className="text-2xl mb-1">{emoji}</div>
                  <div className="font-bold text-gray-800 dark:text-gray-100 text-sm">{label}</div>
                  <div className="text-xs text-gray-400">{CATEGORY_ORDER[idx]}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleStart}
          disabled={!canStart}
          className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 text-xl min-h-[56px] shadow-md"
        >
          시작! 🚀
        </button>
      </div>
    </div>
  );
}
