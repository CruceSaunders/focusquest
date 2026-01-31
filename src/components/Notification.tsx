'use client';

import { useEffect, useState } from 'react';

interface NotificationProps {
  message: string;
  type: 'xp' | 'gold' | 'levelUp' | 'streak' | 'evolution';
  onClose: () => void;
}

export default function Notification({ message, type, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons: Record<string, string> = {
    xp: '⚡',
    gold: '💰',
    levelUp: '🎉',
    streak: '🔥',
    evolution: '✨',
  };

  const colors: Record<string, string> = {
    xp: 'from-green-500 to-emerald-500',
    gold: 'from-yellow-500 to-amber-500',
    levelUp: 'from-purple-500 to-pink-500',
    streak: 'from-orange-500 to-red-500',
    evolution: 'from-cyan-500 to-blue-500',
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div
        className={`bg-gradient-to-r ${colors[type]} rounded-xl px-6 py-4 shadow-2xl flex items-center gap-3`}
      >
        <span className="text-3xl animate-bounce">{icons[type]}</span>
        <span className="text-white font-bold text-lg">{message}</span>
      </div>
    </div>
  );
}
