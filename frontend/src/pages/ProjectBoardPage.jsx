import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Users, Shield } from 'lucide-react';

export const ProjectBoardPage = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await projectService.getProjectById(id);
        if (res.data) {
          setProject(res.data);
        }
      } catch (err) {
        showToast('Failed to load project details', 'error');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span className="text-xs text-slate-400">Loading Kanban board...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-bold text-slate-800">Project Not Found</h2>
        <Link to="/projects" className="text-xs text-brand-600 font-semibold mt-2 inline-block">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      {/* Board Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/projects"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
            title="Back to Projects"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
                {project.projectKey}
              </span>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">{project.name}</h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Team: <span className="font-semibold text-slate-600">{project.teamName}</span>
            </p>
          </div>
        </div>

        {/* Member Avatars */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 overflow-hidden">
            {project.members?.map((m) => (
              <img
                key={m.id}
                src={m.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.email}`}
                alt={m.fullName}
                title={m.fullName}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100"
              />
            ))}
          </div>

          <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>{project.members?.length || 1} members</span>
          </div>
        </div>
      </div>

      {/* Main Kanban Board */}
      <div className="flex-1 min-h-0">
        <KanbanBoard projectId={project.id} members={project.members || []} />
      </div>
    </div>
  );
};
