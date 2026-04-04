import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Bell, Grid, LogOut, UserCircle, Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../ui/ThemeToggle';
import { getUser, logout, connectionAPI, isLoggedIn } from '../../lib/api';

const desktopLinks = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/explore', label: 'Explore' },
  { path: '/teams', label: 'Teams' },
  { path: '/questions', label: 'Q&A' },
  { path: '/bounties', label: 'Bounties' },
  { path: '/leaderboard', label: 'Leaderboard' },
];

export const TopBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Fetch pending requests when logged in
  useEffect(() => {
    if (isLoggedIn()) {
      fetchPending();
    }
  }, []);

  const fetchPending = async () => {
    try {
      setLoadingNotifs(true);
      const res = await connectionAPI.getPending();
      setPendingRequests(res.data || []);
    } catch (err) {
      console.error('Fetch pending error:', err);
    } finally {
      setLoadingNotifs(false);
    }
  };

  const handleAccept = async (connectionId: string, userId: string) => {
    try {
      await connectionAPI.accept(connectionId);
      setPendingRequests(prev => prev.filter(r => r.connectionId !== connectionId));
    } catch (err) {
      console.error('Accept error:', err);
    }
  };

  const handleReject = async (connectionId: string) => {
    try {
      await connectionAPI.reject(connectionId);
      setPendingRequests(prev => prev.filter(r => r.connectionId !== connectionId));
    } catch (err) {
      console.error('Reject error:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  // Hide on landing and onboarding
  if (location.pathname === '/' || location.pathname === '/onboarding') {
    return null;
  }

  const userInitial = currentUser?.name?.[0]?.toUpperCase() || '?';

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
              <Link key={link.path} to={link.path}
                className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:text-white">
                <span className={cn('relative z-10', isActive ? 'text-white' : 'text-white/70')}>{link.label}</span>
                {isActive && (
                  <motion.div layoutId="top-nav-indicator"
                    className="absolute inset-0 bg-white/10 rounded-lg"
                    initial={false}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setShowNotifications(!showNotifications); fetchPending(); }}
              className="text-white/70 hover:text-white transition-colors relative p-1"
            >
              <Bell size={20} />
              {pendingRequests.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-accent-pink rounded-full text-[9px] font-black text-white flex items-center justify-center">
                  {pendingRequests.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-10 w-80 bg-[#0f0f13] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h3 className="font-bold text-sm">Notifications</h3>
                    {pendingRequests.length > 0 && (
                      <span className="text-xs bg-accent-pink/20 text-accent-pink font-bold px-2 py-0.5 rounded-full">
                        {pendingRequests.length} pending
                      </span>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {loadingNotifs ? (
                      <div className="p-6 flex justify-center">
                        <div className="w-6 h-6 rounded-full border-2 border-white/10 border-t-primary animate-spin" />
                      </div>
                    ) : pendingRequests.length > 0 ? (
                      pendingRequests.map((req) => (
                        <div key={req.connectionId} className="p-4 border-b border-white/5 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/60 to-accent-cyan/60 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {req.user?.name?.[0] || '?'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm truncate">{req.user?.name}</p>
                            <p className="text-xs text-white/50">wants to connect</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => handleAccept(req.connectionId, req.user?._id)}
                              className="w-8 h-8 bg-primary/20 hover:bg-primary/40 text-primary rounded-full flex items-center justify-center transition-colors"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => handleReject(req.connectionId)}
                              className="w-8 h-8 bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 rounded-full flex items-center justify-center transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-white/40 font-medium text-sm">
                        No new notifications
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Avatar — initials, no image */}
          <Link to="/profile" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/70 to-accent-cyan/70 flex items-center justify-center text-white font-bold text-sm border-2 border-white/10 group-hover:border-primary/50 transition-colors">
              {userInitial}
            </div>
          </Link>

          {/* Logout */}
          <button onClick={handleLogout} className="text-white/40 hover:text-red-400 transition-colors hidden md:block" title="Logout">
            <LogOut size={18} />
          </button>

          <button className="md:hidden text-white/70 hover:text-white transition-colors">
            <Grid size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};
