import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

interface SkillTagProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
  animated?: boolean;
}

export const SkillTag: React.FC<SkillTagProps> = ({
  label,
  selected = false,
  onClick,
  onRemove,
  className,
  animated = true
}) => {
  const baseClasses = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer border";
  
  const variants = {
    selected: "bg-gradient-to-r from-primary to-accent-cyan border-transparent text-white shadow-lg",
    default: "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20"
  };

  const Component = animated ? motion.div : 'div';
  const animationProps = animated ? {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  } : {};

  return (
    <Component
      onClick={onClick}
      className={cn(baseClasses, selected ? variants.selected : variants.default, className)}
      {...animationProps}
    >
      {label}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </Component>
  );
};
