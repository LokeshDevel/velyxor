"use client";

import { motion } from 'motion/react';
import { TypingState } from '@/lib/typingEngine';

interface StatsBarProps {
  wpm: number;
  accuracy: number;
  combo: number;
  maxCombo: number;
  timeLeft: number | null;
  gameState: TypingState;
}

export function StatsBar({ wpm, accuracy, combo, maxCombo, timeLeft, gameState }: StatsBarProps) {
  
  const getWpmColor = (val: number) => {
    if (val === 0) return 'text-white/80';
    if (val < 40) return 'text-rose-400';
    if (val < 70) return 'text-amber-400';
    if (val < 100) return 'text-blue-400';
    return 'text-emerald-400 text-glow-emerald';
  };

  const getAccColor = (val: number) => {
    if (val === 100 && gameState === 'idle') return 'text-white/80';
    if (val < 90) return 'text-rose-400';
    if (val < 95) return 'text-amber-400';
    if (val < 98) return 'text-blue-400';
    return 'text-emerald-400 text-glow-emerald';
  };

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mb-3 shrink-0">
      <StatCard 
        icon="🚀" 
        label="WPM" 
        value={wpm} 
        valueClass={getWpmColor(wpm)} 
      />
      <StatCard 
        icon="🎯" 
        label="ACCURACY" 
        value={`${accuracy}%`} 
        valueClass={getAccColor(accuracy)} 
      />
      <StatCard 
        icon={combo > 10 ? "🔥" : "✨"} 
        label="COMBO" 
        value={combo} 
        subLabel={`Max: ${maxCombo}`}
        valueClass={combo > 10 ? 'text-orange-400 animate-pulse text-glow-amber' : 'text-white/80'}
      />
      <StatCard 
        icon="⏱️" 
        label="TIME" 
        value={formatTime(timeLeft)} 
        valueClass="text-purple-400" 
      />
    </div>
  );
}

function StatCard({ icon, label, value, subLabel, valueClass }: { icon: string, label: string, value: string | number, subLabel?: string, valueClass: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 glass rounded-xl p-2 md:p-3 flex flex-col items-center justify-center relative overflow-hidden"
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="text-sm">{icon}</span>
        <span className="text-[10px] sm:text-xs text-white/50 tracking-wider font-semibold">{label}</span>
      </div>
      <div className={`text-xl sm:text-2xl font-bold tabular-nums transition-colors duration-300 ${valueClass}`}>
        {value}
      </div>
      {subLabel && (
        <div className="text-[10px] text-white/40 mt-1 absolute bottom-1 right-2">
          {subLabel}
        </div>
      )}
    </motion.div>
  );
}
