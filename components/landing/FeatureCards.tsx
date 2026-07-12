"use client";

import { motion } from 'motion/react';

export function FeatureCards() {
  const features = [
    {
      icon: "⚡",
      title: "Speed Tests",
      description: "Challenge yourself with 15s, 30s, and 60s typing tests.",
      color: "blue"
    },
    {
      icon: "🎯",
      title: "Accuracy Training",
      description: "Improve precision with real-time feedback and combo tracking.",
      color: "emerald"
    },
    {
      icon: "🎮",
      title: "Game Modes",
      description: "Classic, Zen, Time Attack, Endless and more.",
      color: "purple"
    },
    {
      icon: "📊",
      title: "Analytics",
      description: "Track your progress with detailed statistics and charts.",
      color: "amber"
    },
    {
      icon: "⌨️",
      title: "Virtual Keyboard",
      description: "Visual key guides and finger placement hints.",
      color: "rose"
    },
    {
      icon: "💻",
      title: "Code Typing",
      description: "Practice typing real JavaScript and Python code.",
      color: "cyan"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold gradient-text-blue-purple mb-4">Everything You Need</h2>
        <p className="text-white/50 text-lg">Built for speed, designed for perfection.</p>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {features.map((feature, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            whileHover={{ scale: 1.02, translateY: -5 }}
            className={`glass-strong rounded-2xl p-6 border-transparent hover:border-${feature.color}-500/50 transition-colors group relative overflow-hidden`}
          >
            {/* Background glow on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-500/0 to-${feature.color}-500/0 group-hover:from-${feature.color}-500/10 group-hover:to-transparent transition-all duration-500`} />
            
            <div className="text-4xl mb-4 relative z-10">{feature.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2 relative z-10">{feature.title}</h3>
            <p className="text-white/60 leading-relaxed relative z-10">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
