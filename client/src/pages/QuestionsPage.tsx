import React from 'react';
import { mockQuestions } from '../data/mock';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassInput } from '../components/ui/GlassInput';
import { LiquidButton } from '../components/ui/LiquidButton';
import { ArrowUpRight, Search } from 'lucide-react';
import { SkillTag } from '../components/ui/SkillTag';

import { Link } from 'react-router-dom';

const QuestionsPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">Campus Q&A</h1>
          <p className="text-slate-500 dark:text-white/60 font-medium text-sm">Tap into the collective knowledge of your peers.</p>
        </div>
        <LiquidButton>Ask a Question</LiquidButton>
      </div>

      <GlassInput icon={<Search size={18} />} placeholder="Search for existing answers first..." />

      <div className="space-y-4 pt-4">
        {mockQuestions.map(q => (
          <Link to={`/questions/${q.id}`} key={q.id} className="block group">
            <GlassCard className="p-5 flex gap-4 border border-slate-200 dark:border-white/10 group-hover:border-primary/30 transition-colors">
              <div className="hidden sm:flex flex-col items-center gap-2 p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 self-start min-w-[64px]">
                 <ArrowUpRight size={20} className="text-primary"/>
                 <span className="font-bold">{q.upvotes}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-white group-hover:text-primary transition-colors">{q.title}</h2>
                <p className="text-slate-600 dark:text-white/70 line-clamp-2 mb-4 text-sm font-medium">{q.content}</p>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {q.tags.map(t => <SkillTag key={t} label={t} animated={false} className="text-xs py-1" />)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-white/50 flex items-center gap-4 font-bold">
                    <span>{q.answers} answers</span>
                    <span>{q.views} views</span>
                    <span className="flex items-center gap-2 px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-md">
                      <img src={q.author.avatar} alt="" className="w-5 h-5 rounded-full" />
                      {q.author.name}
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuestionsPage;
