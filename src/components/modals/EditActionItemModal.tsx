import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ActionItem, Priority } from '../../types';
import { X, Check, Quote, Calendar, User as UserIcon, Tag, Clock, AlertTriangle } from 'lucide-react';

interface EditActionItemModalProps {
  item: ActionItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditActionItemModal: React.FC<EditActionItemModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const { users, updateActionItem } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState<string>('');
  const [category, setCategory] = useState('Engineering');

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description);
      setAssigneeId(item.assigneeId);
      setPriority(item.priority);
      setDueDate(item.dueDate || '');
      setCategory(item.category || 'Engineering');
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateActionItem({
      ...item,
      title: title.trim() || item.title,
      description: description.trim(),
      assigneeId: assigneeId === 'unassigned' || !assigneeId ? null : assigneeId,
      priority,
      dueDate: dueDate ? dueDate : null,
      category,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Edit Suggested Action Item</h3>
            <p className="text-xs text-slate-500">Refine task details before accepting to the board</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
          {/* Transcript Excerpt Verification Box */}
          <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100/70">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900 mb-1">
              <Quote className="w-3.5 h-3.5 text-blue-600" />
              <span>Verbatim Transcript Evidence</span>
              <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 text-[11px] font-mono text-blue-700">
                <Clock className="w-3 h-3" />
                {item.timestamp}
              </span>
            </div>
            <p className="text-xs text-blue-950/80 italic leading-relaxed pl-5 border-l-2 border-blue-300">
              "{item.excerpt}"
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-slate-900"
              placeholder="e.g. Update API documentation"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Task Description & Context
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
              placeholder="Provide actionable instructions, links, or notes..."
            />
          </div>

          {/* Assignee & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                Assigned Owner
              </label>
              <select
                value={assigneeId || 'unassigned'}
                onChange={(e) => setAssigneeId(e.target.value === 'unassigned' ? null : e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
              >
                <option value="unassigned">⚠️ Unassigned (Needs Owner)</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium"
              >
                <option value="high">🔴 High Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="low">🔵 Low Priority</option>
              </select>
            </div>
          </div>

          {/* Due Date & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
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
                    title="Clear due date"
                  >
                    Clear
                  </button>
                )}
              </div>
              {!dueDate && (
                <p className="text-[11px] text-slate-400 mt-1">No explicit deadline discussed</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="QA">QA</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Save Modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

