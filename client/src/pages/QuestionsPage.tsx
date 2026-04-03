import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassInput } from '../components/ui/GlassInput';
import { LiquidButton } from '../components/ui/LiquidButton';
import { ArrowUpRight, Search } from 'lucide-react';
import { SkillTag } from '../components/ui/SkillTag';
import { Link, useNavigate } from 'react-router-dom';
import { questionAPI, isLoggedIn } from '../lib/api';

const QuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAsk, setShowAsk] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: '', description: '', tags: '' });
  const [posting, setPosting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/auth');
      return;
    }
    loadQuestions();
  }, []);

  const loadQuestions = async (searchTerm?: string) => {
    try {
      setLoading(true);
      const res = await questionAPI.getAll({ search: searchTerm });
      setQuestions(res.data || []);
    } catch (err) {
      console.error('Questions load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => loadQuestions(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleAsk = async () => {
    if (!newQuestion.title || !newQuestion.description) return;
    setPosting(true);
    try {
      const tags = newQuestion.tags.split(',').map(t => t.trim()).filter(Boolean);
      await questionAPI.create({ title: newQuestion.title, description: newQuestion.description, tags });
      setNewQuestion({ title: '', description: '', tags: '' });
      setShowAsk(false);
      loadQuestions();
    } catch (err) {
      console.error('Post question error:', err);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">Campus Q&A</h1>
          <p className="text-slate-500 dark:text-white/60 font-medium text-sm">Tap into the collective knowledge of your peers.</p>
        </div>
        <LiquidButton onClick={() => setShowAsk(!showAsk)}>
          {showAsk ? 'Cancel' : 'Ask a Question'}
        </LiquidButton>
      </div>

      {/* Ask Question Form */}
      {showAsk && (
        <GlassCard className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Ask a Question</h2>
          <GlassInput placeholder="Question title" value={newQuestion.title} onChange={e => setNewQuestion(prev => ({ ...prev, title: e.target.value }))} />
          <textarea 
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/40 font-medium min-h-[120px] resize-y focus:outline-none focus:border-primary"
            placeholder="Describe your question in detail..."
            value={newQuestion.description}
            onChange={e => setNewQuestion(prev => ({ ...prev, description: e.target.value }))}
          />
          <GlassInput placeholder="Tags (comma separated, e.g. React, Node.js, MongoDB)" value={newQuestion.tags} onChange={e => setNewQuestion(prev => ({ ...prev, tags: e.target.value }))} />
          <LiquidButton onClick={handleAsk} disabled={posting || !newQuestion.title || !newQuestion.description}>
            {posting ? 'Posting...' : 'Post Question'}
          </LiquidButton>
        </GlassCard>
      )}

      <GlassInput icon={<Search size={18} />} placeholder="Search for existing answers first..." value={search} onChange={e => setSearch(e.target.value)} />

      {loading ? (
        <div className="flex justify-center pt-8">
          <div className="w-10 h-10 rounded-full border-4 border-white/10 border-t-primary animate-spin" />
        </div>
      ) : (
        <div className="space-y-4 pt-4">
          {questions.length > 0 ? questions.map(q => (
            <Link to={`/questions/${q._id || q.id}`} key={q._id || q.id} className="block group">
              <GlassCard className="p-5 flex gap-4 border border-slate-200 dark:border-white/10 group-hover:border-primary/30 transition-colors">
                <div className="hidden sm:flex flex-col items-center gap-2 p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 self-start min-w-[64px]">
                   <ArrowUpRight size={20} className="text-primary"/>
                   <span className="font-bold">{q.upvotes || 0}</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-white group-hover:text-primary transition-colors">{q.title}</h2>
                  <p className="text-slate-600 dark:text-white/70 line-clamp-2 mb-4 text-sm font-medium">{q.content || q.description}</p>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {(q.tags || []).map((t: string) => <SkillTag key={t} label={t} animated={false} className="text-xs py-1" />)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-white/50 flex items-center gap-4 font-bold">
                      <span>{q.answers || 0} answers</span>
                      <span>{q.timeAgo || 'just now'}</span>
                      {q.author && (
                        <span className="flex items-center gap-2 px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-md">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/60 to-accent-cyan/60 flex items-center justify-center text-[8px] text-white font-bold">
                            {q.author.name?.[0] || '?'}
                          </div>
                          {q.author.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Link>
          )) : (
            <div className="text-center py-16 text-slate-500 dark:text-white/50 font-medium">
              {search ? 'No questions match your search.' : 'No questions yet. Be the first to ask!'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionsPage;
