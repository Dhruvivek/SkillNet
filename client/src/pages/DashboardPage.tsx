import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { LiquidButton } from '../components/ui/LiquidButton';
import { SkillTag } from '../components/ui/SkillTag';
import { mockUsers, mockQuestions, mockTeams } from '../data/mock';
import { ArrowUpRight, Activity, Users, Code, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
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
            Welcome back, Alex. Here's your pulse on the campus network.
          </p>
        </div>
        <Link to="/questions">
          <LiquidButton>Ask Question <Plus size={18} className="ml-2" /></LiquidButton>
        </Link>
      </div>

      {/* Primary Top Metrics - Clean Minimalist Horizon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div variants={itemVariants}>
          <GlassCard className="p-8 hoverEffect={false}">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-semibold tracking-wide text-slate-500 uppercase">Profile Views</span>
              <Activity size={18} className="text-primary" />
            </div>
            <div className="flex items-baseline gap-4">
              <h2 className="text-5xl font-extrabold tracking-tight">2,492</h2>
              <span className="text-sm font-bold text-accent-cyan bg-accent-cyan/10 px-2 py-1 rounded-full">+24%</span>
            </div>
          </GlassCard>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <GlassCard className="p-8 hoverEffect={false}">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-semibold tracking-wide text-slate-500 uppercase">Campus Reach</span>
              <Users size={18} className="text-accent-pink" />
            </div>
            <div className="flex items-baseline gap-4">
              <h2 className="text-5xl font-extrabold tracking-tight">1,248</h2>
              <span className="text-sm font-bold text-slate-400">Total</span>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard className="p-8 hoverEffect={false}">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-semibold tracking-wide text-slate-500 uppercase">Active Teams</span>
              <Code size={18} className="text-accent-cyan" />
            </div>
            <div className="flex items-baseline gap-4">
              <h2 className="text-5xl font-extrabold tracking-tight">42</h2>
              <span className="text-sm font-bold text-accent-cyan bg-accent-cyan/10 px-2 py-1 rounded-full">+3</span>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Main SaaS Layout: 2/3 Content, 1/3 Sidebar */}
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
                 {mockQuestions.map((q) => (
                   <div key={q.id} className="p-4 rounded-xl hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors cursor-pointer group flex gap-5 items-start">
                     <div className="flex flex-col items-center justify-center w-14 h-14 bg-white/50 dark:bg-white/5 rounded-2xl group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0 shadow-sm border border-slate-900/5 dark:border-white/5">
                       <ArrowUpRight size={18} />
                       <span className="text-xs font-bold leading-none mt-1">{q.upvotes}</span>
                     </div>
                     <div className="pt-1">
                       <h3 className="font-semibold text-lg text-slate-800 dark:text-white group-hover:text-primary transition-colors leading-snug mb-3">
                         {q.title}
                       </h3>
                       <div className="flex flex-wrap gap-2">
                         {q.tags.map(t => <SkillTag key={t} label={t} animated={false} className="text-[11px] py-1 px-2.5 bg-slate-900/5 dark:bg-white/5" />)}
                       </div>
                     </div>
                   </div>
                 ))}
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
                {mockTeams.slice(0, 2).map((t) => (
                  <div key={t.id} className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-white/5 flex flex-col group">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] font-bold tracking-widest uppercase text-accent-cyan">Hiring</span>
                    </div>
                    <h3 className="font-bold text-lg leading-tight mb-1">{t.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-white/60 mb-6">{t.event}</p>
                    
                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex -space-x-2">
                        {t.members.map(m => (
                          <img key={m.id} src={m.avatar} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#09090B]" />
                        ))}
                      </div>
                      <button className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors px-3 py-1.5 rounded-lg bg-primary/10">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-bold tracking-tight mb-4">Suggested Connections</h2>
            <GlassCard className="p-4 border-none shadow-none bg-transparent dark:bg-transparent">
              <div className="flex flex-col gap-2">
                {mockUsers.slice(1, 4).map((u) => (
                  <div key={u.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors cursor-pointer group border border-transparent hover:border-slate-200 dark:hover:border-white/10">
                    <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-white/10" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate">{u.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-white/60 truncate">{u.role}</p>
                    </div>
                    <div className="text-slate-400 group-hover:text-primary transition-colors">
                      <Plus size={18} />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
