import { ICONS } from '../utils/icons.js';
import { MOCK_CHART_DATA, STATS } from '../utils/data.js';

export function renderAnalytics() {
  return `
    <div class="page-header">
      <div class="page-header__left">
        <h1>Analytics</h1>
        <p>Platform performance, resolution metrics, and learning insights</p>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-secondary btn-sm">Export CSV</button>
        <button class="btn btn-primary btn-sm">Generate Report</button>
      </div>
    </div>

    <!-- KPI Row -->
    <div class="stats-grid" style="margin-bottom:24px;">
      <div class="stat-card">
        <div class="stat-card__header">
          <div class="stat-card__icon green">${ICONS.chart}</div>
        </div>
        <div class="stat-card__value">${STATS.resolutionRate}%</div>
        <div class="stat-card__label">Resolution Rate</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__header">
          <div class="stat-card__icon purple">${ICONS.clock}</div>
        </div>
        <div class="stat-card__value">${STATS.avgResolutionTime}</div>
        <div class="stat-card__label">Avg Resolution Time</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__header">
          <div class="stat-card__icon blue">${ICONS.brain}</div>
        </div>
        <div class="stat-card__value">47</div>
        <div class="stat-card__label">RL Feedback Cycles</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__header">
          <div class="stat-card__icon orange">${ICONS.lock}</div>
        </div>
        <div class="stat-card__value">99.2%</div>
        <div class="stat-card__label">Anti-Fraud Accuracy</div>
      </div>
    </div>

    <div class="content-grid">
      <!-- Resolution Volume Chart -->
      <div class="card">
        <div class="card__header">
          <span class="card__title">Monthly Resolution Volume</span>
        </div>
        <div class="card__body">
          <div class="chart-area">
            ${MOCK_CHART_DATA.map(val => `
              <div class="chart-bar" data-height="${val * 2}px" style="height:4px;"></div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Score Distribution -->
      <div class="card">
        <div class="card__header">
          <span class="card__title">Score Distribution</span>
        </div>
        <div class="card__body">
          <div style="display:flex;flex-direction:column;gap:14px;">
            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                <span style="font-size:0.82rem;">Auto-Resolved (≥ 80)</span>
                <span style="font-size:0.82rem;font-weight:700;color:var(--cx-success);">68%</span>
              </div>
              <div class="score-bar__track" style="height:10px;border-radius:5px;">
                <div class="score-bar__fill high" data-width="68%" style="width:0%;height:100%;border-radius:5px;"></div>
              </div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                <span style="font-size:0.82rem;">Human Review (50–79)</span>
                <span style="font-size:0.82rem;font-weight:700;color:var(--cx-warning);">22%</span>
              </div>
              <div class="score-bar__track" style="height:10px;border-radius:5px;">
                <div class="score-bar__fill mid" data-width="22%" style="width:0%;height:100%;border-radius:5px;"></div>
              </div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                <span style="font-size:0.82rem;">Fraud Rejected (< 50)</span>
                <span style="font-size:0.82rem;font-weight:700;color:var(--cx-danger);">10%</span>
              </div>
              <div class="score-bar__track" style="height:10px;border-radius:5px;">
                <div class="score-bar__fill low" data-width="10%" style="width:0%;height:100%;border-radius:5px;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Explainability Framework -->
    <div class="card" style="margin-top:18px;" id="card-explainability">
      <div class="card__header">
        <span class="card__title">${ICONS.brain} Explainability Framework</span>
        <span style="font-size:0.72rem;color:var(--cx-text-muted);">Audit table reference</span>
      </div>
      <div class="card__body">
        <p style="font-size:0.85rem;color:var(--cx-text-secondary);margin-bottom:16px;">
          Every decision returns: rationale, policy references, confidence score, fraud assessment, evidence summary, resolution justification, human-override recommendation, and execution log.
        </p>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;">
          ${['Rationale', 'Policy Refs', 'Confidence', 'Fraud Assessment', 'Evidence Summary', 'Resolution', 'Override Rec.', 'Exec Log'].map(field => `
            <div style="padding:10px 14px;background:var(--cx-bg-input);border-radius:var(--cx-radius-sm);border:1px solid var(--cx-border);font-size:0.8rem;font-weight:600;text-align:center;">
              ${field}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
