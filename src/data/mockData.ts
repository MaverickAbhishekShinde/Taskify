import { User, Meeting, ActionItem, Task } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Alex Rivera (You)',
    email: 'alex.rivera@taskify.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Product Lead',
    initials: 'AR',
    color: '#2563eb', // Blue
  },
  {
    id: 'user-2',
    name: 'Aisha Patel',
    email: 'aisha.patel@taskify.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Staff Software Engineer',
    initials: 'AP',
    color: '#8b5cf6', // Purple
  },
  {
    id: 'user-3',
    name: 'Rohit Sharma',
    email: 'rohit.sharma@taskify.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Senior UI/UX Designer',
    initials: 'RS',
    color: '#06b6d4', // Cyan
  },
  {
    id: 'user-4',
    name: 'Marcus Chen',
    email: 'marcus.chen@taskify.io',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'DevOps & Platform Architect',
    initials: 'MC',
    color: '#10b981', // Emerald
  },
  {
    id: 'user-5',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@taskify.io',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'Engineering Manager',
    initials: 'SJ',
    color: '#f59e0b', // Amber
  },
];

// Helper to get formatted date string for relative days
const getRelativeDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'meet-1',
    title: 'Product Launch & API Readiness Sync',
    date: getRelativeDate(0), // Today
    time: '10:00 AM',
    durationMinutes: 35,
    participantIds: ['user-1', 'user-2', 'user-3', 'user-5'],
    transcript: `[00:02] Alex: Alright team, let's jump right into the launch readiness for v2.4. We've got our beta partners testing on Monday.
[01:15] Sarah: Core backend is stable, but we need to ensure the developer documentation reflects the new breaking changes to authentication endpoints.
[02:30] Alex: Great point. Let's get the API documentation updated. Aisha, can you take ownership of that? We need it ready by Thursday.
[03:45] Aisha: Sure thing, I will review all payload schemas and update the Postman collection too by Thursday afternoon.
[05:10] Alex: Awesome. I'll handle the presentation slides for the partner keynote.
[06:20] Rohit: On the marketing side, the landing page hero graphics are 80% done, but the icon bundle still lacks dark-mode variants.
[07:05] Alex: Rohit can finalise the new icon assets by Friday. That way the frontend team can pull them in before the weekend build.
[08:15] Rohit: Deal. I will export SVG and WebP packages by Friday 3 PM.
[09:40] Sarah: One more thing - do we need to rerun load tests on the cluster?
[10:15] Aisha: We should, but let's check cluster costs first. No one is assigned to run that yet until we approve the budget.
[12:00] Alex: Perfect. Let's regroup tomorrow morning. Thanks everyone!`,
    snippets: [
      { id: 'sn-1', speaker: 'Alex Rivera', time: '00:02', text: "Alright team, let's jump right into the launch readiness for v2.4. We've got our beta partners testing on Monday." },
      { id: 'sn-2', speaker: 'Sarah Jenkins', time: '01:15', text: "Core backend is stable, but we need to ensure the developer documentation reflects the new breaking changes to authentication endpoints." },
      { id: 'sn-3', speaker: 'Alex Rivera', time: '02:30', text: "Great point. Let's get the API documentation updated. Aisha, can you take ownership of that? We need it ready by Thursday.", isActionItem: true, actionItemId: 'act-1' },
      { id: 'sn-4', speaker: 'Aisha Patel', time: '03:45', text: "Sure thing, I will review all payload schemas and update the Postman collection too by Thursday afternoon." },
      { id: 'sn-5', speaker: 'Alex Rivera', time: '05:10', text: "Awesome. I'll handle the presentation slides for the partner keynote.", isActionItem: true, actionItemId: 'act-2' },
      { id: 'sn-6', speaker: 'Rohit Sharma', time: '06:20', text: "On the marketing side, the landing page hero graphics are 80% done, but the icon bundle still lacks dark-mode variants." },
      { id: 'sn-7', speaker: 'Alex Rivera', time: '07:05', text: "Rohit can finalise the new icon assets by Friday. That way the frontend team can pull them in before the weekend build.", isActionItem: true, actionItemId: 'act-3' },
      { id: 'sn-8', speaker: 'Rohit Sharma', time: '08:15', text: "Deal. I will export SVG and WebP packages by Friday 3 PM." },
      { id: 'sn-9', speaker: 'Sarah Jenkins', time: '09:40', text: "One more thing - do we need to rerun load tests on the cluster?" },
      { id: 'sn-10', speaker: 'Aisha Patel', time: '10:15', text: "We should, but let's check cluster costs first. No one is assigned to run that yet until we approve the budget.", isActionItem: true, actionItemId: 'act-4' },
      { id: 'sn-11', speaker: 'Alex Rivera', time: '12:00', text: "Perfect. Let's regroup tomorrow morning. Thanks everyone!" },
    ],
    status: 'reviewing',
    summary: 'Reviewed launch milestones for release v2.4. Aisha is updating developer API docs, Alex is preparing partner slides, and Rohit is completing dark mode icon sets. Cluster load testing remains unassigned pending budget review.',
    keyDecisions: [
      'Beta partner testing kickoff set for next Monday',
      'API authentication schema breaking changes must be documented prior to partner onboarding',
      'Cost approval required before scheduling full cluster stress tests'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'meet-2',
    title: 'Sprint 42 Architecture & Reliability Review',
    date: getRelativeDate(-2),
    time: '02:30 PM',
    durationMinutes: 45,
    participantIds: ['user-1', 'user-2', 'user-4', 'user-5'],
    transcript: `[00:00] Sarah: Welcome to our bi-weekly architecture checkpoint. Today we focus on query latency in the reporting service.
[04:20] Marcus: We analyzed the p99 response times. The multi-tenant aggregation queries are taking 2.8 seconds due to missing composite indexes on organization_id and created_at.
[06:45] Sarah: That explains the alerts. Marcus, please write and test the database migration script. We want it staged by Wednesday.
[09:10] Aisha: While Marcus does that, I can implement Redis caching for the top 5 dashboard query endpoints. That should take load off Postgres immediately.
[14:30] Marcus: Sounds like a solid plan. I'll benchmark query speeds before and after in staging.
[20:15] Alex: Sarah, should we update the incident post-mortem document for the leadership team?
[21:00] Sarah: Yes, I will draft the root cause analysis document by tomorrow noon.`,
    snippets: [
      { id: 'sn-201', speaker: 'Sarah Jenkins', time: '00:00', text: "Welcome to our bi-weekly architecture checkpoint. Today we focus on query latency in the reporting service." },
      { id: 'sn-202', speaker: 'Marcus Chen', time: '04:20', text: "We analyzed the p99 response times. The multi-tenant aggregation queries are taking 2.8 seconds due to missing composite indexes." },
      { id: 'sn-203', speaker: 'Sarah Jenkins', time: '06:45', text: "Marcus, please write and test the database migration script. We want it staged by Wednesday.", isActionItem: true },
      { id: 'sn-204', speaker: 'Aisha Patel', time: '09:10', text: "While Marcus does that, I can implement Redis caching for the top 5 dashboard query endpoints.", isActionItem: true },
      { id: 'sn-205', speaker: 'Sarah Jenkins', time: '21:00', text: "Yes, I will draft the root cause analysis document by tomorrow noon.", isActionItem: true },
    ],
    status: 'completed',
    summary: 'Identified root cause of reporting latency as unindexed aggregations. Marcus is executing index migrations, Aisha adding Redis query cache layer, and Sarah publishing incident RCA.',
    keyDecisions: [
      'Approved composite indexes on reporting database tables',
      'Standardized Redis caching TTL to 5 minutes for dashboard metrics'
    ],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'meet-3',
    title: 'Design System & Mobile Accessibility Sync',
    date: getRelativeDate(-4),
    time: '11:15 AM',
    durationMinutes: 30,
    participantIds: ['user-1', 'user-3', 'user-5'],
    transcript: `[00:01] Rohit: We completed the WCAG 2.1 AA audit of our navigation components. Contrast ratios on muted button states failed compliance tests.
[04:10] Alex: That needs immediate attention before the enterprise accessibility review. Rohit, can you adjust the design tokens in Figma?
[06:00] Rohit: Yes, I will update color tokens and document minimum contrast pairings by Thursday.
[11:30] Alex: Also, we need an accessibility testing checklist for our QA team to follow during pull request reviews.
[13:45] Sarah: I will coordinate with QA to create that checklist.`,
    snippets: [
      { id: 'sn-301', speaker: 'Rohit Sharma', time: '00:01', text: "We completed the WCAG 2.1 AA audit of our navigation components. Contrast ratios failed compliance tests." },
      { id: 'sn-302', speaker: 'Rohit Sharma', time: '06:00', text: "Yes, I will update color tokens and document minimum contrast pairings by Thursday.", isActionItem: true },
      { id: 'sn-303', speaker: 'Sarah Jenkins', time: '13:45', text: "I will coordinate with QA to create that checklist.", isActionItem: true }
    ],
    status: 'completed',
    summary: 'Audited WCAG 2.1 AA compliance. Approved updated contrast tokens for interactive elements. QA checklist in progress.',
    keyDecisions: [
      'Mandate WCAG 2.1 AA compliance for all new design system components',
      'Automate axe-core linting inside CI/CD pipelines'
    ],
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  }
];

