import React, { useState, useEffect } from 'react';
import { KanbanColumn } from './KanbanColumn';
import { TaskModal } from './TaskModal';
import { NewTaskModal } from './NewTaskModal';
import { taskService } from '../../services/taskService';
import { useToast } from '../../context/ToastContext';
import { 
  Circle, 
  Clock, 
  Eye, 
  CheckCircle2, 
  Search, 
  Filter, 
  Plus 
} from 'lucide-react';

export const KanbanBoard = ({ projectId, members = [] }) => {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');

  // Modals state
  const [selectedTask, setSelectedTask] = useState(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskDefaultStatus, setNewTaskDefaultStatus] = useState('TODO');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (priorityFilter) params.priority = priorityFilter;
      if (assigneeFilter) params.assigneeId = assigneeFilter;

      const res = await taskService.getTasks(projectId, params);
      if (res.data) {
        setTasks(res.data);
      }
    } catch (err) {
      showToast('Failed to load project tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId, priorityFilter, assigneeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTasks();
  };

  const handleDropTask = async (task, newStatus) => {
    if (task.status === newStatus) return;

    // Optimistic UI update
    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    );

    try {
      const res = await taskService.updateTaskStatus(task.id, newStatus, task.version);
      if (res.data) {
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? res.data : t))
        );
        showToast(`Task moved to ${newStatus}`, 'success');
      }
    } catch (err) {
      // Revert optimistic update
      setTasks(previousTasks);
      if (err.error === 'CONFLICT') {
        showToast('Concurrency conflict! Another user updated this task. Refreshed.', 'error');
        fetchTasks();
      } else {
        showToast(err.message || 'Failed to update task status', 'error');
      }
    }
  };

  const handleOpenNewTask = (statusKey = 'TODO') => {
    setNewTaskDefaultStatus(statusKey);
    setShowNewTaskModal(true);
  };

  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  const handleTaskDeleted = (deletedTaskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== deletedTaskId));
  };

  const columns = [
    {
      statusKey: 'TODO',
      title: 'To Do',
      icon: Circle,
      accentColor: 'bg-slate-100 text-slate-600',
    },
    {
      statusKey: 'IN_PROGRESS',
      title: 'In Progress',
      icon: Clock,
      accentColor: 'bg-indigo-100 text-brand-600',
    },
    {
      statusKey: 'REVIEW',
      title: 'Under Review',
      icon: Eye,
      accentColor: 'bg-amber-100 text-amber-600',
    },
    {
      statusKey: 'DONE',
      title: 'Completed',
      icon: CheckCircle2,
      accentColor: 'bg-emerald-100 text-emerald-600',
    },
  ];

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Filtering & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[200px] max-w-md relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks by title or details..."
            className="w-full text-xs pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </form>

        <div className="flex items-center gap-3">
          {/* Priority filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Assignee filter */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Assignees</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.fullName}
              </option>
            ))}
          </select>

          {/* New Task Button */}
          <button
            onClick={() => handleOpenNewTask('TODO')}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Columns container */}
      {loading ? (
        <div className="py-24 text-center text-slate-400">
          <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span className="text-xs font-medium">Loading Kanban Board...</span>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 items-start">
          {columns.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.statusKey);
            return (
              <KanbanColumn
                key={col.statusKey}
                statusKey={col.statusKey}
                title={col.title}
                tasks={columnTasks}
                icon={col.icon}
                accentColor={col.accentColor}
                onSelectTask={setSelectedTask}
                onDropTask={handleDropTask}
                onOpenNewTask={handleOpenNewTask}
              />
            );
          })}
        </div>
      )}

      {/* Task Details Drawer/Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          members={members}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
        />
      )}

      {/* Create New Task Modal */}
      {showNewTaskModal && (
        <NewTaskModal
          projectId={projectId}
          defaultStatus={newTaskDefaultStatus}
          members={members}
          onClose={() => setShowNewTaskModal(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
};
