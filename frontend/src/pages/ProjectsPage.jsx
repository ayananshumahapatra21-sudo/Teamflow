import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { teamService } from '../services/teamService';
import { useToast } from '../context/ToastContext';
import { FolderKanban, Plus, Users, ArrowUpRight, X } from 'lucide-react';

export const ProjectsPage = () => {
  const { showToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Project modal state
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [projectKey, setProjectKey] = useState('');
  const [teamId, setTeamId] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projRes, teamRes] = await Promise.all([
        projectService.getProjects(),
        teamService.getTeams(),
      ]);
      if (projRes.data) setProjects(projRes.data);
      if (teamRes.data) {
        setTeams(teamRes.data);
        if (teamRes.data.length > 0) setTeamId(teamRes.data[0].id);
      }
    } catch (err) {
      showToast('Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!name.trim() || !projectKey.trim() || !teamId) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await projectService.createProject(
        teamId,
        name.trim(),
        projectKey.trim().toUpperCase(),
        description.trim() || null
      );
      if (res.data) {
        showToast('Project created successfully!', 'success');
        setProjects((prev) => [res.data, ...prev]);
        setShowModal(false);
        setName('');
        setProjectKey('');
        setDescription('');
      }
    } catch (err) {
      showToast(err.message || 'Failed to create project', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Projects</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your project workspaces and launch interactive Kanban boards
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-brand-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span className="text-xs text-slate-400">Loading projects...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-brand-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-100">
                    {p.projectKey}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                    {p.teamName || 'Workspace'}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-800 group-hover:text-brand-600 transition">
                  {p.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {p.description || 'No project description provided.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>{p.members?.length || 1} members</span>
                </div>

                <Link
                  to={`/projects/${p.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 group-hover:text-brand-700 bg-brand-50/50 group-hover:bg-brand-50 px-3 py-1.5 rounded-xl transition"
                >
                  <span>Open Board</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8">
              <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-700 text-sm">No projects found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Get started by creating your first project workspace to organize tasks and sprints.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl"
              >
                + Create Project
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">Create Project</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Project Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mobile App Redesign"
                  className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Project Key <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={8}
                    value={projectKey}
                    onChange={(e) => setProjectKey(e.target.value.toUpperCase())}
                    placeholder="e.g. MOB"
                    className="w-full text-sm uppercase font-mono border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Team Workspace <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                    className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Goals, target milestones and deliverables..."
                  className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow-md shadow-brand-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
