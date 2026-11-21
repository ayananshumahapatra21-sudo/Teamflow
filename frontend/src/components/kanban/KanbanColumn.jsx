import React, { useState } from 'react';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

export const KanbanColumn = ({
  statusKey,
  title,
  tasks,
  icon: Icon,
  accentColor,
  onSelectTask,
  onDropTask,
  onOpenNewTask,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (dataStr) {
        const droppedTask = JSON.parse(dataStr);
        onDropTask(droppedTask, statusKey);
      }
    } catch (err) {
      console.error('Drop error:', err);
    }
  };

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('application/json', JSON.stringify(task));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 flex flex-col rounded-2xl bg-slate-100/70 border transition-all duration-200 min-w-[280px] max-w-[340px] max-h-[calc(100vh-13rem)] ${
        isDragOver
          ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/20'
          : 'border-slate-200/60'
      }`}
    >
      {/* Column Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-200/60">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg ${accentColor}`}>
            <Icon className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-slate-800">{title}</h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onOpenNewTask(statusKey)}
          className="p-1 text-slate-400 hover:text-brand-600 hover:bg-white rounded-lg transition"
          title={`Add task to ${title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Task List */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onSelectTask={onSelectTask}
            onDragStart={handleDragStart}
          />
        ))}

        {tasks.length === 0 && (
          <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-xs font-medium text-slate-400">No tasks</p>
            <button
              onClick={() => onOpenNewTask(statusKey)}
              className="mt-2 text-xs text-brand-600 hover:text-brand-700 font-semibold"
            >
              + Create task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
