import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockQuestions, mockUsers } from '../data/mock';
import { GlassCard } from '../components/ui/GlassCard';
import { SkillTag } from '../components/ui/SkillTag';
import { LiquidButton } from '../components/ui/LiquidButton';
import { ArrowUp, ArrowDown, ArrowLeft, MessageSquare, Share2, CheckCircle2 } from 'lucide-react';

const QuestionDetailPage: React.FC = () => {
  const { id } = useParams();
  
  // Use the mocked question or a default
  const question = mockQuestions.find(q => q.id === id) || mockQuestions[0];

  // Mock answers tailored for this view
  const answers = [
    {
      id: 'a1',
      author: mockUsers[2],
      content: "For Framer Motion variants, you need to ensure you add `as const` to any `ease` array values if you are using TypeScript in strict mode. E.g., `ease: [0.25, 0.1, 0.25, 1] as const`. This helps TS correctly infer the type instead of generalizing it to a number array.",
      upvotes: 42,
      isAccepted: true,
      time: "2 days ago"
    },
    {
      id: 'a2',
      author: mockUsers[1],
      content: "I usually just decouple the transition objects entirely and map them inline in the motion component. It's dirtier but prevents type issues. Also check if you have the latest Framer Motion version installed.",
      upvotes: 12,
      isAccepted: false,
      time: "3 days ago"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6">
      <Link to="/questions" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-primary transition-colors mb-4">
         <ArrowLeft size={16} className="mr-2" /> Back to Q&A
      </Link>

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Voting Sidebar */}
        <div className="hidden md:flex flex-col items-center gap-3 shrink-0 w-16 pt-2">
           <button className="w-12 h-12 rounded-full border border-slate-200 dark:border-white/10 hover:bg-primary/10 hover:text-primary transition-colors flex items-center justify-center">
             <ArrowUp size={24} />
           </button>
           <span className="text-2xl font-black">{question.upvotes}</span>
           <button className="w-12 h-12 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex items-center justify-center">
             <ArrowDown size={24} />
           </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          
          {/* Original Question Card */}
          <GlassCard className="p-6 md:p-8">
             <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{question.title}</h1>
             <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-white/60 font-medium mb-6 pb-6 border-b border-slate-200 dark:border-white/10">
                <span className="flex items-center gap-2">
                  <img src={question.author.avatar} alt="" className="w-6 h-6 rounded-full" />
                  {question.author.name}
                </span>
                <span>•</span>
                <span>Asked 1 week ago</span>
                <span>•</span>
                <span>{question.views} views</span>
             </div>
             
             <div className="text-slate-700 dark:text-white/80 leading-relaxed font-medium mb-8">
               {question.content}
               <p className="mt-4">Does anyone have a snippet that actually maps correctly without throwing TS2322? I've been stuck on this for hours across multiple components.</p>
             </div>

             <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
               <div className="flex flex-wrap gap-2">
                 {question.tags.map(t => <SkillTag key={t} label={t} animated={false} />)}
               </div>
               <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors">
                 <Share2 size={16} /> Share
               </button>
             </div>
          </GlassCard>

          {/* Answers Section */}
          <div className="pt-4">
             <div className="flex justify-between items-end mb-6">
               <h2 className="text-2xl font-bold tracking-tight">{answers.length} Answers</h2>
               <div className="flex bg-slate-100 dark:bg-white/5 rounded-lg p-1 text-sm font-bold">
                 <button className="px-4 py-1.5 bg-white dark:bg-white/10 rounded-md shadow-sm">Top</button>
                 <button className="px-4 py-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">Newest</button>
               </div>
             </div>

             <div className="space-y-6">
                {answers.map(ans => (
                  <GlassCard key={ans.id} className={`p-6 ${ans.isAccepted ? 'border-primary/40 ring-1 ring-primary/20' : ''}`}>
                    <div className="flex gap-4">
                      {/* Answer Voting Mobile */}
                      <div className="flex flex-col items-center gap-2 shrink-0">
                         <button className="p-1 hover:text-primary transition-colors"><ArrowUp size={20} /></button>
                         <span className="font-bold">{ans.upvotes}</span>
                         <button className="p-1 hover:text-slate-500 transition-colors"><ArrowDown size={20} /></button>
                         {ans.isAccepted && (
                           <CheckCircle2 size={24} className="text-green-500 mt-2" />
                         )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="text-slate-700 dark:text-white/80 leading-relaxed font-medium mb-6">
                          {ans.content}
                        </div>
                        <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-200 dark:border-white/10">
                           <span className="font-bold text-slate-500 hover:text-primary cursor-pointer transition-colors flex items-center gap-2">
                             <MessageSquare size={16} /> Reply
                           </span>
                           <div className="flex items-center gap-3 text-slate-500 dark:text-white/60">
                             <span>Answered {ans.time}</span>
                             <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5">
                               <img src={ans.author.avatar} alt="" className="w-5 h-5 rounded-full" />
                               <span className="font-bold text-slate-800 dark:text-white">{ans.author.name}</span>
                             </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
             </div>
          </div>

          {/* Your Answer Input */}
          <div className="pt-8">
            <h2 className="text-xl font-bold tracking-tight mb-4">Your Answer</h2>
            <GlassCard className="p-4 flex flex-col gap-4">
              <textarea 
                className="w-full bg-transparent border-none focus:ring-0 p-2 min-h-[150px] resize-y text-slate-800 dark:text-white placeholder:text-slate-400 font-medium"
                placeholder="Write a clear, concise answer..."
              />
              <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-white/10">
                 <LiquidButton>Post Answer</LiquidButton>
              </div>
            </GlassCard>
          </div>

        </div>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
