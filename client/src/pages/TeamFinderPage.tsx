import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassInput } from '../components/ui/GlassInput';
import { Code, Calendar } from 'lucide-react';
import { LiquidButton } from '../components/ui/LiquidButton';
import { hackathonAPI, isLoggedIn } from '../lib/api';
import { useNavigate } from 'react-router-dom';

const TeamFinderPage: React.FC = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTeam, setNewTeam] = useState({ title: '', description: '', requiredSkills: '' });
  const [creating, setCreating] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/auth'); return; }
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const res = await hackathonAPI.getAll();
      setTeams(res.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleCreate = async () => {
    if (!newTeam.title || !newTeam.description) return;
    setCreating(true);
    try {
      const skills = newTeam.requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
      await hackathonAPI.create({ title: newTeam.title, description: newTeam.description, requiredSkills: skills });
      setNewTeam({ title: '', description: '', requiredSkills: '' });
      setShowCreate(false);
      loadTeams();
    } catch (err) { console.error(err); } finally { setCreating(false); }
  };

  const handleApply = async (teamId: string) => {
    try {
      await hackathonAPI.apply(teamId);
      loadTeams();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to apply.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Hackathon Team Finder</h1>
          <p className="text-white/60 mt-1">Join an existing team or create your own.</p>
        </div>
        <LiquidButton onClick={() => setShowCreate(!showCreate)}>{showCreate ? 'Cancel' : 'Create Team'}</LiquidButton>
      </div>

      {showCreate && (
        <GlassCard className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Create a Team</h2>
          <GlassInput placeholder="Team / Hackathon Name" value={newTeam.title} onChange={e => setNewTeam(p => ({ ...p, title: e.target.value }))} />
          <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/40 font-medium min-h-[100px] resize-y focus:outline-none focus:border-primary" placeholder="Describe the event and what you're building..." value={newTeam.description} onChange={e => setNewTeam(p => ({ ...p, description: e.target.value }))} />
          <GlassInput placeholder="Required Skills (comma separated)" value={newTeam.requiredSkills} onChange={e => setNewTeam(p => ({ ...p, requiredSkills: e.target.value }))} />
          <LiquidButton onClick={handleCreate} disabled={creating || !newTeam.title}>{creating ? 'Creating...' : 'Create Team'}</LiquidButton>
        </GlassCard>
      )}

      {loading ? (
        <div className="flex justify-center pt-8"><div className="w-10 h-10 rounded-full border-4 border-white/10 border-t-primary animate-spin" /></div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <GlassCard className="p-5">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Code size={18}/> Roles Needed</h3>
              <div className="space-y-2">
                {['Frontend Developer', 'Backend Developer', 'UI/UX Designer', 'Data Scientist', 'Project Manager'].map(role => (
                  <label key={role} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary focus:ring-primary" />
                    <span className="text-sm text-white/80">{role}</span>
                  </label>
                ))}
              </div>
            </GlassCard>
          </div>
          <div className="lg:col-span-2 space-y-4">
            {teams.length > 0 ? teams.map(team => (
              <GlassCard key={team._id || team.id} className="p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-white">{team.name || team.title}</h2>
                      <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-bold rounded">{team.status === 'recruiting' ? 'HIRING' : team.status?.toUpperCase()}</span>
                    </div>
                    <p className="text-white/60 flex items-center gap-2 text-sm mb-4"><Calendar size={14} /> {team.event || team.description}</p>
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2 opacity-80">Looking for:</p>
                      <div className="flex flex-wrap gap-2">
                        {(team.lookingFor || team.requiredSkills || []).map((role: string) => (
                          <span key={role} className="text-xs bg-white/10 px-3 py-1 rounded-full text-white/90 border border-white/10">{role}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-6">
                      <p className="text-sm font-medium text-white/60 mr-2">Members:</p>
                      <div className="flex -space-x-3">
                        {(team.members || []).map((m: any) => (
                          <div key={m._id} className="w-8 h-8 rounded-full border-2 border-[#09090B] bg-gradient-to-br from-primary/60 to-accent-cyan/60 flex items-center justify-center text-[10px] text-white font-bold">{m.name?.[0] || '?'}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end">
                    <LiquidButton 
                      variant="outline" 
                      className="w-full sm:w-auto"
                      onClick={() => {
                        if (team.isMember || team.applicationStatus === 'pending' || team.applicationStatus === 'accepted') {
                          setSelectedTeam(team);
                        } else {
                          handleApply(team.id || team._id);
                        }
                      }}
                    >
                      {team.isMember ? 'View Team' : 
                       team.applicationStatus === 'pending' ? 'Applied (View)' :
                       team.applicationStatus === 'accepted' ? 'Accepted (View)' :
                       'Apply Now'}
                    </LiquidButton>
                  </div>
                </div>
              </GlassCard>
            )) : (
              <div className="text-center py-16 text-white/50 font-medium">No teams yet. Create the first one!</div>
            )}
          </div>
        </div>
      )}

      {/* Team Details Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassCard className="w-full max-w-2xl p-8 space-y-6 relative border-primary/20 shadow-2xl">
            <button 
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors"
              onClick={() => setSelectedTeam(null)}
            >
              ✕
            </button>
            
            <div className="flex items-center gap-3 pr-8">
              <h2 className="text-3xl font-extrabold text-white">{selectedTeam.name || selectedTeam.title}</h2>
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded uppercase tracking-wider">
                {selectedTeam.status === 'recruiting' ? 'HIRING' : selectedTeam.status || 'ACTIVE'}
              </span>
            </div>
            
            <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Calendar size={18}/> Event Details</h3>
              <p className="text-white/80 whitespace-pre-wrap leading-relaxed">{selectedTeam.event || selectedTeam.description}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg text-white mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {(selectedTeam.lookingFor || selectedTeam.requiredSkills || []).map((role: string) => (
                  <span key={role} className="text-sm bg-white/10 px-4 py-1.5 rounded-full text-white/90 border border-white/10 shadow-sm">{role}</span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-white mb-3 flex items-center gap-2">Team Members <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{(selectedTeam.members || []).length}</span></h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {(selectedTeam.members || []).map((m: any) => (
                  <div key={m._id} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-full border border-white/10 bg-gradient-to-br from-primary/60 to-accent-cyan/60 flex items-center justify-center text-sm text-white font-bold shrink-0 overflow-hidden">
                      {m.profilePic ? <img src={m.profilePic} className="w-full h-full object-cover" /> : (m.name?.[0]?.toUpperCase() || '?')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate w-full">{m.name || 'Member'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4 flex justify-end border-t border-white/10">
              <LiquidButton onClick={() => setSelectedTeam(null)}>Close Window</LiquidButton>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default TeamFinderPage;
