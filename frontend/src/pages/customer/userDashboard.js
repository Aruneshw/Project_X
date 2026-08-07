/**
 * Enterprise CX Platform — User / Customer Dashboard
 */
import { MOCK_CLAIMS, MOCK_ACTIVITY } from '../../utils/data.js';
import { showModal } from '../../utils/modal.js';


const ISSUE_TYPES = [
  { icon: '💬', label: 'Customer Complaint',        desc: 'Report a service or product complaint' },
  { icon: '⚖️', label: 'Order Dispute',             desc: 'Wrong item, missing parts, incorrect order' },
  { icon: '💰', label: 'Refund Request',             desc: 'Request a full or partial refund' },
  { icon: '🛡️', label: 'Warranty Claim',            desc: 'Claim a repair or replacement under warranty' },
  { icon: '🚚', label: 'Delivery Issue',             desc: 'Late, lost, or damaged during shipping' },
  { icon: '❌', label: 'Subscription Cancellation', desc: 'Cancel or pause an active subscription' },
  { icon: '📣', label: 'Service Escalation',        desc: 'Escalate unresolved or critical issues' },
  { icon: '🔄', label: 'Product Return',            desc: 'Initiate a return or exchange' },
  { icon: '🧾', label: 'Billing Dispute',           desc: 'Dispute an incorrect charge or invoice' },
];

