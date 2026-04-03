import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { mockTeams } from '../data/mock';
import { Code, Calendar } from 'lucide-react';
import { LiquidButton } from '../components/ui/LiquidButton';

const TeamFinderPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Hackathon Team Finder</h1>
          <p className="text-white/60 mt-1">Join an existing team or create your own.</p>
        </div>
        <LiquidButton>Create Team</LiquidButton>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
           {/* Filters Sidebar */}
           <GlassCard className="p-5">
             <h3 className="font-bold mb-4 flex items-center gap-2"><Code size={18}/> Roles Needed</h3>
             <div className="space-y-2">
               {['Frontend Developer', 'Backend Developer', 'UI/UX Designer', 'Data Scientist', 'Project Manager'].map(role => (
                 <label key={role} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                   <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary focus:ring-primary focus:ring-offset-bg-dark" />
                   <span className="text-sm text-white/80">{role}</span>
                 </label>
               ))}
             </div>
           </GlassCard>
        </div>

        <div className="lg:col-span-2 space-y-4">
           {mockTeams.map(team => (
             <GlassCard key={team.id} className="p-6">
               <div className="flex flex-col sm:flex-row justify-between gap-4">
                 <div>
                   <div className="flex items-center gap-3 mb-2">
                     <h2 className="text-2xl font-bold text-white">{team.name}</h2>
                     <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-bold rounded">HIRING</span>
                   </div>
                   <p className="text-white/60 flex items-center gap-2 text-sm mb-4">
                     <Calendar size={14} /> {team.event}
                   </p>
                   
                   <div className="mb-4">
                     <p className="text-sm font-medium mb-2 opacity-80">Looking for:</p>
                     <div className="flex flex-wrap gap-2">
                       {team.lookingFor.map(role => (
                         <span key={role} className="text-xs bg-white/10 px-3 py-1 rounded-full text-white/90 border border-white/10">
                           {role}
                         </span>
                       ))}
                     </div>
                   </div>

                   <div className="flex items-center gap-3 mt-6">
                     <p className="text-sm font-medium text-white/60 mr-2">Current Members:</p>
                     <div className="flex -space-x-3">
                       {team.members.map(m => (
                         <img key={m.id} src={m.avatar} title={m.name} className="w-8 h-8 rounded-full border-2 border-bg-dark" alt={m.name} />
                       ))}
                     </div>
                   </div>
                 </div>

                 <div className="flex flex-col justify-end">
                   <LiquidButton variant="outline" className="w-full sm:w-auto">Apply Now</LiquidButton>
                 </div>
               </div>
             </GlassCard>
           ))}
        </div>
      </div>
    </div>
  );
};

export default TeamFinderPage;
