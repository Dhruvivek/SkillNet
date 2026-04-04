import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { LiquidButton } from '../components/ui/LiquidButton';
import { SkillTag } from '../components/ui/SkillTag';
import { ArrowUpRight, Activity, Users, Code, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { questionAPI, hackathonAPI, userAPI, connectionAPI, getUser, isLoggedIn } from '../lib/api';

const DashboardPage: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [user, setUserData] = useState<any>(null);
  const [stats, setStats] = useState({ connections: 0, questions: 0, teams: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/auth');
      return;
    }
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const currentUser = getUser();
      setUserData(currentUser);

      // Load data in parallel
      const [questionsRes, teamsRes, connectionsRes] = await Promise.allSettled([
        questionAPI.getAll({ page: 1 }),
        hackathonAPI.getAll(),
        connectionAPI.getAll(),
      ]);

      if (questionsRes.status === 'fulfilled') {
        setQuestions(questionsRes.value.data?.slice(0, 3) || []);
      }
      if (teamsRes.status === 'fulfilled') {
        setTeams(teamsRes.value.data?.slice(0, 2) || []);
      }
      if (connectionsRes.status === 'fulfilled') {
        setStats(prev => ({ ...prev, connections: connectionsRes.value.data?.length || 0 }));
      }

      // Load suggested users
      try {
        const searchRes = await userAPI.search({ q: '' });
        setSuggestions(searchRes.data?.slice(0, 3) || []);
      } catch {}

      setStats(prev => ({
        ...prev,
        questions: questionsRes.status === 'fulfilled' ? (questionsRes.value.data?.length || 0) : 0,
        teams: teamsRes.status === 'fulfilled' ? (teamsRes.value.data?.length || 0) : 0,
      }));
    } catch (err) {
      console.error('Dashboard load error:', err);
    }
  };

  const handleConnect = async (userId: string) => {
    try {
      await connectionAPI.send(userId);
      setSuggestions(prev => prev.map(u => 
        u._id === userId ? { ...u, connectionStatus: 'pending' } : u
      ));
    } catch (err: any) {
      console.error('Connection error:', err.message);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { ease: [0.25, 0.1, 0.25, 1] as const, duration: 0.6 } }
  };

  return (
    <motion.div 
      className="max-w-[1200px] mx-auto pb-12"
      initial="hidden"
      animate="show"
      variants={{
        show: { transition: { staggerChildren: 0.08 } }
      }}
    >
      {/* SaaS-style Clean Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-8 gap-6 border-b border-white/5 dark:border-white/5 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            Overview
          </h1>
          <p className="text-slate-600 dark:text-white/60 font-medium">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}. Here's your pulse on the campus network.
          </p>
        </div>
        <Link to="/questions">
          <LiquidButton>Ask Question <Plus size={18} className="ml-2" /></LiquidButton>
        </Link>
      </div>

      {/* Primary Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div variants={itemVariants}>
          <GlassCard className="p-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-semibold tracking-wide text-slate-500 uppercase">Questions</span>
              <Activity size={18} className="text-primary" />
            </div>
            <div className="flex items-baseline gap-4">
              <h2 className="text-5xl font-extrabold tracking-tight">{stats.questions}</h2>
              <span className="text-sm font-bold text-slate-400">Total</span>
            </div>
          </GlassCard>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <GlassCard className="p-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-semibold tracking-wide text-slate-500 uppercase">Connections</span>
              <Users size={18} className="text-accent-pink" />
            </div>
            <div className="flex items-baseline gap-4">
              <h2 className="text-5xl font-extrabold tracking-tight">{stats.connections}</h2>
              <span className="text-sm font-bold text-slate-400">Total</span>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard className="p-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-semibold tracking-wide text-slate-500 uppercase">Active Teams</span>
              <Code size={18} className="text-accent-cyan" />
            </div>
            <div className="flex items-baseline gap-4">
              <h2 className="text-5xl font-extrabold tracking-tight">{stats.teams}</h2>
              <span className="text-sm font-bold text-slate-400">Total</span>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div variants={itemVariants}>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-xl font-bold tracking-tight">Trending Discussions</h2>
              <Link to="/questions" className="text-sm font-medium text-primary hover:underline">View all</Link>
            </div>
            <GlassCard className="p-2 sm:p-4">
               <div className="divide-y divide-slate-200/10 dark:divide-white/5">
                 {questions.length > 0 ? questions.map((q) => (
                   <Link to={`/questions/${q._id || q.id}`} key={q._id || q.id} className="block">
                     <div className="p-4 rounded-xl hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors cursor-pointer group flex gap-5 items-start">
                       <div className="flex flex-col items-center justify-center w-14 h-14 bg-white/50 dark:bg-white/5 rounded-2xl group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0 shadow-sm border border-slate-900/5 dark:border-white/5">
                         <ArrowUpRight size={18} />
                         <span className="text-xs font-bold leading-none mt-1">{q.upvotes || 0}</span>
                       </div>
                       <div className="pt-1">
                         <h3 className="font-semibold text-lg text-slate-800 dark:text-white group-hover:text-primary transition-colors leading-snug mb-3">
                           {q.title}
                         </h3>
                         <div className="flex flex-wrap gap-2">
                           {(q.tags || []).map((t: string) => <SkillTag key={t} label={t} animated={false} className="text-[11px] py-1 px-2.5 bg-slate-900/5 dark:bg-white/5" />)}
                         </div>
                       </div>
                     </div>
                   </Link>
                 )) : (
                   <div className="p-8 text-center text-slate-500 dark:text-white/50 font-medium">
                     No questions yet. Be the first to ask!
                   </div>
                 )}
               </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-bold tracking-tight mb-4">Active Team Matches</h2>
            <GlassCard className="p-4">
              <div className="flex flex-col gap-3">
                {teams.length > 0 ? teams.slice(0, 2).map((t) => (
                  <div key={t._id || t.id} className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-white/5 flex flex-col group">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] font-bold tracking-widest uppercase text-accent-cyan">{t.status === 'recruiting' ? 'Hiring' : t.status}</span>
                    </div>
                    <h3 className="font-bold text-lg leading-tight mb-1">{t.name || t.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-white/60 mb-6">{t.event || t.description}</p>
                    
                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex -space-x-2">
                        {(t.members || []).slice(0, 3).map((m: any) => (
                          <div key={m._id} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#09090B] bg-gradient-to-br from-primary/60 to-accent-cyan/60 flex items-center justify-center text-[10px] text-white font-bold">
                            {m.name?.[0] || '?'}
                          </div>
                        ))}
                      </div>
                      <Link to="/teams" className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors px-3 py-1.5 rounded-lg bg-primary/10">
                        View Details
                      </Link>
                    </div>
                  </div>
                )) : (
                  <div className="p-4 text-center text-slate-500 dark:text-white/50 font-medium text-sm">
                    No active teams yet. Create one!
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-bold tracking-tight mb-4">Suggested Connections</h2>
            <GlassCard className="p-4 border-none shadow-none bg-transparent dark:bg-transparent">
              <div className="flex flex-col gap-2">
                {suggestions.length > 0 ? suggestions.map((u) => (
                  <div key={u._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors cursor-pointer group border border-transparent hover:border-slate-200 dark:hover:border-white/10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/60 to-accent-cyan/60 flex items-center justify-center text-white font-bold text-lg">
                      {u.name?.[0] || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate">{u.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-white/60 truncate">{u.skills?.slice(0, 2).join(', ') || 'No skills listed'}</p>
                    </div>
                    {u.connectionStatus === 'none' ? (
                      <button onClick={() => handleConnect(u._id)} className="text-slate-400 group-hover:text-primary transition-colors">
                        <Plus size={18} />
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">{u.connectionStatus}</span>
                    )}
                  </div>
                )) : (
                  <div className="p-4 text-center text-slate-500 dark:text-white/50 font-medium text-sm">
                    No suggestions yet. More users will appear as the network grows.
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
