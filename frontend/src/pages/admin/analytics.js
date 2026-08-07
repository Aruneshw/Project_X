/**
 * Enterprise CX Platform — Analytics & Insights Page
 */
import { ICONS } from '../../utils/icons.js';
import { MOCK_CHART_DATA, STATS } from '../../utils/data.js';

const EXPLAINABILITY_FIELDS = [
  { icon: '📋', name: 'Rationale',               desc: 'Why the AI made this decision' },
  { icon: '📜', name: 'Policy References',        desc: 'Which clauses were applied' },
  { icon: '📊', name: 'Confidence Score',         desc: '0–100 merged pipeline score' },
  { icon: '🛡️', name: 'Fraud Assessment',         desc: 'Risk level and signals detected' },
  { icon: '📷', name: 'Evidence Summary',         desc: 'Pipeline A + Pipeline B results' },
  { icon: '⚡', name: 'Resolution Justification', desc: 'Chosen outcome and alternatives' },
  { icon: '👤', name: 'Override Recommendation', desc: 'Human reviewer guidance' },
  { icon: '📝', name: 'Execution Log',            desc: 'Agent-by-agent decision trace' },
];

const INTEGRATIONS = [
  { icon: '👥', name: 'CRM',       desc: 'Customer data, history, interactions' },
  { icon: '🏭', name: 'ERP',       desc: 'Financial data, order management' },
  { icon: '💳', name: 'Payment',   desc: 'Refund processing, transaction verification' },
  { icon: '🏬', name: 'WMS',       desc: 'Warehouse management, returns logistics' },
  { icon: '📦', name: 'Inventory', desc: 'Stock levels, replacement availability' },
  { icon: '🚚', name: 'Shipping',  desc: 'Carrier APIs, tracking, delivery verification' },
  { icon: '📧', name: 'Email',     desc: 'Automated customer notifications' },
  { icon: '💬', name: 'WhatsApp',  desc: 'Multi-channel complaint intake' },
];

