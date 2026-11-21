import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { projectService } from '../services/projectService';
import { useToast } from '../context/ToastContext';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  User, 
  Layers 
} from 'lucide-react';

export const AnalyticsPage = () => {
  const { showToast } = useToast();
  const [dashboardAnalytics, setDashboardAnalytics] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projectAnalytics, setProjectAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalAnalytics = async () => {
      try {
        setLoading(true);
        const [dashRes, projRes] = await Promise.all([
          analyticsService.getDashboardAnalytics(),
          projectService.getProjects(),
        ]);
        if (dashRes.data) setDashboardAnalytics(dashRes.data);
        if (projRes.data && projRes.data.length > 0) {
          setProjects(projRes.data);
          setSelectedProjectId(projRes.data[0].id);
        }
      } catch (err) {
        showToast('Failed to load analytics', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchGlobalAnalytics();
  }, []);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!selectedProjectId) return;
      try {
        const res = await analyticsService.getProjectAnalytics(selectedProjectId);
        if (res.data) setProjectAnalytics(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjectDetails();
  }, [selectedProjectId]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span className="text-xs text-slate-400">Computing project analytics...</span>
      </div>
    );
  }

  const priorityColors = {
    URGENT: 'bg-rose-500',
    HIGH: 'bg-amber-500',
    MEDIUM: 'bg-blue-500',
    LOW: 'bg-slate-400',
  };

  const statusColors = {
    DONE: 'bg-emerald-500',
    IN_PROGRESS: 'bg-brand-500',
    REVIEW: 'bg-amber-500',
    TODO: 'bg-slate-400',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Analytics & Productivity</h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor velocity, task distribution, overdue alerts, and team workload balance
        </p>
      </div>

      {/* Global Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Completion Rate</p>
            <h3 className="text-3xl font-black text-slate-800 mt-1">
              {dashboardAnalytics?.completionRate || 0}%
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
              {dashboardAnalytics?.completedTasks || 0} of {dashboardAnalytics?.totalTasks || 0} finished
            </span>
          </div>
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Work Items</p>
            <h3 className="text-3xl font-black text-slate-800 mt-1">
              {dashboardAnalytics?.totalTasks || 0}
            </h3>
            <span className="text-[11px] text-brand-600 font-semibold mt-1 inline-block">
              Across {dashboardAnalytics?.totalProjects || 0} active projects
            </span>
          </div>
          <div className="p-3.5 bg-brand-50 text-brand-600 rounded-2xl border border-brand-100">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Overdue Tasks</p>
            <h3 className="text-3xl font-black text-slate-800 mt-1">
              {dashboardAnalytics?.overdueTasks || 0}
            </h3>
            <span className="text-[11px] text-rose-600 font-semibold mt-1 inline-block">
              Requires immediate team triage
            </span>
          </div>
          <div className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Task Distribution Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Breakdown */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <h3 className="font-bold text-sm text-slate-800 mb-6">Distribution by Priority</h3>
          <div className="space-y-4">
            {dashboardAnalytics?.priorityDistribution &&
              Object.entries(dashboardAnalytics.priorityDistribution).map(([pKey, count]) => {
                const total = dashboardAnalytics.totalTasks || 1;
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={pKey}>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                      <span>{pKey}</span>
                      <span>{count} tasks ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`${priorityColors[pKey] || 'bg-slate-400'} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <h3 className="font-bold text-sm text-slate-800 mb-6">Distribution by Status</h3>
          <div className="space-y-4">
            {dashboardAnalytics?.statusDistribution &&
              Object.entries(dashboardAnalytics.statusDistribution).map(([sKey, count]) => {
                const total = dashboardAnalytics.totalTasks || 1;
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={sKey}>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                      <span>{sKey}</span>
                      <span>{count} tasks ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`${statusColors[sKey] || 'bg-slate-400'} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Project-Specific Workload Breakdown */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm text-slate-800">Team Workload Distribution</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Current tasks assigned to each contributor for selected project
            </p>
          </div>

          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectKey} - {p.name}
              </option>
            ))}
          </select>
        </div>

        {projectAnalytics?.workloadByMember && Object.keys(projectAnalytics.workloadByMember).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            {Object.entries(projectAnalytics.workloadByMember).map(([member, count]) => (
              <div
                key={member}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                    {member.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{member}</p>
                    <span className="text-[10px] text-slate-400">Assigned Tasks</span>
                  </div>
                </div>
                <span className="text-base font-black text-brand-600 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                  {count}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-8">No tasks recorded for this project yet.</p>
        )}
      </div>
    </div>
  );
};
