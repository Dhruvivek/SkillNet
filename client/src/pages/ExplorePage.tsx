import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassInput } from '../components/ui/GlassInput';
import { LiquidButton } from '../components/ui/LiquidButton';
import { Search, UserPlus, Check, Clock } from 'lucide-react';
import { userAPI, connectionAPI, isLoggedIn } from '../lib/api';
import { useNavigate } from 'react-router-dom';

const ExplorePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/auth');
      return;
    }
    searchUsers('');
  }, []);

  const searchUsers = async (query: string) => {
    try {
      setLoading(true);
      const res = await userAPI.search({ q: query });
      setUsers(res.data || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleConnect = async (userId: string) => {
    try {
      await connectionAPI.send(userId);
      setUsers(prev => prev.map(u => 
        u._id === userId ? { ...u, connectionStatus: 'pending' } : u
      ));
    } catch (err: any) {
      console.error('Connection error:', err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-6 pt-4">
        <h1 className="text-4xl font-bold">Find Talent</h1>
        <GlassInput 
          icon={<Search size={20} />} 
          placeholder="Search by name, skill, or branch..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-lg py-4 shadow-2xl"
        />
        <div className="flex flex-wrap gap-2 justify-center">
          {["React", "Python", "Machine Learning", "Flutter"].map(filter => (
             <span 
               key={filter} 
               onClick={() => setSearch(filter)}
               className="text-sm px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
             >
               {filter}
             </span>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center pt-16">
          <div className="w-10 h-10 rounded-full border-4 border-white/10 border-t-primary animate-spin" />
        </div>
      ) : (
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-8">
          <AnimatePresence>
            {users.length > 0 ? users.map((user) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={user._id}
              >
                <GlassCard className="flex flex-col h-full group hover:border-primary/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/60 to-accent-cyan/60 flex items-center justify-center text-white font-bold text-2xl ring-2 ring-white/10">
                      {user.name?.[0] || '?'}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{user.name}</h3>
                      <p className="text-sm text-primary font-medium">{user.branch || 'Student'} {user.year ? `• Year ${user.year}` : ''}</p>
                    </div>
                  </div>
                  
                  <p className="text-white/60 text-sm mb-4 flex-1 line-clamp-3 relative z-10">{user.bio || 'No bio yet'}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-6 relative z-10">
                    {(user.skills || []).slice(0, 3).map((s: string) => (
                      <span key={s} className="text-xs bg-white/10 px-2 py-1 rounded text-white/80">{s}</span>
                    ))}
                    {(user.skills || []).length > 3 && (
                      <span className="text-xs bg-white/5 px-2 py-1 rounded text-white/50">+{user.skills.length - 3}</span>
                    )}
                  </div>
                  
                  {user.connectionStatus === 'accepted' ? (
                    <LiquidButton variant="outline" className="w-full relative z-10 opacity-60" disabled>
                      <Check size={16} className="mr-2" /> Connected
                    </LiquidButton>
                  ) : user.connectionStatus === 'pending' ? (
                    <LiquidButton variant="outline" className="w-full relative z-10 opacity-60" disabled>
                      <Clock size={16} className="mr-2" /> Pending
                    </LiquidButton>
                  ) : (
                    <LiquidButton variant="outline" className="w-full relative z-10" onClick={() => handleConnect(user._id)}>
                      <UserPlus size={16} className="mr-2" /> Connect
                    </LiquidButton>
                  )}
                </GlassCard>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-16 text-slate-500 dark:text-white/50 font-medium">
                {search ? 'No users found matching your search.' : 'No users on the network yet. Invite your friends!'}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default ExplorePage;
