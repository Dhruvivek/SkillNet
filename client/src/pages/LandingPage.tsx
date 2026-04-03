import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Terminal, Rocket } from 'lucide-react';
import { LiquidButton } from '../components/ui/LiquidButton';
import { SkillTag } from '../components/ui/SkillTag';

const LandingPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const words = ["Don't", "just", "study.", "Build", "Empires."];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9, filter: 'blur(10px)' },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      filter: 'blur(0px)',
      transition: { type: 'spring' as const, damping: 12, stiffness: 100 } 
    }
  };

  const floatingBadgeVariants = {
    animate: (i: number) => ({
      y: [0, -15, 0],
      rotate: [0, i % 2 === 0 ? 3 : -3, 0],
      transition: {
        duration: 4 + i,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: i * 0.5
      }
    })
  };

  return (
    <div ref={containerRef} className="min-h-[120vh] relative pt-12 md:pt-24 px-4 overflow-hidden">
      
      {/* Abstract Glowing Aura behind the hero */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/20 dark:bg-primary/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[500px] bg-accent-cyan/10 blur-[100px] mix-blend-screen pointer-events-none -z-10" />

      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* === LEFT SIDE: COPY & CTA === */}
        <motion.div 
          style={{ y: y1, opacity }}
          className="lg:col-span-5 space-y-8 relative z-20"
        >
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* SaaS Launch Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-white/5 border border-primary/30 mb-8 text-xs font-bold tracking-widest uppercase text-primary shadow-lg backdrop-blur-md">
              <Sparkles size={14} className="animate-pulse" />
              <span>SkillNet Beta is live</span>
            </div>
            
            {/* Main Catchy Headline */}
            <motion.h1 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="text-6xl md:text-7xl lg:text-7xl font-extrabold tracking-tighter leading-[0.9] text-white flex flex-wrap gap-x-4 gap-y-2 mb-6"
            >
              {words.map((word, i) => (
                <motion.span 
                  key={i} 
                  variants={wordVariants}
                  className={(word === "Build" || word === "Empires.") 
                    ? "text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary-dark to-accent-cyan pb-2"
                    : "text-slate-900 dark:text-white"
                  }
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            {/* Sub-phrase SaaS text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <p className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">
                Your campus is a sleeping tech incubator.
              </p>
              <p className="text-lg text-slate-600 dark:text-white/60 max-w-lg leading-relaxed font-medium">
                Stop building alone. Find the top 1% of hackers, designers, and visionaries hiding in your lectures. Match instantly. Build faster.
              </p>
            </motion.div>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 pt-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Link to="/auth">
              <LiquidButton size="lg" className="w-full sm:w-auto text-lg px-8 py-4 group h-14">
                Join SkillNet
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </LiquidButton>
            </Link>
            <Link to="/dashboard">
              <LiquidButton variant="ghost" size="lg" className="w-full sm:w-auto h-14 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5">
                <Terminal size={18} className="mr-2" />
                View Network
              </LiquidButton>
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="flex items-center gap-4 pt-4 text-sm font-semibold text-slate-500 dark:text-white/50"
          >
            <div className="flex -space-x-2">
               {[1,2,3,4].map(i => (
                 <div key={i} className={`w-8 h-8 rounded-full border-2 border-[var(--bg-main)] bg-gradient-to-br from-primary/60 to-accent-cyan/60 flex items-center justify-center text-[10px] text-white font-bold`}>
                   P{i}
                 </div>
               ))}
            </div>
            <span>Over 2,400 students shipped projects last week.</span>
          </motion.div>
        </motion.div>


        {/* === RIGHT SIDE: 3D VIDEO PLAYER === */}
        <motion.div 
          style={{ y: y2 }}
          className="lg:col-span-7 relative w-full perspective-[1200px] mt-12 lg:mt-0"
          initial={{ opacity: 0, rotateY: 15, rotateX: 10, scale: 0.9 }}
          animate={{ opacity: 1, rotateY: -10, rotateX: 5, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Floating Feature Badges */}
          <motion.div 
            custom={1} variants={floatingBadgeVariants} animate="animate"
            className="absolute -top-8 -left-4 md:-left-12 z-30 bg-white dark:bg-[#050505] p-3 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 flex items-center gap-3 backdrop-blur-xl"
          >
             <div className="p-2 bg-primary/10 text-primary rounded-xl"><Rocket size={20} /></div>
             <div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</p>
               <p className="text-sm font-black text-slate-900 dark:text-white">Looking for Co-founder</p>
             </div>
          </motion.div>

          <motion.div 
            custom={2} variants={floatingBadgeVariants} animate="animate"
            className="absolute -bottom-10 right-4 md:-right-8 z-30 bg-white dark:bg-[#050505] p-3 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 flex items-center gap-3 backdrop-blur-xl"
          >
             <div className="flex gap-2">
               <SkillTag label="React" animated={false} className="border-none bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold" />
               <SkillTag label="Python" animated={false} className="border-none bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 font-bold" />
             </div>
          </motion.div>

          {/* The Main Animated Faux-Video Panel */}
          <div className="relative rounded-[2rem] overflow-hidden border border-slate-200/50 dark:border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] dark:shadow-[0_20px_80px_-12px_rgba(255,148,77,0.3)] bg-slate-900 aspect-video transform-gpu flex items-center justify-center">
            
            {/* Inner glass bezel */}
            <div className="absolute inset-0 pointer-events-none border-[6px] border-white/5 rounded-[2rem] z-20 mix-blend-overlay" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black pointer-events-none z-0" />
            
            {/* Highly Animated Code/Data Loop written in pure Framer Motion */}
            <motion.div animate={{ rotate: 360, scale: [1, 1.05, 1] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute w-[120%] aspect-square border-[1px] border-primary/20 rounded-full border-dashed z-0" />
            <motion.div animate={{ rotate: -360, scale: [1, 1.1, 1] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute w-[80%] aspect-square border-[2px] border-accent-cyan/10 rounded-full border-solid z-0" />
            <motion.div animate={{ rotate: 360, scale: [1, 1.15, 1] }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }} className="absolute w-[150%] aspect-square border-[1px] border-accent-pink/20 rounded-full border-dotted z-0" />
            
            {/* Central glowing core */}
            <div className="absolute w-32 h-32 bg-primary/40 rounded-full blur-3xl animate-pulse z-0" />
            
            <div className="z-10 text-center font-mono flex flex-col items-center">
               <Terminal size={48} className="text-primary mb-4 mx-auto animate-bounce opacity-80" />
               <span className="text-white text-sm font-bold tracking-widest opacity-70">SYSTEM.SYNC()</span>
               <motion.div 
                 className="h-1 bg-gradient-to-r from-primary to-accent-cyan mt-4 rounded-full"
                 animate={{ width: ["0%", "100%", "0%"] }}
                 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               />
               <motion.div 
                 className="h-1 bg-gradient-to-r from-accent-pink to-primary mt-1 rounded-full"
                 animate={{ width: ["100%", "0%", "100%"] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               />
            </div>

            {/* Faux UI Overlay on top of the animation to make it look like an app interaction */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500/80 backdrop-blur-sm" />
               <div className="w-3 h-3 rounded-full bg-yellow-500/80 backdrop-blur-sm" />
               <div className="w-3 h-3 rounded-full bg-green-500/80 backdrop-blur-sm" />
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default LandingPage;
