"use client";

import { motion } from 'motion/react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function GameModeShowcase() {
  const modes = [
    { icon: "🏆", name: "Classic", desc: "The standard typing experience", color: "blue" },
    { icon: "🧘", name: "Zen", desc: "No timer, no pressure, just flow", color: "emerald" },
    { icon: "⏱️", name: "Time Attack", desc: "Race against the clock", color: "amber" },
    { icon: "♾️", name: "Endless", desc: "Type until you drop", color: "purple" },
    { icon: "💬", name: "Quotes", desc: "Type famous quotes", color: "pink" },
    { icon: "💻", name: "Code", desc: "Type real code snippets", color: "cyan" }
  ];

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto relative z-10 text-center">
      <h2 className="text-4xl md:text-5xl font-bold gradient-text-rainbow mb-16 inline-block">Choose Your Challenge</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {modes.map((mode, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className={`glass-strong rounded-2xl p-6 text-left group hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all`}
          >
            <div className="flex items-center gap-4 mb-3">
              <span className="text-3xl bg-white/5 w-12 h-12 flex items-center justify-center rounded-xl">{mode.icon}</span>
              <h3 className={`text-xl font-bold group-hover:text-${mode.color}-400 transition-colors`}>{mode.name}</h3>
            </div>
            <p className="text-white/50 text-sm ml-16">{mode.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        className="mt-16"
      >
        <Link href="/play">
          <Button variant="primary" size="lg" className="px-12 py-4 text-lg">Play Now</Button>
        </Link>
      </motion.div>
    </section>
  );
}
