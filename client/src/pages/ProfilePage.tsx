import React, { useState } from 'react';
import { mockUsers } from '../data/mock';
import { GlassCard } from '../components/ui/GlassCard';
import { SkillTag } from '../components/ui/SkillTag';
import { Edit3, Settings, Hash, Globe, ExternalLink, MapPin, Briefcase, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage: React.FC = () => {
  const user = mockUsers[0];
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* SaaS Style Header */}
      <GlassCard className="p-0 overflow-hidden relative border-none">
        {/* Cover Photo Area */}
        <div className="h-48 w-full bg-gradient-to-r from-primary via-primary-dark to-accent-cyan relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <button className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-sm transition-colors z-10">
              <Settings size={20} />
           </button>
        </div>
        
        {/* Profile Content */}
        <div className="px-8 pb-8 relative -mt-16">
           <div className="flex justify-between items-end mb-6">
             <div className="relative">
               <img 
                 src={user.avatar} 
                 alt={user.name} 
                 className="w-32 h-32 rounded-2xl border-4 border-[var(--bg-main)] bg-[var(--bg-main)] object-cover shadow-xl relative z-10" 
               />
               <button className="absolute bottom-[-8px] right-[-8px] p-2 bg-primary hover:bg-primary-dark rounded-full text-white shadow-lg transition-colors z-20">
                 <Edit3 size={14} />
               </button>
             </div>
             <div className="flex gap-3">
               {/* Social Links Requested by User */}
               <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors font-semibold text-sm">
                 <Hash size={18} /> <span className="hidden sm:inline">GitHub</span>
               </a>
               <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors font-semibold text-sm text-[#0077b5]">
                 <Globe size={18} /> <span className="hidden sm:inline">LinkedIn</span>
               </a>
             </div>
           </div>
           
           <div className="max-w-2xl">
             <h1 className="text-4xl font-extrabold tracking-tight mb-1">{user.name}</h1>
             <p className="text-primary font-bold text-lg mb-4">{user.role}</p>
             
             <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500 dark:text-white/60 mb-6">
                <span className="flex items-center gap-1.5"><MapPin size={16} /> Computer Science '27</span>
                <span className="flex items-center gap-1.5"><Briefcase size={16} /> Seeking Summer Internships</span>
                <span className="flex items-center gap-1.5"><Mail size={16} /> {user.name.toLowerCase().replace(' ', '.')}@university.edu</span>
             </div>

             <p className="text-slate-700 dark:text-white/80 leading-relaxed font-medium">
               {user.bio}
             </p>
           </div>
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
                <span className="font-bold text-lg">{user.connections}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-white/10">
                <span className="text-slate-500 dark:text-white/60 font-medium">Questions</span>
                <span className="font-bold text-lg">14</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500 dark:text-white/60 font-medium">Answers Given</span>
                <span className="font-bold text-lg">42</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-lg font-bold mb-4 tracking-tight">Top Skills</h2>
            <div className="flex flex-wrap gap-2">
              {user.skills.map(skill => (
                <SkillTag key={skill} label={skill} animated={false} />
              ))}
            </div>
          </GlassCard>
        </div>
        
        <div className="md:col-span-2">
          {activeTab === 'overview' && (
            <GlassCard className="p-8">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
                 <button className="text-primary text-sm font-bold">View all</button>
              </div>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-white/20 before:to-transparent">
                 
                 <div className="relative flex items-start gap-4 group">
                   <div className="flex items-center justify-center w-6 h-6 rounded-full border border-slate-200 dark:border-white/20 bg-[var(--bg-main)] text-accent-cyan shadow shrink-0 mt-1">
                     <div className="w-2 h-2 rounded-full bg-accent-cyan" />
                   </div>
                   <div className="flex-1 p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur shadow-sm">
                     <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-[var(--tw-white)]">Joined Team <span className="text-primary">Byte Me</span></div>
                        <time className="text-xs text-slate-500 dark:text-white/50 font-medium">2 days ago</time>
                     </div>
                     <p className="text-sm text-slate-600 dark:text-white/70 font-medium">Alex is now collaborating on the HackMIT main submission project.</p>
                   </div>
                 </div>

                 <div className="relative flex items-start gap-4 group">
                   <div className="flex items-center justify-center w-6 h-6 rounded-full border border-slate-200 dark:border-white/20 bg-[var(--bg-main)] text-primary shadow shrink-0 mt-1">
                     <div className="w-2 h-2 rounded-full bg-primary" />
                   </div>
                   <div className="flex-1 p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur shadow-sm">
                     <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-[var(--tw-white)]">Answered a Question</div>
                        <time className="text-xs text-slate-500 dark:text-white/50 font-medium">1 week ago</time>
                     </div>
                     <p className="text-sm text-slate-600 dark:text-white/70 font-medium">"How do I properly implement Framer Motion variants in React?"</p>
                   </div>
                 </div>

              </div>
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
