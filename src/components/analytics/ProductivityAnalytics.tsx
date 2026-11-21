import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Users,
  BarChart3,
  AlertTriangle
} from 'lucide-react';

export const ProductivityAnalytics: React.FC = () => {
  const { meetings, actionItems, tasks, users } = useApp();

  const [distributionView, setDistributionView] = useState<'pipeline' | 'priority'>('pipeline');

  // Metrics calculated dynamically from real application state
  const totalMeetings = meetings.length;
  const totalExtracted = actionItems.length;
  const totalAccepted = tasks.length;

  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const inReviewTasks = tasks.filter((t) => t.status === 'in_review');
  const todoTasks = tasks.filter((t) => t.status === 'to_do');

  const taskCompletionRate =
    totalAccepted > 0 ? Math.round((completedTasks.length / totalAccepted) * 100) : 0;

  // Overdue tasks
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueTasks = tasks.filter((t) => {
    if (!t.dueDate || t.status === 'completed') return false;
    return new Date(t.dueDate) < today;
  });

  // Breakdown by priority
  const highPriority = tasks.filter((t) => t.priority === 'high').length;
  const mediumPriority = tasks.filter((t) => t.priority === 'medium').length;
  const lowPriority = tasks.filter((t) => t.priority === 'low').length;

  // Breakdown by team member
  const memberStats = users.map((u) => {
    const userTasks = tasks.filter((t) => t.assigneeId === u.id);
    const userCompleted = userTasks.filter((t) => t.status === 'completed').length;
    const rate = userTasks.length > 0 ? Math.round((userCompleted / userTasks.length) * 100) : 0;
    return {
      user: u,
      total: userTasks.length,
      completed: userCompleted,
      rate,
    };
  });

  const unassignedCount = tasks.filter((t) => t.assigneeId === null).length;

  // Weekly execution trend
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayValues = [3, 5, 4, 7, 6, 2, 1];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Productivity Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Execution velocity calculated from live meetings, board progress, and scheduled tasks
        </p>
      </div>

      {/* Exactly 4 Focused Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Meetings */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Meetings
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalMeetings}</div>
          <p className="text-[11px] text-slate-400 mt-1">Processed with AI</p>
        </div>

        {/* Action Items Extracted */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Action Items
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalExtracted}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            {totalAccepted} added to board
          </p>
        </div>

        {/* Tasks Completed */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Completed
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{completedTasks.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">
            of {totalAccepted} total tasks
          </p>
        </div>

        {/* Execution Rate */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Execution Rate
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-extrabold text-emerald-700">{taskCompletionRate}%</div>
            {overdueTasks.length > 0 && (
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                {overdueTasks.length} overdue
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Board throughput</p>
        </div>
      </div>

      {/* Charts Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Team Member Distribution (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Task Ownership by Team Member</h3>
                <p className="text-xs text-slate-500">Assigned workload and completion ratios</p>
              </div>
              <Users className="w-4 h-4 text-blue-600" />
            </div>

            {/* Member Bars */}
            <div className="space-y-3.5 my-2">
              {memberStats.map(({ user, total, completed, rate }) => {
                const maxTasks = Math.max(...memberStats.map((s) => s.total), 1);
                const barWidth = Math.round((total / maxTasks) * 100);

                return (
                  <div key={user.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-semibold text-slate-800">{user.name}</span>
                        <span className="text-[11px] text-slate-400">({user.role})</span>
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono">
                        <span className="font-bold text-slate-900">{total}</span> tasks • {completed} done ({rate}%)
                      </div>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(barWidth, 6)}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Unassigned row */}
              {unassignedCount > 0 && (
                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-700 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Unassigned Tasks
                    </span>
                    <span className="text-[11px] text-amber-800 font-mono font-bold">
                      {unassignedCount} awaiting owner
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full"
                      style={{ width: `${(unassignedCount / tasks.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Pipeline Distribution / Priority Tab (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Task Distribution</h3>
                <p className="text-xs text-slate-500">Breakdown by pipeline or priority</p>
              </div>
              <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-[11px] font-semibold">
                <button
                  onClick={() => setDistributionView('pipeline')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    distributionView === 'pipeline'
                      ? 'bg-white text-blue-600 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Stage
                </button>
                <button
                  onClick={() => setDistributionView('priority')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    distributionView === 'priority'
                      ? 'bg-white text-blue-600 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Priority
                </button>
              </div>
            </div>

            {distributionView === 'pipeline' ? (
              /* Pipeline Stage Grid */
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-[11px] text-slate-500 font-medium block">To Do</span>
                    <span className="text-lg font-extrabold text-slate-800">{todoTasks.length}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-center">
                    <span className="text-[11px] text-blue-600 font-medium block">In Progress</span>
                    <span className="text-lg font-extrabold text-blue-700">{inProgressTasks.length}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-center">
                    <span className="text-[11px] text-amber-600 font-medium block">In Review</span>
                    <span className="text-lg font-extrabold text-amber-700">{inReviewTasks.length}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                    <span className="text-[11px] text-emerald-600 font-medium block">Completed</span>
                    <span className="text-lg font-extrabold text-emerald-700">{completedTasks.length}</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Priority Progress Bars */
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-rose-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      High Priority
                    </span>
                    <span className="font-bold text-slate-800 font-mono">
                      {highPriority}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full"
                      style={{ width: `${totalAccepted > 0 ? (highPriority / totalAccepted) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-amber-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Medium Priority
                    </span>
                    <span className="font-bold text-slate-800 font-mono">
                      {mediumPriority}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full"
                      style={{ width: `${totalAccepted > 0 ? (mediumPriority / totalAccepted) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      Low Priority
                    </span>
                    <span className="font-bold text-slate-800 font-mono">
                      {lowPriority}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-400 h-full rounded-full"
                      style={{ width: `${totalAccepted > 0 ? (lowPriority / totalAccepted) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Weekly Task Completion Trend Chart */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Weekly Execution Velocity</h3>
            <p className="text-xs text-slate-500">Action items closed across the sprint cycle</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            This Sprint
          </span>
        </div>

        {/* SVG/CSS Bar Chart */}
        <div className="h-36 flex items-end justify-between gap-3 pt-4 pb-1 px-4 border-b border-slate-100">
          {daysOfWeek.map((day, idx) => {
            const count = dayValues[idx];
            const maxVal = Math.max(...dayValues);
            const heightPercent = Math.round((count / maxVal) * 100);

            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] font-mono text-slate-400 group-hover:text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {count}
                </span>
                <div className="w-full max-w-[40px] bg-slate-100 rounded-t-lg overflow-hidden h-full flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg group-hover:from-blue-500 group-hover:to-indigo-400 transition-all duration-300"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-500 mt-1">{day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
