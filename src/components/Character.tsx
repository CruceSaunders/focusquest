'use client';

import { useState, useEffect } from 'react';
import { getPetEmoji, getPetStageName } from '@/lib/gameState';

interface CharacterProps {
  level: number;
  xp: number;
  xpToNextLevel: number;
  gold: number;
  petStage: number;
  petName: string;
  petHappiness: number;
  currentStreak: number;
  showLevelUp?: boolean;
}

export default function Character({
  level,
  xp,
  xpToNextLevel,
  gold,
  petStage,
  petName,
  petHappiness,
  currentStreak,
  showLevelUp,
}: CharacterProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (showLevelUp) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [showLevelUp]);

  const xpProgress = (xp / xpToNextLevel) * 100;

  return (
    <div className="card p-6 w-full max-w-sm">
      {/* Header with Level */}
      <div className="flex justify-between items-center mb-4">
        <div className={`text-2xl font-bold text-[var(--primary)] ${animate ? 'animate-level-up' : ''}`}>
          Level {level}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[var(--gold)] text-xl">💰</span>
          <span className="text-[var(--gold)] font-bold">{gold}</span>
        </div>
      </div>

      {/* XP Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-white/60 mb-1">
          <span>XP</span>
          <span>{xp} / {xpToNextLevel}</span>
        </div>
        <div className="h-3 bg-[var(--accent)] rounded-full overflow-hidden">
          <div
            className="progress-bar h-full rounded-full"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </div>

      {/* Pet Display */}
      <div className="text-center py-4 bg-[var(--accent)] rounded-xl mb-4">
        <div className={`text-7xl mb-2 ${animate ? 'animate-float' : ''}`}>
          {getPetEmoji(petStage)}
        </div>
        <div className="text-white font-medium">{petName}</div>
        <div className="text-white/60 text-sm">{getPetStageName(petStage)}</div>
        
        {/* Happiness Bar */}
        <div className="mt-3 px-6">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>😊 Happiness</span>
            <span>{petHappiness}%</span>
          </div>
          <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${petHappiness}%`,
                background: petHappiness > 70 ? '#00ff88' : petHappiness > 30 ? '#ffd700' : '#e94560'
              }}
            />
          </div>
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-center justify-center gap-2 text-white/80">
        <span className="text-2xl">🔥</span>
        <span className="font-bold text-lg">{currentStreak} day streak</span>
      </div>
    </div>
  );
}
