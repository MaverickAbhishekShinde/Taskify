export type Priority = 'low' | 'medium' | 'high';

export type TaskStatus = 'to_do' | 'in_progress' | 'in_review' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  initials: string;
  color: string;
}

export interface ActionItem {
  id: string;
  meetingId: string;
  title: string;
  description: string;
  excerpt: string; // Original transcript excerpt
  timestamp: string; // e.g. "04:15"
  assigneeId: string | null; // null represents "Unassigned"
  priority: Priority;
  dueDate: string | null; // ISO string 'YYYY-MM-DD' or null if unset
  category: string;
  status: 'suggested' | 'accepted' | 'discarded';
  createdAt: string;
}

export interface Task {
  id: string;
  actionItemId?: string;
  meetingId: string;
  meetingTitle: string;
  title: string;
  description: string;
  excerpt?: string;
  timestamp?: string;
  assigneeId: string | null;
  priority: Priority;
  status: TaskStatus;
  dueDate: string | null; // YYYY-MM-DD
  scheduledDate?: string | null; // YYYY-MM-DD if scheduled on calendar
  scheduledTime?: string | null; // "10:00"
  scheduledDurationMinutes?: number; // 30, 45, 60
  category: string;
  order: number;
  createdAt: string;
  completedAt?: string;
}

export interface TranscriptSnippet {
  id: string;
  speaker: string;
  time: string;
  text: string;
  isActionItem?: boolean;
  actionItemId?: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:00 AM"
  durationMinutes: number;
  participantIds: string[];
  transcript: string;
  snippets: TranscriptSnippet[];
  status: 'reviewing' | 'completed' | 'processing';
  summary: string;
  keyDecisions: string[];
  createdAt: string;
}

export interface CalendarItem {
  id: string;
  type: 'task' | 'meeting';
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "09:00"
  endTime: string; // e.g. "10:00"
  durationMinutes: number;
  assigneeId: string | null;
  priority?: Priority;
  status?: TaskStatus;
  meetingId?: string;
  taskId?: string;
}

export type ActiveTab = 'review' | 'board' | 'calendar' | 'history' | 'analytics' | 'about';

export interface FilterState {
  searchQuery: string;
  assigneeId: string | 'all';
  priority: Priority | 'all';
  meetingId: string | 'all';
  dueDateRange?: 'all' | 'today' | 'this_week' | 'overdue';
}
