/**
 * Enterprise CX Platform — Admin Operations Dashboard
 * Features KPI stats, threshold routing controls, escalation queue,
 * 13-agent fleet status, policy management, and System Execution & Audit Logs Table Interface.
 */
import { MOCK_CLAIMS, MOCK_ACTIVITY, STATS, MOCK_AGENTS } from '../../utils/data.js';
import { showModal } from '../../utils/modal.js';


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
  const fraudQueue = MOCK_CLAIMS.filter(c => c.score < 50);

  return `
    <div>
      <!-- Admin Header (Pinned Board Card style) -->
      <div class="rc-card rc-card-blue" style="background:linear-gradient(135deg, #f5b444ff, #f59e0b); padding:24px; color:#fff; border:2.5px solid #1e293b; box-shadow:0 6px 0 #1e293b; margin-bottom:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div class="page-header__left">
            <span style="background:rgba(14, 15, 15, 0.25); color:#818cf8; font-size:0.72rem; font-weight:800; padding:4px 12px; border-radius:12px; text-transform:uppercase; border:1.5px solid #818cf8;">
              Admin Ops — Platform Control Center
            </span>
            <h1 style="margin-top:8px; font-size:1.7rem; font-weight:800; color:#fff; margin-bottom:4px;">Platform Control Center</h1>
            <p style="color:#0a090bff; font-size:0.88rem; margin:0;">
              Monitor 13 AI agents, manage escalation queue, inspect audit logs, and configure scoring thresholds.
            </p>
          </div>
          <div style="display:flex; gap:12px; flex-wrap:wrap;">
            <button class="btn btn-secondary" onclick="cxNavigate('agents')" id="btn-agent-monitor" style="border:2px solid #1e293b; box-shadow:3px 3px 0 #1e293b; color:#1e293b; font-weight:800;">
              🤖 Agent Fleet Monitor
            </button>
            <button class="btn btn-primary" onclick="cxNavigate('analytics')" id="btn-analytics" style="border:2px solid #1e293b; box-shadow:3px 3px 0 #1e293b; font-weight:800;">
              📊 Analytics & RL Insights
            </button>
          </div>
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
      <!-- Prometheus & Grafana Monitoring Section -->
      <div class="rc-card rc-card-blue" style="margin-bottom:24px; padding:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div>
            <span style="background:#1e293b; color:#fff; font-size:0.75rem; font-weight:800; padding:4px 12px; border-radius:12px; display:inline-block; margin-bottom:8px;">📈 SYSTEM INFRASTRUCTURE</span>
            <h2 style="font-size:1.4rem; font-weight:800; color:#1e293b; margin:0 0 4px 0;">Prometheus & Grafana Monitoring</h2>
            <p style="font-size:0.85rem; color:#64748b; margin:0;">Live metrics feed exposed via /metrics. Embeds directly into Grafana.</p>
          </div>
          <button class="btn btn-primary" onclick="window.open('http://localhost:8000/metrics', '_blank')" style="border:2px solid #1e293b; box-shadow:3px 3px 0 #1e293b;">
            View Raw Prometheus Metrics
          </button>
        </div>
        <div style="background:#0f172a; border-radius:12px; border:2.5px solid #1e293b; padding:2px; height:360px; position:relative; overflow:hidden;">
          <!-- Simulated Grafana Dashboard embed -->
          <div style="position:absolute; inset:0; background:url('https://grafana.com/static/assets/img/blog/grafana_dashboard_example_1.png') center/cover no-repeat; opacity:0.6; filter: hue-rotate(190deg) saturate(1.5);"></div>
          <div style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; background:rgba(15,23,42,0.75);">
            <div style="font-size:3rem; margin-bottom:10px;">📊</div>
            <h3 style="color:#fff; font-size:1.3rem; margin:0 0 8px 0; font-weight:800;">Grafana Dashboard Initializing...</h3>
            <p style="color:#94a3b8; font-size:0.85rem; max-width:400px; text-align:center; line-height:1.5;">
              Connect your Grafana instance to <code style="background:#1e293b; padding:2px 6px; border-radius:4px; color:#38bdf8;">http://backend:8000/metrics</code> to visualize real-time FastApi & AI orchestration metrics.
            </p>
          </div>
        </div>
      </div>
      
      <!-- Overall & Monthly Platform Status Dashboard (ListContainer cream style) -->
      <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:20px; margin-bottom:24px;">
        <!-- Left: Overall Performance -->
        <div class="lc-card" style="padding:24px;">
          <div class="lc-card-header" style="font-size:1.25rem; font-weight:800; border-bottom:2.5px solid #1e293b; padding-bottom:10px; margin-bottom:20px;">
            📊 Overall Platform Performance Status
          </div>
          <div class="lc-list">
            <div class="lc-item">
              <div class="lc-badge">AR</div>
              <div class="lc-content">
                <h4 class="lc-title">Auto-Resolution Success Rate</h4>
                <div class="lc-progress-track"><div class="lc-progress-fill" style="width: 84%; background-color:#22c55e;"></div></div>
              </div>
              <div class="lc-value">84% (Target: 80%+)</div>
            </div>
            <div class="lc-item">
              <div class="lc-badge">CS</div>
              <div class="lc-content">
                <h4 class="lc-title">Customer CSAT Score</h4>
                <div class="lc-progress-track"><div class="lc-progress-fill" style="width: 94%; background-color:#3b82f6;"></div></div>
              </div>
              <div class="lc-value">4.7 / 5.0</div>
            </div>
            <div class="lc-item">
              <div class="lc-badge">LT</div>
              <div class="lc-content">
                <h4 class="lc-title">Average Processing Latency</h4>
                <div class="lc-progress-track"><div class="lc-progress-fill" style="width: 90%; background-color:#ef4444;"></div></div>
              </div>
              <div class="lc-value">4.2 Seconds</div>
            </div>
            <div class="lc-item">
              <div class="lc-badge">FD</div>
              <div class="lc-content">
                <h4 class="lc-title">Anti-Fraud Gate Block Accuracy</h4>
                <div class="lc-progress-track"><div class="lc-progress-fill" style="width: 99.2%; background-color:#22c55e;"></div></div>
              </div>
              <div class="lc-value">99.2% Accuracy</div>
            </div>
          </div>
        </div>

        <!-- Right: Monthly Dispute Volume Status -->
        <div class="lc-card" style="padding:24px;">
          <div class="lc-card-header" style="font-size:1.25rem; font-weight:800; border-bottom:2.5px solid #1e293b; padding-bottom:10px; margin-bottom:20px;">
            📅 Monthly Dispute Volume & Trend
          </div>
          <div class="lc-list">
            <div class="lc-item">
              <div class="lc-badge">JUL</div>
              <div class="lc-content">
                <h4 class="lc-title">July Resolution Volume</h4>
                <div class="lc-progress-track"><div class="lc-progress-fill" style="width: 92%; background-color:#ffb84d;"></div></div>
              </div>
              <div class="lc-value">1,280 Claims</div>
            </div>
            <div class="lc-item">
              <div class="lc-badge">JUN</div>
              <div class="lc-content">
                <h4 class="lc-title">June Resolution Volume</h4>
                <div class="lc-progress-track"><div class="lc-progress-fill" style="width: 80%; background-color:#ffb84d;"></div></div>
              </div>
              <div class="lc-value">1,120 Claims</div>
            </div>
            <div class="lc-item">
              <div class="lc-badge">MAY</div>
              <div class="lc-content">
                <h4 class="lc-title">May Resolution Volume</h4>
                <div class="lc-progress-track"><div class="lc-progress-fill" style="width: 67%; background-color:#ffb84d;"></div></div>
              </div>
              <div class="lc-value">940 Claims</div>
            </div>
            <div class="lc-item">
              <div class="lc-badge">APR</div>
              <div class="lc-content">
                <h4 class="lc-title">April Resolution Volume</h4>
                <div class="lc-progress-track"><div class="lc-progress-fill" style="width: 58%; background-color:#ffb84d;"></div></div>
              </div>
              <div class="lc-value">810 Claims</div>
            </div>
          </div>
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

      <!-- NEW: DATABASE USER HISTORY TABLE -->
      <div class="card" style="margin-bottom:24px;" id="admin-db-history">
        <div class="card__header" style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <span class="card__title">🗄️ Database Records (user_history)</span>
            <p style="font-size:0.78rem; color:var(--cx-text-muted); margin-top:2px;">
              Live data from Supabase PostgreSQL database.
            </p>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="cxLoadDbHistory()" id="btn-refresh-db">
            🔄 Refresh DB
          </button>
        </div>
        <div style="overflow-x:auto;">
          <table class="claim-table" id="db-history-table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>User ID</th>
                <th>Issue Type</th>
                <th>AI Score</th>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody id="db-history-tbody">
              <tr>
                <td colspan="6" style="text-align:center; color:#64748b;">Loading database records...</td>
              </tr>
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
          <div style="display:flex; gap:10px;">
            <button class="btn btn-secondary btn-sm" onclick="cxTogglePolicyUpload()" id="btn-toggle-upload">
              Upload New Policy
            </button>
            <button class="btn btn-primary btn-sm" onclick="cxReindexPolicies()" id="btn-reindex-policies">
              🔄 Re-index Policies
            </button>
          </div>
        </div>
        
        <div id="policy-upload-container" style="display:none; padding:16px; background:#f8fafc; border-bottom:1px solid #e2e8f0;">
          <form id="policy-upload-form" onsubmit="cxUploadPolicy(event)" style="display:flex; gap:12px; align-items:flex-end; flex-wrap:wrap;">
            <div style="flex:2; min-width:200px;">
              <label style="font-size:0.8rem; font-weight:700; color:#1e293b;">Document Name</label>
              <input type="text" id="policy-doc-name" required placeholder="e.g. Summer Return Policy" style="width:100%; padding:8px; border-radius:8px; border:1px solid #cbd5e1;">
            </div>
            <div style="flex:1; min-width:120px;">
              <label style="font-size:0.8rem; font-weight:700; color:#1e293b;">Type</label>
              <select id="policy-type" required style="width:100%; padding:8px; border-radius:8px; border:1px solid #cbd5e1;">
                <option value="Return">Return</option>
                <option value="Warranty">Warranty</option>
                <option value="General">General</option>
              </select>
            </div>
            <div style="flex:1; min-width:100px;">
              <label style="font-size:0.8rem; font-weight:700; color:#1e293b;">Version</label>
              <input type="text" id="policy-version" required placeholder="v1.0" style="width:100%; padding:8px; border-radius:8px; border:1px solid #cbd5e1;">
            </div>
            <div style="flex:2; min-width:200px;">
              <label style="font-size:0.8rem; font-weight:700; color:#1e293b;">PDF File</label>
              <input type="file" id="policy-file" accept=".pdf" required style="width:100%; font-size:0.8rem;">
            </div>
            <button type="submit" class="btn btn-primary" id="btn-upload-submit">Upload & Vectorize →</button>
          </form>
          <div id="upload-status" style="margin-top:10px; font-size:0.8rem; font-weight:700;"></div>
        </div>

        <div class="card__body" id="policy-list-container" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:10px;">
          <p style="font-size:0.8rem; color:#64748b;">Loading policies from RAG engine...</p>
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
window.cxFilterLogLevel = function (level) {
  const rows = document.querySelectorAll('.log-row');
  rows.forEach(r => {
    if (level === 'ALL' || r.dataset.level === level) {
      r.style.display = '';
    } else {
      r.style.display = 'none';
    }
  });
};

window.cxFilterLogs = function () {
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

window.cxSimulateLiveLog = function () {
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

window.cxAdminApprove = function (caseId) {
  showModal({
    title: `Case ${caseId} Approved`,
    icon: '✅',
    type: 'success',
    body: 'Workflow Execution Agent (#10) has been triggered.',
    lines: [
      '💸 Refund / replacement initiated',
      '📧 Customer notification queued',
      '📋 Audit log entry created',
      '🤖 Learning Agent (#13) notified for RL feedback cycle',
    ],
  });
};

window.cxAdminReject = function (caseId) {
  showModal({
    title: `Case ${caseId} Rejected`,
    icon: '❌',
    type: 'error',
    body: 'The case has been rejected by the admin reviewer.',
    lines: [
      '📧 Customer notification sent',
      '📋 Audit log entry created',
      '🤖 Learning Agent (#13) notified for RL feedback',
    ],
  });
};

window.cxAdminViewCase = function (caseId) {
  showModal({
    title: `Case ${caseId} — Full Explainability Report`,
    icon: '📋',
    type: 'info',
    body: 'AI Explainability Framework Output:',
    lines: [
      '📝 Rationale: Score 50–79 — mixed evidence quality',
      '📜 Policy References: Return Policy v2.4, Warranty Terms v1.8',
      '📊 Confidence Score: 65%',
      '🛡️ Fraud Assessment: Low risk behavioral signals',
      '📷 Evidence: Camera-only (Pipeline A) + Invoice (Pipeline B)',
      '⚡ Resolution: Insufficient auto-resolve confidence',
      '👤 Recommendation: Approve with partial refund',
      '🔗 Execution Log: Agents 1→2→3→4→5→6→7→8→11 completed',
    ],
    confirmText: 'Close Report',
  });
};

window.cxLogout = function () {
  window.cxIsAuthenticated = false;
  window.cxCurrentRole = null;
  window.cxCurrentUser = null;
  if (window.cxNavigate) window.cxNavigate('login');
};

// --- RAG Policy Management Scripts ---
window.cxTogglePolicyUpload = function() {
  const container = document.getElementById('policy-upload-container');
  container.style.display = container.style.display === 'none' ? 'block' : 'none';
};

window.cxLoadPolicies = async function() {
  const container = document.getElementById('policy-list-container');
  if (!container) return;
  try {
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/v1/policies/');
    const data = await res.json();
    
    if (data.policies && data.policies.length > 0) {
      container.innerHTML = data.policies.map(p => `
        <div style="padding:12px; border-radius:10px; background:var(--cx-bg-input); border:1px solid var(--cx-border);">
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span>📄</span>
            <span style="font-weight:700; font-size:0.82rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${p.document_name}">${p.document_name}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--cx-text-muted);">
            <span>${p.version}</span>
            <span style="color:var(--cx-success); font-weight:600;">● active</span>
          </div>
          <div style="font-size:0.68rem; color:#64748b; margin-top:4px;">Chunks: ${p.chunks_count} | Type: ${p.policy_type}</div>
        </div>
      `).join('');
    } else {
      container.innerHTML = '<p style="font-size:0.8rem; color:#64748b;">No policies found. Upload one to build the RAG knowledge base.</p>';
    }
  } catch (err) {
    container.innerHTML = '<p style="font-size:0.8rem; color:#dc2626;">Error loading policies. Is the backend running?</p>';
  }
};

window.cxUploadPolicy = async function(event) {
  event.preventDefault();
  const btn = document.getElementById('btn-upload-submit');
  const status = document.getElementById('upload-status');
  const fileInput = document.getElementById('policy-file');
  
  if (!fileInput.files[0]) return;
  
  btn.disabled = true;
  btn.innerText = 'Uploading & Vectorizing...';
  status.textContent = 'Processing PDF chunks and generating embeddings (FAISS)...';
  status.style.color = '#4f46e5';
  
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);
  formData.append('document_name', document.getElementById('policy-doc-name').value);
  formData.append('policy_type', document.getElementById('policy-type').value);
  formData.append('version', document.getElementById('policy-version').value);
  
  try {
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/v1/policies/upload', {
      method: 'POST',
      body: formData
    });
    const result = await res.json();
    if (res.ok) {
      status.textContent = `✓ Successfully uploaded and vectorized into ${result.policy.chunks_count} chunks.`;
      status.style.color = '#15803d';
      document.getElementById('policy-upload-form').reset();
      window.cxLoadPolicies();
    } else {
      status.textContent = 'Error: ' + result.detail;
      status.style.color = '#dc2626';
    }
  } catch (err) {
    status.textContent = 'Error contacting backend: ' + err.message;
    status.style.color = '#dc2626';
  } finally {
    btn.disabled = false;
    btn.innerText = 'Upload & Vectorize →';
  }
};

window.cxReindexPolicies = async function() {
  const btn = document.getElementById('btn-reindex-policies');
  btn.innerText = '🔄 Re-indexing...';
  try {
    await fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/v1/policies/reindex', { method: 'POST' });
    alert('Knowledge base reindexed successfully.');
  } catch (err) {
    alert('Error reindexing: ' + err.message);
  }
  btn.innerText = '🔄 Re-index Policies';
};

// Initial load
setTimeout(() => {
  if (document.getElementById('policy-list-container')) {
    window.cxLoadPolicies();
  }
  if (document.getElementById('db-history-tbody')) {
    window.cxLoadDbHistory();
  }
}, 500);

window.cxLoadDbHistory = async function() {
  const tbody = document.getElementById('db-history-tbody');
  if (!tbody) return;
  try {
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/v1/claims/history');
    const data = await res.json();
    if (data.history && data.history.length > 0) {
      tbody.innerHTML = data.history.map(h => `
        <tr>
          <td style="font-family:monospace; font-weight:700; color:#4f46e5;">${h.claim_id}</td>
          <td style="font-family:monospace; font-size:0.75rem; color:#64748b;">${h.user_id}</td>
          <td style="color:var(--cx-text-secondary);">${h.issue_type}</td>
          <td style="font-weight:700;">${h.ai_score !== null ? h.ai_score : 'N/A'}</td>
          <td><span class="badge-status ${h.status === 'Reject' ? 'rejected' : 'resolved'}">${h.status}</span></td>
          <td style="font-size:0.8rem; color:#475569; max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${h.description}">${h.description}</td>
        </tr>
      `).join('');
    } else {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#64748b;">No records found in database.</td></tr>';
    }
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#dc2626;">Error loading database records.</td></tr>';
  }
};
