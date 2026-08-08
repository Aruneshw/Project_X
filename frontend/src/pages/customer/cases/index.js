/**
 * Enterprise CX Platform — Customer Cases Page
 * Styled completely using the Board Cards visual system and ListContainer visual tokens.
 */
import { supabase } from '../../../utils/supabase.js';

export function renderCustomerCases() {
  return `
    <div class="customer-cases-wrapper" style="display:flex; flex-direction:column; gap:24px;">
      <!-- Pinned Header Card (Warm Green Board Card style) -->
      <div class="rc-card rc-card-green rc-card-green" style="padding:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <span style="font-size:0.75rem; font-weight:800; color:#1e293b; text-transform:uppercase; letter-spacing:0.08em;">Case Tracking</span>
            <h1 style="font-size:1.6rem; font-weight:800; color:#1e293b; margin:4px 0 0 0;">My complaint log</h1>
            <p style="color:#1e293b; opacity:0.85; font-size:0.88rem; margin-top:2px;">These records belong to your signed-in account. They include your object detection and policy negotiation cases.</p>
          </div>
          <button class="btn btn-primary" onclick="cxNavigate('userDashboard')" style="border:2px solid #1e293b; box-shadow:3px 3px 0 #1e293b;">
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
              <tr><td colspan="7" id="my-cases-loading" style="padding:20px;text-align:center;color:#64748b;">Loading your complaint records…</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  queueMicrotask(loadMyCases);
}

async function loadMyCases() {
  const target = document.getElementById('my-cases-loading');
  if (!target) return;
  if (!supabase) { target.textContent = 'Supabase is not configured.'; return; }
  const safe = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
  const { data, error } = await supabase.from('user_history').select('*').order('created_at', { ascending: false });
  if (error) { target.textContent = `Could not load your complaint records: ${error.message}`; return; }
  if (!data?.length) { target.textContent = 'No complaint records yet. File a complaint to begin.'; return; }
  target.parentElement.innerHTML = data.map(item => {
    const order = item.resolution_data?.order_id || '—';
    const score = Math.max(0, Math.min(100, Number(item.ai_score || 0)));
    return `<tr>
      <td style="padding:14px 12px;border-bottom:2px dashed #cbd5e1;font-family:monospace;font-weight:800;color:#4f46e5;">${safe(item.claim_id)}</td>
      <td style="padding:14px 12px;border-bottom:2px dashed #cbd5e1;font-weight:800;">${safe(item.issue_type)}</td>
      <td style="padding:14px 12px;border-bottom:2px dashed #cbd5e1;font-family:monospace;">${safe(order)}</td>
      <td style="padding:14px 12px;border-bottom:2px dashed #cbd5e1;"><div class="lc-progress-track" style="max-width:120px;margin:0;display:inline-block;"><div class="lc-progress-fill" style="width:${score}%;"></div></div> ${score}%</td>
      <td style="padding:14px 12px;border-bottom:2px dashed #cbd5e1;"><span class="badge-status resolved">${safe(item.status)}</span></td>
      <td style="padding:14px 12px;border-bottom:2px dashed #cbd5e1;">Policy assistant</td>
      <td style="padding:14px 12px;border-bottom:2px dashed #cbd5e1;font-size:.8rem;">${safe(new Date(item.created_at).toLocaleString())}</td>
    </tr>`;
  }).join('');
}
