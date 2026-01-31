// Game state management with localStorage persistence

export interface GameState {
  // Character stats
  level: number;
  xp: number;
  xpToNextLevel: number;
  gold: number;
  
  // Pomodoro stats
  totalPomodoros: number;
  totalFocusMinutes: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  
  // Pet
  petName: string;
  petStage: number; // 0=egg, 1=baby, 2=teen, 3=adult, 4=legendary
  petHappiness: number;
  
  // Tasks
  tasks: Task[];
  
  // Settings
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  soundEnabled: boolean;
}

export interface Task {
  id: string;
  text: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  completed: boolean;
  createdAt: string;
}

const DEFAULT_STATE: GameState = {
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  gold: 0,
  totalPomodoros: 0,
  totalFocusMinutes: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
  petName: 'Focus Buddy',
  petStage: 0,
  petHappiness: 50,
  tasks: [],
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  soundEnabled: true,
};

const STORAGE_KEY = 'focusquest_state';

export function loadGameState(): GameState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_STATE, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load game state:', e);
  }
  return DEFAULT_STATE;
}

export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save game state:', e);
  }
}

export function calculateXpToNextLevel(level: number): number {
  // XP curve: each level requires more XP
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function getPetStageName(stage: number): string {
  const stages = ['Egg', 'Baby', 'Teen', 'Adult', 'Legendary'];
  return stages[stage] || 'Unknown';
}

export function getPetEmoji(stage: number): string {
  const emojis = ['🥚', '🐣', '🐥', '🐔', '🦅'];
  return emojis[stage] || '❓';
}

// XP rewards
export const XP_REWARDS = {
  POMODORO_COMPLETE: 25,
  TASK_COMPLETE: 10,
  STREAK_BONUS: 5, // per day of streak
};

// Gold rewards
export const GOLD_REWARDS = {
  POMODORO_COMPLETE: 10,
  TASK_COMPLETE: 25,
  LEVEL_UP: 50,
};

// Pet evolution thresholds (total pomodoros)
export const PET_EVOLUTION = {
  BABY: 5,
  TEEN: 20,
  ADULT: 50,
  LEGENDARY: 100,
};

export function checkPetEvolution(totalPomodoros: number): number {
  if (totalPomodoros >= PET_EVOLUTION.LEGENDARY) return 4;
  if (totalPomodoros >= PET_EVOLUTION.ADULT) return 3;
  if (totalPomodoros >= PET_EVOLUTION.TEEN) return 2;
  if (totalPomodoros >= PET_EVOLUTION.BABY) return 1;
  return 0;
}

export function checkStreak(lastActiveDate: string): { isNewDay: boolean; streakBroken: boolean } {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  if (lastActiveDate === today) {
    return { isNewDay: false, streakBroken: false };
  }
  
  if (lastActiveDate === yesterday) {
    return { isNewDay: true, streakBroken: false };
  }
  
  // Streak is broken if last active was before yesterday
  return { isNewDay: true, streakBroken: lastActiveDate !== '' };
}
