'use client';

import { useState } from 'react';

interface SettingsProps {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  soundEnabled: boolean;
  onSave: (settings: {
    focusDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    soundEnabled: boolean;
  }) => void;
  onClose: () => void;
}

export default function Settings({
  focusDuration,
  shortBreakDuration,
  longBreakDuration,
  soundEnabled,
  onSave,
  onClose,
}: SettingsProps) {
  const [focus, setFocus] = useState(focusDuration);
  const [shortBreak, setShortBreak] = useState(shortBreakDuration);
  const [longBreak, setLongBreak] = useState(longBreakDuration);
  const [sound, setSound] = useState(soundEnabled);

  const handleSave = () => {
    onSave({
      focusDuration: focus,
      shortBreakDuration: shortBreak,
      longBreakDuration: longBreak,
      soundEnabled: sound,
    });
    onClose();
  };

  const resetToDefaults = () => {
    setFocus(25);
    setShortBreak(5);
    setLongBreak(10);
    setSound(true);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a2e] border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">⚙️ Settings</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Focus Duration */}
          <div>
            <label className="block text-white/80 text-sm mb-2">
              🎯 Focus Duration (minutes)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max="90"
                step="5"
                value={focus}
                onChange={(e) => setFocus(Number(e.target.value))}
                className="flex-1 accent-purple-500"
              />
              <input
                type="number"
                value={focus}
                onChange={(e) => setFocus(Math.min(90, Math.max(5, Number(e.target.value))))}
                className="w-16 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Short Break */}
          <div>
            <label className="block text-white/80 text-sm mb-2">
              ☕ Short Break (minutes)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="30"
                value={shortBreak}
                onChange={(e) => setShortBreak(Number(e.target.value))}
                className="flex-1 accent-green-500"
              />
              <input
                type="number"
                value={shortBreak}
                onChange={(e) => setShortBreak(Math.min(30, Math.max(1, Number(e.target.value))))}
                className="w-16 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Long Break */}
          <div>
            <label className="block text-white/80 text-sm mb-2">
              🛋️ Long Break (minutes)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={longBreak}
                onChange={(e) => setLongBreak(Number(e.target.value))}
                className="flex-1 accent-blue-500"
              />
              <input
                type="number"
                value={longBreak}
                onChange={(e) => setLongBreak(Math.min(60, Math.max(5, Number(e.target.value))))}
                className="w-16 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Sound */}
          <div className="flex items-center justify-between">
            <label className="text-white/80">🔔 Sound Notifications</label>
            <button
              onClick={() => setSound(!sound)}
              className={`w-14 h-8 rounded-full relative transition-colors ${
                sound ? 'bg-purple-500' : 'bg-white/20'
              }`}
            >
              <div
                className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${
                  sound ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Preset Info */}
        <div className="mt-6 p-4 bg-white/5 rounded-xl">
          <p className="text-white/60 text-sm">
            <strong className="text-white/80">Pomodoro Standard:</strong> 25 min focus, 5 min short break, 10 min long break
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={resetToDefaults}
            className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold transition"
          >
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold hover:scale-[1.02] transition-transform"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
