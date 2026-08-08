/**
 * Enterprise CX Platform — Claims Management Page
 */
import { MOCK_CLAIMS } from '../../utils/data.js';
import { showModal } from '../../utils/modal.js';


const ISSUE_TYPES = [
  'Customer Complaint', 'Order Dispute', 'Refund Request', 'Warranty Claim',
  'Delivery Issue', 'Subscription Cancellation', 'Service Escalation',
  'Product Return', 'Billing Dispute',
];

export function renderClaims() {
  const isAdmin = window.cxCurrentRole === 'admin';

  return `
    <div class="page-header">
      <div class="page-header__left">
        <h1>${isAdmin ? 'Claims Management' : 'My Claims & Cases'}</h1>
        <p>${isAdmin
          ? 'All platform claims — filtered by status, score, and routing band'
          : 'Your submitted disputes and their current AI processing status'}</p>
      </div>
      <div style="display:flex;gap:8px;">
        ${isAdmin ? `
          <button class="btn btn-secondary" onclick="cxNavigate('analytics')" id="btn-analytics-link">📊 Analytics</button>
        ` : `
          <button class="btn btn-secondary" onclick="cxNavigate('evidence')" id="btn-evidence-link">📷 Add Evidence</button>
        `}
        <button class="btn btn-primary" id="btn-new-claim-page"
          onclick="document.getElementById('claims-new-modal').style.display='flex'">
          + New Claim
        </button>
      </div>
    </div>

    <!-- Filter Bar -->
    <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;align-items:center;">
      <span style="font-size:0.8rem;font-weight:600;color:#64748b;">Filter:</span>
      <button class="btn btn-secondary btn-sm" style="border-color:var(--cx-accent);color:var(--cx-accent);" id="filter-all">All</button>
      <button class="btn btn-secondary btn-sm" id="filter-processing">Processing</button>
      <button class="btn btn-secondary btn-sm" id="filter-in-review">In Review (50–79)</button>
      <button class="btn btn-secondary btn-sm" id="filter-resolved">Auto-Resolved</button>
      <button class="btn btn-secondary btn-sm" id="filter-rejected">Fraud Rejected</button>
    </div>

    <!-- Claims Table -->
    <div class="card" id="card-all-claims">
      <div class="card__body" style="padding:0;">
        <table class="claim-table">
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Customer</th>
              <th>Issue Type</th>
              <th>Order</th>
              <th>AI Score</th>
              <th>Routing Band</th>
              <th>Status</th>
              <th>Agent</th>
              <th>Submitted</th>
              ${isAdmin ? '<th style="text-align:right;">Action</th>' : ''}
            </tr>
          </thead>
          <tbody id="claims-tbody">
            <tr><td colspan="${isAdmin ? 10 : 9}" style="text-align:center; padding:20px; color:#64748b;">Loading claims...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <script>
      setTimeout(() => { if (window.cxLoadClaims) window.cxLoadClaims(); }, 100);
    </script>

    <!-- Score Routing Thresholds Info -->
    <div class="card" style="margin-top:18px;" id="card-thresholds">
      <div class="card__header">
        <span class="card__title">⚙️ Isolated Score Routing Thresholds</span>
        <span style="font-size:0.72rem;color:var(--cx-text-muted);font-family:var(--cx-font-mono);">core/config.py — SCORE_AUTO_RESOLVE_THRESHOLD = 80 · SCORE_HUMAN_REVIEW_THRESHOLD = 50</span>
      </div>
      <div class="card__body" style="display:flex;gap:14px;flex-wrap:wrap;">
        <div style="flex:1;min-width:180px;padding:14px 18px;background:var(--cx-success-bg);border-radius:var(--cx-radius-md);border:1px solid rgba(16,185,129,0.2);">
          <div style="font-size:1.4rem;font-weight:800;color:var(--cx-success);">Score ≥ 80</div>
          <div style="font-size:0.82rem;color:var(--cx-text-secondary);margin-top:4px;">
            ⚡ AI Auto-Resolves → Workflow Execution Agent (#10) → Refund / Replacement / Coupon / Shipping Label
          </div>
        </div>
        <div style="flex:1;min-width:180px;padding:14px 18px;background:var(--cx-warning-bg);border-radius:var(--cx-radius-md);border:1px solid rgba(245,158,11,0.2);">
          <div style="font-size:1.4rem;font-weight:800;color:var(--cx-warning);">Score 50–79</div>
          <div style="font-size:0.82rem;color:var(--cx-text-secondary);margin-top:4px;">
            ⚖️ Escalation Agent (#11) → Human Review Required · No bypass allowed (enforced at DB constraint level)
          </div>
        </div>
        <div style="flex:1;min-width:180px;padding:14px 18px;background:var(--cx-danger-bg);border-radius:var(--cx-radius-md);border:1px solid rgba(239,68,68,0.2);">
          <div style="font-size:1.4rem;font-weight:800;color:var(--cx-danger);">Score &lt; 50</div>
          <div style="font-size:0.82rem;color:var(--cx-text-secondary);margin-top:4px;">
            🚫 Flagged as Fraudulent → Customer Notification → Case Closed with Audit Log + Explainability Report
          </div>
        </div>
      </div>
    </div>

    <!-- New Claim Modal -->
    <div id="claims-new-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;align-items:center;justify-content:center;">
      <div style="background:#fff;border-radius:20px;padding:28px;width:100%;max-width:480px;box-shadow:0 25px 50px rgba(0,0,0,0.15);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
          <h2 style="font-size:1.1rem;font-weight:700;color:#0f172a;">Submit New Dispute</h2>
          <button onclick="document.getElementById('claims-new-modal').style.display='none'" style="background:none;border:none;font-size:1.4rem;cursor:pointer;color:#64748b;">✕</button>
        </div>
        <form onsubmit="cxSubmitNewClaim(event)" style="display:flex;flex-direction:column;gap:14px;">
          <div>
            <label style="font-size:0.82rem;font-weight:700;color:#334155;display:block;margin-bottom:5px;">Issue Type (9 supported categories)</label>
            <select id="new-claim-type" required style="width:100%;padding:10px 12px;border-radius:10px;border:1px solid #cbd5e1;font-size:0.88rem;outline:none;">
              ${ISSUE_TYPES.map(t => `<option>${t}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="font-size:0.82rem;font-weight:700;color:#334155;display:block;margin-bottom:5px;">Order / Reference ID</label>
            <input type="text" id="new-claim-order" placeholder="e.g. ORD-91823" required
              style="width:100%;padding:10px 12px;border-radius:10px;border:1px solid #cbd5e1;font-size:0.88rem;outline:none;" />
          </div>
          <div>
            <label style="font-size:0.82rem;font-weight:700;color:#334155;display:block;margin-bottom:5px;">Description</label>
            <textarea id="new-claim-desc" required placeholder="Describe your issue in detail..."
              style="width:100%;padding:10px 12px;border-radius:10px;border:1px solid #cbd5e1;font-size:0.88rem;outline:none;resize:vertical;min-height:80px;"></textarea>
          </div>
          <div style="font-size:0.78rem;color:#64748b;background:#f8fafc;padding:10px;border-radius:8px;border:1px solid #e2e8f0;">
            📷 After submission, you will be directed to the Evidence Capture Gate (Pipeline A — camera-only, gallery blocked)
            or Pipeline B (sandboxed document upload) based on your claim type.
          </div>
          <div style="display:flex;gap:10px;">
            <button type="button"
              onclick="document.getElementById('claims-new-modal').style.display='none'"
              style="flex:1;padding:12px;background:#f1f5f9;color:#475569;border:1px solid #e2e8f0;border-radius:10px;font-weight:600;font-size:0.88rem;cursor:pointer;">
              Cancel
            </button>
            <button type="submit"
              style="flex:2;padding:12px;background:linear-gradient(135deg,#4f46e5,#6366f1);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:0.88rem;cursor:pointer;">
              Submit Dispute →
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

window.cxSubmitNewClaim = function(event) {
  event.preventDefault();
  const type = document.getElementById('new-claim-type')?.value || 'Order Dispute';
  const order = document.getElementById('new-claim-order')?.value || 'ORD-99999';
  document.getElementById('claims-new-modal').style.display = 'none';
  const claimId = `CLM-${Math.floor(2848 + Math.random() * 100)}`;
  showModal({
    title: 'Dispute Submitted!',
    icon: '✅',
    type: 'success',
    body: 'Your claim is now being processed by the AI pipeline.',
    lines: [
      `📋 Claim ID: ${claimId}`,
      `📦 Type: ${type}`,
      `🏷️ Order: ${order}`,
      '🤖 Customer Interaction Agent (#1) is classifying your intent',
      '📷 Redirecting to Evidence Capture Gate...',
    ],
    confirmText: 'Continue to Evidence',
    onConfirm: () => { if (window.cxNavigate) window.cxNavigate('evidence'); },
  });
};

window.cxLoadClaims = async function() {
  const tbody = document.getElementById('claims-tbody');
  if (!tbody) return;
  const isAdmin = window.cxCurrentRole === 'admin';
  
  if (!window.supabase) {
    tbody.innerHTML = \`<tr><td colspan="\${isAdmin ? 10 : 9}" style="text-align:center; padding:20px; color:#dc2626;">Supabase client not initialized.</td></tr>\`;
    return;
  }

  try {
    const { data: userResp } = await window.supabase.auth.getUser();
    const user = userResp?.user;
    
    let query = window.supabase.from('user_history').select('*').order('created_at', { ascending: false });
    
    // If not admin, only fetch their own claims
    if (!isAdmin && user) {
      query = query.eq('user_id', user.id);
    }
    
    const { data: claims, error } = await query;

    if (error) throw error;

    if (claims && claims.length > 0) {
      tbody.innerHTML = claims.map(c => {
        const score = c.ai_score || 0;
        return \`
        <tr>
          <td style="font-family:var(--cx-font-mono);font-weight:700;font-size:0.82rem;color:#4f46e5;">\${c.claim_id}</td>
          <td style="font-weight:500;">\${c.user_id ? c.user_id.substring(0,8)+'...' : 'Unknown'}</td>
          <td style="color:var(--cx-text-secondary);">\${c.issue_type}</td>
          <td style="font-family:var(--cx-font-mono);font-size:0.78rem;color:var(--cx-text-muted);">\${c.description ? c.description.substring(0, 15)+'...' : 'N/A'}</td>
          <td>
            <div class="score-bar">
              <div class="score-bar__track">
                <div class="score-bar__fill \${score >= 80 ? 'high' : score >= 50 ? 'mid' : 'low'}"
                     style="width:\${score}%"></div>
              </div>
              <span class="score-bar__value">\${score}%</span>
            </div>
          </td>
          <td>
            <span style="font-size:0.72rem;font-weight:700;padding:2px 8px;border-radius:10px;
              background:\${score >= 80 ? '#dcfce7' : score >= 50 ? '#fef3c7' : '#fee2e2'};
              color:\${score >= 80 ? '#15803d' : score >= 50 ? '#b45309' : '#dc2626'};">
              \${score >= 80 ? '⚡ Auto-Resolve' : score >= 50 ? '⚖️ Human Review' : '🚫 Fraud Reject'}
            </span>
          </td>
          <td><span class="badge-status \${c.status === 'Reject' ? 'rejected' : 'resolved'}">\${c.status.replace('-', ' ')}</span></td>
          <td style="font-size:0.82rem;">Agent #10</td>
          <td style="font-size:0.78rem;color:var(--cx-text-muted);">\${new Date(c.created_at).toLocaleDateString()}</td>
          \${isAdmin ? \`
            <td style="text-align:right;">
              \${score >= 50 && score < 80
                ? \`<div style="display:flex;gap:4px;justify-content:flex-end;">
                     <button style="background:#22c55e;color:#fff;border:none;padding:4px 8px;border-radius:6px;font-size:0.72rem;font-weight:700;cursor:pointer;">✓</button>
                     <button style="background:#ef4444;color:#fff;border:none;padding:4px 8px;border-radius:6px;font-size:0.72rem;font-weight:700;cursor:pointer;">✕</button>
                   </div>\`
                : \`<span style="font-size:0.72rem;color:var(--cx-text-muted);">—</span>\`
              }
            </td>\` : ''}
        </tr>
      \`}).join('');
    } else {
      tbody.innerHTML = \`<tr><td colspan="\${isAdmin ? 10 : 9}" style="text-align:center; padding:20px; color:#64748b;">No claims found.</td></tr>\`;
    }
  } catch (err) {
    tbody.innerHTML = \`<tr><td colspan="\${isAdmin ? 10 : 9}" style="text-align:center; padding:20px; color:#dc2626;">Error loading claims: \${err.message}</td></tr>\`;
  }
};
