/**
 * Enterprise CX Platform — Agent Monitor Page
 */
import { MOCK_AGENTS } from '../../utils/data.js';
import { ICONS } from '../../utils/icons.js';

const AGENT_DESCRIPTIONS = {
  1:  'Intent classification, sentiment analysis, emotion detection, multilingual support. First point of contact.',
  2:  '★ NOVEL — Gallery BLOCKED. Forces camera-only live capture. WebRTC camera control, auto-capture on detection trigger.',
  3:  '★ NOVEL — 3-layer video intelligence: Hand+Object (MediaPipe) → Product Identity (YOLO) → Damage Region (OpenCV). ALL 3 must pass.',
  4:  '★ NOVEL — Dynamic physical challenges: LED pen, 360° rotation, shadow/light test, random 4-digit session code. Defeats screen-replay AI attacks.',
  5:  'OCR text extraction, document structure parsing, multimodal analysis, cross-reference with Order DB. Processes Pipeline B uploads.',
  6:  'RAG with enterprise knowledge bases, policy versioning, conflict detection, regulatory compliance. Feeds all agents via shared vector store.',
  7:  'Pattern recognition, behavioral analysis, risk scoring, anomaly detection. Uses Pipeline A & B signals.',
  8:  '★ NOVEL — Isolated pipeline merge: CV score + document score + fraud score → single 0-100 confidence. Routes: ≥80 auto, 50-79 human, <50 fraud.',
  9:  'Decision optimization, personalized negotiation, multi-criteria outcome selection for >80% band cases.',
  10: 'API orchestration for refunds, replacements, inventory updates, coupon issuance. Executes resolution for auto-resolved cases.',
  11: 'Priority routing to human reviewers for 50-79 band. Context preservation, approval gating — no bypass allowed.',
  12: '★ NOVEL — Shared vector memory across all 13 agents. Indexes policies, injects case context, persists resolved case knowledge.',
  13: 'Reinforcement learning from historical outcomes and human corrections. Updates Score Evaluation thresholds asynchronously.',
};

export function renderAgents() {
  const onlineCount = MOCK_AGENTS.filter(a => a.status === 'online').length;

  return `
    <div class="page-header">
      <div class="page-header__left">
        <h1>13-Agent Orchestration Monitor</h1>
        <p>${onlineCount} agents online · ${13 - onlineCount} idle · Anti-Fabrication + Isolated Dual Pipeline active</p>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-secondary btn-sm" onclick="cxNavigate('evidence')" id="btn-view-evidence">📷 Evidence Pipelines</button>
        <button class="btn btn-primary btn-sm" onclick="cxNavigate('analytics')" id="btn-view-analytics">📊 Analytics</button>
      </div>
    </div>

    <!-- Orchestration Flow -->
    <div class="card" style="margin-bottom:18px;" id="card-pipeline-flow">
      <div class="card__header">
        <span class="card__title">Agent Orchestration Flow</span>
        <span style="font-size:0.72rem;color:var(--cx-text-muted);">Per README §2.3 — live processing flow</span>
      </div>
      <div class="card__body">
        <div class="pipeline-flow">
          <div class="pipeline-node complete">
            <div class="pipeline-node__icon">${ICONS.users}</div>
            <div class="pipeline-node__label">Customer<br>Interaction<br><small>#1</small></div>
          </div>
          <div class="pipeline-arrow">${ICONS.arrowRight}</div>
          <div class="pipeline-node active">
            <div class="pipeline-node__icon">${ICONS.camera}</div>
            <div class="pipeline-node__label">Evidence<br>Capture<br><small>#2 ★</small></div>
          </div>
          <div class="pipeline-arrow">${ICONS.arrowRight}</div>
          <div class="pipeline-node" style="border-color:var(--cx-info);">
            <div class="pipeline-node__icon">${ICONS.eye}</div>
            <div class="pipeline-node__label">CV Object<br>Detection<br><small>#3 ★</small></div>
          </div>
          <div class="pipeline-arrow">${ICONS.arrowRight}</div>
          <div class="pipeline-node">
            <div class="pipeline-node__icon">${ICONS.shield}</div>
            <div class="pipeline-node__label">Anti-Fraud<br>Challenge<br><small>#4 ★</small></div>
          </div>
          <div class="pipeline-arrow">${ICONS.arrowRight}</div>
          <div class="pipeline-node">
            <div class="pipeline-node__icon">${ICONS.doc}</div>
            <div class="pipeline-node__label">Evidence<br>Verify<br><small>#5</small></div>
          </div>
          <div class="pipeline-arrow">${ICONS.arrowRight}</div>
          <div class="pipeline-node">
            <div class="pipeline-node__icon">${ICONS.target}</div>
            <div class="pipeline-node__label">Score<br>Evaluation<br><small>#8 ★</small></div>
          </div>
          <div class="pipeline-arrow">${ICONS.arrowRight}</div>
          <div class="pipeline-node">
            <div class="pipeline-node__icon">${ICONS.lightning}</div>
            <div class="pipeline-node__label">Workflow<br>Execution<br><small>#10</small></div>
          </div>
        </div>

        <div style="margin-top:14px;padding:12px 16px;background:var(--cx-bg-input);border-radius:var(--cx-radius-md);border:1px solid var(--cx-border);font-size:0.8rem;color:var(--cx-text-secondary);">
          <strong>Parallel Processing (via Agent #12 Shared Memory):</strong>
          Agent #6 Policy Intelligence · Agent #7 Fraud Detection · Agent #9 Resolution Strategy run concurrently while evidence pipelines execute.
          Agent #11 Escalation handles 50–79 band. Agent #13 Learning updates thresholds after every resolved case.
        </div>
      </div>
    </div>

    <!-- Novel Features Banner -->
    <div style="margin-bottom:18px;padding:14px 18px;background:linear-gradient(135deg,#1e1b4b,#312e81);border-radius:var(--cx-radius-md);color:#fff;">
      <div style="font-size:0.78rem;font-weight:700;color:#a5b4fc;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.05em;">★ Novel Agents — Core Differentiators (per README §3)</div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:0.82rem;color:#cbd5e1;">
        <span>📷 #2 — Gallery Blocked, Camera-Only Gate</span>
        <span>👁️ #3 — 3-Layer CV Intelligence (MediaPipe+YOLO+OpenCV)</span>
        <span>🛡️ #4 — Dynamic Physical Anti-Fraud Challenges</span>
        <span>⚖️ #8 — Isolated Dual-Pipeline Score Merge</span>
        <span>🧠 #12 — Shared Vector Memory / RAG Across All Agents</span>
      </div>
    </div>

    <!-- Agent Cards Grid -->
    <div class="agent-grid" id="agent-grid">
      ${MOCK_AGENTS.map(agent => `
        <div class="agent-card" id="agent-card-${agent.id}">
          <div class="agent-card__header">
            <span class="agent-card__name">
              ${agent.novel ? '★ ' : ''}Agent #${agent.id} — ${agent.name}
            </span>
            <div class="agent-card__status ${agent.status}"></div>
          </div>
          <div style="font-size:0.72rem;color:var(--cx-text-muted);margin-bottom:8px;">
            ${agent.novel ? '⭐ Novel Agent · ' : ''}Status: <strong>${agent.status}</strong>
          </div>
          <div style="font-size:0.75rem;color:var(--cx-text-secondary);margin-bottom:10px;line-height:1.5;">
            ${AGENT_DESCRIPTIONS[agent.id]}
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
