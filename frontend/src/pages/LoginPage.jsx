import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Layers, ArrowRight, ShieldCheck, UserCheck, Code, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      showToast('Welcome to TeamFlow!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative ambient gradient glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-600/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] bg-indigo-600/20 rounded-full blur-[130px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 text-white shadow-2xl shadow-brand-500/40 mb-4 ring-1 ring-white/20">
          <Layers className="w-9 h-9" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-[11px] font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3 h-3 text-brand-400" />
          <span>Designed & Architected by Ayananshu</span>
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">TeamFlow</h2>
        <p className="mt-1 text-sm text-slate-400">
          Enterprise Collaborative Project Management System
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-900/80 backdrop-blur-2xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-800 ring-1 ring-white/10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ayananshu@teamflow.io"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-brand-500/30 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins for Interview Showcase */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-3 text-center">
              Quick 1-Click Demo Profiles
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('ayananshu@teamflow.io', 'Password123!')}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 rounded-2xl border border-indigo-500/40 text-center transition flex flex-col items-center group ring-1 ring-brand-500/30"
              >
                <ShieldCheck className="w-5 h-5 text-brand-400 mb-1 transition-transform group-hover:scale-110" />
                <span className="text-xs font-extrabold text-white">Ayananshu</span>
                <span className="text-[10px] text-brand-300 font-medium">Lead Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('sarah@teamflow.io', 'Password123!')}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 rounded-2xl border border-slate-800 text-center transition flex flex-col items-center group"
              >
                <UserCheck className="w-5 h-5 text-emerald-400 mb-1 transition-transform group-hover:scale-110" />
                <span className="text-xs font-extrabold text-white">Sarah</span>
                <span className="text-[10px] text-slate-400 font-medium">Manager</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('david@teamflow.io', 'Password123!')}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 rounded-2xl border border-slate-800 text-center transition flex flex-col items-center group"
              >
                <Code className="w-5 h-5 text-blue-400 mb-1 transition-transform group-hover:scale-110" />
                <span className="text-xs font-extrabold text-white">David</span>
                <span className="text-[10px] text-slate-400 font-medium">Developer</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              New here?{' '}
              <Link to="/register" className="text-brand-400 hover:text-brand-300 font-bold">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
