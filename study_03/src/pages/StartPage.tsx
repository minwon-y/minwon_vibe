import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

export default function StartPage() {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const { dispatch } = useGame();
  const navigate = useNavigate();

  function validate(value: string): string {
    const trimmed = value.trim();
    if (trimmed.length < 2) return '닉네임은 2자 이상이어야 해요! 🥺';
    if (trimmed.length > 12) return '닉네임은 12자 이하여야 해요! 😅';
    return '';
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = nickname.trim();
    const err = validate(trimmed);
    if (err) { setError(err); return; }
    dispatch({ type: 'SET_NICKNAME', nickname: trimmed });
    navigate('/mode');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10 w-full max-w-md text-center border-2 border-dashed border-indigo-200 dark:border-gray-600">

        <div className="text-7xl mb-4 animate-bounce-in">🧠</div>
        <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">상식 퀴즈!</h1>
        <p className="text-gray-400 dark:text-gray-500 mb-2">한국사 🐯 · 과학 🦉 · 지리 🐧 · 일반상식 🦊</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mb-8">총 40문제에 도전해봐요!</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            aria-label="닉네임 입력"
            placeholder="닉네임을 입력하세요 (2~12자)"
            value={nickname}
            onChange={(e) => { setNickname(e.target.value); setError(''); }}
            maxLength={14}
            className="w-full border-2 border-indigo-200 dark:border-gray-600 rounded-2xl px-5 py-4 text-center text-xl
              focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900
              bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
              placeholder-gray-300 dark:placeholder-gray-500 mb-3 min-h-[56px]"
          />
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-bold py-4 rounded-2xl transition-all text-xl mt-1 min-h-[56px] shadow-md"
          >
            다음 →
          </button>
        </form>
      </div>
    </div>
  );
}
