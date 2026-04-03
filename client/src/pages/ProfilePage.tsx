import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { SkillTag } from '../components/ui/SkillTag';
import { Edit3, Settings, ExternalLink, MapPin, Briefcase, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { userAPI, getUser, setUser, isLoggedIn } from '../lib/api';
import { GlassInput } from '../components/ui/GlassInput';
import { LiquidButton } from '../components/ui/LiquidButton';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const [user, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', bio: '', branch: '', year: 1 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/auth');
      return;
    }
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await userAPI.getProfile();
      setUserData(res.data);
      setEditData({
        name: res.data.name || '',
        bio: res.data.bio || '',
        branch: res.data.branch || '',
        year: res.data.year || 1,
      });
    } catch (err) {
      console.error('Profile load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await userAPI.updateProfile(editData);
      setUserData(res.data);
      setUser(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Profile save error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-4 border-white/10 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* SaaS Style Header */}
      <GlassCard className="p-0 overflow-hidden relative border-none">
        {/* Cover Photo Area */}
        <div className="h-48 w-full bg-gradient-to-r from-primary via-primary-dark to-accent-cyan relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <button onClick={() => setIsEditing(!isEditing)} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-sm transition-colors z-10">
              <Settings size={20} />
           </button>
        </div>
        
        {/* Profile Content */}
        <div className="px-8 pb-8 relative -mt-16">
           <div className="flex justify-between items-end mb-6">
             <div className="relative">
               <div className="w-32 h-32 rounded-2xl border-4 border-[var(--bg-main)] bg-gradient-to-br from-primary/60 to-accent-cyan/60 flex items-center justify-center text-white font-bold text-5xl shadow-xl relative z-10">
                 {user.name?.[0] || '?'}
               </div>
               <button className="absolute bottom-[-8px] right-[-8px] p-2 bg-primary hover:bg-primary-dark rounded-full text-white shadow-lg transition-colors z-20">
                 <Edit3 size={14} />
               </button>
             </div>
           </div>
           
           {isEditing ? (
             <div className="max-w-2xl space-y-4">
               <GlassInput placeholder="Full Name" value={editData.name} onChange={e => setEditData(prev => ({ ...prev, name: e.target.value }))} />
               <GlassInput placeholder="Branch (e.g. Computer Science)" value={editData.branch} onChange={e => setEditData(prev => ({ ...prev, branch: e.target.value }))} />
               <GlassInput placeholder="Year" type="number" value={editData.year.toString()} onChange={e => setEditData(prev => ({ ...prev, year: parseInt(e.target.value) || 1 }))} />
               <textarea 
                 className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/40 font-medium min-h-[100px] resize-y focus:outline-none focus:border-primary"
                 placeholder="Bio"
                 value={editData.bio}
                 onChange={e => setEditData(prev => ({ ...prev, bio: e.target.value }))}
               />
               <div className="flex gap-3">
                 <LiquidButton onClick={handleSave}>Save Changes</LiquidButton>
                 <LiquidButton variant="outline" onClick={() => setIsEditing(false)}>Cancel</LiquidButton>
               </div>
             </div>
           ) : (
             <div className="max-w-2xl">
               <h1 className="text-4xl font-extrabold tracking-tight mb-1">{user.name}</h1>
               <p className="text-primary font-bold text-lg mb-4">{user.branch || 'Student'} {user.year ? `• Year ${user.year}` : ''}</p>
               
               <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500 dark:text-white/60 mb-6">
                  <span className="flex items-center gap-1.5"><MapPin size={16} />{user.branch || 'Not set'} {user.year ? `'${String(user.year + 24).slice(-2)}` : ''}</span>
                  <span className="flex items-center gap-1.5"><Briefcase size={16} />{user.availability ? 'Available for teams' : 'Not available'}</span>
                  <span className="flex items-center gap-1.5"><Mail size={16} />{user.email}</span>
               </div>

               <p className="text-slate-700 dark:text-white/80 leading-relaxed font-medium">
                 {user.bio || 'No bio set yet. Click the settings icon to add one!'}
               </p>
             </div>
           )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-slate-200 dark:border-white/10 px-8 bg-slate-50 dark:bg-white/5">
           {['overview', 'projects', 'activity'].map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`py-4 px-6 font-bold text-sm capitalize transition-colors relative ${activeTab === tab ? 'text-primary' : 'text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white'}`}
             >
               {tab}
               {activeTab === tab && (
                 <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
               )}
             </button>
           ))}
        </div>
      </GlassCard>

      {/* Tab Content */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <GlassCard className="p-6">
            <h2 className="text-lg font-bold mb-4 tracking-tight">Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-white/10">
                <span className="text-slate-500 dark:text-white/60 font-medium">Connections</span>
                <span className="font-bold text-lg">{user.connections?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-white/10">
                <span className="text-slate-500 dark:text-white/60 font-medium">Skills</span>
                <span className="font-bold text-lg">{user.skills?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500 dark:text-white/60 font-medium">Member since</span>
                <span className="font-bold text-sm">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-lg font-bold mb-4 tracking-tight">Top Skills</h2>
            <div className="flex flex-wrap gap-2">
              {(user.skills || []).length > 0 ? user.skills.map((skill: string) => (
                <SkillTag key={skill} label={skill} animated={false} />
              )) : (
                <p className="text-sm text-slate-500 dark:text-white/50">No skills set yet. Complete onboarding!</p>
              )}
            </div>
          </GlassCard>
        </div>
        
        <div className="md:col-span-2">
          {activeTab === 'overview' && (
            <GlassCard className="p-8">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold tracking-tight">About</h2>
              </div>
              <p className="text-slate-700 dark:text-white/80 leading-relaxed font-medium">
                {user.bio || 'This user has not added a bio yet.'}
              </p>
              {user.interests && user.interests.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-bold mb-3">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest: string) => (
                      <SkillTag key={interest} label={interest} animated={false} className="bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20" />
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
          )}

          {activeTab === 'projects' && (
             <GlassCard className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                <ExternalLink size={48} className="text-slate-300 dark:text-white/20 mb-4" />
                <h3 className="text-xl font-bold mb-2">No projects showcased yet</h3>
                <p className="text-slate-500 dark:text-white/60 font-medium max-w-sm">Connect your GitHub account or manually add previous hackathon projects to stand out.</p>
                <button className="mt-6 px-6 py-2 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-colors">
                  Add Project
                </button>
             </GlassCard>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
