import React from 'react';
import { motion } from 'framer-motion';
import { mockUsers } from '../data/mock';
import { GlassCard } from '../components/ui/GlassCard';
import { Trophy, Star, Zap, Flame } from 'lucide-react';

const LeaderboardPage: React.FC = () => {
  // Mock sort users by a hypothetical score
  const sortedUsers = [...mockUsers].map((u, i) => ({ ...u, score: (mockUsers.length - i) * 1540 })).sort((a, b) => b.score - a.score);
  
  const topThree = sortedUsers.slice(0, 3);
  const rest = sortedUsers.slice(3, 10);

  // Helper to arrange top 3 visually: 2nd, 1st, 3rd
  const podiumOrder = topThree.length === 3 ? [topThree[1], topThree[0], topThree[2]] : [];

  return (
    <div className="max-w-5xl mx-auto pb-16">
      <div className="text-center mb-16">
         <h1 className="text-4xl font-extrabold tracking-tight mb-3">Campus Leaderboard</h1>
         <p className="text-slate-500 dark:text-white/60 font-medium text-lg">Top contributors, hackers, and builders on campus this month.</p>
      </div>

      {/* The Podium UI */}
      {podiumOrder.length === 3 && (
        <div className="flex justify-center items-end gap-2 sm:gap-6 mb-20 px-4 mt-12 sm:mt-24">
          
          {/* 2nd Place (Silver) */}
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="w-1/3 max-w-[200px] flex flex-col items-center">
             <div className="relative mb-2 sm:mb-4">
               <img src={podiumOrder[0].avatar} className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-slate-300 dark:border-white/20 shadow-xl" alt="" />
               <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 bg-slate-200 text-slate-800 font-black text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full shadow-lg">2ND</div>
             </div>
             <p className="font-bold text-center truncate w-full px-2 text-sm sm:text-base">{podiumOrder[0].name}</p>
             <p className="text-xs text-slate-500 dark:text-white/60 font-medium">{podiumOrder[0].score} pts</p>
             <div className="w-full bg-gradient-to-t from-slate-200 to-slate-100 dark:from-white/10 dark:to-white/5 h-24 mt-4 rounded-t-2xl border border-b-0 border-slate-300 dark:border-white/20 shadow-inner flex justify-center pt-4">
               <Star className="text-slate-400" />
             </div>
          </motion.div>

          {/* 1st Place (Gold) */}
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-1/3 max-w-[220px] flex flex-col items-center z-10">
             <div className="relative mb-2 sm:mb-4">
               <div className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2"><Trophy size={24} className="sm:w-8 sm:h-8 text-yellow-400 fill-yellow-400 drop-shadow-xl" /></div>
               <img src={podiumOrder[1].avatar} className="w-20 h-20 sm:w-32 sm:h-32 rounded-full object-cover border-4 sm:border-[6px] border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.4)]" alt="" />
               <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-950 font-black text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg">1ST</div>
             </div>
             <p className="font-bold text-center truncate w-full px-2 mt-2 text-base sm:text-lg">{podiumOrder[1].name}</p>
             <p className="text-sm text-yellow-500 font-bold">{podiumOrder[1].score} pts</p>
             <div className="w-full bg-gradient-to-t from-yellow-500/20 to-yellow-500/5 h-36 mt-4 rounded-t-3xl border border-b-0 border-yellow-500/30 shadow-[inset_0_4px_20px_rgba(250,204,21,0.2)] flex justify-center pt-6">
               <Flame className="text-yellow-500 drop-shadow-md" size={32} />
             </div>
          </motion.div>

          {/* 3rd Place (Bronze) */}
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="w-1/3 max-w-[200px] flex flex-col items-center">
             <div className="relative mb-2 sm:mb-4">
               <img src={podiumOrder[2].avatar} className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-orange-400/60 shadow-xl" alt="" />
               <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 bg-orange-400/20 backdrop-blur-md border border-orange-400/50 text-orange-600 dark:text-orange-400 font-black text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full shadow-lg">3RD</div>
             </div>
             <p className="font-bold text-center truncate w-full px-2 text-sm sm:text-base">{podiumOrder[2].name}</p>
             <p className="text-xs text-slate-500 dark:text-white/60 font-medium">{podiumOrder[2].score} pts</p>
             <div className="w-full bg-gradient-to-t from-orange-400/10 to-transparent h-16 mt-4 rounded-t-2xl border border-b-0 border-orange-400/20 shadow-inner flex justify-center pt-2">
               <Zap className="text-orange-400/60" size={20} />
             </div>
          </motion.div>

        </div>
      )}

      {/* Remaining Ranks List */}
      <GlassCard className="p-2 sm:p-4 overflow-hidden border border-slate-200 dark:border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest">
                 <th className="py-4 px-4 sm:px-6 w-16 text-center">Rank</th>
                 <th className="py-4 px-4 sm:px-6">Hacker</th>
                 <th className="py-4 px-4 sm:px-6 hidden sm:table-cell">Role</th>
                 <th className="py-4 px-4 sm:px-6 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {rest.length > 0 ? rest.map((user, idx) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                  <td className="py-4 px-4 sm:px-6 text-center font-bold text-slate-400 dark:text-white/40">{idx + 4}</td>
                  <td className="py-4 px-4 sm:px-6 flex items-center gap-3">
                    <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-white/10" alt="" />
                    <div className="font-bold text-sm sm:text-base group-hover:text-primary transition-colors">{user.name}</div>
                  </td>
                  <td className="py-4 px-4 sm:px-6 hidden sm:table-cell text-sm font-medium text-slate-500 dark:text-white/60">{user.role}</td>
                  <td className="py-4 px-4 sm:px-6 text-right font-bold text-primary">{user.score}</td>
                </tr>
              )) : (
                <tr>
                   <td colSpan={4} className="py-8 text-center text-sm font-medium text-slate-500 dark:text-white/50">
                     Only 3 hackers qualify for the leaderboard so far. Keep building!
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default LeaderboardPage;
