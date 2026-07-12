import { GameMode, Difficulty } from './wordCorpus';

export interface SessionResult {
  id: string;
  mode: GameMode;
  difficulty: Difficulty;
  duration: number;
  wpm: number;
  accuracy: number;
  combo: number;
  maxCombo: number;
  correctChars: number;
  totalChars: number;
  timestamp: number;
  wpmOverTime: number[];
}

export interface UserStats {
  totalSessions: number;
  totalPracticeTime: number; // in seconds
  bestWpm: number;
  avgWpm: number;
  bestAccuracy: number;
  avgAccuracy: number;
}

const STORAGE_KEY = 'velyxor_sessions';

export function saveSession(result: SessionResult): void {
  if (typeof window === 'undefined') return;
  const sessions = getSessions();
  sessions.push(result);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function getSessions(): SessionResult[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse sessions from localStorage', e);
    return [];
  }
}

export function getRecentSessions(count: number): SessionResult[] {
  const sessions = getSessions();
  return sessions.sort((a, b) => b.timestamp - a.timestamp).slice(0, count);
}

export function getUserStats(): UserStats {
  const sessions = getSessions();
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      totalPracticeTime: 0,
      bestWpm: 0,
      avgWpm: 0,
      bestAccuracy: 0,
      avgAccuracy: 0,
    };
  }

  const totalSessions = sessions.length;
  let totalPracticeTime = 0;
  let bestWpm = 0;
  let totalWpm = 0;
  let bestAccuracy = 0;
  let totalAccuracy = 0;

  for (const s of sessions) {
    totalPracticeTime += s.duration;
    if (s.wpm > bestWpm) bestWpm = s.wpm;
    totalWpm += s.wpm;
    if (s.accuracy > bestAccuracy) bestAccuracy = s.accuracy;
    totalAccuracy += s.accuracy;
  }

  return {
    totalSessions,
    totalPracticeTime,
    bestWpm,
    avgWpm: Math.round(totalWpm / totalSessions),
    bestAccuracy,
    avgAccuracy: Math.round(totalAccuracy / totalSessions),
  };
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
