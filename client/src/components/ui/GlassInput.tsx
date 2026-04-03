import React from 'react';
import { cn } from '../../lib/utils';
import { Search } from 'lucide-react';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  isSearch?: boolean;
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, icon, label, isSearch, ...props }, ref) => {
    return (
      <div className="w-full relative flex flex-col gap-1.5">
        {label && <label className="text-sm font-medium text-white/80 ml-1">{label}</label>}
        <div className="relative flex items-center">
          {(icon || isSearch) && (
            <div className="absolute left-4 text-white/50">
              {icon || (isSearch && <Search size={18} />)}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "glass-input",
              (icon || isSearch) && "pl-11",
              className
            )}
            {...props}
          />
        </div>
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';
