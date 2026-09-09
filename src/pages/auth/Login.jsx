import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import { Lock, LogIn, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithOAuth, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

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
    if (res.success) {
      const userRole = res.data?.user?.role || ROLES.CANDIDATE;
      navigate(userRole === ROLES.RECRUITER ? '/recruiter' : '/candidate');
    } else {
      setError(res.message || 'OAuth authentication failed');
    }
  };

  const fillDemoAccount = (demoEmail, demoRole) => {
    setFormData({
      email: demoEmail,
      password: 'Password123!'
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
              Welcome back. Sign in with Google, OAuth, or your email.
            </p>
          </div>

          {/* OAuth Authentication Buttons */}
          <div className="space-y-2.5 pt-1">
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

            <button
              type="button"
              onClick={() => handleOAuth('github')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              or continue with email
            </span>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium leading-relaxed">
              {error}
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
                  onClick={() => alert('Password reset link sent to demo email.')}
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

          {/* Quick Demo Credentials Switcher */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
              <span>Quick Demo Fill:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillDemoAccount('alex.morgan@gmail.com', ROLES.CANDIDATE)}
                className="p-2 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200 text-left transition-colors"
              >
                <span className="font-bold text-slate-800 block text-[11px]">Candidate User</span>
                <span className="text-[10px] text-teal-600 truncate block">alex.morgan@gmail.com</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('elena.rostova@fairhire.io', ROLES.RECRUITER)}
                className="p-2 rounded-lg bg-slate-50 hover:bg-navy-50 border border-slate-200 text-left transition-colors"
              >
                <span className="font-bold text-slate-800 block text-[11px]">HR / Recruiter</span>
                <span className="text-[10px] text-navy-700 truncate block">elena.rostova@fairhire.io</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-100 bg-white">
        © 2026 FairHire • Secure OAuth 2.0 & Token Authentication
      </footer>
    </div>
  );
};

export default Login;
