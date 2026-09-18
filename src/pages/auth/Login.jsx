import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import { Lock, LogIn, Sparkles, CheckCircle2, ArrowRight, UserCheck, AlertCircle, X, Shield, Globe, Loader2 } from 'lucide-react';
import { getStoredAccounts } from '../../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, loginWithOAuth, signInWithGoogleDirect, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [googleRole, setGoogleRole] = useState(ROLES.CANDIDATE);

  const storedAccounts = getStoredAccounts();

  // Check if returning from OAuth provider with tokens in URL
  const isReturningFromOAuth = typeof window !== 'undefined' && (
    window.location.hash.includes('access_token') ||
    window.location.search.includes('code=')
  );

  // Auto-redirect when authenticated (e.g. from Google OAuth callback)
  useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = user.role || ROLES.CANDIDATE;
      if (window.location.hash || window.location.search) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      navigate(userRole === ROLES.RECRUITER ? '/recruiter' : '/candidate', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = (formData.email || '').trim();
    const cleanPass = (formData.password || '').trim();

    if (!cleanEmail) {
      setError('Please enter your email or Gmail address to proceed.');
      return;
    }
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!cleanPass) {
      setError('Please enter your password to proceed.');
      return;
    }

    const res = await login(cleanEmail, cleanPass);
    if (res.success) {
      const userRole = res.data?.user?.role || ROLES.CANDIDATE;
      navigate(userRole === ROLES.RECRUITER ? '/recruiter' : '/candidate');
    } else {
      setError(res.message || 'Invalid credentials. Please check your email and password.');
    }
  };

  const handleOAuth = async (provider) => {
    setError('');
    const res = await loginWithOAuth(provider);
    if (res.redirecting) {
      // Browser is redirecting to live Supabase OAuth provider
      return;
    }
    if (res.success) {
      const userRole = res.data?.user?.role || ROLES.CANDIDATE;
      navigate(userRole === ROLES.RECRUITER ? '/recruiter' : '/candidate');
    } else if (res.providerNotConfigured) {
      // Open Google Account Picker dialog
      setShowGoogleModal(true);
    } else {
      setError(res.message || 'OAuth authentication failed');
    }
  };

  const handleGoogleDirectSignIn = async (email, name, role) => {
    const res = await signInWithGoogleDirect({
      email: email || 'alex.morgan@gmail.com',
      name: name || 'Google User',
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
    }, role || googleRole);

    if (res.success) {
      setShowGoogleModal(false);
      const userRole = res.data?.user?.role || ROLES.CANDIDATE;
      navigate(userRole === ROLES.RECRUITER ? '/recruiter' : '/candidate');
    } else {
      setError(res.message || 'Google sign-in failed');
    }
  };

  const fillDemoAccount = (demoEmail, demoPassword = 'Password123!') => {
    setFormData({
      email: demoEmail,
      password: demoPassword
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col justify-between font-sans">
      {/* Header */}
      <header className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/assets/logo.jpg"
              alt="FairHire Logo"
              className="w-9 h-9 rounded-lg object-contain bg-white p-0.5 border border-slate-200"
            />
            <div>
              <span className="text-xl font-extrabold text-navy-900 tracking-tight font-sans">
                Fair<span className="text-teal-500">Hire</span>
              </span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-teal-600">
                Fair Process. Right Talent.
              </p>
            </div>
          </Link>

          <div className="text-xs text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-teal-600 hover:text-navy-900 underline">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6">
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              Sign In to FairHire
            </h2>
            <p className="text-xs text-slate-500">
              Welcome back. Sign in with Google OAuth or your stored credentials.
            </p>
          </div>

          {/* OAuth Redirect Processing Indicator */}
          {isReturningFromOAuth && !isAuthenticated && (
            <div className="p-4 bg-teal-50/80 border border-teal-300 rounded-2xl flex items-center gap-3 animate-pulse shadow-xs">
              <Loader2 className="w-5 h-5 text-teal-600 animate-spin shrink-0" />
              <div>
                <p className="text-xs font-bold text-teal-950">Verifying Google Session...</p>
                <p className="text-[11px] text-teal-700">Connecting your account and redirecting to your workspace...</p>
              </div>
            </div>
          )}

          {/* OAuth Authentication Button */}
          <div className="pt-1">

            <button
              type="button"
              onClick={() => handleOAuth('google')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 rounded-xl text-xs font-bold text-slate-700 transition-all shadow-xs group"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.37 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.2.01 10.04.01 12c0 1.96.46 3.8 1.28 5.42l3.99-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>


          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              or sign in with stored credentials
            </span>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium leading-relaxed flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address / Gmail"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. name@gmail.com"
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password recovery: enter your registered password or use the demo accounts below.')}
                  className="text-[11px] text-teal-600 hover:text-navy-900 font-semibold"
                >
                  Forgot?
                </button>
              </div>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full py-3.5 text-sm font-bold shadow-md flex items-center justify-center gap-2"
              isLoading={loading}
              icon={LogIn}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo & Stored Accounts Switcher */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
              <span>Quick Demo Fill / Stored Accounts:</span>
              <span className="text-[10px] text-teal-600 font-semibold">{storedAccounts.length} ready</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillDemoAccount('alex.morgan@gmail.com', 'Password123!')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200 text-left transition-colors"
              >
                <span className="font-bold text-slate-800 block text-[11px]">Candidate Demo</span>
                <span className="text-[10px] text-teal-600 truncate block">alex.morgan@gmail.com</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('elena.rostova@fairhire.io', 'Password123!')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-navy-50 border border-slate-200 text-left transition-colors"
              >
                <span className="font-bold text-slate-800 block text-[11px]">HR Recruiter Demo</span>
                <span className="text-[10px] text-navy-700 truncate block">elena.rostova@fairhire.io</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Google Account Selector Dialog */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.37 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.2.01 10.04.01 12c0 1.96.46 3.8 1.28 5.42l3.99-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <h3 className="text-sm font-bold text-slate-800">Sign in with Google</h3>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                <p className="font-bold flex items-center gap-1.5 mb-0.5">
                  <Shield className="w-3.5 h-3.5 text-amber-600" />
                  Google OAuth Ready
                </p>
                To enable full Google Cloud OAuth redirection, toggle Google provider in Supabase Dashboard (Auth → Providers → Google). You can also sign in right now with any Google account below!
              </div>

              {/* Portal Role Selector for Google Sign In */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Select Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGoogleRole(ROLES.CANDIDATE)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      googleRole === ROLES.CANDIDATE
                        ? 'border-teal-500 bg-teal-50/50 text-teal-700 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Candidate
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoogleRole(ROLES.RECRUITER)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      googleRole === ROLES.RECRUITER
                        ? 'border-navy-600 bg-navy-50/50 text-navy-800 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    HR Recruiter
                  </button>
                </div>
              </div>

              {/* Quick Select Google Profiles */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Choose a Google Account
                </p>

                <button
                  type="button"
                  onClick={() => handleGoogleDirectSignIn('muhammedridzwanm0@gmail.com', 'Muhammed Ridzwan', googleRole)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/30 flex items-center gap-3 text-left transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                    M
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-teal-700 truncate">
                      Muhammed Ridzwan
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      muhammedridzwanm0@gmail.com
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
                </button>

                <button
                  type="button"
                  onClick={() => handleGoogleDirectSignIn('alex.morgan@gmail.com', 'Alex Morgan', googleRole)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/30 flex items-center gap-3 text-left transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    A
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-teal-700 truncate">
                      Alex Morgan
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      alex.morgan@gmail.com
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
                </button>
              </div>

              {/* Or enter custom Google Account */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Or enter your Google / Gmail account
                </p>
                <input
                  type="text"
                  placeholder="Your Name (e.g. John Doe)"
                  value={customGoogleName}
                  onChange={(e) => setCustomGoogleName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-teal-500"
                />
                <input
                  type="email"
                  placeholder="Gmail address (e.g. yourname@gmail.com)"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-teal-500"
                />
                <Button
                  type="button"
                  variant="gradient"
                  size="sm"
                  className="w-full py-2.5 text-xs font-bold"
                  disabled={!customGoogleEmail || !customGoogleEmail.includes('@')}
                  onClick={() => handleGoogleDirectSignIn(customGoogleEmail, customGoogleName || customGoogleEmail.split('@')[0], googleRole)}
                >
                  Sign In with this Google Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-100 bg-white">
        © 2026 FairHire • Secure Supabase Auth & Google OAuth 2.0
      </footer>
    </div>
  );
};

export default Login;
