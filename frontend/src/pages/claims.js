import { MOCK_CLAIMS } from '../utils/data.js';

export function renderClaims() {
  return `
    <div class="page-header">
      <div class="page-header__left">
        <h1>Claims Management</h1>
        <p>All customer claims — filtered by status, score, and assignment</p>
      </div>
      <button class="btn btn-primary" id="btn-new-claim-page">+ New Claim</button>
    </div>

    <!-- Filters -->
    <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;">
      <button class="btn btn-secondary btn-sm" style="border-color:var(--cx-accent);color:var(--cx-accent);">All</button>
      <button class="btn btn-secondary btn-sm">Processing</button>
      <button class="btn btn-secondary btn-sm">In Review</button>
      <button class="btn btn-secondary btn-sm">Resolved</button>
      <button class="btn btn-secondary btn-sm">Rejected</button>
    </div>

    <div class="card" id="card-all-claims">
      <div class="card__body" style="padding:0;">
        <table class="claim-table">
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Customer</th>
              <th>Type</th>
              <th>Order</th>
              <th>Score</th>
              <th>Status</th>
              <th>Current Agent</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            ${MOCK_CLAIMS.map(c => `
              <tr>
                <td style="font-family:var(--cx-font-mono);font-weight:600;font-size:0.82rem;">${c.id}</td>
                <td>${c.customer}</td>
                <td style="color:var(--cx-text-secondary)">${c.type}</td>
                <td style="font-family:var(--cx-font-mono);font-size:0.8rem;color:var(--cx-text-muted);">${c.order}</td>
                <td>
                  <div class="score-bar">
                    <div class="score-bar__track">
                      <div class="score-bar__fill ${c.score >= 80 ? 'high' : c.score >= 50 ? 'mid' : 'low'}"
                           data-width="${c.score}%" style="width:0%"></div>
                    </div>
                    <span class="score-bar__value">${c.score}</span>
                  </div>
                </td>
                <td><span class="badge-status ${c.status}">${c.status.replace('-', ' ')}</span></td>
                <td style="font-size:0.82rem;">${c.agent}</td>
                <td style="color:var(--cx-text-muted);font-size:0.82rem;">${c.created}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Scoring Thresholds Info -->
    <div class="card" style="margin-top:18px;" id="card-thresholds">
      <div class="card__header">
        <span class="card__title">Routing Thresholds</span>
        <span style="font-size:0.72rem;color:var(--cx-text-muted);font-family:var(--cx-font-mono);">core/config.py</span>
      </div>
      <div class="card__body" style="display:flex;gap:24px;flex-wrap:wrap;">
        <div style="flex:1;min-width:200px;padding:16px;background:var(--cx-success-bg);border-radius:var(--cx-radius-md);border:1px solid rgba(16,185,129,0.2);">
          <div style="font-size:1.4rem;font-weight:800;color:var(--cx-success);">≥ 80</div>
          <div style="font-size:0.82rem;color:var(--cx-text-secondary);margin-top:4px;">Auto-Resolve → Workflow Execution Agent</div>
        </div>
        <div style="flex:1;min-width:200px;padding:16px;background:var(--cx-warning-bg);border-radius:var(--cx-radius-md);border:1px solid rgba(245,158,11,0.2);">
          <div style="font-size:1.4rem;font-weight:800;color:var(--cx-warning);">50 – 79</div>
          <div style="font-size:0.82rem;color:var(--cx-text-secondary);margin-top:4px;">Human Review → Escalation Agent (no bypass)</div>
        </div>
        <div style="flex:1;min-width:200px;padding:16px;background:var(--cx-danger-bg);border-radius:var(--cx-radius-md);border:1px solid rgba(239,68,68,0.2);">
          <div style="font-size:1.4rem;font-weight:800;color:var(--cx-danger);">< 50</div>
          <div style="font-size:0.82rem;color:var(--cx-text-secondary);margin-top:4px;">Fraud Reject → Notification + Case Closed</div>
        </div>
      </div>
    </div>
  `;
}
