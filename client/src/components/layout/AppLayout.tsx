import React from 'react';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export const AppLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background ambient effects */}
      <div className="mesh-bg">
        <div className="mesh-blob-1" />
        <div className="mesh-blob-2" />
        <div className="mesh-blob-3" />
        <div className="noise-overlay" />
      </div>

      <TopBar />
      
      <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 md:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};
