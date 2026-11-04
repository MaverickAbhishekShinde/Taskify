import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_TRANSCRIPTS } from '../../data/mockData';
import { processTranscriptWithAI, ProcessingProgress } from '../../services/aiProcessor';
import {
  X,
  Sparkles,
  Upload,
  FileText,
  Clock,
  Calendar,
  CheckCircle2,
  Users as UsersIcon,
  Cpu,
  Layers,
  ArrowRight,
  Loader2
} from 'lucide-react';

interface NewMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewMeetingModal: React.FC<NewMeetingModalProps> = ({ isOpen, onClose }) => {
  const { users, apiKey, addMeetingWithExtraction } = useApp();

  const [activeSourceTab, setActiveSourceTab] = useState<'sample' | 'paste' | 'upload'>('sample');
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);

  const [title, setTitle] = useState(SAMPLE_TRANSCRIPTS[0].title);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('11:00 AM');
  const [duration, setDuration] = useState(30);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    SAMPLE_TRANSCRIPTS[0].participants
  );
  const [transcriptText, setTranscriptText] = useState(SAMPLE_TRANSCRIPTS[0].text);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);

  if (!isOpen) return null;

  const handleSelectSample = (idx: number) => {
    setSelectedSampleIndex(idx);
    const sample = SAMPLE_TRANSCRIPTS[idx];
    setTitle(sample.title);
    setTranscriptText(sample.text);
    setSelectedParticipants(sample.participants);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setTranscriptText(content);
        setActiveSourceTab('paste');
      }
    };
    reader.readAsText(file);
  };

  const toggleParticipant = (userId: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleStartProcessing = async () => {
    if (!transcriptText.trim()) return;

    setIsProcessing(true);
    setProgress({
      stage: 'Initializing Parser',
      stepNumber: 1,
      totalSteps: 4,
      percentage: 10,
      logMessage: 'Preparing transcript buffer and token dictionary...',
    });

    try {
      const meetingId = `meet-${Date.now()}`;
      const result = await processTranscriptWithAI(
        transcriptText,
        title || 'Untitled Meeting Sync',
        meetingId,
        users,
        apiKey,
        (p) => setProgress(p)
      );

      // Create and save meeting
      addMeetingWithExtraction(
        {
          id: meetingId,
          title: title.trim() || 'Untitled Meeting Sync',
          date,
          time,
          durationMinutes: duration,
          participantIds: selectedParticipants.length > 0 ? selectedParticipants : [users[0].id],
          transcript: transcriptText,
          snippets: result.snippets,
          status: 'reviewing',
          summary: result.summary,
          keyDecisions: result.keyDecisions,
        },
        result.actionItems
      );

      setIsProcessing(false);
      onClose();
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] relative">
        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-30 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border-2 border-blue-500/20 flex items-center justify-center text-blue-600 animate-pulse-glow">
                <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                AI
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {progress?.stage || 'Analyzing Conversation...'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
              {progress?.logMessage || 'Identifying commitments, assignees, deadlines and transcript evidence...'}
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-md bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200 mb-3">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress?.percentage || 25}%` }}
              />
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Step {progress?.stepNumber || 1} of {progress?.totalSteps || 4} ({progress?.percentage || 25}%)
            </div>
          </div>
        )}

        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Process Meeting Transcript</h3>
              <p className="text-xs text-slate-500">Extract action items, owners, and deadlines with AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4.5">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Meeting Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sprint 43 Planning & Launch Sync"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
              />
            </div>
          </div>

          {/* Participants Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
              <UsersIcon className="w-3.5 h-3.5 text-slate-400" />
              Meeting Participants ({selectedParticipants.length})
            </label>
            <div className="flex flex-wrap gap-1.5">
              {users.map((u) => {
                const isSelected = selectedParticipants.includes(u.id);
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => toggleParticipant(u.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200/80 border border-transparent'
                    }`}
                  >
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <span>{u.name}</span>
                    {isSelected && <CheckCircle2 className="w-3 h-3 text-blue-600 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transcript Source Tabs */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 mb-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSourceTab('sample')}
                  className={`pb-2 text-xs font-semibold transition-all relative ${
                    activeSourceTab === 'sample'
                      ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  ⚡ Sample Transcripts
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSourceTab('paste')}
                  className={`pb-2 text-xs font-semibold transition-all relative ${
                    activeSourceTab === 'paste'
                      ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  📝 Paste Transcript
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSourceTab('upload')}
                  className={`pb-2 text-xs font-semibold transition-all relative ${
                    activeSourceTab === 'upload'
                      ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  📁 Upload File
                </button>
              </div>

              <span className="text-[11px] text-slate-400 pb-2">
                {apiKey ? '✨ Gemini LLM Active' : '⚡ Local NLP Engine'}
              </span>
            </div>

            {/* Tab 1: Sample Transcripts */}
            {activeSourceTab === 'sample' && (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-500">
                  Select a realistic meeting transcript to test extraction accuracy immediately:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {SAMPLE_TRANSCRIPTS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSample(idx)}
                      className={`p-2.5 text-left rounded-xl border transition-all ${
                        selectedSampleIndex === idx
                          ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-400/50'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
                      }`}
                    >
                      <h4 className="text-xs font-bold text-slate-900 truncate">{sample.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                        {sample.text.slice(0, 70)}...
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Paste Transcript */}
            {activeSourceTab === 'paste' && (
              <div>
                <p className="text-[11px] text-slate-500 mb-1.5">
                  Paste raw meeting notes or conversation dialogue with optional timestamps (e.g. <code className="text-slate-700 bg-slate-100 px-1 py-0.5 rounded font-mono">[02:15] Alex: ...</code>):
                </p>
              </div>
            )}

            {/* Tab 3: Upload File */}
            {activeSourceTab === 'upload' && (
              <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-center hover:bg-blue-50/20 hover:border-blue-300 transition-colors cursor-pointer relative mb-3">
                <input
                  type="file"
                  accept=".txt,.vtt,.srt,.json,.md"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-7 h-7 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-700">
                  Drop transcript file here or click to browse
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Supports .txt, .vtt, .srt, .md, .json meeting transcripts
                </p>
              </div>
            )}

            {/* Live Transcript Preview Box */}
            <div className="mt-2.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1 flex items-center justify-between">
                <span>Transcript Text ({transcriptText.length} characters)</span>
                <span className="text-[10px] text-slate-400 font-normal">Editable</span>
              </label>
              <textarea
                rows={6}
                value={transcriptText}
                onChange={(e) => setTranscriptText(e.target.value)}
                className="w-full p-3 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono leading-relaxed border border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                placeholder="[00:00] Speaker: Dialogue..."
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span>Preserves verbatim quotes & timestamps</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleStartProcessing}
              disabled={!transcriptText.trim()}
              className="px-4.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Extract Action Items with AI
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

