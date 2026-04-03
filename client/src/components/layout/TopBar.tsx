import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Bell, Grid } from 'lucide-react';
import { cn } from '../../lib/utils';
import { mockUsers } from '../../data/mock';
import { ThemeToggle } from '../ui/ThemeToggle';

const desktopLinks = [
  { path: '/', label: 'Home' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/explore', label: 'Explore' },
  { path: '/match', label: 'Match' },
  { path: '/teams', label: 'Teams' },
  { path: '/bounties', label: 'Bounties' },
  { path: '/leaderboard', label: 'Leaderboard' },
  { path: '/questions', label: 'Q&A' }
];

export const TopBar: React.FC = () => {
  const location = useLocation();
  const currentUser = mockUsers[0];

  // Hide on landing and onboarding
  if (location.pathname === '/' || location.pathname === '/onboarding') {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="glass-morphism rounded-2xl px-6 py-3 flex items-center justify-between shadow-xl">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-tr from-primary to-accent-cyan p-2 rounded-xl group-hover:scale-105 transition-transform">
            <Code2 size={24} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">
            Skill<span className="text-primary-dark font-black">Net</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {desktopLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:text-white"
              >
                <span className={cn("relative z-10", isActive ? "text-white" : "text-white/70")}>{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="top-nav-indicator"
                    className="absolute inset-0 bg-white/10 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button className="text-white/70 hover:text-white transition-colors relative">
            <Bell size={20} />
            <span className="absolute 0 right-0 w-2 h-2 bg-accent-pink rounded-full"></span>
          </button>
          
          <Link to="/profile" className="flex items-center gap-2 group">
            <div className="relative rounded-full overflow-hidden w-9 h-9 border-2 border-white/10 group-hover:border-primary/50 transition-colors">
              <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </Link>
          
          <button className="md:hidden text-white/70 hover:text-white transition-colors">
            <Grid size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};
