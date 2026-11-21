import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';

export const TaskCard = ({ task, onSelectTask, onDragStart }) => {
  const isOverdue =
    task.dueDate &&
    task.status !== 'DONE' &&
    new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);

  const getPriorityBorder = (priority) => {
    switch (priority) {
      case 'URGENT':
        return 'border-l-rose-500';
      case 'HIGH':
        return 'border-l-amber-500';
      case 'MEDIUM':
        return 'border-l-brand-500';
      default:
        return 'border-l-slate-300';
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case 'HIGH':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'MEDIUM':
        return 'bg-indigo-50 text-brand-700 border-indigo-200/80';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200/80';
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onClick={() => onSelectTask(task)}
      className={`bg-white p-4 rounded-2xl border border-slate-200/80 border-l-4 ${getPriorityBorder(
        task.priority
      )} shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-grab active:cursor-grabbing group hover:border-r-brand-200 hover:border-t-brand-200 hover:border-b-brand-200 select-none relative`}
    >
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className="text-[11px] font-extrabold tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
          {task.projectKey || 'TF'}
        </span>
        <span
          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getPriorityStyle(
            task.priority
          )}`}
        >
          {task.priority}
        </span>
      </div>

      <h4 className="font-bold text-sm text-slate-800 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
        {task.title}
      </h4>

      {task.description && (
        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          {task.dueDate ? (
            <div
              className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                isOverdue
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'text-slate-500 bg-slate-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              {isOverdue && <AlertCircle className="w-3.5 h-3.5 text-rose-600 ml-0.5" />}
            </div>
          ) : (
            <span className="text-[11px] text-slate-300">No deadline</span>
          )}
        </div>

        <div>
          {task.assignee ? (
            <img
              src={task.assignee.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignee.email}`}
              alt={task.assignee.fullName}
              title={task.assignee.fullName}
              className="w-7 h-7 rounded-full ring-2 ring-white shadow-xs"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-bold">
              ?
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
