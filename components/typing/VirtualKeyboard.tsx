"use client";

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface VirtualKeyboardProps {
  activeKey: string | null;
  isCorrect: boolean | null;
  showGuide: boolean;
}

export function VirtualKeyboard({ activeKey, isCorrect, showGuide }: VirtualKeyboardProps) {
  const rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
    [' ']
  ];

  const getFingerZoneColor = (key: string) => {
    const zones: Record<string, string> = {
      // Left pinky (rose)
      q: 'bg-rose-500/10', a: 'bg-rose-500/10', z: 'bg-rose-500/10',
      // Left ring (orange/amber)
      w: 'bg-amber-500/10', s: 'bg-amber-500/10', x: 'bg-amber-500/10',
      // Left middle (yellow/emeraldish)
      e: 'bg-yellow-500/10', d: 'bg-yellow-500/10', c: 'bg-yellow-500/10',
      // Left index (emerald)
      r: 'bg-emerald-500/10', f: 'bg-emerald-500/10', v: 'bg-emerald-500/10',
      t: 'bg-emerald-500/10', g: 'bg-emerald-500/10', b: 'bg-emerald-500/10',
      // Right index (emerald)
      y: 'bg-emerald-500/10', h: 'bg-emerald-500/10', n: 'bg-emerald-500/10',
      u: 'bg-emerald-500/10', j: 'bg-emerald-500/10', m: 'bg-emerald-500/10',
      // Right middle (amber)
      i: 'bg-amber-500/10', k: 'bg-amber-500/10',
      // Right ring (orange)
      o: 'bg-orange-500/10', l: 'bg-orange-500/10',
      // Right pinky (rose)
      p: 'bg-rose-500/10',
      // Thumbs (blue)
      ' ': 'bg-blue-500/10'
    };
    return zones[key] || 'bg-white/5';
  };

  const [flashKey, setFlashKey] = useState<string | null>(null);
  const [flashState, setFlashState] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    if (activeKey === null) return;
    
    // We only flash the *previous* key that was typed, which is hard to track purely from activeKey
    // But we can just use the isCorrect prop which updates on keystroke
    // This is a simplified visual. For actual physical keystroke flashes, we'd need a separate hook listening to window.keydown
  }, [activeKey, isCorrect]);

  // Better approach: listen to actual keystrokes to flash keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setFlashKey(key);
      // Wait, isCorrect isn't known here unless we tie it strictly to the engine.
      // We'll just do a neutral flash for key presses
      setTimeout(() => setFlashKey(null), 150);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-3xl p-3 sm:p-5 mt-4 max-w-[90%] sm:max-w-xl lg:max-w-2xl mx-auto flex flex-col gap-1.5 border border-white/10 shrink-0"
    >
      {rows.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className={`flex justify-center gap-1 sm:gap-1.5 ${rowIndex === 1 ? 'ml-3 sm:ml-4' : rowIndex === 2 ? 'ml-8 sm:ml-10' : ''}`}
        >
          {row.map(key => {
            const isSpace = key === ' ';
            const isActive = activeKey?.toLowerCase() === key;
            const isFlashed = flashKey === key;
            
            let keyClass = 'bg-white/5 border border-white/10 text-white/50';
            
            if (showGuide) {
              keyClass = `${getFingerZoneColor(key)} border-white/10 text-white/70`;
            }
            
            if (isActive) {
              keyClass = 'bg-blue-500/20 border-blue-400 text-blue-400 glow-blue';
            }
            
            if (isFlashed) {
              keyClass = 'bg-white/20 border-white/50 text-white scale-95';
            }

            return (
              <div 
                key={key}
                className={`
                  ${isSpace ? 'w-40 sm:w-56 lg:w-64' : 'w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10'}
                  rounded-md sm:rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-mono uppercase transition-all duration-100
                  ${keyClass}
                `}
              >
                {!isSpace && key}
              </div>
            );
          })}
        </div>
      ))}
    </motion.div>
  );
}
