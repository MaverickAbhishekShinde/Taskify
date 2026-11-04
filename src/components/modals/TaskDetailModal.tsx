import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus, Priority } from '../../types';
import {
  X,
  Check,
  Calendar,
  Clock,
  User as UserIcon,
  Tag,
  Trash2,
  ExternalLink,
  Quote,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, isOpen, onClose }) => {
  const { users, meetings, updateTask, deleteTask, setSelectedMeetingId, setActiveTab } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('to_do');
  const [priority, setPriority] = useState<Priority>('medium');
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [scheduledDuration, setScheduledDuration] = useState<number>(45);
  const [category, setCategory] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setAssigneeId(task.assigneeId);
      setDueDate(task.dueDate || '');
      setScheduledDate(task.scheduledDate || '');
      setScheduledTime(task.scheduledTime || '');
      setScheduledDuration(task.scheduledDurationMinutes || 45);
      setCategory(task.category || 'General');
      setShowDeleteConfirm(false);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTask({
      ...task,
      title: title.trim() || task.title,
      description: description.trim(),
      status,
      priority,
      assigneeId: assigneeId === 'unassigned' || !assigneeId ? null : assigneeId,
      dueDate: dueDate || null,
      scheduledDate: scheduledDate || null,
      scheduledTime: scheduledTime || null,
      scheduledDurationMinutes: scheduledTime ? scheduledDuration : undefined,
      category,
    });
    onClose();
  };

  const handleDelete = () => {
    deleteTask(task.id);
    onClose();
  };

  const handleOpenSourceMeeting = () => {
    if (task.meetingId) {
      setSelectedMeetingId(task.meetingId);
      setActiveTab('review');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-md bg-blue-100 text-blue-700">
              {category}
            </span>
            {task.meetingTitle && (
              <button
                type="button"
                onClick={handleOpenSourceMeeting}
                className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium transition-colors"
                title="Jump to source meeting"
              >
                <span>{task.meetingTitle}</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4.5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Task Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
            />
          </div>

          {/* Transcript Excerpt if available */}
          {task.excerpt && (
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 mb-1">
                <Quote className="w-3.5 h-3.5 text-amber-600" />
                <span>Originating Transcript Excerpt</span>
                {task.timestamp && (
                  <span className="ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-100 text-[10px] font-mono text-amber-800">
                    <Clock className="w-2.5 h-2.5" />
                    {task.timestamp}
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-950/80 italic leading-relaxed pl-4 border-l-2 border-amber-300">
                "{task.excerpt}"
              </p>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Description & Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
              placeholder="Add implementation notes, context, or deliverables..."
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                Status Column
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
              >
                <option value="to_do">📋 To Do</option>
                <option value="in_progress">⚡ In Progress</option>
                <option value="in_review">🔍 In Review</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
              >
                <option value="high">🔴 High Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="low">🔵 Low Priority</option>
              </select>
            </div>
          </div>

          {/* Assignee & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                Assignee
              </label>
              <select
                value={assigneeId || 'unassigned'}
                onChange={(e) => setAssigneeId(e.target.value === 'unassigned' ? null : e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
              >
                <option value="unassigned">⚠️ Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Due Date
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                />
                {dueDate && (
                  <button
                    type="button"
                    onClick={() => setDueDate('')}
                    className="px-2 py-1 text-[11px] text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Daily Calendar Scheduling Section */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Daily Calendar Timeline Slot
              </span>
              {scheduledTime && (
                <button
                  type="button"
                  onClick={() => {
                    setScheduledTime('');
                    setScheduledDate('');
                  }}
                  className="text-[11px] text-rose-600 hover:underline"
                >
                  Unschedule
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Time Slot</label>
                <select
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  <option value="">Unscheduled</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Duration</label>
                <select
                  disabled={!scheduledTime}
                  value={scheduledDuration}
                  onChange={(e) => setScheduledDuration(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs disabled:opacity-50"
                >
                  <option value={30}>30 mins</option>
                  <option value={45}>45 mins</option>
                  <option value={60}>60 mins</option>
                  <option value={90}>90 mins</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {showDeleteConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-600 font-medium">Delete task?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700"
                >
                  Confirm Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2 py-1 text-slate-500 hover:text-slate-800 text-xs"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs text-rose-500 hover:text-rose-700 font-medium flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Task
              </button>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