export const INITIAL_ACTION_ITEMS: ActionItem[] = [
  {
    id: 'act-1',
    meetingId: 'meet-1',
    title: 'Update API documentation for v2.4 auth endpoints',
    description: 'Review payload schemas, document breaking changes to authentication endpoints, and update the Postman collection.',
    excerpt: "Great point. Let's get the API documentation updated. Aisha, can you take ownership of that? We need it ready by Thursday.",
    timestamp: '02:30',
    assigneeId: 'user-2', // Aisha Patel
    priority: 'high',
    dueDate: getRelativeDate(2), // Thursday
    category: 'Engineering',
    status: 'suggested',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'act-2',
    meetingId: 'meet-1',
    title: 'Finalize partner keynote presentation slides',
    description: 'Prepare keynote presentation deck covering v2.4 feature highlights, architecture updates, and rollout timeline.',
    excerpt: "Awesome. I'll handle the presentation slides for the partner keynote.",
    timestamp: '05:10',
    assigneeId: 'user-1', // Alex Rivera (You)
    priority: 'medium',
    dueDate: null, // Explicitly no deadline discussed
    category: 'Product',
    status: 'suggested',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'act-3',
    meetingId: 'meet-1',
    title: 'Finalize and export new dark-mode icon assets',
    description: 'Complete remaining dark-mode variants for icon bundle and export SVG and WebP packages for frontend integration.',
    excerpt: "Rohit can finalise the new icon assets by Friday. That way the frontend team can pull them in before the weekend build.",
    timestamp: '07:05',
    assigneeId: 'user-3', // Rohit Sharma
    priority: 'medium',
    dueDate: getRelativeDate(3), // Friday
    category: 'Design',
    status: 'suggested',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'act-4',
    meetingId: 'meet-1',
    title: 'Run cluster load tests pending budget sign-off',
    description: 'Determine load test parameters and execute high-concurrency simulation once infrastructure costs are reviewed.',
    excerpt: "We should, but let's check cluster costs first. No one is assigned to run that yet until we approve the budget.",
    timestamp: '10:15',
    assigneeId: null, // Explicitly Unassigned!
    priority: 'low',
    dueDate: null, // Unset
    category: 'Infrastructure',
    status: 'suggested',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-101',
    actionItemId: 'act-prev-1',
    meetingId: 'meet-2',
    meetingTitle: 'Sprint 42 Architecture & Reliability Review',
    title: 'Create composite index migration script for reporting DB',
    description: 'Add composite indexes on organization_id and created_at columns to bring p99 query latency under 200ms.',
    excerpt: 'Marcus, please write and test the database migration script. We want it staged by Wednesday.',
    timestamp: '06:45',
    assigneeId: 'user-4', // Marcus Chen
    priority: 'high',
    status: 'in_progress',
    dueDate: getRelativeDate(1),
    scheduledDate: getRelativeDate(0),
    scheduledTime: '11:00',
    scheduledDurationMinutes: 60,
    category: 'Infrastructure',
    order: 0,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'task-102',
    actionItemId: 'act-prev-2',
    meetingId: 'meet-2',
    meetingTitle: 'Sprint 42 Architecture & Reliability Review',
    title: 'Implement Redis caching layer for top 5 dashboard endpoints',
    description: 'Setup Redis key-value cache with 5-minute TTL to offload read load from primary Postgres cluster.',
    excerpt: 'While Marcus does that, I can implement Redis caching for the top 5 dashboard query endpoints.',
    timestamp: '09:10',
    assigneeId: 'user-2', // Aisha Patel
    priority: 'high',
    status: 'in_review',
    dueDate: getRelativeDate(2),
    scheduledDate: getRelativeDate(0),
    scheduledTime: '14:30',
    scheduledDurationMinutes: 45,
    category: 'Engineering',
    order: 0,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'task-103',
    actionItemId: 'act-prev-3',
    meetingId: 'meet-2',
    meetingTitle: 'Sprint 42 Architecture & Reliability Review',
    title: 'Publish query latency incident root cause analysis',
    description: 'Document timeline, root cause, detection gap, and remediation action items for team leadership.',
    excerpt: 'Yes, I will draft the root cause analysis document by tomorrow noon.',
    timestamp: '21:00',
    assigneeId: 'user-5', // Sarah Jenkins
    priority: 'medium',
    status: 'completed',
    dueDate: getRelativeDate(-1),
    scheduledDate: getRelativeDate(-1),
    scheduledTime: '10:00',
    scheduledDurationMinutes: 60,
    category: 'Operations',
    order: 0,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'task-104',
    actionItemId: 'act-prev-4',
    meetingId: 'meet-3',
    meetingTitle: 'Design System & Mobile Accessibility Sync',
    title: 'Update Figma color tokens for WCAG 2.1 AA compliance',
    description: 'Adjust contrast ratios on button states and muted typography to meet minimum 4.5:1 ratio.',
    excerpt: 'Yes, I will update color tokens and document minimum contrast pairings by Thursday.',
    timestamp: '06:00',
    assigneeId: 'user-3', // Rohit Sharma
    priority: 'medium',
    status: 'to_do',
    dueDate: getRelativeDate(1),
    scheduledDate: getRelativeDate(0),
    scheduledTime: '16:00',
    scheduledDurationMinutes: 60,
    category: 'Design',
    order: 0,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'task-105',
    actionItemId: 'act-prev-5',
    meetingId: 'meet-3',
    meetingTitle: 'Design System & Mobile Accessibility Sync',
    title: 'Create PR accessibility checklist for QA team',
    description: 'Draft checklist covering keyboard navigation, screen reader labels, and contrast audits.',
    excerpt: 'I will coordinate with QA to create that checklist.',
    timestamp: '13:45',
    assigneeId: 'user-5', // Sarah Jenkins
    priority: 'low',
    status: 'to_do',
    dueDate: getRelativeDate(4),
    category: 'QA',
    order: 1,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  }
];

