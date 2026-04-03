import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockUsers } from '../data/mock';
import { GlassCard } from '../components/ui/GlassCard';
import { SkillTag } from '../components/ui/SkillTag';
import { X, Heart, MapPin, Briefcase, RotateCcw } from 'lucide-react';

// Using actual users as a candidate pool
const MatchPage: React.FC = () => {
  const [candidates, setCandidates] = useState(mockUsers);
  
  // When a card is swiped, remove it from the array
  const handleSwipe = (direction: 'left' | 'right', id: string) => {
    // In a real app, send swipe to API here
    setTimeout(() => {
      setCandidates(prev => prev.filter(c => c.id !== id));
    }, 200);
  };

  const currentCandidate = candidates[0];

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-10 w-full">
         <h1 className="text-4xl font-extrabold tracking-tight mb-2">Co-Founder Match</h1>
         <p className="text-slate-500 dark:text-white/60 font-medium">Swipe right to connect. Swipe left to pass.</p>
      </div>

      <div className="relative w-full max-w-sm h-[500px]">
        <AnimatePresence>
          {candidates.map((user, index) => {
             // Only render top 2 cards for performance and visual stacking
             if (index > 1) return null;
             
             const isTop = index === 0;

             return (
               <motion.div
                 key={user.id}
                 className="absolute inset-0 w-full h-full"
                 style={{ zIndex: candidates.length - index }}
                 initial={{ scale: 0.95, y: 30, opacity: 0 }}
                 animate={{ 
                   scale: isTop ? 1 : 0.95, 
                   y: isTop ? 0 : 20, 
                   opacity: 1 
                 }}
                 exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                 drag={isTop ? "x" : false}
                 dragConstraints={{ left: 0, right: 0 }}
                 onDragEnd={(e, { offset, velocity }) => {
                   const swipeThreshold = 100;
                   if (offset.x > swipeThreshold) {
                     handleSwipe('right', user.id);
                   } else if (offset.x < -swipeThreshold) {
                     handleSwipe('left', user.id);
                   }
                 }}
               >
                 <GlassCard className="w-full h-full overflow-hidden flex flex-col p-0 border border-slate-200 dark:border-white/10 shadow-2xl relative bg-white dark:bg-[#09090B]">
                   
                   {/* Abstract background behind avatar */}
                   <div className="h-2/5 w-full bg-gradient-to-br from-primary via-primary-dark to-accent-cyan relative">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                   </div>

                   {/* Avatar */}
                   <div className="absolute top-[30%] left-6 -translate-y-1/2">
                     <img 
                       src={user.avatar} 
                       alt={user.name} 
                       className="w-24 h-24 rounded-2xl border-4 border-white dark:border-[#09090B] object-cover bg-white shadow-xl pointer-events-none" 
                     />
                   </div>

                   {/* Content */}
                   <div className="pt-16 px-6 pb-6 flex-1 flex flex-col pointer-events-none">
                     <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
                     <p className="text-primary font-bold text-sm mb-4">{user.role}</p>
                     
                     <div className="flex flex-col gap-2 text-sm text-slate-500 dark:text-white/60 font-medium mb-4">
                        <span className="flex items-center gap-1.5"><MapPin size={14} /> Campus Main Library</span>
                        <span className="flex items-center gap-1.5"><Briefcase size={14} /> Looking for Hackathon Team</span>
                     </div>

                     <p className="text-sm font-medium text-slate-700 dark:text-white/80 line-clamp-3 mb-4">
                       {user.bio}
                     </p>

                     <div className="mt-auto">
                       <div className="flex flex-wrap gap-1.5">
                         {user.skills.slice(0, 3).map(skill => (
                           <SkillTag key={skill} label={skill} animated={false} className="text-[10px] py-1 shadow-sm border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5" />
                         ))}
                         {user.skills.length > 3 && (
                           <span className="text-[10px] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2 py-1 rounded text-slate-500 font-bold">+{user.skills.length - 3}</span>
                         )}
                       </div>
                     </div>
                   </div>
                 </GlassCard>
               </motion.div>
             );
          })}
        </AnimatePresence>

        {candidates.length === 0 && (
          <GlassCard className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 text-center border-dashed border-2">
             <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
               <RotateCcw size={24} className="text-slate-400" />
             </div>
             <h3 className="text-xl font-bold mb-2">No more hackers!</h3>
             <p className="text-slate-500 dark:text-white/60 text-sm font-medium">You've swiped through everyone on campus. Check back later.</p>
             <button onClick={() => setCandidates(mockUsers)} className="mt-6 text-primary font-bold text-sm hover:underline">
               Reset Stack
             </button>
          </GlassCard>
        )}
      </div>

      {/* Manual Action Buttons (Connected only if there is a top card) */}
      <div className={`flex gap-6 mt-10 transition-opacity ${candidates.length > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
         <button 
           onClick={() => handleSwipe('left', currentCandidate?.id)}
           className="w-16 h-16 rounded-full bg-white dark:bg-[#09090B] border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-center text-red-500 hover:scale-110 active:scale-95 transition-transform"
         >
           <X size={32} />
         </button>
         <button 
           onClick={() => handleSwipe('right', currentCandidate?.id)}
           className="w-16 h-16 rounded-full bg-white dark:bg-[#09090B] border border-slate-200 dark:border-white/10 shadow-[0_0_40px_-5px_rgba(255,148,77,0.3)] flex items-center justify-center text-primary hover:scale-110 active:scale-95 transition-transform"
         >
           <Heart size={28} className="fill-primary" />
         </button>
      </div>
    </div>
  );
};

export default MatchPage;
