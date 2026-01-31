'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Timer from '@/components/Timer';
import Character from '@/components/Character';
import Stats from '@/components/Stats';
import TaskList from '@/components/TaskList';
import Notification from '@/components/Notification';
import Settings from '@/components/Settings';
import {
  GameState,
  Task,
  loadGameState,
  saveGameState,
  calculateXpToNextLevel,
  checkPetEvolution,
  checkStreak,
  XP_REWARDS,
  GOLD_REWARDS,
} from '@/lib/gameState';

interface NotificationData {
  id: number;
  message: string;
  type: 'xp' | 'gold' | 'levelUp' | 'streak' | 'evolution';
}

export default function AppPage() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load game state on mount
  useEffect(() => {
    setMounted(true);
    const state = loadGameState();
    
    // Check streak
    const { isNewDay, streakBroken } = checkStreak(state.lastActiveDate);
    if (isNewDay) {
      if (streakBroken) {
        state.currentStreak = 0;
      }
      state.lastActiveDate = new Date().toDateString();
    }
    
    setGameState(state);
  }, []);

  // Save game state whenever it changes
  useEffect(() => {
    if (gameState && mounted) {
      saveGameState(gameState);
    }
  }, [gameState, mounted]);

  const addNotification = useCallback((message: string, type: NotificationData['type']) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const handlePomodoroComplete = useCallback(() => {
    if (!gameState) return;

    setGameState((prev) => {
      if (!prev) return prev;

      let newState = { ...prev };
      
      // Award XP
      const xpGained = XP_REWARDS.POMODORO_COMPLETE + (prev.currentStreak * XP_REWARDS.STREAK_BONUS);
      newState.xp += xpGained;
      addNotification(`+${xpGained} XP`, 'xp');
      
      // Award Gold
      const goldGained = GOLD_REWARDS.POMODORO_COMPLETE;
      newState.gold += goldGained;
      addNotification(`+${goldGained} Gold`, 'gold');
      
      // Update stats
      newState.totalPomodoros += 1;
      newState.totalFocusMinutes += prev.focusDuration;
      
      // Check for level up
      while (newState.xp >= newState.xpToNextLevel) {
        newState.xp -= newState.xpToNextLevel;
        newState.level += 1;
        newState.xpToNextLevel = calculateXpToNextLevel(newState.level);
        newState.gold += GOLD_REWARDS.LEVEL_UP;
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 1000);
        addNotification(`Level Up! Now Level ${newState.level}`, 'levelUp');
      }
      
      // Check pet evolution
      const newPetStage = checkPetEvolution(newState.totalPomodoros);
      if (newPetStage > prev.petStage) {
        newState.petStage = newPetStage;
        addNotification(`Your pet evolved!`, 'evolution');
      }
      
      // Increase pet happiness
      newState.petHappiness = Math.min(100, prev.petHappiness + 5);
      
      // Update streak
      const today = new Date().toDateString();
      if (prev.lastActiveDate !== today) {
        const { streakBroken } = checkStreak(prev.lastActiveDate);
        if (!streakBroken) {
          newState.currentStreak += 1;
          if (newState.currentStreak > newState.longestStreak) {
            newState.longestStreak = newState.currentStreak;
          }
          if (newState.currentStreak > 1) {
            addNotification(`${newState.currentStreak} day streak!`, 'streak');
          }
        }
        newState.lastActiveDate = today;
      }
      
      return newState;
    });
  }, [gameState, addNotification]);

  const handleAddTask = useCallback((text: string, estimatedPomodoros: number) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      estimatedPomodoros,
      completedPomodoros: 0,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setGameState((prev) => {
      if (!prev) return prev;
      return { ...prev, tasks: [...prev.tasks, newTask] };
    });
  }, []);

  const handleCompleteTask = useCallback((id: string) => {
    setGameState((prev) => {
      if (!prev) return prev;
      const tasks = prev.tasks.map((t) =>
        t.id === id ? { ...t, completed: true } : t
      );
      const xpGained = XP_REWARDS.TASK_COMPLETE;
      const goldGained = GOLD_REWARDS.TASK_COMPLETE;
      addNotification(`Task complete! +${xpGained} XP`, 'xp');
      
      let newXp = prev.xp + xpGained;
      let newLevel = prev.level;
      let newXpToNext = prev.xpToNextLevel;
      let newGold = prev.gold + goldGained;
      
      while (newXp >= newXpToNext) {
        newXp -= newXpToNext;
        newLevel += 1;
        newXpToNext = calculateXpToNextLevel(newLevel);
        newGold += GOLD_REWARDS.LEVEL_UP;
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 1000);
        addNotification(`Level Up! Now Level ${newLevel}`, 'levelUp');
      }
      
      return {
        ...prev,
        tasks,
        xp: newXp,
        level: newLevel,
        xpToNextLevel: newXpToNext,
        gold: newGold,
      };
    });
  }, [addNotification]);

  const handleDeleteTask = useCallback((id: string) => {
    setGameState((prev) => {
      if (!prev) return prev;
      return { ...prev, tasks: prev.tasks.filter((t) => t.id !== id) };
    });
  }, []);

  const handleIncrementPomodoro = useCallback((id: string) => {
    setGameState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === id ? { ...t, completedPomodoros: t.completedPomodoros + 1 } : t
        ),
      };
    });
  }, []);

  const handleClearCompleted = useCallback(() => {
    setGameState((prev) => {
      if (!prev) return prev;
      return { ...prev, tasks: prev.tasks.filter((t) => !t.completed) };
    });
  }, []);

  const handleSaveSettings = useCallback((settings: {
    focusDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    soundEnabled: boolean;
  }) => {
    setGameState((prev) => {
      if (!prev) return prev;
      return { ...prev, ...settings };
    });
    addNotification('Settings saved!', 'xp');
  }, [addNotification]);

  if (!mounted || !gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
        <div className="text-4xl animate-pulse">🎮</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      {/* Settings Modal */}
      {showSettings && (
        <Settings
          focusDuration={gameState.focusDuration}
          shortBreakDuration={gameState.shortBreakDuration}
          longBreakDuration={gameState.longBreakDuration}
          soundEnabled={gameState.soundEnabled}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Notifications */}
      {notifications.map((n) => (
        <Notification
          key={n.id}
          message={n.message}
          type={n.type}
          onClose={() => removeNotification(n.id)}
        />
      ))}

      {/* Header */}
      <header className="text-center mb-8 relative">
        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(true)}
          className="absolute right-0 top-0 p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition"
          title="Settings"
        >
          ⚙️
        </button>

        {/* Back to Landing */}
        <Link
          href="/landing"
          className="absolute left-0 top-0 p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition"
          title="Home"
        >
          🏠
        </Link>

        <h1 className="text-4xl font-bold text-white mb-2">
          <span className="text-purple-400">Focus</span>Quest
        </h1>
        <p className="text-white/60">Level up by staying focused 🎮</p>
        
        {/* Timer Settings Display */}
        <div className="mt-2 text-white/40 text-sm">
          ⏱️ {gameState.focusDuration}m focus · {gameState.shortBreakDuration}m short · {gameState.longBreakDuration}m long
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Character & Stats */}
        <div className="space-y-6 flex flex-col items-center lg:items-start">
          <Character
            level={gameState.level}
            xp={gameState.xp}
            xpToNextLevel={gameState.xpToNextLevel}
            gold={gameState.gold}
            petStage={gameState.petStage}
            petName={gameState.petName}
            petHappiness={gameState.petHappiness}
            currentStreak={gameState.currentStreak}
            showLevelUp={showLevelUp}
          />
          <Stats
            totalPomodoros={gameState.totalPomodoros}
            totalFocusMinutes={gameState.totalFocusMinutes}
            longestStreak={gameState.longestStreak}
            level={gameState.level}
          />
        </div>

        {/* Center Column - Timer */}
        <div className="flex flex-col items-center">
          <div className="card p-8 bg-white/5 backdrop-blur border border-white/10 rounded-3xl">
            <Timer
              focusDuration={gameState.focusDuration}
              shortBreakDuration={gameState.shortBreakDuration}
              longBreakDuration={gameState.longBreakDuration}
              onPomodoroComplete={handlePomodoroComplete}
              soundEnabled={gameState.soundEnabled}
            />
          </div>
        </div>

        {/* Right Column - Tasks */}
        <div className="flex flex-col items-center lg:items-end">
          <TaskList
            tasks={gameState.tasks}
            onAddTask={handleAddTask}
            onCompleteTask={handleCompleteTask}
            onDeleteTask={handleDeleteTask}
            onIncrementPomodoro={handleIncrementPomodoro}
            onClearCompleted={handleClearCompleted}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-12 text-white/40 text-sm">
        <p>Built with 🎮 for productivity</p>
        <p className="mt-1">Complete pomodoros to level up your character and evolve your pet!</p>
      </footer>
    </main>
  );
}
