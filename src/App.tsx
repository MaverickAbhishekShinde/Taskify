import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { MeetingReview } from './components/review/MeetingReview';
import { TaskBoard } from './components/board/TaskBoard';
import { DailySchedule } from './components/calendar/DailySchedule';
import { MeetingHistory } from './components/history/MeetingHistory';
import { ProductivityAnalytics } from './components/analytics/ProductivityAnalytics';
import { About } from './components/about/About';
import { NewMeetingModal } from './components/modals/NewMeetingModal';
import { ApiKeyModal } from './components/modals/ApiKeyModal';
import { ToastContainer } from './components/common/ToastContainer';
import { CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  const { activeTab } = useApp();
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navbar */}
      <Navbar
        onOpenNewMeeting={() => setIsNewMeetingOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'review' && <MeetingReview />}
        {activeTab === 'board' && <TaskBoard />}
        {activeTab === 'calendar' && <DailySchedule />}
        {activeTab === 'history' && (
          <MeetingHistory onOpenNewMeeting={() => setIsNewMeetingOpen(true)} />
        )}
        {activeTab === 'analytics' && <ProductivityAnalytics />}
        {activeTab === 'about' && <About />}
      </main>

      {/* Clean Minimal Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium text-slate-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Taskify — AI Meeting-to-Execution Platform</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Turn conversations into clear ownership and execution
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <NewMeetingModal
        isOpen={isNewMeetingOpen}
        onClose={() => setIsNewMeetingOpen(false)}
      />
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
      <ToastContainer />
    </div>
  );
};

export default App;
