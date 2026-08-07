import { MOCK_AGENTS } from '../utils/data.js';
import { ICONS } from '../utils/icons.js';

export function renderAgents() {
  const onlineCount = MOCK_AGENTS.filter(a => a.status === 'online').length;

  return `
    <div class="page-header">
      <div class="page-header__left">
        <h1>Agent Monitor</h1>
        <p>All 13 agents — ${onlineCount} online, ${13 - onlineCount} idle</p>
      </div>
    </div>

    <!-- Pipeline Flow Visualization -->
    <div class="card" style="margin-bottom:18px;" id="card-pipeline-flow">
      <div class="card__header">
        <span class="card__title">Orchestration Pipeline</span>
        <span style="font-size:0.72rem;color:var(--cx-text-muted);">Live processing flow</span>
      </div>
      <div class="card__body">
        <div class="pipeline-flow">
          <div class="pipeline-node complete">
            <div class="pipeline-node__icon">${ICONS.users}</div>
            <div class="pipeline-node__label">Customer<br>Interaction</div>
          </div>
          <div class="pipeline-arrow">${ICONS.arrowRight}</div>
          <div class="pipeline-node active">
            <div class="pipeline-node__icon">${ICONS.camera}</div>
            <div class="pipeline-node__label">Evidence<br>Capture</div>
          </div>
          <div class="pipeline-arrow">${ICONS.arrowRight}</div>
          <div class="pipeline-node" style="border-color:var(--cx-info);">
            <div class="pipeline-node__icon">${ICONS.eye}</div>
            <div class="pipeline-node__label">CV Object<br>Detection</div>
          </div>
          <div class="pipeline-arrow">${ICONS.arrowRight}</div>
          <div class="pipeline-node">
            <div class="pipeline-node__icon">${ICONS.shield}</div>
            <div class="pipeline-node__label">Anti-Fraud<br>Challenge</div>
          </div>
          <div class="pipeline-arrow">${ICONS.arrowRight}</div>
          <div class="pipeline-node">
            <div class="pipeline-node__icon">${ICONS.doc}</div>
            <div class="pipeline-node__label">Evidence<br>Verify</div>
          </div>
          <div class="pipeline-arrow">${ICONS.arrowRight}</div>
          <div class="pipeline-node">
            <div class="pipeline-node__icon">${ICONS.target}</div>
            <div class="pipeline-node__label">Score<br>Evaluation</div>
          </div>
          <div class="pipeline-arrow">${ICONS.arrowRight}</div>
          <div class="pipeline-node">
            <div class="pipeline-node__icon">${ICONS.lightning}</div>
            <div class="pipeline-node__label">Workflow<br>Execution</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Agent Cards Grid -->
    <div class="agent-grid" id="agent-grid">
      ${MOCK_AGENTS.map(agent => `
        <div class="agent-card" id="agent-card-${agent.id}">
          <div class="agent-card__header">
            <span class="agent-card__name">
              ${agent.novel ? '✦ ' : ''}${agent.name}
            </span>
            <div class="agent-card__status ${agent.status}"></div>
          </div>
          <div style="font-size:0.72rem;color:var(--cx-text-muted);margin-bottom:8px;">
            Agent #${agent.id} ${agent.novel ? '· Novel' : ''}
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
            <span class="agent-card__metric">Tasks: <strong style="color:var(--cx-text-primary)">${agent.tasks}</strong></span>
            <span class="agent-card__metric">Avg: <strong style="color:var(--cx-text-primary)">${agent.avgTime}</strong></span>
          </div>
          <div class="score-bar" style="margin-top:4px;">
            <div class="score-bar__track">
              <div class="score-bar__fill ${agent.accuracy >= 95 ? 'high' : agent.accuracy >= 90 ? 'mid' : 'low'}"
                   data-width="${agent.accuracy}%" style="width:0%"></div>
            </div>
            <span class="score-bar__value" style="font-size:0.72rem;">${agent.accuracy}%</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
