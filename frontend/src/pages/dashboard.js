import { ICONS } from '../utils/icons.js';
import { MOCK_CLAIMS, MOCK_ACTIVITY, MOCK_CHART_DATA, STATS } from '../utils/data.js';

export function renderDashboard() {
  return `
    <div class="page-header">
      <div class="page-header__left">
        <h1>Dashboard</h1>
        <p>Real-time overview of your customer resolution platform</p>
      </div>
      <button class="btn btn-primary" id="btn-new-claim">
        + New Claim
      </button>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card" id="stat-total-claims">
        <div class="stat-card__header">
          <div class="stat-card__icon purple">${ICONS.claims}</div>
          <span class="stat-card__trend up">${ICONS.arrowUp} 12%</span>
        </div>
        <div class="stat-card__value" data-target="${STATS.totalClaims}">0</div>
        <div class="stat-card__label">Total Claims</div>
      </div>
      <div class="stat-card" id="stat-auto-resolved">
        <div class="stat-card__header">
          <div class="stat-card__icon green">${ICONS.check}</div>
          <span class="stat-card__trend up">${ICONS.arrowUp} 8%</span>
        </div>
        <div class="stat-card__value" data-target="${STATS.autoResolved}">0</div>
        <div class="stat-card__label">Auto-Resolved</div>
      </div>
      <div class="stat-card" id="stat-in-review">
        <div class="stat-card__header">
          <div class="stat-card__icon orange">${ICONS.clock}</div>
          <span class="stat-card__trend down">${ICONS.arrowDown} 3%</span>
        </div>
        <div class="stat-card__value" data-target="${STATS.inReview}">0</div>
        <div class="stat-card__label">In Human Review</div>
      </div>
      <div class="stat-card" id="stat-fraud">
        <div class="stat-card__header">
          <div class="stat-card__icon red">${ICONS.shield}</div>
          <span class="stat-card__trend down">${ICONS.arrowDown} 15%</span>
        </div>
        <div class="stat-card__value" data-target="${STATS.fraudDetected}">0</div>
        <div class="stat-card__label">Fraud Detected</div>
      </div>
    </div>

    <!-- Content Grid: Recent Claims + Activity -->
    <div class="content-grid">
      <div class="card" id="card-recent-claims">
        <div class="card__header">
          <span class="card__title">Recent Claims</span>
          <button class="btn btn-secondary btn-sm" onclick="cxNavigate('claims')">View All ${ICONS.arrowRight}</button>
        </div>
        <div class="card__body" style="padding:0;">
          <table class="claim-table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${MOCK_CLAIMS.slice(0, 5).map(c => `
                <tr>
                  <td style="font-family:var(--cx-font-mono);font-weight:600;font-size:0.82rem;">${c.id}</td>
                  <td>${c.customer}</td>
                  <td style="color:var(--cx-text-secondary)">${c.type}</td>
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
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card" id="card-activity">
        <div class="card__header">
          <span class="card__title">Live Activity</span>
          <span style="font-size:0.75rem;color:var(--cx-text-muted);">Auto-updating</span>
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
    </div>

    <!-- Resolution Trends Chart -->
    <div class="card" id="card-trends">
      <div class="card__header">
        <span class="card__title">Resolution Trends (12 Months)</span>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-secondary btn-sm">Daily</button>
          <button class="btn btn-secondary btn-sm" style="border-color:var(--cx-accent);color:var(--cx-accent);">Monthly</button>
        </div>
      </div>
      <div class="card__body">
        <div class="chart-area">
          ${MOCK_CHART_DATA.map(val => `
            <div class="chart-bar" data-height="${val * 2}px" style="height:4px;"></div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
