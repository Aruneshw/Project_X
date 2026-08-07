/**
 * Mock data matching the backend API contract defined in project_info.md.
 * Mirrors: Claim, Evidence, Policy, Audit SQLAlchemy models.
 */

export const MOCK_CLAIMS = [];

export const MOCK_AGENTS = [
  { id: 1, name: 'Customer Interaction', status: 'online', tasks: 142, avgTime: '1.2s', accuracy: 96 },
  { id: 2, name: 'Evidence Capture', status: 'online', tasks: 89, avgTime: '3.4s', accuracy: 99, novel: true },
  { id: 3, name: 'CV Object Detection', status: 'online', tasks: 67, avgTime: '4.8s', accuracy: 94, novel: true },
  { id: 4, name: 'Anti-Fraud Challenge', status: 'online', tasks: 34, avgTime: '12.1s', accuracy: 98, novel: true },
  { id: 5, name: 'Evidence Verification', status: 'online', tasks: 78, avgTime: '2.1s', accuracy: 97 },
  { id: 6, name: 'Policy Intelligence', status: 'online', tasks: 112, avgTime: '1.8s', accuracy: 93 },
  { id: 7, name: 'Fraud Detection', status: 'idle', tasks: 56, avgTime: '2.6s', accuracy: 95 },
  { id: 8, name: 'Score Evaluation', status: 'online', tasks: 156, avgTime: '0.3s', accuracy: 99, novel: true },
  { id: 9, name: 'Resolution Strategy', status: 'online', tasks: 98, avgTime: '1.5s', accuracy: 91 },
  { id: 10, name: 'Workflow Execution', status: 'online', tasks: 87, avgTime: '2.9s', accuracy: 97 },
  { id: 11, name: 'Escalation', status: 'idle', tasks: 23, avgTime: '0.8s', accuracy: 100 },
  { id: 12, name: 'Memory / RAG', status: 'online', tasks: 234, avgTime: '0.5s', accuracy: 96, novel: true },
  { id: 13, name: 'Learning', status: 'online', tasks: 312, avgTime: '8.2s', accuracy: 89 },
];

export const MOCK_ACTIVITY = [];

export const MOCK_CHART_DATA = [45, 62, 78, 55, 89, 72, 95, 68, 82, 91, 76, 88];

export const STATS = {
  totalClaims: 2847,
  autoResolved: 1923,
  inReview: 412,
  fraudDetected: 89,
  avgResolutionTime: '4.2m',
  resolutionRate: 92.4,
};
