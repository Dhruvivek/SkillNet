import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Compass, Home, MessageSquare, Users, User } from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/explore', icon: Compass, label: 'Explore' },
  { path: '/teams', icon: Users, label: 'Teams' },
  { path: '/chat', icon: MessageSquare, label: 'Chat' },
  { path: '/profile', icon: User, label: 'Profile' }
];

export const BottomNav: React.FC = () => {
  const location = useLocation();

  // Hide on landing and onboarding
  if (location.pathname === '/' || location.pathname === '/onboarding') {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2">
      <div className="glass-morphism rounded-2xl p-2 flex justify-between items-center relative">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative p-3 flex-1 flex flex-col items-center gap-1 tap-highlight-transparent"
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-0 bg-white/10 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon 
                size={20} 
                className={cn("relative z-10 transition-colors duration-300", isActive ? "text-primary-dark shadow-primary" : "text-white/60")} 
              />
              <span className={cn(
                "text-[10px] font-medium relative z-10 transition-all duration-300",
                isActive ? "text-white opacity-100" : "text-white/60 opacity-0 md:opacity-100"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
