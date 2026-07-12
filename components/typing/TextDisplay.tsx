"use client";

import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { CharStatus } from '@/lib/typingEngine';

interface TextDisplayProps {
  targetText: string;
  charStatuses: CharStatus[];
  currentPosition: number;
}

export function TextDisplay({ targetText, charStatuses, currentPosition }: TextDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (activeCharRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeChar = activeCharRef.current;
      
      const containerRect = container.getBoundingClientRect();
      const activeCharRect = activeChar.getBoundingClientRect();
      
      const relativeTop = activeCharRect.top - containerRect.top;
      
      if (relativeTop > containerRect.height - 60) {
        container.scrollTop += 40; // line height approx
      } else if (relativeTop < 0) {
        container.scrollTop -= 40;
      }
    }
  }, [currentPosition]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-2xl p-4 md:p-6 border border-white/10 shrink-0"
    >
      <div 
        ref={containerRef}
        className="max-h-[120px] md:max-h-[150px] overflow-hidden relative font-mono text-xl md:text-2xl leading-[1.6] tracking-wide select-none"
        style={{ scrollBehavior: 'smooth' }}
      >
        {targetText.split('').map((char, index) => {
          let status = charStatuses[index];
          let colorClass = 'text-white/30';
          let bgClass = '';
          
          if (status === 'correct') {
            colorClass = 'text-emerald-400 text-glow-emerald';
          } else if (status === 'incorrect') {
            colorClass = 'text-rose-400';
            bgClass = 'bg-rose-500/20';
          }

          const isActive = index === currentPosition;
          
          // Show spaces explicitly if they are incorrect
          const displayChar = char === ' ' ? (status === 'incorrect' ? '_' : ' ') : char;

          return (
            <span
              key={index}
              ref={isActive ? activeCharRef : null}
              className={`
                relative transition-colors duration-100 
                ${colorClass} ${bgClass}
              `}
            >
              {isActive && (
                <span className="absolute left-0 top-[10%] bottom-[10%] w-[2px] bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-blink" />
              )}
              {displayChar}
            </span>
          );
        })}
      </div>
    </motion.div>
  );
}
