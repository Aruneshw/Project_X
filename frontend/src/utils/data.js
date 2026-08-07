/**
 * Mock data matching the backend API contract defined in project_info.md.
 * Mirrors: Claim, Evidence, Policy, Audit SQLAlchemy models.
 */

export const MOCK_CLAIMS = [
  { id: 'CLM-2847', customer: 'Sarah Mitchell', type: 'Damaged Product', status: 'processing', score: 72, order: 'ORD-91823', created: '2 min ago', agent: 'CV Detection' },
  { id: 'CLM-2846', customer: 'James Rivera', type: 'Wrong Item', status: 'resolved', score: 94, order: 'ORD-91801', created: '18 min ago', agent: 'Auto-Resolved' },
  { id: 'CLM-2845', customer: 'Priya Sharma', type: 'Missing Delivery', status: 'in-review', score: 63, order: 'ORD-91798', created: '34 min ago', agent: 'Escalation' },
  { id: 'CLM-2844', customer: 'Alex Chen', type: 'Defective Electronics', status: 'processing', score: 81, order: 'ORD-91785', created: '1 hr ago', agent: 'Evidence Capture' },
  { id: 'CLM-2843', customer: 'Maria Santos', type: 'Return Request', status: 'resolved', score: 91, order: 'ORD-91770', created: '1.5 hr ago', agent: 'Auto-Resolved' },
  { id: 'CLM-2842', customer: 'David Kim', type: 'Fraud Suspected', status: 'rejected', score: 22, order: 'ORD-91768', created: '2 hr ago', agent: 'Fraud Detection' },
  { id: 'CLM-2841', customer: 'Emily Johnson', type: 'Late Delivery', status: 'resolved', score: 88, order: 'ORD-91752', created: '3 hr ago', agent: 'Workflow Exec' },
  { id: 'CLM-2840', customer: 'Omar Hassan', type: 'Quality Issue', status: 'in-review', score: 57, order: 'ORD-91740', created: '4 hr ago', agent: 'Policy Intel' },
];

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

export const MOCK_ACTIVITY = [
  { text: 'Claim CLM-2847 evidence captured via <strong>Pipeline A</strong> (camera-only)', time: '2 min ago', type: 'info' },
  { text: 'Anti-Fraud Challenge passed — session code verified for CLM-2847', time: '3 min ago', type: 'success' },
  { text: 'CLM-2846 auto-resolved (score: 94) — refund processed via Workflow Agent', time: '18 min ago', type: 'success' },
  { text: 'CLM-2845 escalated to human reviewer — score 63 (50–80 range)', time: '34 min ago', type: 'warning' },
  { text: 'Fraud flag raised on CLM-2842 — behavioral anomaly detected', time: '2 hr ago', type: 'danger' },
  { text: 'Learning Agent updated scoring thresholds (RL feedback cycle #47)', time: '3 hr ago', type: 'info' },
  { text: 'Memory/RAG Agent indexed 12 new policy documents', time: '4 hr ago', type: 'info' },
];

export const MOCK_CHART_DATA = [45, 62, 78, 55, 89, 72, 95, 68, 82, 91, 76, 88];

export const STATS = {
  totalClaims: 2847,
  autoResolved: 1923,
  inReview: 412,
  fraudDetected: 89,
  avgResolutionTime: '4.2m',
  resolutionRate: 92.4,
};
