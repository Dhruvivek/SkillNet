import React, { useRef, useState } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, hoverEffect = true, ...props }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!hoverEffect) return;
      const rect = internalRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    return (
      <motion.div
        ref={(el) => {
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
          internalRef.current = el as HTMLDivElement;
        }}
        onMouseMove={handleMouseMove}
        className={cn("glass-panel p-6 relative overflow-hidden group", className)}
        whileHover={hoverEffect ? { y: -4, scale: 1.005 } : undefined}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        {...props}
      >
        {hoverEffect && (
          <div
            className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-0 mix-blend-overlay dark:mix-blend-screen"
            style={{
              background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.4), transparent 40%)`,
            }}
          />
        )}
        <div className="relative z-10 h-full flex flex-col">{children}</div>
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
