import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassInput } from '../components/ui/GlassInput';
import { Code, Calendar, Check, Clock, UserPlus } from 'lucide-react';
import { LiquidButton } from '../components/ui/LiquidButton';
import { hackathonAPI, connectionAPI, getUser, isLoggedIn } from '../lib/api';
import { useNavigate } from 'react-router-dom';

const TeamFinderPage: React.FC = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTeam, setNewTeam] = useState({ title: '', description: '', requiredSkills: '' });
  const [creating, setCreating] = useState(false);
  const [applyingIds, setApplyingIds] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const currentUser = getUser();

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

  const handleApply = async (team: any) => {
    const teamId = team._id || team.id;
    const creatorId = team.createdBy?._id || team.createdBy;

    if (!creatorId || creatorId === currentUser?._id) return;

    setApplyingIds(prev => new Set(prev).add(teamId));
    try {
      // Send connection request to team creator as an "apply" signal
      await connectionAPI.send(creatorId);
      // Update the local team state to show pending
      setTeams(prev => prev.map(t =>
        (t._id || t.id) === teamId ? { ...t, applied: true } : t
      ));
    } catch (err: any) {
      // "already exists" is okay — update as pending
      if (err.message?.includes('already')) {
        setTeams(prev => prev.map(t =>
          (t._id || t.id) === teamId ? { ...t, applied: true } : t
        ));
      } else {
        console.error('Apply error:', err);
      }
    } finally {
      setApplyingIds(prev => { const s = new Set(prev); s.delete(teamId); return s; });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Hackathon Team Finder</h1>
          <p className="text-white/60 mt-1">Join an existing team or create your own for the next hackathon.</p>
        </div>
        <LiquidButton onClick={() => setShowCreate(!showCreate)}>{showCreate ? 'Cancel' : '+ Create Team'}</LiquidButton>
      </div>

      {showCreate && (
        <GlassCard className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Create a Team</h2>
          <GlassInput placeholder="Team / Hackathon Name" value={newTeam.title} onChange={(e: any) => setNewTeam(p => ({ ...p, title: e.target.value }))} />
          <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/40 font-medium min-h-[100px] resize-y focus:outline-none focus:border-primary"
            placeholder="Describe the event and what you're building..." value={newTeam.description} onChange={e => setNewTeam(p => ({ ...p, description: e.target.value }))} />
          <GlassInput placeholder="Required Skills (comma separated, e.g. React, Node.js, UI/UX)" value={newTeam.requiredSkills} onChange={(e: any) => setNewTeam(p => ({ ...p, requiredSkills: e.target.value }))} />
          <LiquidButton onClick={handleCreate} disabled={creating || !newTeam.title || !newTeam.description}>
            {creating ? 'Creating...' : 'Create Team'}
          </LiquidButton>
        </GlassCard>
      )}

      {loading ? (
        <div className="flex justify-center pt-8"><div className="w-10 h-10 rounded-full border-4 border-white/10 border-t-primary animate-spin" /></div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1 space-y-4">
            <GlassCard className="p-5">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Code size={18} /> Filter by Role</h3>
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

          {/* Team Cards */}
          <div className="lg:col-span-2 space-y-4">
            {teams.length > 0 ? teams.map(team => {
              const teamId = team._id || team.id;
              const isMyTeam = team.isMember || team.isCreator;
              const isApplied = team.applied;
              const isApplying = applyingIds.has(teamId);
              const isCreatorSelf = (team.createdBy?._id || team.createdBy) === currentUser?._id;

              return (
                <GlassCard key={teamId} className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-white">{team.name || team.title}</h2>
                        <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold rounded-full">
                          {team.status === 'recruiting' ? 'RECRUITING' : (team.status || 'OPEN').toUpperCase()}
                        </span>
                      </div>

                      <p className="text-white/60 flex items-center gap-2 text-sm mb-4">
                        <Calendar size={14} /> {team.event || team.description}
                      </p>

                      {(team.lookingFor || team.requiredSkills || []).length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Looking for</p>
                          <div className="flex flex-wrap gap-2">
                            {(team.lookingFor || team.requiredSkills || []).map((role: string) => (
                              <span key={role} className="text-xs bg-white/10 px-3 py-1 rounded-full text-white/90 border border-white/10">{role}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 mt-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/40">Members</p>
                        <div className="flex -space-x-2">
                          {(team.members || []).map((m: any) => (
                            <div key={m._id} title={m.name}
                              className="w-7 h-7 rounded-full border-2 border-[#09090B] bg-gradient-to-br from-primary/60 to-accent-cyan/60 flex items-center justify-center text-[9px] text-white font-bold">
                              {m.name?.[0] || '?'}
                            </div>
                          ))}
                        </div>
                        {team.createdBy && (
                          <span className="text-xs text-white/40 ml-2">
                            by {team.createdBy.name || 'Unknown'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Apply Button */}
                    <div className="flex flex-col justify-end shrink-0">
                      {isCreatorSelf ? (
                        <LiquidButton variant="outline" disabled className="opacity-50 cursor-default">
                          Your Team
                        </LiquidButton>
                      ) : isMyTeam ? (
                        <LiquidButton variant="outline" disabled className="opacity-60">
                          <Check size={16} className="mr-2" /> Joined
                        </LiquidButton>
                      ) : isApplied ? (
                        <LiquidButton variant="outline" disabled className="opacity-60">
                          <Clock size={16} className="mr-2" /> Request Sent
                        </LiquidButton>
                      ) : (
                        <LiquidButton onClick={() => handleApply(team)} disabled={isApplying}>
                          {isApplying ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Sending...
                            </div>
                          ) : (
                            <><UserPlus size={16} className="mr-2" /> Apply to Join</>
                          )}
                        </LiquidButton>
                      )}
                    </div>
                  </div>
                </GlassCard>
              );
            }) : (
              <div className="text-center py-16 text-white/50 font-medium">
                No teams yet. Be the first to create one!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamFinderPage;
