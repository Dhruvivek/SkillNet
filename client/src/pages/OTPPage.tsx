import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LiquidButton } from '../components/ui/LiquidButton';
import { Code2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../lib/api';

const OTPPage: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from navigation state
  const email = (location.state as any)?.email || '';

  useEffect(() => {
    if (!email) {
      navigate('/auth');
    }
  }, [email, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError(null);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Go back on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authAPI.verifyOtp(email, otpString);
      setSuccess('Email verified successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/auth', { state: { verified: true } });
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    
    setIsLoading(true);
    setError(null);

    try {
      await authAPI.register('', email, ''); // Will trigger OTP resend for unverified user
      setSuccess('New OTP sent to your email');
      setResendCountdown(60);
      setOtp(Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      // If register fails because it needs name/password, just reset countdown
      setResendCountdown(60);
      setError('Could not resend OTP. Please try registering again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex">
      {/* Left side: Branding (same as AuthPage) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 justify-center items-center">
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

          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-gradient-to-tr from-primary/20 to-accent-cyan/20 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-xl border border-white/10">
              <ShieldCheck size={48} className="text-primary" />
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tighter">
              Almost there!
            </h1>
            <p className="text-lg text-white/60 font-medium">
              Check your inbox for a 6-digit verification code. We want to make sure you're a real campus builder.
            </p>
          </div>
        </div>
      </div>

      {/* Right side: OTP Form */}
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
            <button 
              onClick={() => navigate('/auth')} 
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft size={16} /> Back to login
            </button>

            <h2 className="text-3xl font-extrabold tracking-tight mb-2">
              Verify your email
            </h2>
            <p className="text-slate-500 dark:text-white/60 font-medium mb-2">
              We sent a 6-digit code to
            </p>
            <p className="text-primary font-bold mb-8">
              {email}
            </p>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm font-bold flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                {success}
              </motion.div>
            )}

            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={el => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`w-14 h-16 text-center text-2xl font-black rounded-xl border-2 bg-white/5 dark:bg-white/5 backdrop-blur-sm outline-none transition-all duration-200 
                    ${digit ? 'border-primary text-primary shadow-[0_0_20px_rgba(124,58,237,0.2)]' : 'border-slate-200 dark:border-white/10 text-slate-800 dark:text-white'}
                    focus:border-primary focus:ring-2 focus:ring-primary/20`}
                />
              ))}
            </div>

            <LiquidButton 
              type="button" 
              className="w-full h-12 text-lg mb-6" 
              disabled={isLoading || otp.join('').length !== 6}
              onClick={handleVerify}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify Email'
              )}
            </LiquidButton>

            <p className="text-center text-sm text-slate-500 dark:text-white/60 font-medium">
              Didn't receive the code?{' '}
              {resendCountdown > 0 ? (
                <span className="text-white/40">Resend in {resendCountdown}s</span>
              ) : (
                <button 
                  onClick={handleResend}
                  disabled={isLoading}
                  className="font-bold text-primary hover:underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
              )}
            </p>

            <p className="mt-6 text-center text-xs text-slate-400 dark:text-white/30">
              💡 Tip: Check your spam folder if you don't see the email. In dev mode, the OTP is also logged in the backend console.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
