"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Play', href: '/play' },
    { name: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-6 left-4 right-4 md:left-8 md:right-8 h-16 z-50 rounded-xl"
    >
      {/* Background with Gradient Border */}
      <div className="absolute inset-0 rounded-xl bg-[#0a0a1a]/80 backdrop-blur-2xl border border-transparent [background:linear-gradient(#0a0a1a,#0a0a1a)_padding-box,linear-gradient(to_right,rgba(59,130,246,0.5),rgba(139,92,246,0.5))_border-box] shadow-[0_10px_40px_-10px_rgba(59,130,246,0.2)]" />

      <div className="relative w-full h-full px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <span className="text-2xl font-bold text-white tracking-wide group-hover:text-glow-white transition-all">
            Velyxor
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {links.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`relative px-1 py-2 text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-white/60 hover:text-white'}`}
              >
                {link.name}
                {isActive && (
                  <motion.div 
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_8px_rgba(139,92,246,0.8)] rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile Nav Toggle */}
        <button 
          className="md:hidden text-white/70 hover:text-white p-2 relative z-10"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-20 left-0 right-0 bg-[#0a0a1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl"
        >
          <div className="flex flex-col gap-2">
            {links.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white font-medium border border-white/10' : 'text-white/70 hover:bg-white/5'}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
