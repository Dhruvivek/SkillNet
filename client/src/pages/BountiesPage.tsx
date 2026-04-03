import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassInput } from '../components/ui/GlassInput';
import { LiquidButton } from '../components/ui/LiquidButton';
import { Search, DollarSign, Pizza, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const mockBounties = [
  {
    id: "b1",
    title: "Fix responsive navbar bug on campus club site",
    org: "HackMIT",
    orgLogo: "https://i.pravatar.cc/150?u=hackmit",
    description: "Our main landing page has a collapsing bug on mobile screens specifically for iOS Safari. Need someone to patch it ASAP.",
    rewardType: "cash",
    rewardValue: "$50",
    tags: ["React", "CSS", "Tailwind"],
    timeAgo: "2 hours ago"
  },
  {
    id: "b2",
    title: "Build simple waitlist MVP",
    org: "Student Founder",
    orgLogo: "https://i.pravatar.cc/150?u=1",
    description: "Looking for a fast Next.js dev to build a 1-page waitlist with Supabase auth for my startup idea.",
    rewardType: "equity",
    rewardValue: "1% Equity + Free Dinner",
    tags: ["Next.js", "Supabase", "MVP"],
    timeAgo: "5 hours ago"
  },
  {
    id: "b3",
    title: "Scrape prerequisite data from course catalog",
    org: "CS Department Mentors",
    orgLogo: "https://i.pravatar.cc/150?u=cs",
    description: "Need a Python script using BeautifulSoup to dump all prerequisites into a clean JSON format from the messy campus portal.",
    rewardType: "perk",
    rewardValue: "Dining Hall Swipe",
    tags: ["Python", "Data Scraping"],
    timeAgo: "1 day ago"
  }
];

const BountiesPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
         <div>
           <h1 className="text-4xl font-extrabold tracking-tight mb-2">Bounty Board</h1>
           <p className="text-slate-500 dark:text-white/60 font-medium text-lg max-w-2xl">
             Pick up localized gigs for cash, equity, or perks. Build experience and help out campus organizations.
           </p>
         </div>
         <LiquidButton>Post a Bounty</LiquidButton>
      </div>

      <GlassInput icon={<Search size={20} />} placeholder="Search bounties e.g., 'React', 'Python', '$50'..." className="py-4 shadow-xl" />

      <div className="grid md:grid-cols-1 gap-6 pt-6">
        {mockBounties.map((bounty, i) => (
          <motion.div
            key={bounty.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className="p-6 md:p-8 flex flex-col md:flex-row gap-6 hover:border-primary/40 transition-colors group">
               
               {/* Left Column - Reward Badge */}
               <div className="shrink-0 flex flex-col items-center justify-center w-full md:w-32 h-32 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 gap-2">
                 {bounty.rewardType === 'cash' && <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center"><DollarSign /></div>}
                 {bounty.rewardType === 'equity' && <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center"><AlertCircle /></div>}
                 {bounty.rewardType === 'perk' && <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center"><Pizza /></div>}
                 
                 <span className="font-extrabold text-center px-2 text-sm text-slate-800 dark:text-white leading-tight">
                   {bounty.rewardValue}
                 </span>
               </div>

               {/* Center Column - Details */}
               <div className="flex-1">
                 <div className="flex items-center gap-2 mb-2">
                   <img src={bounty.orgLogo} className="w-5 h-5 rounded object-cover" alt="" />
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{bounty.org}</span>
                   <span className="text-xs font-medium text-slate-400 flex items-center gap-1 ml-auto"><Clock size={12} /> {bounty.timeAgo}</span>
                 </div>
                 
                 <h2 className="text-2xl font-bold tracking-tight mb-2 group-hover:text-primary transition-colors">{bounty.title}</h2>
                 <p className="text-slate-600 dark:text-white/70 font-medium text-sm leading-relaxed mb-6">{bounty.description}</p>
                 
                 <div className="flex flex-wrap gap-2">
                   {bounty.tags.map(t => (
                     <span key={t} className="px-3 py-1 rounded-full text-xs font-bold border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-white/80">
                       {t}
                     </span>
                   ))}
                 </div>
               </div>

               {/* Right Column - Action */}
               <div className="shrink-0 flex items-center justify-center md:border-l border-slate-200 dark:border-white/10 md:pl-6">
                  <LiquidButton variant="outline" className="w-full md:w-auto h-12">Claim Bounty</LiquidButton>
               </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BountiesPage;
