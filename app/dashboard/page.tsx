"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { getRecentSessions, getUserStats, clearAllData } from "@/lib/storage";
import type { SessionResult, UserStats } from "@/lib/storage";
import { Button } from "@/components/ui/Button";
import StatsOverview from "@/components/dashboard/StatsOverview";
import WpmChart from "@/components/dashboard/WpmChart";
import SessionHistory from "@/components/dashboard/SessionHistory";
import Link from "next/link";

const sectionVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export default function DashboardPage() {
  const [sessions, setSessions] = useState<SessionResult[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setSessions(getRecentSessions(20));
    setStats(getUserStats());
    setIsLoaded(true);
  }, []);

  const handleClearData = useCallback(() => {
    clearAllData();
    setSessions([]);
    setStats(null);
    setShowClearConfirm(false);
  }, []);

  const hasData = stats !== null && stats.totalSessions > 0;

  // Show nothing until data is loaded to prevent flash
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/50 text-sm font-mono"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-30%] left-[-10%] w-[60%] h-[60%] bg-blue-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto py-8 px-4 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-white/50 text-sm mt-1">
              Track your typing progress
            </p>
          </div>

          {hasData && (
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button>⌨️ Practice</Button>
              </Link>

              {/* Clear data button */}
              {!showClearConfirm ? (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="px-4 py-2 text-sm text-red-400/70 hover:text-red-400 
                    border border-red-500/20 hover:border-red-500/40 
                    rounded-xl transition-all duration-200
                    hover:bg-red-500/10"
                >
                  Clear Data
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2"
                >
                  <span className="text-red-400 text-sm">Are you sure?</span>
                  <button
                    onClick={handleClearData}
                    className="px-3 py-1 text-xs font-medium text-white bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
                  >
                    Yes, Clear
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-1 text-xs font-medium text-white/50 hover:text-white/80 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>

        {hasData && stats ? (
          <>
            {/* Stats Overview */}
            <motion.section
              custom={0}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <StatsOverview stats={stats} />
            </motion.section>

            {/* WPM Chart */}
            <motion.section
              custom={1}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <WpmChart sessions={sessions} />
            </motion.section>

            {/* Session History */}
            <motion.section
              custom={2}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <SessionHistory sessions={sessions} />
            </motion.section>
          </>
        ) : (
          /* Welcome empty state */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <div className="relative mb-8">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-7xl"
              >
                ⌨️
              </motion.div>
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl -z-10" />
            </div>

            <h2 className="text-2xl font-bold text-white/90 mb-2">
              Welcome to Velyxor
            </h2>
            <p className="text-white/40 text-center max-w-md mb-8">
              Your typing stats will appear here once you complete your first
              session. Ready to test your speed?
            </p>

            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button>
                  🚀 Start Typing
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
