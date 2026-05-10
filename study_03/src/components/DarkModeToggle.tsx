interface Props {
  dark: boolean;
  onToggle: () => void;
}

export default function DarkModeToggle({ dark, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className="w-11 h-11 rounded-full bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm shadow-md flex items-center justify-center text-lg transition-colors hover:bg-white dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
      aria-label={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}
