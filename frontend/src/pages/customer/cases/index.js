/**
 * Enterprise CX Platform — Customer Cases Page
 * Styled completely using the Board Cards visual system and ListContainer visual tokens.
 */
import { MOCK_CLAIMS } from '../../../utils/data.js';

export function renderCustomerCases() {
  const myClaims = MOCK_CLAIMS;

  return `
    <div class="customer-cases-wrapper" style="display:flex; flex-direction:column; gap:24px;">
      <!-- Pinned Header Card (Warm Green Board Card style) -->
      <div class="rc-card rc-card-green rc-card-green" style="padding:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <span style="font-size:0.75rem; font-weight:800; color:#1e293b; text-transform:uppercase; letter-spacing:0.08em;">Case Tracking</span>
            <h1 style="font-size:1.6rem; font-weight:800; color:#1e293b; margin:4px 0 0 0;">My Cases & Dispute History</h1>
            <p style="color:#1e293b; opacity:0.85; font-size:0.88rem; margin-top:2px;">Track real-time AI scoring, agent assignments, and resolution status for all your claims.</p>
          </div>
          <button class="btn btn-primary" onclick="cxNavigate('home')" style="border:2px solid #1e293b; box-shadow:3px 3px 0 #1e293b;">
            + File New Complaint
          </button>
        </div>
      </div>

      <!-- Main Cases List Card (ListContainer cream style with thick border) -->
      <div class="lc-card" style="padding:24px;">
        <div class="lc-card-header" style="font-size:1.2rem; font-weight:800; border-bottom:2px solid #1e293b; padding-bottom:12px; margin-bottom:16px;">
          📋 Active Disputes & Historical Log
        </div>
        
        <div style="overflow-x:auto;">
          <table class="claim-table" style="width:100%; border-collapse:separate; border-spacing:0;">
            <thead>
              <tr style="background:#f1f5f9;">
                <th style="border:2px solid #1e293b; border-right:none; border-radius:8px 0 0 8px; padding:12px; font-weight:800; color:#1e293b;">Case ID</th>
                <th style="border:2px solid #1e293b; border-right:none; padding:12px; font-weight:800; color:#1e293b;">Issue Type</th>
                <th style="border:2px solid #1e293b; border-right:none; padding:12px; font-weight:800; color:#1e293b;">Order Ref</th>
                <th style="border:2px solid #1e293b; border-right:none; padding:12px; font-weight:800; color:#1e293b;">AI Match Score</th>
                <th style="border:2px solid #1e293b; border-right:none; padding:12px; font-weight:800; color:#1e293b;">Current Status</th>
                <th style="border:2px solid #1e293b; border-right:none; padding:12px; font-weight:800; color:#1e293b;">Assigned Agent</th>
                <th style="border:2px solid #1e293b; border-radius:0 8px 8px 0; padding:12px; font-weight:800; color:#1e293b;">Submitted</th>
              </tr>
            </thead>
            <tbody>
              ${myClaims.map(c => `
                <tr style="transition:background 0.2s;">
                  <td style="padding:14px 12px; border-bottom:2px dashed #cbd5e1; font-family:monospace; font-weight:800; color:#4f46e5;">${c.id}</td>
                  <td style="padding:14px 12px; border-bottom:2px dashed #cbd5e1; font-weight:800; color:#1e293b;">${c.type}</td>
                  <td style="padding:14px 12px; border-bottom:2px dashed #cbd5e1; font-family:monospace; color:#64748b; font-weight:700;">${c.order}</td>
                  <td style="padding:14px 12px; border-bottom:2px dashed #cbd5e1;">
                    <div style="display:flex; align-items:center; gap:8px;">
                      <div class="lc-progress-track" style="max-width:120px; margin:0;">
                        <div class="lc-progress-fill" style="width:${c.score}%; background-color:${c.score >= 80 ? '#22c55e' : c.score >= 50 ? '#ffb84d' : '#ef4444'};"></div>
                      </div>
                      <span style="font-weight:800; font-size:0.85rem; color:#1e293b;">${c.score}%</span>
                    </div>
                  </td>
                  <td style="padding:14px 12px; border-bottom:2px dashed #cbd5e1;">
                    <span class="badge-status ${c.status}" style="border:1.5px solid #1e293b; font-weight:800; box-shadow:2px 2px 0 #1e293b;">
                      ${c.status.toUpperCase().replace('-', ' ')}
                    </span>
                  </td>
                  <td style="padding:14px 12px; border-bottom:2px dashed #cbd5e1; font-weight:700; color:#1e293b;">${c.agent}</td>
                  <td style="padding:14px 12px; border-bottom:2px dashed #cbd5e1; color:#64748b; font-size:0.82rem; font-weight:700;">${c.created}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
