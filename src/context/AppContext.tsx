import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Meeting,
  ActionItem,
  Task,
  ActiveTab,
  FilterState,
  TaskStatus,
  Priority,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_MEETINGS,
  INITIAL_ACTION_ITEMS,
  INITIAL_TASKS,
} from '../data/mockData';

export interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface AppContextType {
  users: User[];
  currentUser: User;
  meetings: Meeting[];
  selectedMeetingId: string;
  actionItems: ActionItem[];
  tasks: Task[];
  activeTab: ActiveTab;
  apiKey: string;
  filter: FilterState;
  toasts: Toast[];

  // Navigation
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedMeetingId: (id: string) => void;
  setCurrentUser: (user: User) => void;
  setApiKey: (key: string) => void;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;

  // Meeting Review Actions
  acceptActionItem: (id: string) => void;
  acceptAllActionItems: (meetingId: string) => void;
  discardActionItem: (id: string) => void;
  discardAllActionItems: (meetingId: string) => void;
  updateActionItem: (item: ActionItem) => void;

  // Task Board Actions
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'order'>) => void;
  updateTask: (task: Task) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  deleteTask: (taskId: string) => void;
  scheduleTask: (taskId: string, date: string, time: string, durationMinutes?: number) => void;
  unscheduleTask: (taskId: string) => void;

  // Meeting Management
  addMeetingWithExtraction: (
    meeting: Omit<Meeting, 'createdAt'>,
    extractedItems: ActionItem[]
  ) => void;
  deleteMeeting: (meetingId: string) => void;
  resetToDemoData: () => void;

  // Toasts
  showToast: (title: string, message?: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const STORAGE_KEY = 'taskify_app_state_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from LocalStorage or initialize with mock data
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => users[0] || INITIAL_USERS[0]);

  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_meetings`);
    return saved ? JSON.parse(saved) : INITIAL_MEETINGS;
  });

  const [selectedMeetingId, setSelectedMeetingId] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_selected_meeting`);
    return saved || 'meet-1';
  });

  const [actionItems, setActionItems] = useState<ActionItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_action_items`);
    return saved ? JSON.parse(saved) : INITIAL_ACTION_ITEMS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('review');

  const [apiKey, setApiKey] = useState<string>(() => {
    return (
      localStorage.getItem(`${STORAGE_KEY}_api_key`) ||
      (import.meta.env.VITE_GEMINI_API_KEY as string) ||
      ''
    );
  });

  const [filter, setFilter] = useState<FilterState>({
    searchQuery: '',
    assigneeId: 'all',
    priority: 'all',
    meetingId: 'all',
    dueDateRange: 'all',
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_meetings`, JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_action_items`, JSON.stringify(actionItems));
  }, [actionItems]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_selected_meeting`, selectedMeetingId);
  }, [selectedMeetingId]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_api_key`, apiKey);
  }, [apiKey]);

  const showToast = (title: string, message?: string, type: Toast['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#2563eb', '#3b82f6', '#93c5fd', '#10b981'],
      });
    } catch {
      // Ignore if canvas not supported
    }
  };

  // Convert an ActionItem into an active Task
  const acceptActionItem = (actionItemId: string) => {
    const item = actionItems.find((i) => i.id === actionItemId);
    if (!item) return;

    const sourceMeeting = meetings.find((m) => m.id === item.meetingId);

    // Update action item status
    setActionItems((prev) =>
      prev.map((i) => (i.id === actionItemId ? { ...i, status: 'accepted' as const } : i))
    );

    // Create a new Task
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      actionItemId: item.id,
      meetingId: item.meetingId,
      meetingTitle: sourceMeeting ? sourceMeeting.title : 'Meeting Action Item',
      title: item.title,
      description: item.description,
      excerpt: item.excerpt,
      timestamp: item.timestamp,
      assigneeId: item.assigneeId,
      priority: item.priority,
      status: 'to_do',
      dueDate: item.dueDate,
      scheduledDate: item.dueDate ? item.dueDate : null,
      scheduledTime: null,
      scheduledDurationMinutes: 45,
      category: item.category,
      order: tasks.filter((t) => t.status === 'to_do').length,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);

    triggerConfetti();
    showToast(
      'Action Item Accepted',
      `"${item.title.slice(0, 32)}..." was added to your Task Board.`
    );
  };

  const acceptAllActionItems = (meetingId: string) => {
    const itemsToAccept = actionItems.filter(
      (i) => i.meetingId === meetingId && i.status === 'suggested'
    );

    if (itemsToAccept.length === 0) return;

    const sourceMeeting = meetings.find((m) => m.id === meetingId);
    const meetingTitle = sourceMeeting ? sourceMeeting.title : 'Meeting Action Item';

    const newTasks: Task[] = itemsToAccept.map((item, idx) => ({
      id: `task-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
      actionItemId: item.id,
      meetingId: item.meetingId,
      meetingTitle,
      title: item.title,
      description: item.description,
      excerpt: item.excerpt,
      timestamp: item.timestamp,
      assigneeId: item.assigneeId,
      priority: item.priority,
      status: 'to_do' as TaskStatus,
      dueDate: item.dueDate,
      scheduledDate: item.dueDate ? item.dueDate : null,
      scheduledTime: null,
      scheduledDurationMinutes: 45,
      category: item.category,
      order: tasks.filter((t) => t.status === 'to_do').length + idx,
      createdAt: new Date().toISOString(),
    }));

    setActionItems((prev) =>
      prev.map((i) =>
        i.meetingId === meetingId && i.status === 'suggested'
          ? { ...i, status: 'accepted' as const }
          : i
      )
    );

    setTasks((prev) => [...newTasks, ...prev]);
    triggerConfetti();
    showToast(
      'All Tasks Accepted',
      `Added ${itemsToAccept.length} tasks to your board. Ready for execution!`,
      'success'
    );
  };

  const discardActionItem = (actionItemId: string) => {
    setActionItems((prev) =>
      prev.map((i) => (i.id === actionItemId ? { ...i, status: 'discarded' as const } : i))
    );
    showToast('Task Discarded', 'Action item removed from suggestions.', 'info');
  };

  const discardAllActionItems = (meetingId: string) => {
    setActionItems((prev) =>
      prev.map((i) =>
        i.meetingId === meetingId && i.status === 'suggested'
          ? { ...i, status: 'discarded' as const }
          : i
      )
    );
    showToast('All Tasks Discarded', 'Removed all pending suggestions for this meeting.', 'info');
  };

  const updateActionItem = (item: ActionItem) => {
    setActionItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
    showToast('Changes Saved', 'Action item details updated.');
  };

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'order'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      order: tasks.filter((t) => t.status === taskData.status).length,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast('Task Created', `"${newTask.title}" added to board.`);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    showToast('Task Updated', `Changes to "${updatedTask.title}" saved.`);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const isNowCompleted = status === 'completed';
        if (isNowCompleted && t.status !== 'completed') {
          triggerConfetti();
          showToast('Task Completed! 🎉', `"${t.title.slice(0, 30)}..." moved to Completed.`);
        }
        return {
          ...t,
          status,
          completedAt: isNowCompleted ? new Date().toISOString() : undefined,
        };
      })
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast('Task Deleted', 'Removed task from board.', 'warning');
  };

  const scheduleTask = (
    taskId: string,
    date: string,
    time: string,
    durationMinutes: number = 45
  ) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              scheduledDate: date,
              scheduledTime: time,
              scheduledDurationMinutes: durationMinutes,
            }
          : t
      )
    );
    showToast('Scheduled on Calendar', `Task slotted for ${time} on ${date}.`);
  };

  const unscheduleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, scheduledTime: null, scheduledDurationMinutes: undefined } : t
      )
    );
    showToast('Removed from Timeline', 'Task moved to unscheduled list.');
  };

  const addMeetingWithExtraction = (
    meetingData: Omit<Meeting, 'createdAt'>,
    extractedItems: ActionItem[]
  ) => {
    const newMeeting: Meeting = {
      ...meetingData,
      createdAt: new Date().toISOString(),
    };

    setMeetings((prev) => [newMeeting, ...prev]);
    setActionItems((prev) => [...extractedItems, ...prev]);
    setSelectedMeetingId(newMeeting.id);
    setActiveTab('review');
    showToast(
      'Meeting Processed Successfully',
      `Identified ${extractedItems.length} action items for "${newMeeting.title}".`,
      'success'
    );
  };

  const deleteMeeting = (meetingId: string) => {
    setMeetings((prev) => prev.filter((m) => m.id !== meetingId));
    setActionItems((prev) => prev.filter((a) => a.meetingId !== meetingId));
    showToast('Meeting Deleted', 'Meeting and associated suggestions removed.', 'warning');
  };

  const resetToDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_users`);
    localStorage.removeItem(`${STORAGE_KEY}_meetings`);
    localStorage.removeItem(`${STORAGE_KEY}_action_items`);
    localStorage.removeItem(`${STORAGE_KEY}_tasks`);
    localStorage.removeItem(`${STORAGE_KEY}_selected_meeting`);

    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setMeetings(INITIAL_MEETINGS);
    setSelectedMeetingId(INITIAL_MEETINGS[0].id);
    setActionItems(INITIAL_ACTION_ITEMS);
    setTasks(INITIAL_TASKS);
    setActiveTab('review');

    showToast('Demo Data Restored', 'Application reset to initial demo state.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        users,
        currentUser,
        meetings,
        selectedMeetingId,
        actionItems,
        tasks,
        activeTab,
        apiKey,
        filter,
        toasts,
        setActiveTab,
        setSelectedMeetingId,
        setCurrentUser,
        setApiKey,
        setFilter,
        acceptActionItem,
        acceptAllActionItems,
        discardActionItem,
        discardAllActionItems,
        updateActionItem,
        createTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        scheduleTask,
        unscheduleTask,
        addMeetingWithExtraction,
        deleteMeeting,
        resetToDemoData,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

