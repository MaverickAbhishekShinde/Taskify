import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActionItem, Priority } from '../../types';
import { EditActionItemModal } from '../modals/EditActionItemModal';
import {
  Sparkles,
  Check,
  Trash2,
  Edit3,
  Calendar,
  Clock,
  User as UserIcon,
  Quote,
  FileText,
  AlertCircle,
  CheckCheck,
  XCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  MoreVertical
} from 'lucide-react';

export const MeetingReview: React.FC = () => {
  const {
    meetings,
    selectedMeetingId,
    actionItems,
    users,
    acceptActionItem,
    acceptAllActionItems,
    discardActionItem,
    discardAllActionItems,
    setActiveTab,
  } = useApp();

  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [isAcceptedExpanded, setIsAcceptedExpanded] = useState(false);
  const [editingItem, setEditingItem] = useState<ActionItem | null>(null);
  const [confirmDiscardAll, setConfirmDiscardAll] = useState(false);
  const [activeSnippetHighlight, setActiveSnippetHighlight] = useState<string | null>(null);

  // Find currently selected meeting
  const currentMeeting = meetings.find((m) => m.id === selectedMeetingId) || meetings[0];

  // Filter action items for this meeting
  const meetingActionItems = actionItems.filter((i) => i.meetingId === currentMeeting?.id);
  const pendingItems = meetingActionItems.filter((i) => i.status === 'suggested');
  const acceptedItems = meetingActionItems.filter((i) => i.status === 'accepted');

  // Participants of this meeting
  const participantUsers = currentMeeting
    ? users.filter((u) => currentMeeting.participantIds.includes(u.id))
    : [];

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            High Priority
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Medium Priority
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Low Priority
          </span>
        );
    }
  };

  const getAssigneeUser = (assigneeId: string | null) => {
    if (!assigneeId) return null;
    return users.find((u) => u.id === assigneeId);
  };

  const formatDueDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Top Meeting Header Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200/70">
                <Sparkles className="w-3 h-3 text-blue-600" />
                AI Meeting Review
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {currentMeeting?.title || 'Meeting Review'}
            </h1>

            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-500 pt-0.5">
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentMeeting?.date}</span>
                {currentMeeting?.time && <span>at {currentMeeting?.time}</span>}
              </div>

              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentMeeting?.durationMinutes} min sync</span>
              </div>

              {/* Participants */}
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-1.5 overflow-hidden">
                  {participantUsers.map((u) => (
                    <img
                      key={u.id}
                      src={u.avatar}
                      alt={u.name}
                      title={`${u.name} (${u.role})`}
                      className="inline-block h-5 w-5 rounded-full ring-2 ring-white object-cover"
                    />
                  ))}
                </div>
                <span className="font-medium text-slate-600">
                  {participantUsers.length} participants
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
            {/* Toggle Full Transcript Button */}
            <button
              onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isTranscriptOpen
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isTranscriptOpen ? 'Hide Transcript' : 'View Transcript'}</span>
            </button>

            {/* Bulk Accept All Primary CTA */}
            {pendingItems.length > 0 && (
              <button
                onClick={() => currentMeeting && acceptAllActionItems(currentMeeting.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-xs shadow-blue-500/20 transition-all hover:scale-[1.02]"
              >
                <CheckCheck className="w-4 h-4 stroke-[2.5]" />
                <span>Accept All ({pendingItems.length})</span>
              </button>
            )}

            {/* Subtle Discard All dropdown/action */}
            {pendingItems.length > 0 && (
              <>
                {confirmDiscardAll ? (
                  <div className="flex items-center gap-1.5 p-1 bg-rose-50 border border-rose-200 rounded-xl animate-fade-in">
                    <span className="text-[11px] font-medium text-rose-700 px-1">Discard all?</span>
                    <button
                      onClick={() => {
                        if (currentMeeting) discardAllActionItems(currentMeeting.id);
                        setConfirmDiscardAll(false);
                      }}
                      className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-lg"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmDiscardAll(false)}
                      className="px-1.5 py-0.5 text-slate-600 text-[11px] hover:text-slate-900"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDiscardAll(true)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Discard all pending suggestions"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Progressive Disclosure: Collapsible Meeting Executive Summary & Decisions */}
        {currentMeeting?.summary && (
          <div className="mt-3.5 pt-3 border-t border-slate-100">
            <button
              onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <span>Meeting Summary & Outcomes</span>
              {isSummaryExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {isSummaryExpanded && (
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs animate-fade-in bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <div className="md:col-span-2 text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-800 mr-1.5">Executive Summary:</span>
                  {currentMeeting.summary}
                </div>
                {currentMeeting.keyDecisions && currentMeeting.keyDecisions.length > 0 && (
                  <div className="text-slate-700 border-l border-slate-200 pl-3">
                    <span className="font-bold text-slate-800 block mb-1">Key Decisions:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                      {currentMeeting.keyDecisions.map((dec, i) => (
                        <li key={i} className="truncate">{dec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content Area: Action Items Cards & Synced Transcript Drawer */}
      <div className={`grid grid-cols-1 ${isTranscriptOpen ? 'lg:grid-cols-12' : ''} gap-6`}>
        {/* Action Items List */}
        <div className={isTranscriptOpen ? 'lg:col-span-7' : 'w-full'}>
          {/* Section Subheader */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900">Extracted Action Items</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                {pendingItems.length} Pending
              </span>
            </div>
            {acceptedItems.length > 0 && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                {acceptedItems.length} Added to Board
              </span>
            )}
          </div>

          {/* Empty State when all tasks processed */}
          {pendingItems.length === 0 && (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200/90 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                <CheckCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                All action items reviewed!
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
                You've successfully processed all suggestions for this meeting. Accepted tasks are now active on your Task Board and Calendar.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setActiveTab('board')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <span>Go to Task Board</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  View Schedule
                </button>
              </div>
            </div>
          )}

          {/* Action Items Cards */}
          <div className="space-y-3.5">
            {pendingItems.map((item) => {
              const assignee = getAssigneeUser(item.assigneeId);
              const formattedDate = formatDueDate(item.dueDate);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all group relative overflow-hidden"
                >
                  {/* Category Accent top bar */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                        {item.category}
                      </span>
                      {getPriorityBadge(item.priority)}
                    </div>

                    {/* Timestamp Tag */}
                    <button
                      onClick={() => {
                        setIsTranscriptOpen(true);
                        setActiveSnippetHighlight(item.timestamp);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-700 border border-slate-200/80 text-[11px] font-mono transition-colors"
                      title="Jump to dialogue snippet"
                    >
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{item.timestamp}</span>
                    </button>
                  </div>

                  {/* Task Title */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Task Description */}
                  {item.description && (
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Original Verbatim Transcript Excerpt Box */}
                  <div className="mt-3 p-3 rounded-xl bg-slate-50/90 border border-slate-200/70 relative">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 mb-1">
                      <Quote className="w-3.5 h-3.5 text-blue-600" />
                      <span>Verbatim Transcript Excerpt:</span>
                    </div>
                    <p className="text-xs text-slate-800 italic pl-3.5 border-l-2 border-blue-400 leading-relaxed font-sans">
                      "{item.excerpt}"
                    </p>
                  </div>

                  {/* Metadata: Assignee & Due Date */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Assignee Badge */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-400 font-medium">Assignee:</span>
                        {assignee ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold">
                            <img
                              src={assignee.avatar}
                              alt={assignee.name}
                              className="w-4 h-4 rounded-full object-cover"
                            />
                            <span>{assignee.name}</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            Unassigned
                          </span>
                        )}
                      </div>

                      {/* Due Date Badge */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-400 font-medium">Due:</span>
                        {formattedDate ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-100">
                            <Calendar className="w-3 h-3 text-blue-600" />
                            {formattedDate}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No deadline discussed</span>
                        )}
                      </div>
                    </div>

                    {/* Actions: Edit, Discard, Accept */}
                    <div className="flex items-center gap-1.5 ml-auto">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Edit task details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => discardActionItem(item.id)}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Discard suggestion"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => acceptActionItem(item.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs shadow-blue-500/20 transition-all hover:scale-[1.02]"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Accept Task</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progressive Disclosure: Collapsible Accepted Items */}
          {acceptedItems.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={() => setIsAcceptedExpanded(!isAcceptedExpanded)}
                className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 py-1"
              >
                <div className="flex items-center gap-1.5">
                  <CheckCheck className="w-4 h-4 text-emerald-600" />
                  <span>Accepted Items ({acceptedItems.length})</span>
                </div>
                {isAcceptedExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {isAcceptedExpanded && (
                <div className="space-y-2 mt-2.5 animate-fade-in">
                  {acceptedItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-slate-900">{item.title}</span>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-medium">Added to Board</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Synchronized Transcript Side Drawer */}
        {isTranscriptOpen && (
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Synchronized Transcript</h3>
              </div>
              <button
                onClick={() => setIsTranscriptOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
              Dialogue segments with detected action items are highlighted.
            </p>

            <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
              {currentMeeting?.snippets?.map((sn) => {
                const isAction = sn.isActionItem;
                const isTarget = activeSnippetHighlight === sn.time;

                return (
                  <div
                    key={sn.id}
                    className={`p-3 rounded-xl text-xs transition-all ${
                      isTarget
                        ? 'bg-amber-100/90 border border-amber-300 ring-2 ring-amber-400/50'
                        : isAction
                        ? 'bg-blue-50/80 border border-blue-200/80'
                        : 'bg-slate-50/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        {sn.speaker}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 bg-white/80 px-1.5 py-0.5 rounded border border-slate-200/60">
                        {sn.time}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{sn.text}</p>
                    {isAction && (
                      <div className="mt-1.5 pt-1.5 border-t border-blue-100 flex items-center gap-1 text-[10px] font-bold text-blue-700">
                        <Sparkles className="w-3 h-3" />
                        <span>Action Item Detected</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Edit Action Item Modal */}
      <EditActionItemModal
        item={editingItem}
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
      />
    </div>
  );
};
