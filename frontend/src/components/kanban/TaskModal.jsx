import React, { useState, useEffect } from 'react';
import { taskService } from '../../services/taskService';
import { useToast } from '../../context/ToastContext';
import { X, Calendar, User, MessageSquare, Trash2, Send } from 'lucide-react';

export const TaskModal = ({ task, members = [], onClose, onTaskUpdated, onTaskDeleted }) => {
  const { showToast } = useToast();
  const [currentTask, setCurrentTask] = useState(task);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComment, setLoadingComment] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (task?.id) {
      setCurrentTask(task);
      fetchComments();
    }
  }, [task?.id]);

  const fetchComments = async () => {
    try {
      const res = await taskService.getComments(task.id);
      if (res.data) setComments(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      const res = await taskService.updateTaskStatus(currentTask.id, newStatus, currentTask.version);
      if (res.data) {
        setCurrentTask(res.data);
        onTaskUpdated(res.data);
        showToast(`Moved to ${newStatus}`, 'success');
      }
    } catch (err) {
      if (err.error === 'CONFLICT') {
        showToast('Concurrency conflict! Another user modified this task. Please reopen.', 'error');
      } else {
        showToast(err.message || 'Failed to update status', 'error');
      }
    } finally {
      setUpdating(false);
    }
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      setUpdating(true);
      const res = await taskService.updateTask(currentTask.id, {
        title: currentTask.title,
        description: currentTask.description,
        status: currentTask.status,
        priority: newPriority,
        assigneeId: currentTask.assignee?.id,
        dueDate: currentTask.dueDate,
        version: currentTask.version,
      });
      if (res.data) {
        setCurrentTask(res.data);
        onTaskUpdated(res.data);
        showToast('Priority updated', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update priority', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleAssigneeChange = async (newAssigneeId) => {
    try {
      setUpdating(true);
      const res = await taskService.updateTask(currentTask.id, {
        title: currentTask.title,
        description: currentTask.description,
        status: currentTask.status,
        priority: currentTask.priority,
        assigneeId: newAssigneeId || null,
        dueDate: currentTask.dueDate,
        version: currentTask.version,
      });
      if (res.data) {
        setCurrentTask(res.data);
        onTaskUpdated(res.data);
        showToast('Assignee updated', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update assignee', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoadingComment(true);
      const res = await taskService.addComment(currentTask.id, newComment.trim());
      if (res.data) {
        setComments((prev) => [...prev, res.data]);
        setNewComment('');
        showToast('Comment posted', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to add comment', 'error');
    } finally {
      setLoadingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.deleteTask(currentTask.id);
      showToast('Task deleted successfully', 'success');
      onTaskDeleted(currentTask.id);
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
    }
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-slide-left">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
              {currentTask.projectKey || 'TF'}
            </span>
            <span className="text-xs text-slate-400 font-medium">v{currentTask.version} (Optimistic Lock)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{currentTask.title}</h2>
            <p className="text-sm text-slate-600 mt-3 whitespace-pre-wrap leading-relaxed">
              {currentTask.description || 'No detailed description provided.'}
            </p>
          </div>

          {/* Task Properties Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">Status</label>
              <select
                value={currentTask.status}
                disabled={updating}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">Under Review</option>
                <option value="DONE">Completed</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">Priority</label>
              <select
                value={currentTask.priority}
                disabled={updating}
                onChange={(e) => handlePriorityChange(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">Assignee</label>
              <select
                value={currentTask.assignee?.id || ''}
                disabled={updating}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">Due Date</label>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-2.5 py-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentTask.dueDate || 'None'}</span>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <h3 className="font-bold text-sm text-slate-800">Discussion ({comments.length})</h3>
            </div>

            {/* Comment List */}
            <div className="space-y-4 mb-6">
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-3 p-3 bg-slate-50/60 rounded-xl border border-slate-100">
                  <img
                    src={c.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user?.email}`}
                    alt={c.user?.fullName}
                    className="w-8 h-8 rounded-full bg-slate-200"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{c.user?.fullName}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{c.content}</p>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">No comments yet. Start the conversation below!</p>
              )}
            </div>

            {/* Post Comment Input */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                disabled={loadingComment || !newComment.trim()}
                className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
