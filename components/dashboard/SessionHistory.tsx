"use client";

import { motion } from "motion/react";
import type { SessionResult } from "@/lib/storage";

interface SessionHistoryProps {
  sessions: SessionResult[];
}

function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffSeconds < 60) return "just now";
  if (diffMinutes === 1) return "1 minute ago";
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  if (diffHours === 1) return "1 hour ago";
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffWeeks === 1) return "1 week ago";
  if (diffWeeks < 4) return `${diffWeeks} weeks ago`;

  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getWpmColor(wpm: number): string {
  if (wpm >= 100) return "text-emerald-400";
  if (wpm >= 70) return "text-blue-400";
  if (wpm >= 40) return "text-yellow-400";
  return "text-red-400";
}

function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 98) return "text-emerald-400";
  if (accuracy >= 95) return "text-blue-400";
  if (accuracy >= 90) return "text-yellow-400";
  return "text-red-400";
}

function getModeEmoji(mode: string): string {
  const map: Record<string, string> = {
    words: "📝",
    sentences: "📖",
    code: "💻",
    quotes: "💬",
    custom: "✨",
    numbers: "🔢",
    punctuation: "❗",
  };
  return map[mode.toLowerCase()] || "⌨️";
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

const rowVariants: any = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.04,
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export default function SessionHistory({ sessions }: SessionHistoryProps) {
  const sorted = [...sessions]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 20);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
    >
      <h2 className="text-lg font-semibold text-white/80 mb-4">
        📋 Recent Sessions
      </h2>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-white/30">
          <span className="text-4xl mb-3">🏁</span>
          <p className="text-sm text-center max-w-xs">
            No sessions recorded yet. Complete a typing test to see your history
            here!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-white/40 text-xs uppercase tracking-wider font-medium py-3 px-3">
                  Mode
                </th>
                <th className="text-left text-white/40 text-xs uppercase tracking-wider font-medium py-3 px-3">
                  Difficulty
                </th>
                <th className="text-right text-white/40 text-xs uppercase tracking-wider font-medium py-3 px-3">
                  WPM
                </th>
                <th className="text-right text-white/40 text-xs uppercase tracking-wider font-medium py-3 px-3">
                  Accuracy
                </th>
                <th className="text-right text-white/40 text-xs uppercase tracking-wider font-medium py-3 px-3">
                  Duration
                </th>
                <th className="text-right text-white/40 text-xs uppercase tracking-wider font-medium py-3 px-3">
                  Max Combo
                </th>
                <th className="text-right text-white/40 text-xs uppercase tracking-wider font-medium py-3 px-3">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((session, index) => (
                <motion.tr
                  key={session.timestamp + "-" + index}
                  custom={index}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200 group"
                >
                  <td className="py-3 px-3">
                    <span className="flex items-center gap-2 text-white/70 text-sm">
                      <span>{getModeEmoji(session.mode)}</span>
                      <span className="capitalize">{session.mode}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-white/50 text-sm capitalize">
                      {session.difficulty || "—"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`font-mono font-bold text-sm ${getWpmColor(session.wpm)}`}
                    >
                      {Math.round(session.wpm)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`font-mono text-sm ${getAccuracyColor(session.accuracy)}`}
                    >
                      {session.accuracy.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-white/50 font-mono text-sm">
                      {formatDuration(session.duration)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-white/50 font-mono text-sm">
                      {session.maxCombo ?? "—"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-white/40 text-sm whitespace-nowrap">
                      {getRelativeTime(session.timestamp)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
