import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import {
  Sparkles,
  Kanban,
  Calendar as CalendarIcon,
  Clock,
  BarChart3,
  CheckCircle2,
  Plus,
  ChevronDown,
  Cpu,
  RotateCcw,
  HelpCircle
} from 'lucide-react';

interface NavbarProps {
  onOpenNewMeeting: () => void;
  onOpenApiKeyModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewMeeting, onOpenApiKeyModal }) => {
  const {
    activeTab,
    setActiveTab,
    actionItems,
    selectedMeetingId,
    tasks,
    meetings,
    users,
    currentUser,
    setCurrentUser,
    resetToDemoData,
    apiKey,
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Calculate pending items for currently active meeting
  const pendingItemsCount = actionItems.filter(
    (i) => i.meetingId === selectedMeetingId && i.status === 'suggested'
  ).length;

  const totalActiveTasks = tasks.filter((t) => t.status !== 'completed').length;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    {
      id: 'review',
      label: 'Meeting Review',
      icon: <Sparkles className="w-4 h-4" />,
      badge: pendingItemsCount > 0 ? pendingItemsCount : undefined,
    },
    {
      id: 'board',
      label: 'Task Board',
      icon: <Kanban className="w-4 h-4" />,
      badge: totalActiveTasks > 0 ? totalActiveTasks : undefined,
    },
    {
      id: 'calendar',
      label: 'Daily Schedule',
      icon: <CalendarIcon className="w-4 h-4" />,
    },
    {
      id: 'history',
      label: 'Meeting History',
      icon: <Clock className="w-4 h-4" />,
      badge: meetings.length,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'about',
      label: 'About',
      icon: <HelpCircle className="w-4 h-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-7">
            <div
              onClick={() => setActiveTab('review')}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-xs shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">Taskify</span>
                <p className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">
                  Meeting-to-Execution
                </p>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Section: New Meeting CTA, Profile Menu */}
          <div className="flex items-center gap-3">
            {/* Primary Action Button: Process Meeting */}
            <button
              onClick={onOpenNewMeeting}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold shadow-xs shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Process Meeting</span>
              <span className="sm:hidden">New</span>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                />
                <span className="text-xs font-semibold text-slate-800 hidden md:block max-w-[100px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in"
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser.role}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{currentUser.email}</p>
                  </div>

                  {/* Switch Persona option */}
                  <div className="px-3 py-2 border-b border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-1 block">
                      Switch User View
                    </span>
                    <div className="space-y-0.5">
                      {users.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            setCurrentUser(u);
                            setIsProfileOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
                            currentUser.id === u.id
                              ? 'bg-blue-50 text-blue-700 font-semibold'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="truncate flex-1 text-left">{u.name}</span>
                          {currentUser.id === u.id && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AI Engine Settings */}
                  <div className="px-2 pt-1 border-b border-slate-100 pb-1">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        onOpenApiKeyModal();
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-blue-600" />
                        <span>AI Engine Settings</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {apiKey ? 'Gemini' : 'Smart NLP'}
                      </span>
                    </button>
                  </div>

                  {/* Reset Demo Data */}
                  <div className="px-2 pt-1">
                    <button
                      onClick={() => {
                        resetToDemoData();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Demo Data</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold whitespace-nowrap ${
                  isActive ? 'text-blue-600 font-bold' : 'text-slate-500'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
