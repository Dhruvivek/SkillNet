import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkGlobal = document.documentElement.classList.contains('dark');
    setIsDark(isDarkGlobal);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors relative overflow-hidden group mix-blend-difference"
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0, scale: isDark ? 0.8 : 1, opacity: isDark ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center text-white"
      >
        <Sun size={18} />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : -180, scale: isDark ? 1 : 0.8, opacity: isDark ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center text-white"
      >
        <Moon size={18} />
      </motion.div>
      
      {/* Invisible placeholder for sizing */}
      <div className="opacity-0"><Sun size={18} /></div>
    </button>
  );
};