export function renderAnalytics() {
  return `
    <div class="page-header">
      <div class="page-header__left">
        <h1>Analytics & Platform Intelligence</h1>
        <p>Resolution metrics, RL feedback cycles, explainability audit, and enterprise integrations</p>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-secondary btn-sm" id="btn-export-csv">Export CSV</button>
        <button class="btn btn-primary btn-sm" id="btn-generate-report" onclick="alert('Full platform report generated.')">Generate Report</button>
      </div>
    </div>

    <!-- KPI Row -->
    <div class="stats-grid" style="margin-bottom:20px;">
      <div class="stat-card" id="kpi-resolution-rate">
        <div class="stat-card__header">
          <div class="stat-card__icon green">${ICONS.chart}</div>
          <span class="stat-card__trend up">Target: 80%+</span>
        </div>
        <div class="stat-card__value">${STATS.resolutionRate}%</div>
        <div class="stat-card__label">Auto-Resolution Rate</div>
      </div>
      <div class="stat-card" id="kpi-avg-time">
        <div class="stat-card__header">
          <div class="stat-card__icon purple">${ICONS.clock}</div>
          <span class="stat-card__trend up">Target: &lt;5m</span>
        </div>
        <div class="stat-card__value">${STATS.avgResolutionTime}</div>
        <div class="stat-card__label">Avg Resolution Time</div>
      </div>
      <div class="stat-card" id="kpi-rl-cycles">
        <div class="stat-card__header">
          <div class="stat-card__icon blue">${ICONS.brain}</div>
          <span class="stat-card__trend up">+3 today</span>
        </div>
        <div class="stat-card__value">47</div>
        <div class="stat-card__label">RL Feedback Cycles (Agent #13)</div>
      </div>
      <div class="stat-card" id="kpi-fraud-accuracy">
        <div class="stat-card__header">
          <div class="stat-card__icon orange">${ICONS.lock}</div>
          <span class="stat-card__trend up">Target: 90%+</span>
        </div>
        <div class="stat-card__value">99.2%</div>
        <div class="stat-card__label">Anti-Fraud Accuracy</div>
      </div>
    </div>

    <!-- Evaluation Metrics Grid -->
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;margin-bottom:20px;">
      ${[
        { label: 'Intent Recognition', value: '96.4%', target: 'Target: 95%+', color: '#16a34a' },
        { label: 'Fraud Precision',    value: '91.2%', target: 'Target: 90%+', color: '#16a34a' },
        { label: 'Fraud Recall',       value: '87.5%', target: 'Target: 85%+', color: '#16a34a' },
        { label: 'Decision Explain.',  value: '100%',  target: 'Mandatory',    color: '#16a34a' },
        { label: 'Policy Compliance',  value: '100%',  target: 'Required',     color: '#16a34a' },
        { label: 'CSAT Score',         value: '4.7/5', target: 'Target: 4.5+', color: '#16a34a' },
        { label: 'Uptime SLA',         value: '99.9%', target: 'Enterprise',   color: '#16a34a' },
        { label: 'API Response',       value: '<85ms', target: 'Target: <100ms', color: '#16a34a' },
      ].map(m => `
        <div style="background:#fff;padding:14px;border-radius:12px;border:1px solid #e2e8f0;">
          <div style="font-size:1.2rem;font-weight:800;color:${m.color};">${m.value}</div>
          <div style="font-size:0.8rem;font-weight:600;color:#0f172a;margin-top:2px;">${m.label}</div>
          <div style="font-size:0.72rem;color:#94a3b8;margin-top:2px;">${m.target}</div>
        </div>
      `).join('')}
    </div>

    <div class="content-grid">
      <div class="card" id="card-volume-chart">
        <div class="card__header">
          <span class="card__title">Monthly Resolution Volume (12 Months)</span>
        </div>
        <div class="card__body">
          <div class="chart-area">
            ${MOCK_CHART_DATA.map(val => `
              <div class="chart-bar" data-height="${val * 2}px" style="height:4px;"></div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="card" id="card-score-dist">
        <div class="card__header">
          <span class="card__title">Score Distribution by Routing Band</span>
        </div>
        <div class="card__body">
          <div style="display:flex;flex-direction:column;gap:14px;">
            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                <span style="font-size:0.82rem;font-weight:600;">⚡ Auto-Resolved (Score ≥ 80)</span>
                <span style="font-size:0.82rem;font-weight:700;color:var(--cx-success);">68%</span>
              </div>
              <div class="score-bar__track" style="height:10px;border-radius:5px;">
                <div class="score-bar__fill high" data-width="68%" style="width:0%;height:100%;border-radius:5px;"></div>
              </div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                <span style="font-size:0.82rem;font-weight:600;">⚖️ Human Review (Score 50–79)</span>
                <span style="font-size:0.82rem;font-weight:700;color:var(--cx-warning);">22%</span>
              </div>
              <div class="score-bar__track" style="height:10px;border-radius:5px;">
                <div class="score-bar__fill mid" data-width="22%" style="width:0%;height:100%;border-radius:5px;"></div>
              </div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                <span style="font-size:0.82rem;font-weight:600;">🚫 Fraud Rejected (Score &lt; 50)</span>
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

    <!-- Reinforcement Learning Insights -->
    <div class="card" style="margin-top:18px;" id="card-rl-insights">
      <div class="card__header">
        <span class="card__title">${ICONS.brain} Reinforcement Learning — Agent #13 Insights</span>
      </div>
      <div class="card__body">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;">
          <div style="padding:14px;background:var(--cx-bg-input);border-radius:var(--cx-radius-md);border:1px solid var(--cx-border);">
            <div style="font-size:0.85rem;font-weight:700;margin-bottom:6px;">📈 Policy Optimization</div>
            <div style="font-size:0.78rem;color:var(--cx-text-secondary);">Resolution scoring weights updated based on customer satisfaction. 47 RL cycles completed.</div>
          </div>
          <div style="padding:14px;background:var(--cx-bg-input);border-radius:var(--cx-radius-md);border:1px solid var(--cx-border);">
            <div style="font-size:0.85rem;font-weight:700;margin-bottom:6px;">🔄 Feedback Loop</div>
            <div style="font-size:0.78rem;color:var(--cx-text-secondary);">Human reviewer corrections from 50–79 band → Learning Agent → Score weight update.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Explainability Framework -->
    <div class="card" style="margin-top:18px;" id="card-explainability">
      <div class="card__header">
        <span class="card__title">${ICONS.brain} Explainability Framework — Mandatory for Every Decision</span>
      </div>
      <div class="card__body">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;">
          ${EXPLAINABILITY_FIELDS.map(f => `
            <div style="padding:12px 14px;background:var(--cx-bg-input);border-radius:var(--cx-radius-sm);border:1px solid var(--cx-border);">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                <span>${f.icon}</span>
                <span style="font-size:0.82rem;font-weight:700;">${f.name}</span>
              </div>
              <div style="font-size:0.72rem;color:var(--cx-text-muted);">${f.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Enterprise Integrations -->
    <div class="card" style="margin-top:18px;" id="card-integrations">
      <div class="card__header">
        <span class="card__title">🔗 Enterprise Tool Integrations</span>
      </div>
      <div class="card__body">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;">
          ${INTEGRATIONS.map(i => `
            <div style="padding:12px;border-radius:10px;background:var(--cx-bg-input);border:1px solid var(--cx-border);display:flex;align-items:flex-start;gap:8px;">
              <span style="font-size:1.2rem;">${i.icon}</span>
              <div>
                <div style="font-weight:700;font-size:0.82rem;">${i.name}</div>
                <div style="font-size:0.72rem;color:var(--cx-text-muted);">${i.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
