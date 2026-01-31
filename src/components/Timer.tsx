'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

interface TimerProps {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  onPomodoroComplete: () => void;
  soundEnabled: boolean;
}

export default function Timer({
  focusDuration,
  shortBreakDuration,
  longBreakDuration,
  onPomodoroComplete,
  soundEnabled,
}: TimerProps) {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodorosInSession, setPomodorosInSession] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getDuration = useCallback((m: TimerMode) => {
    switch (m) {
      case 'focus': return focusDuration * 60;
      case 'shortBreak': return shortBreakDuration * 60;
      case 'longBreak': return longBreakDuration * 60;
    }
  }, [focusDuration, shortBreakDuration, longBreakDuration]);

  useEffect(() => {
    // Create audio element for notifications
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleWovWYmF');
    }
  }, []);

  useEffect(() => {
    setTimeLeft(getDuration(mode));
  }, [mode, getDuration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer complete
      if (soundEnabled && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }

      if (mode === 'focus') {
        onPomodoroComplete();
        const newCount = pomodorosInSession + 1;
        setPomodorosInSession(newCount);
        
        // After 4 pomodoros, take a long break
        if (newCount % 4 === 0) {
          setMode('longBreak');
        } else {
          setMode('shortBreak');
        }
      } else {
        setMode('focus');
      }
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, pomodorosInSession, onPomodoroComplete, soundEnabled]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getDuration(mode));
  };

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(getDuration(newMode));
  };

  const progress = ((getDuration(mode) - timeLeft) / getDuration(mode)) * 100;

  return (
    <div className="flex flex-col items-center">
      {/* Mode Tabs */}
      <div className="flex gap-2 mb-8">
        {(['focus', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              mode === m
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            {m === 'focus' ? 'Focus' : m === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div
        className={`relative w-72 h-72 rounded-full flex items-center justify-center ${
          mode === 'focus' ? 'timer-focus' : 'timer-break'
        } ${isRunning ? 'animate-glow' : ''}`}
      >
        {/* Progress Ring */}
        <svg className="absolute w-full h-full -rotate-90">
          <circle
            cx="144"
            cy="144"
            r="130"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="8"
          />
          <circle
            cx="144"
            cy="144"
            r="130"
            fill="none"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 130}`}
            strokeDashoffset={`${2 * Math.PI * 130 * (1 - progress / 100)}`}
            className="transition-all duration-1000"
          />
        </svg>

        {/* Time Display */}
        <div className="text-center z-10">
          <div className="text-6xl font-bold text-white font-mono">
            {formatTime(timeLeft)}
          </div>
          <div className="text-white/60 mt-2">
            {mode === 'focus' ? '🎯 Time to focus!' : '☕ Take a break!'}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={toggleTimer}
          className="btn-primary px-12 py-4 rounded-full text-xl font-bold text-white"
        >
          {isRunning ? 'PAUSE' : 'START'}
        </button>
        <button
          onClick={resetTimer}
          className="btn-secondary px-6 py-4 rounded-full text-white"
        >
          ↻
        </button>
      </div>

      {/* Session Counter */}
      <div className="mt-6 text-white/60">
        <span className="text-2xl">{'🍅'.repeat(pomodorosInSession % 4 || (pomodorosInSession > 0 ? 4 : 0))}</span>
        <span className="ml-2">#{pomodorosInSession + 1}</span>
      </div>
    </div>
  );
}
