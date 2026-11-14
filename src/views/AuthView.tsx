import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  BadgeCheck,
  ChevronRight,
  Eye,
  EyeOff,
  GraduationCap,
  KeyRound,
  Lock,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';

interface AuthViewProps {
  initialMode?: 'login' | 'signup';
  onBack: () => void;
  onAuthenticated: (email: string) => void;
  onShowToast: (msg: string) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'login',
  onBack,
  onAuthenticated,
  onShowToast,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('juan.delacruz@ustp.edu.ph');
  const [password, setPassword] = useState('ustptrailblazer2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!clean.endsWith('@ustp.edu.ph')) {
      setErrorMsg('Please use your official @ustp.edu.ph institutional email.');
      return;
    }
    if (password.length < 4) {
      setErrorMsg('Please enter your campus account password.');
      return;
    }
    setErrorMsg('');
    onShowToast(
      mode === 'login'
        ? 'Welcome back to USTP SupplyHub!'
        : 'USTP Student identity verified!'
    );
    onAuthenticated(clean);
  };

  const handlePortalSSO = () => {
    onShowToast('Synced with myUSTP Campus Portal');
    onAuthenticated('juan.delacruz@ustp.edu.ph');
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] py-6 px-4 sm:px-6 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full flex flex-col gap-5">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to welcome"
            className="w-11 h-11 rounded-full bg-[#eaedff] flex items-center justify-center text-[#131b2e] hover:bg-[#e2e7ff] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#131b2e]">
            <GraduationCap className="w-4 h-4 text-[#003734]" />
            <span>USTP Cagayan de Oro</span>
          </div>
          <div className="w-11" />
        </div>

        {/* Hero Heading */}
        <div className="flex flex-col items-center text-center">
          <img
            src="/assets/aistudio/Image_2_0f2f8706.png"
            alt="USTP SupplyHub"
            className="w-16 h-16 rounded-2xl shadow-md mb-3 object-cover"
          />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] tracking-tight">
            Welcome to SupplyHub
          </h1>
          <p className="text-sm text-[#3f4947] mt-1 max-w-xs">
            Sign in with your USTP institutional account to access student discounts, peer
            marketplace, and active group buys.
          </p>
        </div>

        {/* Segmented Control */}
        <div className="bg-[#eaedff] rounded-full p-1 flex">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-[#003734] shadow-sm'
                : 'text-[#3f4947] hover:text-[#131b2e]'
            }`}
          >
            <BadgeCheck className="w-4 h-4" />
            <span>Student Login</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-[#003734] shadow-sm'
                : 'text-[#3f4947] hover:text-[#131b2e]'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e7ff] flex flex-col gap-4"
        >
          <div>
            <label
              htmlFor="ustp-email"
              className="block text-xs font-semibold text-[#131b2e] mb-1.5"
            >
              USTP Student Email
            </label>
            <div className="relative flex items-center">
              <AtSign className="w-4 h-4 text-[#707977] absolute left-3.5 pointer-events-none" />
              <input
                id="ustp-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juandelacruz@ustp.edu.ph"
                required
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-[#f2f3ff] text-sm text-[#131b2e] focus:bg-white focus:outline-2 focus:outline-[#003734]"
              />
            </div>
            <p className="text-xs text-[#006c49] mt-1.5 flex items-center gap-1">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>Must end with @ustp.edu.ph · Trailblazers</span>
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="ustp-password"
                className="block text-xs font-semibold text-[#131b2e]"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => onShowToast('Recovery instructions sent to your USTP email.')}
                className="text-xs font-semibold text-[#003734] hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-[#707977] absolute left-3.5 pointer-events-none" />
              <input
                id="ustp-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full h-12 pl-10 pr-11 rounded-xl bg-[#f2f3ff] text-sm text-[#131b2e] focus:bg-white focus:outline-2 focus:outline-[#003734]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Toggle password visibility"
                className="absolute right-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-[#707977] hover:text-[#131b2e] cursor-pointer"
              >
                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="text-xs font-semibold text-[#93000a] bg-[#ffdad6] px-3 py-2 rounded-xl">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-[#3f4947]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="w-4 h-4 accent-[#003734] rounded"
              />
              <span>Remember this device</span>
            </label>
            <span>30 days</span>
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-full bg-[#003734] hover:bg-[#0b4f4b] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>
              {mode === 'login' ? 'Login to SupplyHub' : 'Verify USTP Identity & Register'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* SSO Option */}
        <button
          type="button"
          onClick={handlePortalSSO}
          className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#e2e7ff] hover:bg-[#f2f3ff] transition-colors flex items-center justify-between gap-3 cursor-pointer"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#ffddb8] text-[#2a1700] flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#131b2e]">
                Continue with myUSTP Portal
              </div>
              <div className="text-xs text-[#3f4947]">
                Instant student identity sync &amp; batch privileges
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#707977] shrink-0" />
        </button>

        <div className="flex flex-col items-center gap-1.5 text-center text-xs text-[#3f4947]">
          <div className="inline-flex items-center gap-1.5 font-semibold text-[#006c49]">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Verified USTP Student Community</span>
          </div>
          <span>Joined by 4,820+ students from CEA, CITC, CSM &amp; COT</span>
        </div>
      </div>
    </div>
  );
};
