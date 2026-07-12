"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "motion/react";
import type { UserStats } from "@/lib/storage";

interface StatsOverviewProps {
  stats: UserStats;
}

function AnimatedNumber({
  value,
  suffix = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
}) {
  const spring = useSpring(0, { stiffness: 50, damping: 20, mass: 1 });
  const display = useTransform(spring, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString()
  );
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    spring.set(value);
    const unsubscribe = display.on("change", (v) => setDisplayValue(v));
    return () => unsubscribe();
  }, [value, spring, display]);

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
}

function formatPracticeTime(totalSeconds: number): string {
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) {
    const remainingMins = minutes % 60;
    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

const cardVariants: any = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const statCards = [
  {
    icon: "🚀",
    label: "Best WPM",
    key: "bestWpm" as const,
    color: "text-emerald-400",
    glowColor: "shadow-emerald-500/20",
    borderGlow: "hover:border-emerald-500/30",
    suffix: "",
    decimals: 0,
  },
  {
    icon: "📊",
    label: "Average WPM",
    key: "avgWpm" as const,
    color: "text-blue-400",
    glowColor: "shadow-blue-500/20",
    borderGlow: "hover:border-blue-500/30",
    suffix: "",
    decimals: 1,
  },
  {
    icon: "🎯",
    label: "Best Accuracy",
    key: "bestAccuracy" as const,
    color: "text-emerald-400",
    glowColor: "shadow-emerald-500/20",
    borderGlow: "hover:border-emerald-500/30",
    suffix: "%",
    decimals: 1,
  },
  {
    icon: "🏋️",
    label: "Total Sessions",
    key: "totalSessions" as const,
    color: "text-purple-400",
    glowColor: "shadow-purple-500/20",
    borderGlow: "hover:border-purple-500/30",
    suffix: "",
    decimals: 0,
  },
];

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const totalPracticeTime =
    "totalPracticeTime" in stats
      ? (stats as UserStats & { totalPracticeTime: number }).totalPracticeTime
      : 0;

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.key}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`
              relative overflow-hidden
              bg-white/5 backdrop-blur-md
              border border-white/10 rounded-2xl p-6
              transition-colors duration-300
              ${card.borderGlow}
              hover:shadow-lg ${card.glowColor}
              group cursor-default
            `}
          >
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{card.icon}</span>
                <span className="text-white/50 text-sm font-medium tracking-wide">
                  {card.label}
                </span>
              </div>
              <div className={`text-4xl font-bold ${card.color} font-mono`}>
                <AnimatedNumber
                  value={stats[card.key]}
                  suffix={card.suffix}
                  decimals={card.decimals}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Total practice time */}
      {totalPracticeTime > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center text-white/30 text-sm mt-4"
        >
          ⏱️ Total practice time:{" "}
          <span className="text-white/50 font-medium">
            {formatPracticeTime(totalPracticeTime)}
          </span>
        </motion.p>
      )}
    </div>
  );
}
