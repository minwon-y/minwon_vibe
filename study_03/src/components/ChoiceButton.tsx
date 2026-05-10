export type ChoiceState = 'default' | 'selected' | 'correct' | 'wrong';

const LABELS = ['①', '②', '③', '④'];

const STATE_CLASSES: Record<ChoiceState, string> = {
  default:
    'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-800 dark:text-gray-100',
  selected:
    'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300',
  correct:
    'border-green-400 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 animate-pulse-once',
  wrong:
    'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 animate-shake',
};

const STATE_ICON: Partial<Record<ChoiceState, { symbol: string; color: string }>> = {
  correct: { symbol: '✓', color: 'text-green-600 dark:text-green-400' },
  wrong:   { symbol: '✗', color: 'text-red-600 dark:text-red-400' },
};

interface Props {
  index: number;
  label: string;
  state: ChoiceState;
  onClick: () => void;
  disabled?: boolean;
  'aria-label'?: string;
}

export default function ChoiceButton({
  index,
  label,
  state,
  onClick,
  disabled,
  'aria-label': ariaLabel,
}: Props) {
  const icon = STATE_ICON[state];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        w-full flex items-center gap-3 border-2 rounded-xl px-4 py-3 text-left
        font-medium transition-colors duration-150
        disabled:cursor-not-allowed min-h-[44px]
        ${STATE_CLASSES[state]}
      `}
    >
      <span className="text-sm font-bold shrink-0 w-5">{LABELS[index]}</span>
      <span className="flex-1">{label}</span>
      {icon && (
        <span className={`text-base font-bold shrink-0 ${icon.color}`} aria-hidden="true">
          {icon.symbol}
        </span>
      )}
    </button>
  );
}
