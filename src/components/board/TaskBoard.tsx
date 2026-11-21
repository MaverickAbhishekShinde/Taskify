import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus, Priority } from '../../types';
import { TaskDetailModal } from '../modals/TaskDetailModal';
import {
  Search,
  Filter,
  Plus,
  Calendar,
  Clock,
  AlertCircle,
  X,
  SlidersHorizontal
} from 'lucide-react';

export const TaskBoard: React.FC = () => {
  const {
    tasks,
    users,
    meetings,
    updateTaskStatus,
    filter,
    setFilter,
    createTask,
  } = useApp();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');

  const columns: { id: TaskStatus; title: string; color: string; badgeBg: string }[] = [
    { id: 'to_do', title: 'To Do', color: 'bg-slate-400', badgeBg: 'bg-slate-100 text-slate-700' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-blue-500', badgeBg: 'bg-blue-50 text-blue-700' },
    { id: 'in_review', title: 'In Review', color: 'bg-amber-500', badgeBg: 'bg-amber-50 text-amber-700' },
    { id: 'completed', title: 'Completed', color: 'bg-emerald-500', badgeBg: 'bg-emerald-50 text-emerald-700' },
  ];

  // Count active filters (excluding search query)
  const activeFiltersCount =
    (filter.assigneeId !== 'all' ? 1 : 0) +
    (filter.priority !== 'all' ? 1 : 0) +
    (filter.meetingId !== 'all' ? 1 : 0);

  // Filtering logic
  const filteredTasks = tasks.filter((task) => {
    // Search query
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description.toLowerCase().includes(q);
      const matchMeeting = task.meetingTitle?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchMeeting) return false;
    }

    // Assignee filter
    if (filter.assigneeId !== 'all') {
      if (filter.assigneeId === 'unassigned') {
        if (task.assigneeId !== null) return false;
      } else {
        if (task.assigneeId !== filter.assigneeId) return false;
      }
    }

    // Priority filter
    if (filter.priority !== 'all') {
      if (task.priority !== filter.priority) return false;
    }

    // Meeting filter
    if (filter.meetingId !== 'all') {
      if (task.meetingId !== filter.meetingId) return false;
    }

    return true;
  });

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Low
          </span>
        );
    }
  };

  const getAssignee = (assigneeId: string | null) => {
    if (!assigneeId) return null;
    return users.find((u) => u.id === assigneeId);
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    return due < now;
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      updateTaskStatus(taskId, targetStatus);
    }
    setDraggedTaskId(null);
  };

  const handleQuickCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    createTask({
      title: quickTitle.trim(),
      description: 'Manually created task',
      meetingId: meetings[0]?.id || 'manual',
      meetingTitle: 'Ad-hoc Task',
      status: 'to_do',
      priority: 'medium',
      assigneeId: users[0]?.id || null,
      dueDate: new Date().toISOString().split('T')[0],
      category: 'General',
    });

    setQuickTitle('');
    setIsQuickCreateOpen(false);
  };

  const clearFilters = () => {
    setFilter({
      searchQuery: '',
      assigneeId: 'all',
      priority: 'all',
      meetingId: 'all',
      dueDateRange: 'all',
    });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Board Header: Search, Unified Filters Toggle, Add Task */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filter.searchQuery}
              onChange={(e) => setFilter((prev) => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Unified Filters Toggle Button */}
            <button
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                activeFiltersCount > 0 || isFiltersExpanded
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Quick Add Task button */}
            <button
              onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Progressive Disclosure: Collapsible Filter Options Panel */}
        {isFiltersExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2.5 animate-fade-in">
            {/* Assignee Filter */}
            <select
              value={filter.assigneeId}
              onChange={(e) => setFilter((prev) => ({ ...prev, assigneeId: e.target.value }))}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Assignees</option>
              <option value="unassigned">⚠️ Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={filter.priority}
              onChange={(e) => setFilter((prev) => ({ ...prev, priority: e.target.value as Priority | 'all' }))}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🔵 Low</option>
            </select>

            {/* Meeting Filter */}
            <select
              value={filter.meetingId}
              onChange={(e) => setFilter((prev) => ({ ...prev, meetingId: e.target.value }))}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 max-w-[180px] truncate"
            >
              <option value="all">All Meetings</option>
              {meetings.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>

            {/* Reset Filters pill if active */}
            {(activeFiltersCount > 0 || filter.searchQuery) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors ml-auto"
              >
                <X className="w-3 h-3" />
                <span>Clear filters</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Quick Add Task Form */}
      {isQuickCreateOpen && (
        <form
          onSubmit={handleQuickCreate}
          className="bg-white p-3.5 rounded-2xl border border-blue-200 shadow-xs flex items-center gap-2 animate-fade-in"
        >
          <input
            type="text"
            required
            autoFocus
            placeholder="Type task title and press Enter..."
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setIsQuickCreateOpen(false)}
            className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800"
          >
            Cancel
          </button>
        </form>
      )}

      {/* 4 Jira-style Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200/80 flex flex-col min-h-[580px] transition-colors"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 px-1 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.color}`} />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    {col.title}
                  </h3>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${col.badgeBg}`}>
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks Cards Container */}
              <div className="flex-1 space-y-2.5 overflow-y-auto pr-0.5">
                {colTasks.length === 0 && (
                  <div className="h-28 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-[11px] text-slate-400">
                    Drag tasks here
                  </div>
                )}

                {colTasks.map((task) => {
                  const assignee = getAssignee(task.assigneeId);
                  const overdue = isOverdue(task.dueDate) && task.status !== 'completed';

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onClick={() => setSelectedTask(task)}
                      className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all cursor-pointer group relative"
                    >
                      {/* Category & Priority Row */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {task.category}
                        </span>
                        {getPriorityBadge(task.priority)}
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                        {task.title}
                      </h4>

                      {/* Card Footer: Assignee & Due Date */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                        {/* Assignee Avatar */}
                        {assignee ? (
                          <div
                            className="flex items-center gap-1.5"
                            title={`${assignee.name} (${assignee.role})`}
                          >
                            <img
                              src={assignee.avatar}
                              alt={assignee.name}
                              className="w-4.5 h-4.5 rounded-full object-cover ring-1 ring-slate-200"
                            />
                            <span className="text-[11px] text-slate-700 font-medium truncate max-w-[85px]">
                              {assignee.name.split(' ')[0]}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                            <AlertCircle className="w-2.5 h-2.5 text-amber-600" />
                            Unassigned
                          </span>
                        )}

                        {/* Due Date / Calendar Badge */}
                        <div className="flex items-center gap-1.5 ml-auto">
                          {task.scheduledTime && (
                            <span
                              className="inline-flex items-center gap-0.5 text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded"
                              title={`Scheduled on timeline for ${task.scheduledTime}`}
                            >
                              <Clock className="w-2.5 h-2.5 text-blue-600" />
                              {task.scheduledTime}
                            </span>
                          )}

                          {task.dueDate ? (
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded ${
                                overdue
                                  ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200'
                                  : 'text-slate-500 bg-slate-50'
                              }`}
                            >
                              <Calendar className="w-2.5 h-2.5" />
                              {task.dueDate.slice(5)}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-300">No date</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
};