export function renderUserDashboard() {
  const activeClaim = MOCK_CLAIMS.find(c => c.status === 'processing') || MOCK_CLAIMS[0];
  const myClaims = MOCK_CLAIMS.slice(0, 5);

  return `
    <div>
      <!-- Welcome Header -->
      <div class="page-header" style="background:linear-gradient(135deg,#ffffff,#f8fafc);padding:20px 24px;border-radius:20px;border:1px solid #e2e8f0;margin-bottom:20px;">
        <div class="page-header__left">
          <span style="font-size:0.75rem;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:0.05em;">Customer Resolution Hub</span>
          <h1 style="margin-top:4px;font-size:1.6rem;font-weight:700;color:#0f172a;">
            Welcome back, ${window.cxCurrentUser || 'Praveen'} 👋
          </h1>
          <p style="color:#64748b;font-size:0.88rem;margin-top:2px;">
            Submit a dispute, track your active cases, or upload live evidence via our dual-pipeline system.
          </p>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="btn btn-secondary" onclick="cxNavigate('evidence')" id="btn-open-camera">
            📷 Open Camera Gate
          </button>
          <button class="btn btn-primary" onclick="document.getElementById('new-claim-modal').style.display='flex'" id="btn-submit-dispute">
            + Submit New Dispute
          </button>
        </div>
      </div>

      <!-- Active Claim Progress Banner -->
      <div style="background:linear-gradient(135deg,#1e1b4b,#312e81);border-radius:20px;padding:20px 24px;color:#fff;margin-bottom:20px;box-shadow:0 10px 25px rgba(30,27,75,0.2);">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;flex-wrap:wrap;gap:10px;">
          <div>
            <span style="background:rgba(99,102,241,0.3);color:#c7d2fe;font-size:0.72rem;font-weight:700;padding:3px 10px;border-radius:12px;">
              ACTIVE DISPUTE — ${activeClaim.id}
            </span>
            <h2 style="font-size:1.2rem;font-weight:700;margin-top:8px;color:#fff;">${activeClaim.type} — ${activeClaim.customer}</h2>
          </div>
          <span style="background:${activeClaim.score >= 80 ? '#22c55e' : activeClaim.score >= 50 ? '#f59e0b' : '#ef4444'};color:#fff;font-size:0.78rem;font-weight:700;padding:5px 14px;border-radius:20px;">
            ${activeClaim.score >= 80 ? '⚡ Auto-Resolving (>80%)' : activeClaim.score >= 50 ? '⚖️ Human Review (50–80%)' : '🚫 Under Review (<50%)'}
          </span>
        </div>
        <div style="margin-bottom:14px;">
          <div style="display:flex;justify-content:space-between;font-size:0.8rem;color:#a5b4fc;margin-bottom:6px;">
            <span>AI Score: ${activeClaim.score}% — Current Agent: ${activeClaim.agent}</span>
            <span>Order ${activeClaim.order}</span>
          </div>
          <div style="height:7px;background:rgba(255,255,255,0.15);border-radius:4px;overflow:hidden;">
            <div style="width:${activeClaim.score}%;height:100%;background:linear-gradient(90deg,#6366f1,${activeClaim.score >= 80 ? '#22c55e' : '#f59e0b'});border-radius:4px;transition:width 1s ease;"></div>
          </div>
        </div>
        <div style="display:flex;gap:20px;flex-wrap:wrap;font-size:0.82rem;color:#cbd5e1;">
          <span><strong>Status:</strong> ${activeClaim.status.replace('-',' ')}</span>
          <span><strong>Submitted:</strong> ${activeClaim.created}</span>
          <span><strong>Pipeline:</strong> Camera-Only (A) + Documents (B)</span>
        </div>
      </div>

      <!-- 9 Issue Types Grid -->
      <div style="margin-bottom:20px;">
        <div style="font-size:0.82rem;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;">
          Supported Issue Types — Select to Submit a New Dispute
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;">
          ${ISSUE_TYPES.map((t, i) => `
            <div id="issue-type-${i}"
              onclick="cxSelectIssueType('${t.label}')"
              style="background:#fff;padding:14px 16px;border-radius:14px;border:1px solid #e2e8f0;cursor:pointer;transition:all 0.18s ease;"
              onmouseover="this.style.borderColor='#6366f1';this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 12px rgba(99,102,241,0.12)'"
              onmouseout="this.style.borderColor='#e2e8f0';this.style.transform='none';this.style.boxShadow='none'">
              <div style="font-size:1.4rem;margin-bottom:8px;">${t.icon}</div>
              <div style="font-weight:700;font-size:0.85rem;color:#0f172a;margin-bottom:3px;">${t.label}</div>
              <div style="font-size:0.75rem;color:#64748b;">${t.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Evidence Pipelines Quick Access -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px;">
        <div onclick="cxNavigate('evidence')" style="background:#fff;border-radius:16px;border:1px solid #e2e8f0;padding:18px;cursor:pointer;transition:all 0.18s ease;" onmouseover="this.style.borderColor='#6366f1';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='#e2e8f0';this.style.transform='none'">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
            <span style="width:38px;height:38px;border-radius:10px;background:#e0e7ff;color:#4f46e5;display:flex;align-items:center;justify-content:center;font-size:18px;">📷</span>
            <div>
              <div style="font-weight:700;font-size:0.9rem;color:#0f172a;">Pipeline A — Camera Only</div>
              <div style="font-size:0.75rem;color:#dc2626;font-weight:600;">Gallery Upload BLOCKED</div>
            </div>
          </div>
          <p style="font-size:0.8rem;color:#64748b;margin:0;">Live camera capture for visual evidence. Anti-fabrication gate enforced — forces real-time 3-layer OpenCV + YOLO + MediaPipe analysis.</p>
          <div style="margin-top:10px;font-size:0.75rem;font-weight:700;color:#6366f1;">Open Camera Gate →</div>
        </div>

        <div onclick="cxNavigate('evidence')" style="background:#fff;border-radius:16px;border:1px solid #e2e8f0;padding:18px;cursor:pointer;transition:all 0.18s ease;" onmouseover="this.style.borderColor='#10b981';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='#e2e8f0';this.style.transform='none'">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
            <span style="width:38px;height:38px;border-radius:10px;background:#d1fae5;color:#059669;display:flex;align-items:center;justify-content:center;font-size:18px;">📄</span>
            <div>
              <div style="font-weight:700;font-size:0.9rem;color:#0f172a;">Pipeline B — Documents</div>
              <div style="font-size:0.75rem;color:#059669;font-weight:600;">Sandboxed File Picker</div>
            </div>
          </div>
          <p style="font-size:0.8rem;color:#64748b;margin:0;">Upload invoices, receipts, shipping labels, warranty cards. Sandboxed OCR + document parsing runs in isolation from Pipeline A.</p>
          <div style="margin-top:10px;font-size:0.75rem;font-weight:700;color:#10b981;">Upload Documents →</div>
        </div>
      </div>

      <!-- My Recent Claims -->
      <div class="card" id="user-claims-card">
        <div class="card__header">
          <span class="card__title">My Recent Claims</span>
          <button class="btn btn-secondary btn-sm" onclick="cxNavigate('claims')" id="btn-view-all-claims">View All →</button>
        </div>
        <div class="card__body" style="padding:0;">
          <table class="claim-table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Issue Type</th>
                <th>Order</th>
                <th>AI Score</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              ${myClaims.map(c => `
                <tr>
                  <td style="font-family:var(--cx-font-mono);font-weight:700;font-size:0.82rem;color:#4f46e5;">${c.id}</td>
                  <td style="font-weight:500;">${c.type}</td>
                  <td style="font-family:var(--cx-font-mono);font-size:0.78rem;color:var(--cx-text-muted);">${c.order}</td>
                  <td>
                    <div class="score-bar">
                      <div class="score-bar__track">
                        <div class="score-bar__fill ${c.score >= 80 ? 'high' : c.score >= 50 ? 'mid' : 'low'}" data-width="${c.score}%" style="width:0%"></div>
                      </div>
                      <span class="score-bar__value">${c.score}</span>
                    </div>
                  </td>
                  <td><span class="badge-status ${c.status}">${c.status.replace('-', ' ')}</span></td>
                  <td style="font-size:0.8rem;color:var(--cx-text-muted);">${c.created}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recent Activity Feed -->
      <div class="card" style="margin-top:16px;" id="user-activity-card">
        <div class="card__header">
          <span class="card__title">Case Activity Feed</span>
          <span style="font-size:0.75rem;color:var(--cx-text-muted);">Live updates from AI agents</span>
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

    <!-- New Claim Modal -->
    <div id="new-claim-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;align-items:center;justify-content:center;">
      <div style="background:#fff;border-radius:20px;padding:28px;width:100%;max-width:480px;box-shadow:0 25px 50px rgba(0,0,0,0.15);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
          <h2 style="font-size:1.15rem;font-weight:700;color:#0f172a;">Submit New Dispute</h2>
          <button onclick="document.getElementById('new-claim-modal').style.display='none'" style="background:none;border:none;font-size:1.4rem;cursor:pointer;color:#64748b;">✕</button>
        </div>
        <form onsubmit="cxSubmitClaim(event)" style="display:flex;flex-direction:column;gap:14px;">
          <div>
            <label style="font-size:0.82rem;font-weight:700;color:#334155;display:block;margin-bottom:5px;">Issue Type</label>
            <select id="claim-type" required style="width:100%;padding:10px 12px;border-radius:10px;border:1px solid #cbd5e1;font-size:0.88rem;outline:none;">
              ${ISSUE_TYPES.map(t => `<option value="${t.label}">${t.icon} ${t.label}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="font-size:0.82rem;font-weight:700;color:#334155;display:block;margin-bottom:5px;">Order ID</label>
            <input type="text" id="claim-order" placeholder="e.g. ORD-91823" required style="width:100%;padding:10px 12px;border-radius:10px;border:1px solid #cbd5e1;font-size:0.88rem;outline:none;" />
          </div>
          <div>
            <label style="font-size:0.82rem;font-weight:700;color:#334155;display:block;margin-bottom:5px;">Description</label>
            <textarea id="claim-desc" required placeholder="Describe your issue in detail..." style="width:100%;padding:10px 12px;border-radius:10px;border:1px solid #cbd5e1;font-size:0.88rem;outline:none;resize:vertical;min-height:80px;"></textarea>
          </div>
          <div style="display:flex;gap:10px;">
            <button type="button" onclick="cxNavigate('evidence')" style="flex:1;padding:12px;background:#e0e7ff;color:#4f46e5;border:none;border-radius:10px;font-weight:700;font-size:0.88rem;cursor:pointer;">
              📷 Add Camera Evidence
            </button>
            <button type="submit" id="btn-claim-submit" style="flex:1;padding:12px;background:linear-gradient(135deg,#4f46e5,#6366f1);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:0.88rem;cursor:pointer;">
              Submit Dispute
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

window.cxSelectIssueType = function(type) {
  const modal = document.getElementById('new-claim-modal');
  const sel = document.getElementById('claim-type');
  if (modal) modal.style.display = 'flex';
  if (sel) sel.value = type;
};

window.cxSubmitClaim = function(event) {
  event.preventDefault();
  const type = document.getElementById('claim-type')?.value || 'Order Dispute';
  const order = document.getElementById('claim-order')?.value || 'ORD-99999';
  document.getElementById('new-claim-modal').style.display = 'none';
  showModal({
    title: 'Dispute Submitted!',
    icon: '✅',
    type: 'success',
    body: 'Your claim is now being processed by the AI pipeline.',
    lines: [
      `📦 Type: ${type}`,
      `🏷️ Order: ${order}`,
      '🤖 Agent #1 (Customer Interaction) classifying your intent',
      '📷 Evidence capture via live camera will be prompted next',
    ],
    confirmText: 'Go to Evidence',
    onConfirm: () => { if (window.cxNavigate) window.cxNavigate('evidence'); },
  });
};
