/**
 * Enterprise CX Platform — Admin Operations Dashboard
 * Features KPI stats, threshold routing controls, escalation queue,
 * 13-agent fleet status, policy management, and System Execution & Audit Logs Table Interface.
 */
import { MOCK_CLAIMS, MOCK_ACTIVITY, STATS, MOCK_AGENTS } from '../../utils/data.js';

// Initial Mock System Logs (matching JSON structured logging from backend/core/logging.py)
export const INITIAL_SYSTEM_LOGS = [
  { timestamp: '2026-08-08 00:51:14', level: 'AUDIT', agent: 'Agent #8 (Score Evaluation)', caseId: 'CLM-2847', event: 'ISOLATED_SCORE_MERGED', detail: 'Pipeline A (CV): 74, Pipeline B (Doc): 70 → Merged Score: 72. Routed to Escalation Queue (50-79).', traceId: 'tr-9f81a20b' },
  { timestamp: '2026-08-08 00:50:42', level: 'INFO', agent: 'Agent #4 (Anti-Fraud Challenge)', caseId: 'CLM-2847', event: 'CHALLENGE_VERIFIED', detail: 'Session code "4892" & LED pen placement verified via OpenCV live stream.', traceId: 'tr-9f81a20a' },
  { timestamp: '2026-08-08 00:49:15', level: 'INFO', agent: 'Agent #3 (CV Object Detection)', caseId: 'CLM-2847', event: '3LAYER_CV_ANALYSIS', detail: 'MediaPipe hand: PASS (0.98), YOLO product: PASS (0.94), OpenCV damage: PROCESSING.', traceId: 'tr-9f81a209' },
  { timestamp: '2026-08-08 00:48:02', level: 'AUDIT', agent: 'Agent #10 (Workflow Execution)', caseId: 'CLM-2846', event: 'AUTO_REFUND_EXECUTED', detail: 'Score: 94 (>80). Issued $1,299.00 refund via Payment API & updated CRM status.', traceId: 'tr-8e72c10f' },
  { timestamp: '2026-08-08 00:45:30', level: 'WARN', agent: 'Agent #7 (Fraud Detection)', caseId: 'CLM-2842', event: 'REPLAY_ATTACK_DETECTED', detail: 'Screen moire pattern detected on frame #142. Score: 22 (<50). Case rejected.', traceId: 'tr-7d61b00e' },
  { timestamp: '2026-08-08 00:40:18', level: 'INFO', agent: 'Agent #12 (Memory / RAG)', caseId: 'CLM-2845', event: 'POLICY_CONTEXT_INJECTED', detail: 'Retrieved clauses from "Return Policy v2.4" & "Warranty Terms v1.8".', traceId: 'tr-6c50a90d' },
  { timestamp: '2026-08-08 00:35:10', level: 'INFO', agent: 'Agent #13 (Learning)', caseId: 'SYSTEM', event: 'RL_WEIGHT_UPDATED', detail: 'Feedback cycle #47 complete. Self-adjusted threshold weights for resolution score.', traceId: 'tr-5b49f80c' },
];

if (!window.cxSystemLogs) {
  window.cxSystemLogs = [...INITIAL_SYSTEM_LOGS];
}

