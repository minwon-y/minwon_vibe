interface Props {
  current: number;
  total: number;
  colorClass?: string;
}

export default function ProgressBar({
  current,
  total,
  colorClass = 'bg-indigo-500',
}: Props) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
      <div
        className={`${colorClass} h-2 rounded-full transition-all duration-300`}
        style={{ width: `${pct}%` }}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
      />
    </div>
  );
}
