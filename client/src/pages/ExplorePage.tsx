import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassInput } from '../components/ui/GlassInput';
import { LiquidButton } from '../components/ui/LiquidButton';
import { mockUsers } from '../data/mock';
import { Search, UserPlus } from 'lucide-react';

const ExplorePage: React.FC = () => {
  const [search, setSearch] = useState('');
  
  const filteredUsers = mockUsers.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-6 pt-4">
        <h1 className="text-4xl font-bold">Find Talent</h1>
        <GlassInput 
          icon={<Search size={20} />} 
          placeholder="Search by name, role, or skill (e.g. 'React', 'Alex')..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-lg py-4 shadow-2xl"
        />
        <div className="flex flex-wrap gap-2 justify-center">
          {["Frontend", "Backend", "Machine Learning", "Design"].map(filter => (
             <span key={filter} className="text-sm px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
               {filter}
             </span>
          ))}
        </div>
      </div>

      <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-8">
        <AnimatePresence>
          {filteredUsers.map((user) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={user.id}
            >
              <GlassCard className="flex flex-col h-full group hover:border-primary/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/10" />
                  <div>
                    <h3 className="font-bold text-lg">{user.name}</h3>
                    <p className="text-sm text-primary font-medium">{user.role}</p>
                  </div>
                </div>
                
                <p className="text-white/60 text-sm mb-4 flex-1 line-clamp-3 relative z-10">{user.bio}</p>
                
                <div className="flex flex-wrap gap-1.5 mb-6 relative z-10">
                  {user.skills.slice(0, 3).map(s => (
                    <span key={s} className="text-xs bg-white/10 px-2 py-1 rounded text-white/80">{s}</span>
                  ))}
                  {user.skills.length > 3 && (
                    <span className="text-xs bg-white/5 px-2 py-1 rounded text-white/50">+{user.skills.length - 3}</span>
                  )}
                </div>
                
                <LiquidButton variant="outline" className="w-full relative z-10">
                  <UserPlus size={16} className="mr-2" /> Connect
                </LiquidButton>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ExplorePage;
