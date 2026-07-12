"use client";

import { motion } from 'motion/react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  const titleWords = ["Type.", "Compete.", "Dominate."];
  
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background Gradient Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/30 via-purple-600/30 to-emerald-600/30 rounded-full blur-[100px] -z-10 animate-float-slow" />

      <motion.div 
        className="max-w-4xl mx-auto text-center z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mb-6">
          {titleWords.map((word, i) => (
            <motion.h1 
              key={i}
              variants={itemVariants}
              className={`text-6xl md:text-8xl font-black ${
                i === 0 ? 'text-blue-400 text-glow-blue' :
                i === 1 ? 'text-purple-400 text-glow-purple' :
                'text-emerald-400 text-glow-emerald'
              }`}
            >
              {word}
            </motion.h1>
          ))}
        </div>

        <motion.p 
          variants={itemVariants}
          className="text-xl md:text-2xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Master Every Keystroke. 
          Real-time stats, neon visuals, and endless game modes.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/play">
            <Button size="lg" className="w-full sm:w-auto text-lg px-10 py-4 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
              Start Typing
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto text-lg px-10 py-4">
              View Dashboard
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating Badges */}
      <motion.div 
        className="hidden lg:block absolute top-[20%] right-[15%] glass-strong rounded-2xl px-6 py-3 border border-white/10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, type: 'spring' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">🚀</span>
          <div>
            <div className="text-emerald-400 font-bold text-xl">120+ WPM</div>
            <div className="text-white/50 text-xs">Top Speed</div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="hidden lg:block absolute bottom-[25%] left-[10%] glass-strong rounded-2xl px-6 py-3 border border-white/10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, type: 'spring' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎯</span>
          <div>
            <div className="text-blue-400 font-bold text-xl">99%</div>
            <div className="text-white/50 text-xs">Accuracy</div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="hidden lg:block absolute bottom-[15%] right-[20%] glass-strong rounded-2xl px-6 py-3 border border-white/10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, type: 'spring' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎮</span>
          <div>
            <div className="text-purple-400 font-bold text-xl">10+ Modes</div>
            <div className="text-white/50 text-xs">To explore</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
