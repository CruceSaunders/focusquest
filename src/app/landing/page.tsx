'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const FEATURES = [
  {
    emoji: '🎮',
    title: 'Gamified Focus',
    description: 'Earn XP and gold every time you complete a focus session. Level up your character!'
  },
  {
    emoji: '🐣',
    title: 'Pet Evolution',
    description: 'Hatch and evolve your companion pet through consistent focus. From egg to legendary!'
  },
  {
    emoji: '🔥',
    title: 'Streak System',
    description: 'Build daily streaks for bonus XP. Compete with yourself to stay consistent.'
  },
  {
    emoji: '📊',
    title: 'Progress Tracking',
    description: 'See your total focus time, completed pomodoros, and achievement history.'
  },
  {
    emoji: '⚙️',
    title: 'Customizable Timer',
    description: 'Set your own focus, short break, and long break durations. Your workflow, your rules.'
  },
  {
    emoji: '✅',
    title: 'Task Management',
    description: 'Organize tasks with estimated pomodoros. Track progress as you work.'
  }
];

const TESTIMONIALS = [
  { name: 'Alex K.', text: 'Finally, a productivity app that makes focus feel like a game!', avatar: '👨‍💻' },
  { name: 'Sarah M.', text: 'My pet evolved to legendary! Now I can\'t stop being productive.', avatar: '👩‍🎓' },
  { name: 'Mike R.', text: 'The streak system keeps me coming back every day.', avatar: '👨‍🔬' }
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] overflow-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-500/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">
            <span className="text-purple-400">Focus</span>
            <span className="text-white">Quest</span>
            <span className="ml-2">🎮</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 text-white/80 hover:text-white transition">
              Log In
            </Link>
            <Link href="/signup" className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold hover:scale-105 transition-transform">
              Sign Up Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="text-center max-w-4xl">
          {/* Animated Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/40 mb-8 animate-bounce-slow"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          >
            <span className="animate-pulse">🔥</span>
            <span className="text-purple-300 text-sm">Join 10,000+ focused achievers</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Turn Focus Into a
            <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent animate-gradient">
              Game You Want to Win
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-2xl mx-auto">
            The productivity app that makes staying focused actually fun. 
            Earn XP, evolve your pet, and level up your life.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              href="/signup"
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-lg font-bold hover:scale-105 transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
            >
              Start Your Quest
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link 
              href="/app"
              className="px-8 py-4 bg-white/10 backdrop-blur rounded-full text-white text-lg font-semibold hover:bg-white/20 transition border border-white/20"
            >
              Try Without Account
            </Link>
          </div>

          {/* Hero Visual - Animated Timer Preview */}
          <div className="relative mx-auto w-72 h-72 mt-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-pink-600/50 rounded-full blur-3xl animate-pulse" />
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center border-4 border-white/20 shadow-2xl">
              <div className="text-center">
                <div className="text-5xl font-mono font-bold text-white mb-2 animate-pulse">25:00</div>
                <div className="text-white/70">🎯 Focus Time</div>
              </div>
            </div>
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 text-4xl animate-bounce">🐣</div>
            <div className="absolute -bottom-4 -left-4 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
            <div className="absolute top-1/2 -right-12 text-3xl animate-float">+25 XP</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            Everything You Need to <span className="text-purple-400">Stay Focused</span>
          </h2>
          <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
            We studied the top 10 productivity apps and combined the best features into one powerful experience.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <div 
                key={i}
                className="group p-6 bg-white/5 backdrop-blur rounded-2xl border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.emoji}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-12">What Focused Achievers Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-4xl mb-4">{t.avatar}</div>
                <p className="text-white/80 mb-4">"{t.text}"</p>
                <p className="text-purple-400 font-semibold">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Level Up Your Productivity?
          </h2>
          <p className="text-white/60 text-xl mb-8">
            Join thousands of focused achievers. It's free to start.
          </p>
          <Link 
            href="/signup"
            className="inline-flex items-center gap-2 px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-xl font-bold hover:scale-105 transition-all shadow-lg shadow-purple-500/30"
          >
            🚀 Start Free Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-white/40">
          <p>© 2026 FocusQuest. Built to help you focus.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-gradient { 
          background-size: 200% 200%; 
          animation: gradient 4s ease infinite; 
        }
      `}</style>
    </div>
  );
}
