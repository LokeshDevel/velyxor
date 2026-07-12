"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "size"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, disabled, ...props }, ref) => {
    
    let baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a1a] disabled:opacity-50 disabled:cursor-not-allowed";
    
    let variantStyles = "";
    switch (variant) {
      case 'primary':
        variantStyles = "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-400 hover:to-purple-500 hover:glow-blue focus:ring-blue-500 border border-white/10";
        break;
      case 'secondary':
        variantStyles = "bg-white/10 text-white hover:bg-white/20 border border-white/20 focus:ring-white/30";
        break;
      case 'ghost':
        variantStyles = "bg-transparent text-white/70 hover:text-white hover:bg-white/5 focus:ring-white/20";
        break;
      case 'danger':
        variantStyles = "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30 hover:border-rose-500/50 focus:ring-rose-500/50 hover:glow-rose";
        break;
    }

    let sizeStyles = "";
    switch (size) {
      case 'sm':
        sizeStyles = "px-3 py-1.5 text-sm";
        break;
      case 'md':
        sizeStyles = "px-5 py-2.5 text-base";
        break;
      case 'lg':
        sizeStyles = "px-8 py-3.5 text-lg";
        break;
    }

    return (
      <motion.button
        ref={ref}
        whileHover={disabled ? {} : { scale: 1.02 }}
        whileTap={disabled ? {} : { scale: 0.98 }}
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
