import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';
import { projectService } from '../services/projectService';
import { useAuth } from '../context/AuthContext';
import { 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight,
  Activity,
  Layers,
  Sparkles,
  Plus
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [analyticsRes, projectsRes] = await Promise.all([
          analyticsService.getDashboardAnalytics(),
          projectService.getProjects(),
        ]);
        if (analyticsRes.data) setAnalytics(analyticsRes.data);
        if (projectsRes.data) setProjects(projectsRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span className="text-xs font-semibold text-slate-400">Loading your command center...</span>
      </div>
    );
  }

  const kpis = [
    {
      label: 'Total Projects',
      value: analytics?.totalProjects || 0,
      icon: FolderKanban,
      color: 'bg-gradient-to-tr from-blue-500 to-cyan-400 text-white shadow-blue-500/20',
      subtext: 'Active Workspaces',
    },
    {
      label: 'Active Tasks',
      value: (analytics?.inProgressTasks || 0) + (analytics?.todoTasks || 0) + (analytics?.reviewTasks || 0),
      icon: Clock,
      color: 'bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-brand-500/20',
      subtext: 'In Pipeline',
    },
    {
      label: 'Completed Tasks',
      value: analytics?.completedTasks || 0,
      icon: CheckCircle2,
      color: 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-500/20',
      subtext: 'Delivered',
    },
    {
      label: 'Overdue Tasks',
      value: analytics?.overdueTasks || 0,
      icon: AlertTriangle,
      color: 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-rose-500/20',
      subtext: 'Action Required',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-indigo-500/20">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold tracking-wide mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>TeamFlow Platform • Crafted by Ayananshu</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Welcome back, {user?.fullName || 'Ayananshu'}! 🚀
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2.5 leading-relaxed font-normal">
            Your collaborative command center is live with real-time STOMP WebSockets, optimistic concurrency controls, and sprint progress tracking.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/projects"
              className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-500/25 flex items-center gap-2 transition"
            >
              <span>Launch Kanban Board</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/analytics"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/10 backdrop-blur-md transition"
            >
              View Workload Analytics
            </Link>
          </div>
        </div>

        {/* Decorative background logo */}
        <div className="absolute right-4 bottom-0 translate-y-6 opacity-10 pointer-events-none hidden lg:block">
          <Layers className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</p>
                <h3 className="text-3xl font-black text-slate-800 mt-1 tracking-tight">{kpi.value}</h3>
                <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block">{kpi.subtext}</span>
              </div>
              <div className={`p-3.5 rounded-2xl shadow-lg ${kpi.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Progress & Workspaces & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sprint / Project Completion Rate */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-600" />
                Overall Sprint Completion
              </h3>
              <span className="text-xs font-black text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-100">
                {analytics?.completionRate || 0}%
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden my-4 p-0.5">
              <div
                className="bg-gradient-to-r from-brand-600 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${analytics?.completionRate || 0}%` }}
              />
            </div>

            <div className="space-y-3 mt-6">
              <div className="flex justify-between text-xs font-semibold p-2.5 rounded-xl bg-slate-50">
                <span className="text-slate-600 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" /> Completed
                </span>
                <span className="font-bold text-slate-800">{analytics?.completedTasks || 0}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold p-2.5 rounded-xl bg-slate-50">
                <span className="text-slate-600 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 ring-2 ring-indigo-200" /> In Progress
                </span>
                <span className="font-bold text-slate-800">{analytics?.inProgressTasks || 0}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold p-2.5 rounded-xl bg-slate-50">
                <span className="text-slate-600 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 ring-2 ring-slate-200" /> To Do
                </span>
                <span className="font-bold text-slate-800">{analytics?.todoTasks || 0}</span>
              </div>
            </div>
          </div>

          <Link
            to="/analytics"
            className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-600 hover:text-brand-700 transition"
          >
            <span>View granular workload breakdown</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Active Projects List */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-sm text-slate-800">Your Projects</h3>
              <Link to="/projects" className="text-xs font-bold text-brand-600 hover:text-brand-700">
                View all ({projects.length})
              </Link>
            </div>

            <div className="space-y-3">
              {projects.slice(0, 3).map((p) => (
                <Link
                  key={p.id}
                  to={`/projects/${p.id}`}
                  className="block p-4 rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-100 transition group hover:border-brand-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-brand-600 bg-white border border-brand-100 px-2.5 py-0.5 rounded-lg shadow-2xs">
                      {p.projectKey}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">{p.members?.length || 1} members</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 mt-2.5 group-hover:text-brand-600 transition">
                    {p.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-1">{p.description}</p>
                </Link>
              ))}

              {projects.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
                  No projects created yet.
                </div>
              )}
            </div>
          </div>

          <Link
            to="/projects"
            className="mt-4 inline-flex items-center justify-center w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-xs"
          >
            Open Kanban Workspace
          </Link>
        </div>

        {/* Live Activity Audit Feed */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              Live Activity Audit
            </h3>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              Audit Stream
            </span>
          </div>

          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
            {analytics?.recentActivities?.length ? (
              analytics.recentActivities.slice(0, 5).map((act) => (
                <div key={act.id} className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs">
                  <img
                    src={act.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${act.user?.email || 'user'}`}
                    alt={act.user?.fullName}
                    className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 mt-0.5 ring-1 ring-slate-200"
                  />
                  <div className="flex-1">
                    <p className="text-slate-800 leading-tight">
                      <span className="font-bold">{act.user?.fullName}</span> {act.details}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">No recent activities.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
