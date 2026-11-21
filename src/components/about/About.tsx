import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Kanban,
  Calendar as CalendarIcon,
  Clock,
  BarChart3,
  Cpu,
  ArrowRight,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export const About: React.FC = () => {
  const { setActiveTab } = useApp();

  const capabilities = [
    {
      title: 'AI Meeting Review',
      description: 'Extracts tasks with owners, priorities, deadlines, and verbatim quotes.',
      icon: <Sparkles className="w-5 h-5 text-blue-600" />,
      tab: 'review' as const,
    },
    {
      title: 'Kanban Task Board',
      description: 'Drag-and-drop across To Do, In Progress, In Review, and Completed.',
      icon: <Kanban className="w-5 h-5 text-indigo-600" />,
      tab: 'board' as const,
    },
    {
      title: 'Daily Schedule',
      description: 'Hourly timeline with quick slot assignment for unscheduled tasks.',
      icon: <CalendarIcon className="w-5 h-5 text-cyan-600" />,
      tab: 'calendar' as const,
    },
    {
      title: 'Meeting History',
      description: 'Revisit past meetings, summaries, and action item acceptance rates.',
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      tab: 'history' as const,
    },
    {
      title: 'Productivity Analytics',
      description: 'Live team metrics calculated directly from the current board state.',
      icon: <BarChart3 className="w-5 h-5 text-emerald-600" />,
      tab: 'analytics' as const,
    },
    {
      title: 'Dual AI Engine',
      description: 'Built-in deterministic parser, with optional Google Gemini API support.',
      icon: <Cpu className="w-5 h-5 text-violet-600" />,
      tab: null,
    },
  ];

  const walkthroughSteps = [
    {
      step: '1',
      title: 'Review a meeting',
      description:
        'Open a meeting transcript and inspect AI-extracted action items with timestamps and verbatim quotes.',
      actionLabel: 'Open Review',
      tab: 'review' as const,
    },
    {
      step: '2',
      title: 'Accept or discard tasks',
      description:
        'Accept individual tasks or use Accept All / Discard All. Note how unclear owners are marked Unassigned.',
      actionLabel: null,
      tab: null,
    },
    {
      step: '3',
      title: 'Work the board',
      description:
        'Open the Task Board, drag tasks between columns, test search and filters, and open a task to jump back to its source meeting.',
      actionLabel: 'View Board',
      tab: 'board' as const,
    },
    {
      step: '4',
      title: 'Plan the day',
      description:
        'Use the Schedule view to place unscheduled tasks into hourly timeline slots.',
      actionLabel: 'Open Schedule',
      tab: 'calendar' as const,
    },
    {
      step: '5',
      title: 'Check history and analytics',
      description:
        'Browse past meetings in History and inspect live team velocity metrics in Analytics.',
      actionLabel: 'View Analytics',
      tab: 'analytics' as const,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-8">
      {/* 1. Header */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>AI Meeting-to-Execution Platform</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          About Taskify
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
          Taskify turns unstructured meeting transcripts into verified, assigned, and trackable action items. Teams no longer have to manually identify action items, assign owners, or schedule tasks after collaborative meetings.
        </p>
      </section>

      {/* 2. Key Capabilities (6 cards) */}
      <section className="space-y-3.5">
        <div className="px-1">
          <h2 className="text-base font-bold text-slate-900">Key Capabilities</h2>
          <p className="text-xs text-slate-500">Core features powering the meeting-to-execution workflow</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              onClick={() => cap.tab && setActiveTab(cap.tab)}
              className={`bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-2xs transition-all ${
                cap.tab
                  ? 'hover:border-blue-300 hover:shadow-xs cursor-pointer group'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {cap.icon}
                </div>
                {cap.tab && (
                  <span className="text-[11px] font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                    Explore <ArrowRight className="w-3 h-3" />
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{cap.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{cap.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. How to Explore This Prototype (5-step walkthrough) */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">How to Explore This Prototype</h2>
          <p className="text-xs text-slate-500">Follow this 5-step walkthrough to test the end-to-end flow</p>
        </div>

        <div className="space-y-3.5">
          {walkthroughSteps.map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {item.step}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</h3>
                  {item.actionLabel && item.tab && (
                    <button
                      onClick={() => setActiveTab(item.tab!)}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline shrink-0 flex items-center gap-1"
                    >
                      <span>{item.actionLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Demonstration Environment Note */}
      <section className="bg-blue-50/60 rounded-2xl p-5 border border-blue-100 text-xs text-blue-950/90 leading-relaxed">
        <p>
          This prototype comes pre-loaded with realistic sample meetings, team members, and tasks. It runs entirely in your browser with zero setup, no login, and no required paid API keys. An optional Google Gemini integration is available in settings for live LLM experimentation.
        </p>
      </section>

      {/* 5. Subtle Footer Link */}
      <div className="pt-2 text-center">
        <a
          href="https://github.com/MaverickAbhishekShinde/Taskify"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors"
        >
          <span>View source on GitHub</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
