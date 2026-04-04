import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { SkillTag } from '../components/ui/SkillTag';
import { LiquidButton } from '../components/ui/LiquidButton';
import { ArrowUp, ArrowDown, ArrowLeft, MessageSquare, Share2 } from 'lucide-react';
import { questionAPI, isLoggedIn } from '../lib/api';

const QuestionDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/auth'); return; }
    if (id) loadQuestion(id);
  }, [id]);

  const loadQuestion = async (qId: string) => {
    try {
      setLoading(true);
      const res = await questionAPI.getById(qId);
      setQuestion(res.data);
      setAnswers(res.data.answers || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleUpvoteQuestion = async () => {
    if (!id) return;
    try {
      const res = await questionAPI.upvoteQuestion(id);
      setQuestion((p: any) => ({ ...p, upvotes: res.data.upvotes, upvoted: res.data.upvoted }));
    } catch (err) { console.error(err); }
  };

  const handleUpvoteAnswer = async (aid: string) => {
    try {
      const res = await questionAPI.upvoteAnswer(aid);
      setAnswers(prev => prev.map(a => (a._id || a.id) === aid ? { ...a, upvotes: res.data.upvotes, upvoted: res.data.upvoted } : a));
    } catch (err) { console.error(err); }
  };

  const handlePostAnswer = async () => {
    if (!answerContent.trim() || !id) return;
    setPosting(true);
    try {
      const res = await questionAPI.addAnswer(id, answerContent);
      setAnswers(prev => [...prev, res.data]);
      setAnswerContent('');
    } catch (err) { console.error(err); } finally { setPosting(false); }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[50vh]"><div className="w-10 h-10 rounded-full border-4 border-white/10 border-t-primary animate-spin" /></div>;
  if (!question) return <div className="max-w-4xl mx-auto text-center py-16"><h2 className="text-2xl font-bold mb-4">Question not found</h2><Link to="/questions" className="text-primary font-bold hover:underline">Back to Q&A</Link></div>;

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6">
      <Link to="/questions" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-primary transition-colors mb-4"><ArrowLeft size={16} className="mr-2" /> Back to Q&A</Link>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="hidden md:flex flex-col items-center gap-3 shrink-0 w-16 pt-2">
          <button onClick={handleUpvoteQuestion} className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${question.upvoted ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 hover:bg-primary/10 hover:text-primary'}`}><ArrowUp size={24} /></button>
          <span className="text-2xl font-black">{question.upvotes || 0}</span>
          <button className="w-12 h-12 rounded-full border border-white/10 hover:bg-white/10 flex items-center justify-center"><ArrowDown size={24} /></button>
        </div>
        <div className="flex-1 space-y-8">
          <GlassCard className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{question.title}</h1>
            <div className="flex items-center gap-4 text-sm text-white/60 font-medium mb-6 pb-6 border-b border-white/10">
              {question.author && <span className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/60 to-accent-cyan/60 flex items-center justify-center text-[8px] text-white font-bold">{question.author.name?.[0]}</div>{question.author.name}</span>}
              <span>•</span><span>{question.timeAgo || 'Recently'}</span>
            </div>
            <div className="text-white/80 leading-relaxed font-medium mb-8 whitespace-pre-wrap">{question.content || question.description}</div>
            <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-white/10">
              <div className="flex flex-wrap gap-2">{(question.tags || []).map((t: string) => <SkillTag key={t} label={t} animated={false} />)}</div>
              <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary"><Share2 size={16} /> Share</button>
            </div>
          </GlassCard>

          <div className="pt-4">
            <h2 className="text-2xl font-bold tracking-tight mb-6">{answers.length} Answer{answers.length !== 1 ? 's' : ''}</h2>
            <div className="space-y-6">
              {answers.map(ans => (
                <GlassCard key={ans._id || ans.id} className="p-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <button onClick={() => handleUpvoteAnswer(ans._id || ans.id)} className={`p-1 ${ans.upvoted ? 'text-primary' : 'hover:text-primary'}`}><ArrowUp size={20} /></button>
                      <span className="font-bold">{ans.upvotes || 0}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white/80 leading-relaxed font-medium mb-6 whitespace-pre-wrap">{ans.content}</div>
                      <div className="flex justify-between items-center text-sm pt-4 border-t border-white/10">
                        <span className="font-bold text-slate-500 hover:text-primary cursor-pointer flex items-center gap-2"><MessageSquare size={16} /> Reply</span>
                        <div className="flex items-center gap-3 text-white/60">
                          <span>{ans.time || 'just now'}</span>
                          {(ans.author || ans.answeredBy) && <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5"><span className="font-bold text-white">{(ans.author?.name || ans.answeredBy?.name)}</span></div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
              {answers.length === 0 && <div className="text-center py-8 text-white/50 font-medium">No answers yet. Be the first!</div>}
            </div>
          </div>

          <div className="pt-8">
            <h2 className="text-xl font-bold tracking-tight mb-4">Your Answer</h2>
            <GlassCard className="p-4 flex flex-col gap-4">
              <textarea className="w-full bg-transparent border-none p-2 min-h-[150px] resize-y text-white placeholder:text-slate-400 font-medium focus:outline-none" placeholder="Write a clear, concise answer..." value={answerContent} onChange={e => setAnswerContent(e.target.value)} />
              <div className="flex justify-end pt-4 border-t border-white/10">
                <LiquidButton onClick={handlePostAnswer} disabled={posting || !answerContent.trim()}>{posting ? 'Posting...' : 'Post Answer'}</LiquidButton>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
