interface Props {
  totalSec: number;
  timeLeft: number;
}

export default function TimerBar({ totalSec, timeLeft }: Props) {
  const pct = Math.max(0, (timeLeft / totalSec) * 100);
  const barColor = timeLeft > 8 ? 'bg-green-400' : timeLeft > 4 ? 'bg-yellow-400' : 'bg-red-400';
  const textColor = timeLeft <= 4 ? 'text-red-500 animate-pulse' : 'text-gray-500 dark:text-gray-400';

  return (
    <div className="flex items-center gap-3">
      <span className={`text-xl font-bold tabular-nums w-8 text-right shrink-0 ${textColor}`}>
        {timeLeft}
      </span>
      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-3">
        <div
          className={`${barColor} h-3 rounded-full transition-all duration-1000 linear`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 shrink-0">초</span>
    </div>
  );
}
