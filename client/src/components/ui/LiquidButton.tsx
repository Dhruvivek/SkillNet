import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface LiquidButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ children, className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseClasses = "relative z-10 flex items-center justify-center font-medium transition-colors";
    
    const variants = {
      primary: "liquid-button text-white",
      ghost: "text-white/80 hover:bg-white/10 hover:text-white glass-morphism",
      outline: "border border-primary text-primary hover:bg-primary/10"
    };

    const sizes = {
      sm: "text-sm px-4 py-2 rounded-lg",
      md: "text-base px-6 py-3 rounded-xl",
      lg: "text-lg px-8 py-4 rounded-2xl",
      icon: "p-3 rounded-full"
    };

    return (
      <motion.button
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.96 }}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
        {variant === 'primary' && (
          <motion.div
            className="absolute inset-0 rounded-[inherit] ring-1 ring-white/20"
            initial={false}
          />
        )}
      </motion.button>
    );
  }
);

LiquidButton.displayName = 'LiquidButton';
