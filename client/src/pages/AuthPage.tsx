import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassInput } from '../components/ui/GlassInput';
import { LiquidButton } from '../components/ui/LiquidButton';
import { Code2, Mail, Lock, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI, setToken, setUser } from '../lib/api';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Controlled inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // Show success message if redirected from OTP page
  React.useEffect(() => {
    if ((location.state as any)?.verified) {
      setSuccessMsg('Email verified successfully! You can now log in.');
      setIsLogin(true);
    }
  }, [location.state]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    // Basic Validation
    if (!email.includes('@')) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (!isLogin) {
      // Registration: validate @niet.co.in domain
      if (!email.endsWith('@niet.co.in')) {
         setError("You must use your @niet.co.in college email to join.");
         setIsLoading(false);
         return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
         setError("Passwords do not match.");
         setIsLoading(false);
         return;
      }

      // Register API call
      try {
        await authAPI.register(name, email, password);
        // Navigate to OTP page with email
        navigate('/verify-otp', { state: { email } });
      } catch (err: any) {
        setError(err.message || 'Registration failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Login API call
      try {
        const response = await authAPI.login(email, password);
        // Save token and user data
        setToken(response.data.token);
        setUser(response.data.user);
        
        // Check if user has completed onboarding (has skills set)
        if (response.data.user.skills && response.data.user.skills.length > 0) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      } catch (err: any) {
        setError(err.message || 'Login failed. Please check your credentials.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccessMsg(null);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex">
      {/* Left side: Premium Branding Visual (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 justify-center items-center">
        {/* Dynamic Abstract Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black z-0 pointer-events-none" />
        <motion.div animate={{ rotate: 360, scale: [1, 1.05, 1] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute w-[120%] aspect-square border-[1px] border-primary/20 rounded-full border-dashed z-0 pointer-events-none" />
        <motion.div animate={{ rotate: -360, scale: [1, 1.1, 1] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute w-[80%] aspect-square border-[2px] border-accent-cyan/10 rounded-full border-solid z-0 pointer-events-none" />
        
        <div className="relative z-10 p-12 max-w-lg">
           <Link to="/" className="flex items-center gap-3 mb-12 group w-max">
             <div className="bg-gradient-to-tr from-primary to-accent-cyan p-3 rounded-2xl group-hover:scale-105 transition-transform shadow-lg">
               <Code2 size={28} className="text-white" />
             </div>
             <span className="font-extrabold text-3xl tracking-tight text-white">
               Skill<span className="text-primary">Net</span>
             </span>
           </Link>

           <h1 className="text-5xl font-extrabold text-white mb-6 tracking-tighter leading-tight">
             Connect with your campus elite.
           </h1>
           <p className="text-lg text-white/60 font-medium">
             The only network built exclusively to help students find hackathon teams, share knowledge, and build billion dollar ideas.
           </p>
           
           <div className="mt-12 flex -space-x-4">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-slate-900 bg-gradient-to-br from-primary/60 to-accent-cyan/60 flex items-center justify-center text-xs text-white shadow-xl backdrop-blur-md">
                   P{i}
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-white/10 flex items-center justify-center text-xs text-white backdrop-blur-md font-bold">
                 +2k
              </div>
           </div>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <div className="noise-overlay" />
        
        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden flex items-center gap-3 mb-12">
             <div className="bg-gradient-to-tr from-primary to-accent-cyan p-2.5 rounded-xl">
               <Code2 size={24} className="text-white" />
             </div>
             <span className="font-extrabold text-2xl tracking-tight text-[var(--tw-white)]">
               Skill<span className="text-primary">Net</span>
             </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-slate-500 dark:text-white/60 font-medium mb-8">
              {isLogin ? 'Enter your credentials to access your network.' : 'Use your college email (@niet.co.in) to get verified.'}
            </p>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                 {error}
              </motion.div>
            )}

            {successMsg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm font-bold flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                 {successMsg}
              </motion.div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <GlassInput icon={<User size={18} />} type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
              )}
              <GlassInput icon={<Mail size={18} />} type="email" placeholder={isLogin ? "College Email" : "College Email (@niet.co.in)"} value={email} onChange={e => setEmail(e.target.value)} required />
              <GlassInput icon={<Lock size={18} />} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
              
              {!isLogin && (
                <GlassInput icon={<Lock size={18} />} type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              )}

              {isLogin && (
                <div className="flex justify-end">
                  <a href="#" className="text-sm font-semibold text-primary hover:underline">Forgot password?</a>
                </div>
              )}

              <LiquidButton type="submit" className="w-full h-12 text-lg mt-4 disabled:opacity-70" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Join SkillNet'
                )}
              </LiquidButton>
            </form>


            <p className="mt-8 text-center text-sm text-slate-500 dark:text-white/60 font-medium">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                type="button"
                onClick={toggleAuthMode} 
                disabled={isLoading}
                className="font-bold text-primary hover:underline disabled:opacity-50"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
