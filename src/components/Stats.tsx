'use client';

interface StatsProps {
  totalPomodoros: number;
  totalFocusMinutes: number;
  longestStreak: number;
  level: number;
}

export default function Stats({
  totalPomodoros,
  totalFocusMinutes,
  longestStreak,
  level,
}: StatsProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const stats = [
    {
      icon: '🍅',
      label: 'Pomodoros',
      value: totalPomodoros,
    },
    {
      icon: '⏱️',
      label: 'Focus Time',
      value: formatTime(totalFocusMinutes),
    },
    {
      icon: '🔥',
      label: 'Best Streak',
      value: `${longestStreak} days`,
    },
    {
      icon: '⭐',
      label: 'Level',
      value: level,
    },
  ];

  return (
    <div className="card p-6 w-full max-w-sm">
      <h2 className="text-xl font-bold text-white mb-4">📊 Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-[var(--accent)] rounded-xl p-4 text-center"
          >
            <div className="text-3xl mb-1">{stat.icon}</div>
            <div className="text-xl font-bold text-white">{stat.value}</div>
            <div className="text-white/60 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
