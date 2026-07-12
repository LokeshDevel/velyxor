"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameMode, Difficulty, generateText } from '@/lib/wordCorpus';
import { TypingEngine, TypingState, CharStatus, TypingStats } from '@/lib/typingEngine';
import { saveSession } from '@/lib/storage';

interface UseTypingGameOptions {
  mode: GameMode;
  difficulty: Difficulty;
  duration: number | null;
}

export function useTypingGame({ mode, difficulty, duration }: UseTypingGameOptions) {
  const [targetText, setTargetText] = useState(() => generateText(mode, difficulty));
  const engineRef = useRef(new TypingEngine(targetText));
  
  const [gameState, setGameState] = useState<TypingState>('idle');
  const [charStatuses, setCharStatuses] = useState<CharStatus[]>(engineRef.current.getCharStatuses());
  const [currentPosition, setCurrentPosition] = useState(0);
  const [stats, setStats] = useState<TypingStats>(engineRef.current.getStats());
  
  const [timeLeft, setTimeLeft] = useState<number | null>(duration);
  const [wpmOverTime, setWpmOverTime] = useState<number[]>([]);
  
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wpmIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const finishGame = useCallback(() => {
    setGameState('finished');
    if (timerRef.current) clearInterval(timerRef.current);
    if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
    
    const finalStats = engineRef.current.getStats();
    setStats(finalStats);
    
    // Calculate final duration for session record
    const finalDuration = duration && mode !== 'zen' && mode !== 'endless' 
      ? duration - (timeLeft ?? 0)
      : Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000);

    saveSession({
      id: crypto.randomUUID(),
      mode,
      difficulty,
      duration: finalDuration,
      wpm: finalStats.wpm,
      accuracy: finalStats.accuracy,
      combo: finalStats.combo, // final combo
      maxCombo: finalStats.maxCombo,
      correctChars: finalStats.correctChars,
      totalChars: finalStats.totalChars,
      timestamp: Date.now(),
      wpmOverTime: wpmOverTime,
    });
  }, [mode, difficulty, duration, timeLeft, wpmOverTime]);

  const startGame = useCallback(() => {
    setGameState('running');
    startTimeRef.current = Date.now();
    
    if (duration !== null && mode !== 'zen' && mode !== 'endless') {
      setTimeLeft(duration);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev !== null && prev <= 1) {
            finishGame();
            return 0;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
    } else {
      // For zen or endless, we count up
      setTimeLeft(0);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => (prev !== null ? prev + 1 : 0));
      }, 1000);
    }

    wpmIntervalRef.current = setInterval(() => {
      setWpmOverTime(prev => [...prev, engineRef.current.getStats().wpm]);
    }, 1000);
  }, [duration, mode, finishGame]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    // Ignore keystrokes if game is finished or if holding modifier keys (except Shift)
    if (gameState === 'finished' || e.ctrlKey || e.altKey || e.metaKey) return;
    
    // Only accept single character keys or Backspace
    if (e.key.length > 1 && e.key !== 'Backspace') return;

    if (gameState === 'idle' && e.key !== 'Backspace') {
      startGame();
    }

    if (e.key === 'Backspace') {
      e.preventDefault(); // prevent navigation
      engineRef.current.handleBackspace();
    } else {
      // Normal char
      if (e.key === ' ') e.preventDefault(); // prevent scrolling
      const elapsedTimeMs = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
      engineRef.current.processKeystroke(e.key, elapsedTimeMs);
    }

    setCharStatuses([...engineRef.current.getCharStatuses()]);
    setCurrentPosition(engineRef.current.getCurrentPosition());
    setStats({ ...engineRef.current.getStats() });

    if (engineRef.current.isComplete()) {
      finishGame();
    }
  }, [gameState, startGame, finishGame]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
    
    const newText = generateText(mode, difficulty);
    setTargetText(newText);
    engineRef.current.reset(newText);
    
    setGameState('idle');
    setCharStatuses(engineRef.current.getCharStatuses());
    setCurrentPosition(0);
    setStats(engineRef.current.getStats());
    setTimeLeft(duration);
    setWpmOverTime([]);
    startTimeRef.current = null;
  }, [mode, difficulty, duration]);

  // Re-initialize if options change
  useEffect(() => {
    reset();
  }, [mode, difficulty, duration, reset]);

  return {
    targetText,
    userInput: '', // derived from charStatuses if needed, but usually we just use charStatuses directly
    charStatuses,
    currentPosition,
    stats,
    gameState,
    timeLeft,
    wpmOverTime,
    start: startGame,
    reset,
    handleKeyPress,
  };
}
