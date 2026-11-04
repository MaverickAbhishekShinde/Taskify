# Taskify — AI Meeting-to-Execution Platform

> Turn conversations into clear ownership and execution, without manually creating every task after a meeting.

Taskify bridges the gap between collaborative meeting discussions and tangible project management. It transforms unstructured audio transcripts into verified, assigned, and trackable action items with timestamps and verbatim quotes.

---

## 🚀 Key Features

- **AI Meeting Review**:
  - Automatically identifies explicit commitments, owners, priorities, and deadlines.
  - Preserves exact verbatim dialogue excerpts and timestamps (`[02:30]`) for every extracted task.
  - Synchronized transcript drawer with highlighted action items.
  - Bulk **Accept All** and **Discard All** workflows.
  - Strict AI behavior: marks unclear owners as **Unassigned** and leaves unset deadlines untouched.

- **Jira-Style Task Board**:
  - 4 Kanban columns: `To Do`, `In Progress`, `In Review`, and `Completed`.
  - Drag-and-drop task movements and quick transitions.
  - Search and filter by Assignee, Priority, Due Date, and Source Meeting.
  - Detailed task modal with category tags, source meeting jump link, and notes.

- **Daily Schedule & Calendar**:
  - Hourly timeline from 8:00 AM to 6:00 PM.
  - Daily navigation with date pickers and "Today" button.
  - Unscheduled tasks section with quick slot assignment.

- **Meeting History & Archive**:
  - Review previously processed meetings, participants, summaries, and action item acceptance rates.

- **Productivity Analytics**:
  - Real-time team execution metrics calculated from live board state.
  - Task breakdown by team member, urgency priority, and weekly sprint completion velocity.

- **Dual AI Engine**:
  - Built-in intelligent NLP parser (zero configuration required).
  - Optional Google Gemini API integration.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Canvas Confetti
- **Storage**: LocalStorage with state persistence

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

