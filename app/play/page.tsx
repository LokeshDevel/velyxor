"use client";

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTypingGame } from '@/hooks/useTypingGame';
import { GameMode, Difficulty } from '@/lib/wordCorpus';
import { TextDisplay } from '@/components/typing/TextDisplay';
import { StatsBar } from '@/components/typing/StatsBar';
import { VirtualKeyboard } from '@/components/typing/VirtualKeyboard';
import { ResultsScreen } from '@/components/typing/ResultsScreen';
import { Button } from '@/components/ui/Button';

export default function PlayPage() {
  const [mode, setMode] = useState<GameMode>('classic');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [duration, setDuration] = useState<number | null>(30); // 30s default
  const [showGuide, setShowGuide] = useState(true);
  
  const { 
    targetText, charStatuses, currentPosition, stats, gameState, timeLeft, wpmOverTime,
    start, reset 
  } = useTypingGame({ mode, difficulty, duration });

  // Handle Tab to restart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        reset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reset]);

  const activeChar = targetText[currentPosition] || null;
  const isCorrect = currentPosition > 0 && charStatuses[currentPosition - 1] === 'correct';

  const modes: { id: GameMode, label: string }[] = [
    { id: 'classic', label: 'Classic' },
    { id: 'zen', label: 'Zen' },
    { id: 'timeAttack', label: 'Time Attack' },
    { id: 'endless', label: 'Endless' },
    { id: 'quotes', label: 'Quotes' },
    { id: 'code', label: 'Code' }
  ];

  const durations = [15, 30, 60];
  const difficulties: { id: Difficulty, label: string }[] = [
    { id: 'easy', label: 'Easy' },
    { id: 'medium', label: 'Medium' },
    { id: 'hard', label: 'Hard' }
  ];

  const needsDuration = mode === 'classic' || mode === 'timeAttack';

  const handleModeChange = (newMode: GameMode) => {
    setMode(newMode);
    if (newMode === 'zen' || newMode === 'endless') {
      setDuration(null);
    } else if (duration === null) {
      setDuration(30);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 pb-4 h-screen overflow-hidden flex flex-col">
      
      {/* Top Settings Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-center gap-3 mb-4"
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          {modes.map(m => (
            <button
              key={m.id}
              onClick={() => handleModeChange(m.id)}
              disabled={gameState === 'running'}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                mode === m.id 
                  ? 'bg-white/10 text-white neon-border glow-blue' 
                  : 'bg-transparent text-white/50 hover:text-white hover:bg-white/5'
              } ${gameState === 'running' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {m.label}
            </button>
          ))}
        </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowGuide(!showGuide)}
              className="text-white/40 hover:text-white transition-colors text-xs flex items-center gap-1"
              title="Toggle Keyboard Guide"
            >
              ⌨️ <span className="hidden sm:inline">Guide: {showGuide ? 'ON' : 'OFF'}</span>
            </button>
            
            <Button variant="ghost" size="sm" onClick={reset} title="Restart (Tab)" className="h-8 text-xs px-3">
              ↺ Restart
            </Button>
          </div>
      </motion.div>

      {/* Sub Settings (Duration & Difficulty) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex justify-center gap-4 mb-4 transition-opacity duration-300 ${gameState === 'running' ? 'opacity-20 pointer-events-none' : ''}`}
      >
        {needsDuration && (
          <div className="flex gap-1 bg-white/5 rounded-full p-1">
            {durations.map(d => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium transition-colors ${
                  duration === d ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'
                }`}
              >
                {d}s
              </button>
            ))}
          </div>
        )}
        
        <div className="flex gap-1 bg-white/5 rounded-full p-1">
          {difficulties.map(d => (
            <button
              key={d.id}
              onClick={() => setDifficulty(d.id)}
              className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium transition-colors ${
                difficulty === d.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col justify-center max-w-4xl w-full mx-auto">
        <StatsBar 
          wpm={stats.wpm}
          accuracy={stats.accuracy}
          combo={stats.combo}
          maxCombo={stats.maxCombo}
          timeLeft={timeLeft}
          gameState={gameState}
        />
        
        <TextDisplay 
          targetText={targetText}
          charStatuses={charStatuses}
          currentPosition={currentPosition}
        />
        
        <VirtualKeyboard 
          activeKey={activeChar}
          isCorrect={isCorrect}
          showGuide={showGuide}
        />
      </div>

      {gameState === 'finished' && (
        <ResultsScreen 
          stats={stats}
          wpmOverTime={wpmOverTime}
          mode={mode}
          difficulty={difficulty}
          duration={duration}
          onRestart={reset}
          onNewMode={() => { reset(); /* focus mode selector maybe? */ }}
        />
      )}

      {gameState === 'idle' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-white/30 text-sm animate-pulse">
          Start typing to begin...
        </div>
      )}
    </div>
  );
}
