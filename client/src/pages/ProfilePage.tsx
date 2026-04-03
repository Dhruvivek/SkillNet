import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { SkillTag } from '../components/ui/SkillTag';
import { Edit3, Settings, ExternalLink, MapPin, Briefcase, Mail, Star, GitFork } from 'lucide-react';
import { motion } from 'framer-motion';
import { userAPI, setUser, isLoggedIn } from '../lib/api';
import { GlassInput } from '../components/ui/GlassInput';
import { LiquidButton } from '../components/ui/LiquidButton';
import { useNavigate } from 'react-router-dom';

// Inline SVG icons (lucide-react v1 doesn't export Github/Linkedin)
const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedinIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// Extract GitHub username from a URL or plain username
const extractGithubUsername = (input: string): string => {
  if (!input) return '';
  try {
    const url = new URL(input.startsWith('http') ? input : `https://${input}`);
    const parts = url.pathname.split('/').filter(Boolean);
    return parts[0] || '';
  } catch {
    return input.trim();
  }
};

// Language color map
const LANG_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  Java: '#b07219', 'C++': '#f34b7d', C: '#555555', HTML: '#e34c26',
  CSS: '#563d7c', Go: '#00ADD8', Rust: '#dea584', Ruby: '#701516',
  Swift: '#ffac45', Kotlin: '#A97BFF', Dart: '#00B4AB', PHP: '#4F5D95',
};

