import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, Meeting, TaskStatus, Priority } from '../../types';
import { TaskDetailModal } from '../modals/TaskDetailModal';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User as UserIcon,
  Plus,
  CheckCircle2,
  AlertCircle,
  Video,
  Layers,
  ArrowRight,
  Sparkles,
  Filter
} from 'lucide-react';

export const DailySchedule: React.FC = () => {
  const { tasks, meetings, users, scheduleTask, unscheduleTask } = useApp();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [filterType, setFilterType] = useState<'all' | 'tasks' | 'meetings'>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Quick schedule modal / popover
  const [schedulingTask, setSchedulingTask] = useState<Task | null>(null);
  const [targetSlot, setTargetSlot] = useState<string>('10:00');

  const formattedDateString = currentDate.toISOString().split('T')[0];

  const navigateDate = (days: number) => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + days);
    setCurrentDate(next);
  };

  const setToday = () => {
    setCurrentDate(new Date());
  };

  const isToday =
    new Date().toISOString().split('T')[0] === formattedDateString;

  // Time slots from 08:00 to 18:00 (8 AM to 6 PM)
  const timeSlots = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
  ];

  // Helper to get formatted display time (e.g. "10:00 AM")
  const formatSlotDisplay = (slot: string) => {
    const [h] = slot.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour}:00 ${suffix}`;
  };

  // Find tasks scheduled on this date
  const scheduledTasksOnDay = tasks.filter(
    (t) => t.scheduledDate === formattedDateString && t.scheduledTime
  );

  // Find meetings on this date
  const meetingsOnDay = meetings.filter(
    (m) => m.date === formattedDateString
  );

  // Tasks that are unscheduled (no specific time) or assigned to this date but no hour
  const unscheduledTasks = tasks.filter(
    (t) => !t.scheduledTime && t.status !== 'completed'
  );

  const getAssignee = (assigneeId: string | null) => {
    if (!assigneeId) return null;
    return users.find((u) => u.id === assigneeId);
  };

  const handleQuickScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingTask) return;
    scheduleTask(schedulingTask.id, formattedDateString, targetSlot, 45);
    setSchedulingTask(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Calendar Top Controls Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation & Date Label */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => navigateDate(-1)}
              className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={setToday}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                isToday
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'hover:bg-white text-slate-700'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => navigateDate(1)}
              className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span>
                {currentDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              {isToday && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Current Day
                </span>
              )}
            </h2>
          </div>
        </div>

        {/* View Filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterType === 'all'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              All Schedule
            </button>
            <button
              onClick={() => setFilterType('tasks')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterType === 'tasks'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Tasks Only ({scheduledTasksOnDay.length})
            </button>
            <button
              onClick={() => setFilterType('meetings')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterType === 'meetings'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Meetings ({meetingsOnDay.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Hourly Timeline, Right = Unscheduled Tasks Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hourly Timeline (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Daily Timeline View</h3>
            </div>
            <span className="text-xs text-slate-400">
              {scheduledTasksOnDay.length + meetingsOnDay.length} items scheduled
            </span>
          </div>

          {/* Timeline Slots */}
          <div className="divide-y divide-slate-100">
            {timeSlots.map((slot) => {
              // Find matching tasks for this slot (e.g., slot starts with "10:")
              const slotHour = slot.split(':')[0];

              const slotTasks = filterType !== 'meetings'
                ? scheduledTasksOnDay.filter((t) => t.scheduledTime?.startsWith(slotHour))
                : [];

              const slotMeetings = filterType !== 'tasks'
                ? meetingsOnDay.filter((m) => {
                    if (!m.time) return false;
                    const isPM = m.time.includes('PM');
                    let [h] = m.time.split(':').map(Number);
                    if (isPM && h < 12) h += 12;
                    return h === Number(slotHour);
                  })
                : [];

              const hasItems = slotTasks.length > 0 || slotMeetings.length > 0;

              return (
                <div key={slot} className="py-3 flex items-start gap-4 group">
                  {/* Slot Time Indicator */}
                  <div className="w-20 pt-1 shrink-0 text-right">
                    <span className="text-xs font-mono font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
                      {formatSlotDisplay(slot)}
                    </span>
                  </div>

                  {/* Slot Content Lane */}
                  <div className="flex-1 min-h-[48px] rounded-xl transition-colors">
                    {hasItems ? (
                      <div className="space-y-2">
                        {/* Meetings */}
                        {slotMeetings.map((meet) => (
                          <div
                            key={meet.id}
                            className="p-3 bg-gradient-to-r from-indigo-50/90 to-blue-50/80 rounded-xl border border-indigo-200/80 flex items-center justify-between shadow-2xs"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                                <Video className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-1.5 py-0.5 rounded">
                                  Meeting Sync • {meet.durationMinutes} mins
                                </span>
                                <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                                  {meet.title}
                                </h4>
                              </div>
                            </div>
                            <span className="text-[11px] font-mono text-slate-500">
                              {meet.time}
                            </span>
                          </div>
                        ))}

                        {/* Scheduled Tasks */}
                        {slotTasks.map((task) => {
                          const assignee = getAssignee(task.assigneeId);
                          return (
                            <div
                              key={task.id}
                              onClick={() => setSelectedTask(task)}
                              className="p-3 bg-white hover:bg-slate-50 rounded-xl border border-blue-200/90 shadow-2xs flex items-center justify-between gap-3 cursor-pointer group/task transition-all hover:border-blue-400"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-slate-900 group-hover/task:text-blue-600 transition-colors truncate">
                                    {task.title}
                                  </h4>
                                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                                    <span>{task.category}</span>
                                    <span>•</span>
                                    <span className="capitalize">{task.status.replace('_', ' ')}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                {assignee && (
                                  <div className="flex items-center gap-1.5">
                                    <img
                                      src={assignee.avatar}
                                      alt={assignee.name}
                                      className="w-5 h-5 rounded-full object-cover"
                                    />
                                    <span className="text-[11px] text-slate-700 hidden sm:inline">
                                      {assignee.name.split(' ')[0]}
                                    </span>
                                  </div>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    unscheduleTask(task.id);
                                  }}
                                  className="text-[10px] text-slate-400 hover:text-rose-600 p-1 opacity-0 group-hover/task:opacity-100 transition-opacity"
                                  title="Unschedule task"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="h-full border border-dashed border-slate-100 rounded-xl p-2.5 flex items-center justify-between text-[11px] text-slate-300 group-hover:border-slate-200 transition-colors">
                        <span>Free Time Slot</span>
                        <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to schedule
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unscheduled Tasks Section (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col max-h-[720px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Unscheduled Tasks</h3>
            </div>
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              {unscheduledTasks.length}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
            Tasks without a specific hour slot appear here. Click <strong>Schedule</strong> to slot them into today's timeline.
          </p>

          <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
            {unscheduledTasks.length === 0 ? (
              <div className="h-40 border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center text-center p-4 text-xs text-slate-400">
                All tasks are currently scheduled!
              </div>
            ) : (
              unscheduledTasks.map((task) => {
                const assignee = getAssignee(task.assigneeId);

                return (
                  <div
                    key={task.id}
                    className="p-3 bg-slate-50/70 hover:bg-white rounded-xl border border-slate-200/80 shadow-2xs transition-all hover:border-blue-300"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {task.category}
                      </span>
                      {task.dueDate && (
                        <span className="text-[10px] font-medium text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          Due: {task.dueDate.slice(5)}
                        </span>
                      )}
                    </div>

                    <h4
                      onClick={() => setSelectedTask(task)}
                      className="text-xs font-bold text-slate-900 hover:text-blue-600 cursor-pointer leading-snug line-clamp-2"
                    >
                      {task.title}
                    </h4>

                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      {assignee ? (
                        <div className="flex items-center gap-1.5">
                          <img
                            src={assignee.avatar}
                            alt={assignee.name}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span className="text-[11px] text-slate-600 font-medium truncate max-w-[80px]">
                            {assignee.name.split(' ')[0]}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-amber-700 font-medium">Unassigned</span>
                      )}

                      <button
                        onClick={() => setSchedulingTask(task)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg text-xs font-bold transition-all shadow-2xs"
                      >
                        + Schedule
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Quick Schedule Modal */}
      {schedulingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 border border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Schedule Task on Timeline
            </h3>
            <p className="text-xs text-slate-500 mb-4 line-clamp-2">
              "{schedulingTask.title}"
            </p>

            <form onSubmit={handleQuickScheduleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Target Day: {formattedDateString}
                </label>
                <select
                  value={targetSlot}
                  onChange={(e) => setTargetSlot(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {formatSlotDisplay(slot)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSchedulingTask(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
};

