interface Props {
  animal: string;
  text: string;
  variant?: 'correct' | 'wrong' | 'neutral';
}

const VARIANT_STYLE = {
  correct: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-300',
  wrong:   'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-800 dark:text-red-300',
  neutral: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700 text-indigo-800 dark:text-indigo-300',
};

const VARIANT_HEADER = {
  correct: '정답이야! 🎉',
  wrong:   '아쉽다~ 😢',
  neutral: '',
};

export default function MascotSpeech({ animal, text, variant = 'neutral' }: Props) {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="text-4xl shrink-0 animate-bounce-in">{animal}</div>
      <div className={`flex-1 rounded-2xl rounded-tl-none border-2 px-4 py-3 text-sm leading-relaxed ${VARIANT_STYLE[variant]}`}>
        {variant !== 'neutral' && (
          <p className="font-bold text-base mb-1">{VARIANT_HEADER[variant]}</p>
        )}
        <p>{text}</p>
      </div>
    </div>
  );
}