export const SAMPLE_TRANSCRIPTS = [
  {
    name: 'Q4 Product Roadmap & Customer Feedback Sync',
    title: 'Q4 Product Roadmap & Customer Feedback Sync',
    participants: ['user-1', 'user-2', 'user-3', 'user-5'],
    text: `[00:00] Alex: Thanks for joining everyone. Today we're reviewing top feature requests from our enterprise customer council.
[01:10] Sarah: The most urgent feedback is SSO integration with Okta and Azure AD. Without SAML 2.0, three major deals are stalled.
[02:40] Alex: Aisha, can you lead the SAML authentication implementation? Let's aim to have the core provider integration ready by next Tuesday.
[03:15] Aisha: Yes, I've worked with SAML libraries before. I will set up the SP metadata generator and test with Okta sandbox by Tuesday.
[04:20] Rohit: On the customer onboarding flow, users are getting stuck on the workspace invite screen. We need to simplify the multi-user invitation modal.
[05:00] Alex: Agreed. Rohit, please redesign the workspace invitation flow with bulk email pasting. Can we see mockups by Thursday?
[05:40] Rohit: Yes, I will deliver interactive Figma prototypes for the new invite modal by Thursday 4 PM.
[06:30] Alex: I will draft the customer announcement newsletter and align with marketing. No firm deadline yet until engineering approves the release date.
[07:15] Sarah: We also discussed automated backup verification for enterprise customer databases. We still need someone to research AWS backup vault compliance, currently unassigned.
[08:00] Alex: Excellent sync team. Let's move fast on these!`,
  },
  {
    name: 'Security Audit & Zero Trust Architecture Review',
    title: 'Security Audit & Zero Trust Architecture Review',
    participants: ['user-1', 'user-2', 'user-4', 'user-5'],
    text: `[00:05] Sarah: Today we are reviewing the penetration test findings from Cybershield Labs.
[01:30] Marcus: There were two medium vulnerabilities flagged: old TLS 1.1 cipher suites allowed on the edge proxy, and missing rate limiting on public password reset endpoints.
[02:45] Sarah: Marcus, can you deprecate TLS 1.1 and reconfigure Cloudflare SSL settings? That needs to happen immediately by tomorrow.
[03:10] Marcus: I will update the Cloudflare Terraform configuration and apply the TLS 1.3 strict rule by tomorrow 10 AM.
[04:00] Aisha: For the password reset endpoint, I can implement Redis sliding-window rate limiting to restrict attempts to 5 per minute per IP. I'll finish that by Friday.
[05:15] Sarah: Perfect. Aisha handles the rate limiter by Friday.
[06:00] Alex: We should also update our SOC 2 compliance policy register. This is an open item that remains unassigned until we meet the compliance auditor.`,
  },
  {
    name: 'Weekly Engineering Standup & Launch Checklist',
    title: 'Weekly Engineering Standup & Launch Checklist',
    participants: ['user-1', 'user-2', 'user-3', 'user-4'],
    text: `[00:10] Alex: Quick standup before sprint demo. Let's make sure all loose ends are tied up.
[01:00] Rohit: The mobile web responsiveness on the billing page has a horizontal scroll bug on iPhone 13.
[01:45] Rohit: I will fix the CSS viewport overflow container by 2 PM today.
[02:30] Aisha: The Stripe webhook listener is failing on refund events. I will debug the payload signature validator by tomorrow morning.
[03:15] Marcus: I need to rotate our staging environment secrets in AWS Secrets Manager. Setting a deadline for Wednesday evening.
[04:00] Alex: Great initiative team. I will coordinate with customer support to monitor any reported billing glitches.`,
  }
];