export function renderAdminDashboard() {
  const escalationQueue = MOCK_CLAIMS.filter(c => c.score >= 50 && c.score < 80);
  const fraudQueue      = MOCK_CLAIMS.filter(c => c.score < 50);

  return `
    <div>
      <!-- Admin Header -->
      <div class="page-header" style="background:linear-gradient(135deg, #0f172a, #1e293b); padding:24px; border-radius:20px; color:#fff; margin-bottom:24px;">
        <div class="page-header__left">
          <span style="background:rgba(99,102,241,0.25); color:#818cf8; font-size:0.72rem; font-weight:700; padding:4px 12px; border-radius:12px; text-transform:uppercase;">
            Admin Ops — Platform Control Center
          </span>
          <h1 style="margin-top:8px; font-size:1.7rem; font-weight:800; color:#fff;">Platform Control Center</h1>
          <p style="color:#94a3b8; font-size:0.88rem; margin-top:2px;">
            Monitor 13 AI agents, manage escalation queue, inspect audit logs, and configure scoring thresholds.
          </p>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn btn-secondary" onclick="cxNavigate('agents')" id="btn-agent-monitor">
            🤖 Agent Fleet Monitor
          </button>
          <button class="btn btn-primary" onclick="cxNavigate('analytics')" id="btn-analytics">
            📊 Analytics & RL Insights
          </button>
        </div>
      </div>

      <!-- Platform KPIs -->
      <div class="stats-grid" style="margin-bottom:24px;">
        <div class="stat-card" id="admin-stat-total">
          <div class="stat-card__header">
            <div class="stat-card__icon purple">📦</div>
            <span class="stat-card__trend up">+14% week</span>
          </div>
          <div class="stat-card__value" data-target="${STATS.totalClaims}">${STATS.totalClaims}</div>
          <div class="stat-card__label">Total Claims Processed</div>
        </div>
        <div class="stat-card" id="admin-stat-auto">
          <div class="stat-card__header">
            <div class="stat-card__icon green">⚡</div>
            <span class="stat-card__trend up">${STATS.resolutionRate}% rate</span>
          </div>
          <div class="stat-card__value" data-target="${STATS.autoResolved}">${STATS.autoResolved}</div>
          <div class="stat-card__label">Auto-Resolved (Score ≥ 80)</div>
        </div>
        <div class="stat-card" id="admin-stat-review">
          <div class="stat-card__header">
            <div class="stat-card__icon orange">⚖️</div>
            <span class="stat-card__trend" style="color:#d97706; font-size:0.75rem; font-weight:700;">No bypass allowed</span>
          </div>
          <div class="stat-card__value" data-target="${STATS.inReview}">${STATS.inReview}</div>
          <div class="stat-card__label">Human Escalation (50–79)</div>
        </div>
        <div class="stat-card" id="admin-stat-fraud">
          <div class="stat-card__header">
            <div class="stat-card__icon red">🛡️</div>
            <span class="stat-card__trend down">Gallery blocked</span>
          </div>
          <div class="stat-card__value" data-target="${STATS.fraudDetected}">${STATS.fraudDetected}</div>
          <div class="stat-card__label">Fraud Blocked (Score < 50)</div>
        </div>
      </div>

      <!-- Human Escalation Queue -->
      <div class="card" style="margin-bottom:24px;" id="admin-escalation-queue">
        <div class="card__header">
          <div>
            <span class="card__title">⚠️ Pending Human Escalation Queue (Score Band 50–79)</span>
            <p style="font-size:0.78rem; color:var(--cx-text-muted); margin-top:3px;">
              Platform policy strictly prohibits automated bypass. Admin must approve or reject every case in this band.
            </p>
          </div>
          <span style="background:#fef3c7; color:#b45309; font-weight:700; font-size:0.8rem; padding:6px 14px; border-radius:20px;">
            ${escalationQueue.length} Awaiting Approval
          </span>
        </div>
        <div style="overflow-x:auto;">
          <table class="claim-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Customer</th>
                <th>Issue Type</th>
                <th>Order</th>
                <th>AI Score</th>
                <th>Current Agent</th>
                <th>Submitted</th>
                <th style="text-align:right;">Admin Action</th>
              </tr>
            </thead>
            <tbody>
              ${escalationQueue.map(c => `
                <tr>
                  <td style="font-family:var(--cx-font-mono); font-weight:700; color:#4f46e5;">${c.id}</td>
                  <td style="font-weight:600;">${c.customer}</td>
                  <td style="color:var(--cx-text-secondary);">${c.type}</td>
                  <td style="font-family:var(--cx-font-mono); font-size:0.78rem; color:var(--cx-text-muted);">${c.order}</td>
                  <td>
                    <div class="score-bar">
                      <div class="score-bar__track">
                        <div class="score-bar__fill mid" data-width="${c.score}%" style="width:0%"></div>
                      </div>
                      <span class="score-bar__value">${c.score}%</span>
                    </div>
                  </td>
                  <td style="font-size:0.82rem;">${c.agent}</td>
                  <td style="font-size:0.8rem; color:var(--cx-text-muted);">${c.created}</td>
                  <td style="text-align:right;">
                    <div style="display:flex; gap:6px; justify-content:flex-end;">
                      <button class="btn btn-success btn-sm" onclick="cxAdminApprove('${c.id}')" id="btn-approve-${c.id}">
                        ✓ Approve
                      </button>
                      <button class="btn btn-secondary btn-sm" onclick="cxAdminViewCase('${c.id}')" id="btn-view-${c.id}">
                        View Report
                      </button>
                      <button class="btn btn-danger btn-sm" onclick="cxAdminReject('${c.id}')" id="btn-reject-${c.id}">
                        ✕ Reject
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- SYSTEM EXECUTION & AUDIT LOGS TABLE INTERFACE -->
      <div class="card" style="margin-bottom:24px;" id="admin-system-logs">
        <div class="card__header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <span class="card__title">📋 System Execution & Audit Logs</span>
            <p style="font-size:0.78rem; color:var(--cx-text-muted); margin-top:2px;">
              JSON-formatted log stream for ELK / OpenTelemetry ingestion. Provides 100% auditability & explainability trace.
            </p>
          </div>
          <div style="display:flex; gap:10px; align-items:center;">
            <input type="text" id="log-search-input" onkeyup="cxFilterLogs()" placeholder="Filter logs by keyword..." 
              style="padding:8px 14px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.84rem; outline:none; width:220px;" />
            <button class="btn btn-primary btn-sm" onclick="cxSimulateLiveLog()" id="btn-simulate-log">
              ⚡ Simulate Live Event
            </button>
          </div>
        </div>

        <!-- Log Level Filter Bar -->
        <div style="padding:12px 22px; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          <span style="font-size:0.78rem; font-weight:700; color:#64748b;">Filter Level:</span>
          <button class="btn btn-secondary btn-sm" onclick="cxFilterLogLevel('ALL')" id="log-filter-all" style="border-color:#4f46e5; color:#4f46e5;">All Logs (${window.cxSystemLogs.length})</button>
          <button class="btn btn-secondary btn-sm" onclick="cxFilterLogLevel('AUDIT')" id="log-filter-audit">AUDIT</button>
          <button class="btn btn-secondary btn-sm" onclick="cxFilterLogLevel('INFO')" id="log-filter-info">INFO</button>
          <button class="btn btn-secondary btn-sm" onclick="cxFilterLogLevel('WARN')" id="log-filter-warn">WARN</button>
          <button class="btn btn-secondary btn-sm" onclick="cxFilterLogLevel('ERROR')" id="log-filter-error">ERROR</button>
        </div>

        <!-- Logs Table -->
        <div style="overflow-x:auto;">
          <table class="claim-table" id="admin-logs-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Level</th>
                <th>Component / Agent</th>
                <th>Case ID</th>
                <th>Action / Event</th>
                <th>Log Detail & Rationale</th>
                <th style="text-align:right;">Trace ID</th>
              </tr>
            </thead>
            <tbody id="logs-table-body">
              ${window.cxSystemLogs.map((l, i) => `
                <tr class="log-row" data-level="${l.level}">
                  <td style="font-family:monospace; font-size:0.78rem; color:#64748b; white-space:nowrap;">${l.timestamp}</td>
                  <td><span class="badge-log ${l.level}">${l.level}</span></td>
                  <td style="font-weight:700; font-size:0.82rem; color:#0f172a;">${l.agent}</td>
                  <td style="font-family:monospace; font-weight:700; font-size:0.8rem; color:#4f46e5;">${l.caseId}</td>
                  <td style="font-family:monospace; font-weight:700; font-size:0.78rem; color:#1e293b;">${l.event}</td>
                  <td style="font-size:0.8rem; color:#475569; max-width:340px;">${l.detail}</td>
                  <td style="font-family:monospace; font-size:0.75rem; color:#94a3b8; text-align:right;">${l.traceId}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Content Grid: Live Activity + Fraud Queue -->
      <div class="content-grid" style="margin-bottom:24px;">
        <div class="card" id="admin-activity">
          <div class="card__header">
            <span class="card__title">Live Agent Activity</span>
            <span style="font-size:0.72rem; color:var(--cx-text-muted);">Real-time orchestration events</span>
          </div>
          <div class="card__body">
            <div class="activity-feed">
              ${MOCK_ACTIVITY.map(a => `
                <div class="activity-item">
                  <div class="activity-item__dot ${a.type}"></div>
                  <div class="activity-item__content">
                    <div class="activity-item__text">${a.text}</div>
                    <div class="activity-item__time">${a.time}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="card" id="admin-fraud-queue">
          <div class="card__header">
            <span class="card__title">🚫 Fraud-Flagged Cases (Score < 50)</span>
            <span style="font-size:0.72rem; color:var(--cx-danger);">${fraudQueue.length} blocked today</span>
          </div>
          <div class="card__body">
            ${fraudQueue.length === 0
              ? `<p style="color:var(--cx-text-muted); font-size:0.85rem;">No fraud-flagged cases in queue.</p>`
              : fraudQueue.map(c => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--cx-border);">
                  <div>
                    <div style="font-family:var(--cx-font-mono); font-weight:700; font-size:0.82rem; color:var(--cx-danger);">${c.id}</div>
                    <div style="font-size:0.78rem; color:var(--cx-text-secondary);">${c.customer} — ${c.type}</div>
                  </div>
                  <div style="text-align:right;">
                    <span style="font-size:0.82rem; font-weight:700; color:var(--cx-danger);">Score: ${c.score}</span>
                    <br/><span class="badge-status rejected" style="font-size:0.72rem;">rejected</span>
                  </div>
                </div>
              `).join('')
            }
            <p style="font-size:0.75rem; color:var(--cx-text-muted); margin-top:10px;">
              Anti-Fabrication Engine blocked gallery uploads. Dynamic challenges defeated ${STATS.fraudDetected} attempts this month.
            </p>
          </div>
        </div>
      </div>

      <!-- 13-Agent Fleet Status -->
      <div class="card" id="admin-agent-fleet">
        <div class="card__header">
          <span class="card__title">🤖 13-Agent Orchestration Fleet</span>
          <button class="btn btn-secondary btn-sm" onclick="cxNavigate('agents')" id="btn-full-agent-view">
            Full Topology View →
          </button>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:10px; padding:16px;">
          ${MOCK_AGENTS.map(a => `
            <div style="padding:12px; border-radius:12px; background:var(--cx-bg-input); border:1px solid var(--cx-border); display:flex; align-items:center; justify-content:space-between;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span>${a.novel ? '✦' : '•'}</span>
                <div>
                  <div style="font-weight:600; font-size:0.82rem; color:var(--cx-text-primary);">Agent ${a.id} — ${a.name}</div>
                  <div style="font-size:0.72rem; color:var(--cx-text-muted);">Tasks: ${a.tasks} · Avg: ${a.avgTime} · Accuracy: ${a.accuracy}%</div>
                </div>
              </div>
              <span style="font-size:0.72rem; font-weight:700; padding:2px 8px; border-radius:10px;
                background:${a.status === 'online' ? '#dcfce7' : '#f1f5f9'};
                color:${a.status === 'online' ? '#15803d' : '#64748b'};">
                ${a.status === 'online' ? '● Online' : '○ Idle'}
              </span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Policy Management Panel -->
      <div class="card" style="margin-top:16px;" id="admin-policy">
        <div class="card__header">
          <span class="card__title">📜 Policy Management — RAG Knowledge Base (Agent #6 & #12)</span>
          <button class="btn btn-primary btn-sm" onclick="alert('Policy indexing triggered — Memory/RAG Agent (#12) will re-index within 30 seconds.')" id="btn-reindex-policies">
            + Re-index Policies
          </button>
        </div>
        <div class="card__body" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:10px;">
          ${[
            { icon: '📋', name: 'Return & Refund Policy',   version: 'v2.4', status: 'active' },
            { icon: '🛡️', name: 'Warranty Terms',          version: 'v1.8', status: 'active' },
            { icon: '🚚', name: 'Delivery SLA Agreement',  version: 'v3.1', status: 'active' },
            { icon: '💳', name: 'Billing Dispute Policy',  version: 'v1.2', status: 'active' },
            { icon: '📞', name: 'Subscription Terms',      version: 'v2.0', status: 'active' },
            { icon: '🔒', name: 'GDPR / CCPA Compliance',  version: 'v4.0', status: 'active' },
          ].map(p => `
            <div style="padding:12px; border-radius:10px; background:var(--cx-bg-input); border:1px solid var(--cx-border);">
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                <span>${p.icon}</span>
                <span style="font-weight:700; font-size:0.82rem;">${p.name}</span>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--cx-text-muted);">
                <span>${p.version}</span>
                <span style="color:var(--cx-success); font-weight:600;">● ${p.status}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Logout / Switch View -->
      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:24px;">
        <button class="btn btn-secondary" onclick="cxNavigate('userDashboard')" id="btn-switch-user">
          👤 Switch to User View
        </button>
        <button class="btn btn-secondary" onclick="cxLogout()" id="btn-logout">
          🔑 Logout
        </button>
      </div>
    </div>
  `;
}

// Log Filtering Helpers
window.cxFilterLogLevel = function(level) {
  const rows = document.querySelectorAll('.log-row');
  rows.forEach(r => {
    if (level === 'ALL' || r.dataset.level === level) {
      r.style.display = '';
    } else {
      r.style.display = 'none';
    }
  });
};

window.cxFilterLogs = function() {
  const query = document.getElementById('log-search-input')?.value?.toLowerCase() || '';
  const rows = document.querySelectorAll('.log-row');
  rows.forEach(r => {
    const text = r.innerText.toLowerCase();
    if (text.includes(query)) {
      r.style.display = '';
    } else {
      r.style.display = 'none';
    }
  });
};

window.cxSimulateLiveLog = function() {
  const events = [
    { level: 'AUDIT', agent: 'Agent #10 (Workflow Execution)', caseId: 'CLM-2848', event: 'REPLACEMENT_DISPATCHED', detail: 'Score: 91 (>80). Replacement laptop order #ORD-99120 dispatched via Shipping API.' },
    { level: 'INFO', agent: 'Agent #2 (Evidence Capture)', caseId: 'CLM-2848', event: 'WEBRTC_STREAM_STARTED', detail: 'Live camera session opened. Gallery file picker access restricted.' },
    { level: 'WARN', agent: 'Agent #4 (Anti-Fraud Challenge)', caseId: 'CLM-2848', event: 'LIGHTING_PHYSICS_FLAG', detail: 'Frame uniformity suspicious. Issued Shadow/Light physical challenge.' },
  ];
  const newLog = events[Math.floor(Math.random() * events.length)];
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const traceId = 'tr-' + Math.random().toString(16).substring(2, 10);

  window.cxSystemLogs.unshift({
    timestamp: now,
    level: newLog.level,
    agent: newLog.agent,
    caseId: newLog.caseId,
    event: newLog.event,
    detail: newLog.detail,
    traceId: traceId,
  });

  if (window.cxNavigate) {
    window.cxNavigate('adminDashboard');
  }
};

window.cxAdminApprove = function(caseId) {
  alert(`✅ Case ${caseId} APPROVED by Admin.\n\nWorkflow Execution Agent (#10) triggered:\n• Refund / replacement initiated\n• Customer notification queued\n• Audit log entry created\n• Learning Agent (#13) notified for RL feedback cycle`);
};

window.cxAdminReject = function(caseId) {
  alert(`❌ Case ${caseId} REJECTED by Admin.\n\nCustomer notification sent.\nAudit log entry created.\nLearning Agent (#13) notified for RL feedback.`);
};

window.cxAdminViewCase = function(caseId) {
  alert(`📋 Case ${caseId} Full Report:\n\nExplainability Framework Output:\n• Rationale: Score 50-79 — mixed evidence quality\n• Policy References: Return Policy v2.4, Warranty Terms v1.8\n• Confidence Score: 65%\n• Fraud Assessment: Low risk behavioral signals\n• Evidence Summary: Camera-only (Pipeline A) + Invoice (Pipeline B)\n• Resolution Justification: Insufficient auto-resolve confidence\n• Human Override Recommendation: Approve with partial refund\n• Execution Log: Agents 1→2→3→4→5→6→7→8→11 completed`);
};

window.cxLogout = function() {
  window.cxIsAuthenticated = false;
  window.cxCurrentRole = null;
  window.cxCurrentUser = null;
  if (window.cxNavigate) window.cxNavigate('login');
};
