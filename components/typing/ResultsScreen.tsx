"use client";

import { motion } from 'motion/react';
import { TypingStats } from '@/lib/typingEngine';
import { GameMode, Difficulty } from '@/lib/wordCorpus';
import { Button } from '@/components/ui/Button';

interface ResultsScreenProps {
  stats: TypingStats;
  wpmOverTime: number[];
  mode: GameMode;
  difficulty: Difficulty;
  duration: number | null;
  onRestart: () => void;
  onNewMode: () => void;
}

export function ResultsScreen({ stats, wpmOverTime, mode, difficulty, duration, onRestart, onNewMode }: ResultsScreenProps) {
  
  const getTier = (wpm: number) => {
    if (wpm >= 120) return { letter: 'S', color: 'text-yellow-400', glow: 'text-glow-gold' };
    if (wpm >= 90) return { letter: 'A', color: 'text-emerald-400', glow: 'text-glow-emerald' };
    if (wpm >= 60) return { letter: 'B', color: 'text-blue-400', glow: 'text-glow-blue' };
    if (wpm >= 40) return { letter: 'C', color: 'text-amber-400', glow: '' };
    return { letter: 'D', color: 'text-rose-400', glow: '' };
  };

  const tier = getTier(stats.wpm);
  
  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
  };

  // SVG Chart calculation
  const chartHeight = 60;
  const chartWidth = 400;
  
  let points = "";
  if (wpmOverTime.length > 0) {
    const maxWpm = Math.max(...wpmOverTime, 50); // min scale 50
    const dx = chartWidth / Math.max(wpmOverTime.length - 1, 1);
    
    points = wpmOverTime.map((val, i) => {
      const x = i * dx;
      const y = chartHeight - (val / maxWpm) * chartHeight;
      return `${x},${y}`;
    }).join(' ');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
        onClick={onRestart} // clicking outside restarts
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-lg glass-strong rounded-3xl p-8 border border-white/10 shadow-2xl"
      >
        <div className="text-center mb-8 relative">
          <h2 className="text-2xl font-bold text-white/50 mb-2">Results</h2>
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [-10, 0] }}
            transition={{ type: "spring", delay: 0.3 }}
            className={`text-7xl font-black ${tier.color} ${tier.glow} mb-2`}
          >
            {tier.letter}
            {tier.letter === 'S' && (
              <motion.span 
                animate={{ rotate: 360 }} 
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute text-4xl -top-2 -right-2 text-yellow-300"
              >
                ✨
              </motion.span>
            )}
          </motion.div>
          <div className="text-sm text-white/40 uppercase tracking-widest">
            {mode} • {difficulty} {duration ? `• ${duration}s` : ''}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-xs text-white/50 mb-1">WPM</div>
            <div className={`text-3xl font-bold ${tier.color}`}>{stats.wpm}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-xs text-white/50 mb-1">ACCURACY</div>
            <div className="text-3xl font-bold text-white">{stats.accuracy}%</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-xs text-white/50 mb-1">COMBO</div>
            <div className="text-3xl font-bold text-orange-400">{stats.maxCombo}</div>
          </div>
        </div>

        {wpmOverTime.length > 1 && (
          <div className="mb-8 h-[60px] relative w-full opacity-60">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              <polyline 
                points={points} 
                fill="none" 
                stroke="url(#chartGrad)" 
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-draw-line"
              />
            </svg>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={onRestart} className="flex-1 py-4 text-lg">Try Again (Tab)</Button>
          <Button variant="secondary" onClick={onNewMode} className="sm:flex-1 py-4">Change Mode</Button>
        </div>
      </motion.div>
    </div>
  );
}
