import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Search,
  ArrowRight,
  Trash2,
  Plus
} from 'lucide-react';

interface MeetingHistoryProps {
  onOpenNewMeeting: () => void;
}

export const MeetingHistory: React.FC<MeetingHistoryProps> = ({ onOpenNewMeeting }) => {
  const {
    meetings,
    actionItems,
    users,
    setSelectedMeetingId,
    setActiveTab,
    deleteMeeting,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [meetingToDelete, setMeetingToDelete] = useState<string | null>(null);

  // Filter meetings
  const filteredMeetings = meetings.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.summary?.toLowerCase().includes(q) ||
      m.transcript.toLowerCase().includes(q)
    );
  });

  const getMeetingStats = (meetingId: string) => {
    const items = actionItems.filter((i) => i.meetingId === meetingId);
    const accepted = items.filter((i) => i.status === 'accepted').length;
    const pending = items.filter((i) => i.status === 'suggested').length;
    return { total: items.length, accepted, pending };
  };

  const handleOpenMeeting = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setActiveTab('review');
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header and Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Meeting History
          </h2>
          <p className="text-xs text-slate-500">
            Previously analyzed transcripts and extracted action items
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 sm:w-60 pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <button
            onClick={onOpenNewMeeting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Process Meeting</span>
          </button>
        </div>
      </div>

      {/* Meeting Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
        {filteredMeetings.map((meeting) => {
          const stats = getMeetingStats(meeting.id);
          const participantUsers = users.filter((u) => meeting.participantIds?.includes(u.id));

          return (
            <div
              key={meeting.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header row: date & status */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{meeting.date}</span>
                    {meeting.durationMinutes && (
                      <span className="text-slate-400 font-mono">• {meeting.durationMinutes}m</span>
                    )}
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      meeting.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : meeting.status === 'reviewing'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {meeting.status}
                  </span>
                </div>

                {/* Title */}
                <h3
                  onClick={() => handleOpenMeeting(meeting.id)}
                  className="text-base font-bold text-slate-900 group-hover:text-blue-600 cursor-pointer transition-colors leading-snug line-clamp-2"
                >
                  {meeting.title}
                </h3>

                {/* Summary (Truncated to 2 clean lines) */}
                {meeting.summary && (
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {meeting.summary}
                  </p>
                )}

                {/* Participants */}
                <div className="mt-3.5 flex items-center gap-2">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {participantUsers.map((u) => (
                      <img
                        key={u.id}
                        src={u.avatar}
                        alt={u.name}
                        title={u.name}
                        className="inline-block h-5 w-5 rounded-full ring-2 ring-white object-cover"
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {participantUsers.length} participants
                  </span>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-600">
                  <span className="font-bold text-slate-900">{stats.total}</span> items •{' '}
                  <span className="font-semibold text-emerald-700">{stats.accepted} accepted</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {meetingToDelete === meeting.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          deleteMeeting(meeting.id);
                          setMeetingToDelete(null);
                        }}
                        className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded font-bold"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setMeetingToDelete(null)}
                        className="text-[10px] text-slate-400 p-0.5"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setMeetingToDelete(meeting.id)}
                      className="p-1 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete meeting"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenMeeting(meeting.id)}
                    className="flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white text-xs font-bold transition-all"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
