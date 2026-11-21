import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  BarChart3, 
  Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects & Board', path: '/projects', icon: FolderKanban },
    { label: 'Teams & Workspaces', path: '/teams', icon: Users },
    { label: 'Analytics & Reports', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col flex-shrink-0 h-screen sticky top-0 border-r border-slate-800/80 shadow-2xl z-40">
      {/* Brand Header */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/50 to-transparent">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 ring-1 ring-white/20">
          <Layers className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-white text-lg tracking-tight">TeamFlow</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span className="text-[11px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-300">
            by Ayananshu
          </span>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-300 flex items-center justify-between">
          <span>Main Navigation</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] text-brand-400 font-mono">v2.0</span>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Creator Attribution Card */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=ayananshu"
                alt="Ayananshu"
                className="w-10 h-10 rounded-full ring-2 ring-brand-500/50 bg-slate-800"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-brand-500 border-2 border-slate-950 flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-bold text-xs text-white truncate">Ayananshu</span>
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
              </div>
              <span className="text-[10px] text-slate-300 font-medium truncate">Lead Architect & Creator</span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-300">
            <span>Portfolio Project</span>
            <span className="text-brand-400 font-bold">2026 Edition</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
