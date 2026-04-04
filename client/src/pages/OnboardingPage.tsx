import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { LiquidButton } from '../components/ui/LiquidButton';
import { SkillTag } from '../components/ui/SkillTag';
import { ALL_SKILLS } from '../data/mock';
import { userAPI, setUser, getUser } from '../lib/api';

const OnboardingPage: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const toggleSkill = (skill: string) => {
    setSelected(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleContinue = async () => {
    if (selected.length === 0) return;
    setIsLoading(true);
    
    try {
      await userAPI.updateProfile({ skills: selected });
      // Update stored user data
      const currentUser = getUser();
      if (currentUser) {
        setUser({ ...currentUser, skills: selected });
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to save skills:', err);
      // Still navigate — skills can be set later
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 flex flex-col items-center max-w-4xl mx-auto relative z-10">
      
      {/* Progress */}
      <div className="w-full max-w-md mx-auto mb-12">
        <div className="flex justify-between text-sm text-white/60 mb-2">
          <span>Step 1 of 3</span>
          <span>Skills Selection</span>
        </div>
        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-accent-cyan rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "33%" }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">What's your stack?</h1>
        <p className="text-white/60 text-lg">Select the technologies you know or want to learn.<br/>This helps us match you with the right teams and questions.</p>
      </div>

      <GlassCard className="w-full p-8 md:p-12 mb-24 border-white/20 relative overflow-hidden">
         {/* Background glow in card */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-accent-cyan/10 rounded-full mix-blend-screen filter blur-3xl pointer-events-none" />
         
         <div className="flex flex-wrap gap-3 justify-center relative z-10">
           {ALL_SKILLS.map((skill) => (
             <SkillTag 
               key={skill} 
               label={skill} 
               selected={selected.includes(skill)}
               onClick={() => toggleSkill(skill)}
             />
           ))}
         </div>
      </GlassCard>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 md:p-8 bg-gradient-to-t from-bg-dark via-bg-dark/80 to-transparent z-50 flex justify-center backdrop-blur-sm">
         <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
         >
           <LiquidButton 
             size="lg" 
             className="w-[300px]"
             disabled={selected.length === 0 || isLoading}
             onClick={handleContinue}
           >
             {isLoading ? 'Saving...' : selected.length === 0 ? "Select at least one skill" : `Continue with ${selected.length} skills`}
           </LiquidButton>
         </motion.div>
      </div>
    </div>
  );
};

export default OnboardingPage;