const ProfilePage: React.FC = () => {
  const [user, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', bio: '', branch: '', year: 1, github: '', linkedin: '' });
  const [loading, setLoading] = useState(true);
  const [repos, setRepos] = useState<any[]>([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [reposError, setReposError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/auth'); return; }
    loadProfile();
  }, []);

  // Fetch GitHub repos when tab switches to projects and user has github set
  useEffect(() => {
    if (activeTab === 'projects' && user?.github) {
      fetchGithubRepos(user.github);
    }
  }, [activeTab, user?.github]);

  const loadProfile = async () => {
    try {
      const res = await userAPI.getProfile();
      setUserData(res.data);
      setEditData({
        name: res.data.name || '',
        bio: res.data.bio || '',
        branch: res.data.branch || '',
        year: res.data.year || 1,
        github: res.data.github || '',
        linkedin: res.data.linkedin || '',
      });
    } catch (err) {
      console.error('Profile load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGithubRepos = async (githubInput: string) => {
    const username = extractGithubUsername(githubInput);
    if (!username) return;
    setReposLoading(true);
    setReposError('');
    try {
      const res = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=9&type=public`
      );
      if (!res.ok) {
        if (res.status === 404) throw new Error(`GitHub user "${username}" not found`);
        throw new Error('Failed to fetch repositories');
      }
      const data = await res.json();
      // Sort by stars descending
      setRepos(data.sort((a: any, b: any) => b.stargazers_count - a.stargazers_count));
    } catch (err: any) {
      setReposError(err.message);
      setRepos([]);
    } finally {
      setReposLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await userAPI.updateProfile(editData);
      setUserData(res.data);
      setUser(res.data);
      setIsEditing(false);
      // Re-fetch repos if github changed
      if (editData.github) fetchGithubRepos(editData.github);
    } catch (err) {
      console.error('Profile save error:', err);
    }
  };

  const getLink = (url: string) => url.startsWith('http') ? url : `https://${url}`;

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
      <GlassCard className="p-0 overflow-hidden relative border-none">
        {/* Cover */}
        <div className="h-48 w-full bg-gradient-to-r from-primary via-primary-dark to-accent-cyan relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
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
              <button onClick={() => setIsEditing(true)} className="absolute bottom-[-8px] right-[-8px] p-2 bg-primary hover:bg-primary-dark rounded-full text-white shadow-lg transition-colors z-20">
                <Edit3 size={14} />
              </button>
            </div>

            {/* Social Links — header area, visible to all */}
            {!isEditing && (
              <div className="flex gap-3 mb-2">
                {user.github && (
                  <a href={getLink(user.github)} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-white/10 transition-colors font-semibold text-sm">
                    <GithubIcon /> <span className="hidden sm:inline">GitHub</span>
                  </a>
                )}
                {user.linkedin && (
                  <a href={getLink(user.linkedin)} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-white/10 transition-colors font-semibold text-sm text-[#0077b5]">
                    <LinkedinIcon /> <span className="hidden sm:inline">LinkedIn</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="max-w-2xl space-y-4">
              <GlassInput placeholder="Full Name" value={editData.name} onChange={(e: any) => setEditData(p => ({ ...p, name: e.target.value }))} />
              <GlassInput placeholder="Branch (e.g. Computer Science)" value={editData.branch} onChange={(e: any) => setEditData(p => ({ ...p, branch: e.target.value }))} />
              <div>
                <label className="text-sm text-white/60 font-medium mb-1 block">Year</label>
                <select value={editData.year} onChange={e => setEditData(p => ({ ...p, year: parseInt(e.target.value) }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-primary">
                  {[1, 2, 3, 4, 5].map(y => (
                    <option key={y} value={y} className="bg-[#0a0a0b] text-white">Year {y}</option>
                  ))}
                </select>
              </div>
              <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/40 font-medium min-h-[100px] resize-y focus:outline-none focus:border-primary"
                placeholder="Bio — tell people who you are" value={editData.bio} onChange={e => setEditData(p => ({ ...p, bio: e.target.value }))} />
              <div className="space-y-3">
                <p className="text-sm text-white/60 font-medium">Social Links</p>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <GithubIcon />
                  <input type="text" placeholder="https://github.com/username" value={editData.github}
                    onChange={e => setEditData(p => ({ ...p, github: e.target.value }))}
                    className="flex-1 bg-transparent text-white placeholder:text-white/30 font-medium focus:outline-none" />
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <LinkedinIcon />
                  <input type="text" placeholder="https://linkedin.com/in/username" value={editData.linkedin}
                    onChange={e => setEditData(p => ({ ...p, linkedin: e.target.value }))}
                    className="flex-1 bg-transparent text-white placeholder:text-white/30 font-medium focus:outline-none" />
                </div>
              </div>
              <div className="flex gap-3">
                <LiquidButton onClick={handleSave}>Save Changes</LiquidButton>
                <LiquidButton variant="outline" onClick={() => setIsEditing(false)}>Cancel</LiquidButton>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold tracking-tight mb-1">{user.name}</h1>
              <p className="text-primary font-bold text-lg mb-4">
                {user.branch || 'Student'}{user.year ? ` • Year ${user.year}` : ''}
              </p>
              <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500 dark:text-white/60 mb-6">
                <span className="flex items-center gap-1.5"><MapPin size={16} />{user.branch || 'Not set'}</span>
                <span className="flex items-center gap-1.5"><Briefcase size={16} />{user.availability ? 'Available for teams' : 'Not available'}</span>
                <span className="flex items-center gap-1.5"><Mail size={16} />{user.email}</span>
              </div>
              <p className="text-slate-700 dark:text-white/80 leading-relaxed font-medium">
                {user.bio || 'No bio yet. Click the ✏️ icon to add one!'}
              </p>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-slate-200 dark:border-white/10 px-8 bg-slate-50 dark:bg-white/5">
          {['overview', 'projects', 'activity'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`py-4 px-6 font-bold text-sm capitalize transition-colors relative ${activeTab === tab ? 'text-primary' : 'text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white'}`}>
              {tab}
              {activeTab === tab && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Tab Content */}
      <div className="grid md:grid-cols-3 gap-8">

        {/* ─── RIGHT SIDEBAR ─── */}
        <div className="md:col-span-1 space-y-6">

          {/* Stats Card */}
          <GlassCard className="p-6">
            <h2 className="text-lg font-bold mb-4 tracking-tight">Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-white/10">
                <span className="text-slate-500 dark:text-white/60 font-medium">Connections</span>
                <span className="font-bold text-lg">{user.connections?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-white/10">
                <span className="text-slate-500 dark:text-white/60 font-medium">Skills</span>
                <span className="font-bold text-lg">{user.skills?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-white/10">
                <span className="text-slate-500 dark:text-white/60 font-medium">Member since</span>
                <span className="font-bold text-sm">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>

              {/* ── Social Links in right sidebar ── */}
              {(user.github || user.linkedin) && (
                <div className="pt-2 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Connect</p>
                  {user.github && (
                    <a href={getLink(user.github)} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group w-full">
                      <GithubIcon size={16} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white/80 group-hover:text-white transition-colors">GitHub</p>
                        <p className="text-xs text-white/40 truncate">{extractGithubUsername(user.github)}</p>
                      </div>
                      <ExternalLink size={12} className="text-white/30 group-hover:text-white/60 transition-colors shrink-0" />
                    </a>
                  )}
                  {user.linkedin && (
                    <a href={getLink(user.linkedin)} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-[#0077b5]/10 hover:border-[#0077b5]/30 transition-all group w-full">
                      <span className="text-[#0077b5]"><LinkedinIcon size={16} /></span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white/80 group-hover:text-[#0077b5] transition-colors">LinkedIn</p>
                        <p className="text-xs text-white/40 truncate">View Profile</p>
                      </div>
                      <ExternalLink size={12} className="text-white/30 group-hover:text-[#0077b5]/60 transition-colors shrink-0" />
                    </a>
                  )}
                </div>
              )}

              {!user.github && !user.linkedin && (
                <button onClick={() => setIsEditing(true)}
                  className="w-full mt-2 text-xs text-white/40 hover:text-primary transition-colors text-left py-1">
                  + Add social links
                </button>
              )}
            </div>
          </GlassCard>

          {/* Skills Card */}
          <GlassCard className="p-6">
            <h2 className="text-lg font-bold mb-4 tracking-tight">Top Skills</h2>
            <div className="flex flex-wrap gap-2">
              {(user.skills || []).length > 0 ? user.skills.map((skill: string) => (
                <SkillTag key={skill} label={skill} animated={false} />
              )) : (
                <p className="text-sm text-slate-500 dark:text-white/50">No skills set yet.</p>
              )}
            </div>
          </GlassCard>
        </div>

        {/* ─── MAIN CONTENT ─── */}
        <div className="md:col-span-2">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold tracking-tight mb-6">About</h2>
              <p className="text-slate-700 dark:text-white/80 leading-relaxed font-medium">
                {user.bio || 'This user has not added a bio yet.'}
              </p>
              {user.interests && user.interests.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h3 className="font-bold mb-3 text-sm uppercase tracking-widest text-white/50">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest: string) => (
                      <SkillTag key={interest} label={interest} animated={false} className="bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20" />
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
          )}

          {/* PROJECTS TAB — GitHub Repos */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              {!user.github ? (
                <GlassCard className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                  <GithubIcon size={48} />
                  <h3 className="text-xl font-bold mt-6 mb-2">No GitHub linked</h3>
                  <p className="text-white/60 font-medium max-w-sm mb-6">Add your GitHub profile link to automatically showcase your public repositories here.</p>
                  <LiquidButton onClick={() => setIsEditing(true)}>Add GitHub Link</LiquidButton>
                </GlassCard>
              ) : reposLoading ? (
                <div className="flex justify-center py-16">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-4 border-white/10 border-t-primary animate-spin" />
                    <p className="text-white/50 font-medium text-sm">Fetching repos from GitHub…</p>
                  </div>
                </div>
              ) : reposError ? (
                <GlassCard className="p-8 text-center">
                  <p className="text-red-400 font-bold mb-2">⚠️ {reposError}</p>
                  <p className="text-white/50 text-sm">Check that your GitHub URL is correct and the profile is public.</p>
                  <button onClick={() => fetchGithubRepos(user.github)} className="mt-4 text-primary font-bold text-sm hover:underline">Try again</button>
                </GlassCard>
              ) : repos.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold">
                      Public Repos
                      <span className="ml-2 text-sm font-normal text-white/40">via GitHub</span>
                    </h2>
                    <a href={getLink(user.github)} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-primary font-bold hover:underline">
                      View on GitHub <ExternalLink size={14} />
                    </a>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {repos.map((repo: any) => (
                      <motion.a
                        key={repo.id}
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="block"
                      >
                        <GlassCard className="p-5 h-full flex flex-col gap-3 hover:border-primary/40 transition-colors group cursor-pointer">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <GithubIcon size={14} />
                              <h3 className="font-bold text-sm text-white group-hover:text-primary transition-colors truncate">
                                {repo.name}
                              </h3>
                            </div>
                            {repo.fork && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 shrink-0">fork</span>
                            )}
                          </div>

                          <p className="text-xs text-white/60 font-medium leading-relaxed flex-1 line-clamp-2">
                            {repo.description || 'No description provided.'}
                          </p>

                          <div className="flex items-center gap-4 mt-auto">
                            {repo.language && (
                              <span className="flex items-center gap-1.5 text-xs text-white/60 font-medium">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: LANG_COLORS[repo.language] || '#888' }} />
                                {repo.language}
                              </span>
                            )}
                            {repo.stargazers_count > 0 && (
                              <span className="flex items-center gap-1 text-xs text-white/60 font-medium">
                                <Star size={11} className="text-yellow-400" /> {repo.stargazers_count}
                              </span>
                            )}
                            {repo.forks_count > 0 && (
                              <span className="flex items-center gap-1 text-xs text-white/60 font-medium">
                                <GitFork size={11} /> {repo.forks_count}
                              </span>
                            )}
                            <span className="ml-auto text-xs text-white/30">
                              {new Date(repo.updated_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </GlassCard>
                      </motion.a>
                    ))}
                  </div>
                </>
              ) : (
                <GlassCard className="p-8 text-center">
                  <h3 className="text-lg font-bold mb-2">No public repositories found</h3>
                  <p className="text-white/50 text-sm">Make sure your GitHub repositories are public.</p>
                </GlassCard>
              )}
            </div>
          )}

          {/* ACTIVITY TAB */}
          {activeTab === 'activity' && (
            <GlassCard className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
              <h3 className="text-xl font-bold mb-2">Activity coming soon</h3>
              <p className="text-white/50 font-medium">Your questions, answers, and team activity will appear here.</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
