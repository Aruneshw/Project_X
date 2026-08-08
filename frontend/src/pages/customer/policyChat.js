import { saveComplaintLog } from '../../utils/complaintLogs.js';

const apiUrl = () => `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1`;
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));

export function renderPolicyChat() {
  const context = JSON.parse(sessionStorage.getItem('cxComplaintContext') || 'null');
  if (!context) {
    return `<div class="lc-card" style="padding:26px;"><h1>Start with object detection</h1><p>Submit a complaint first so the AI can use the right product and policy context.</p><button class="btn btn-primary" onclick="cxNavigate('userDashboard')">Open complaint intake</button></div>`;
  }
  const detection = context.detection?.label || 'Pending detection';
  const policies = context.policies?.length ? context.policies.map(p => `<li>${escapeHtml(p.document || p.name)}${p.section ? ` — ${escapeHtml(p.section)}` : ''}</li>`).join('') : '<li>Policy context will be retrieved by the assistant.</li>';
  return `
    <div style="display:grid;grid-template-columns:minmax(0,2fr) minmax(240px,1fr);gap:20px;align-items:start;">
      <section class="lc-card" style="padding:24px;">
        <span style="font-size:.75rem;font-weight:800;color:#4f46e5;">2. POLICY & NEGOTIATION CHAT</span>
        <h1 style="margin:7px 0 4px;">Discuss a fair resolution</h1>
        <p style="margin:0 0 18px;color:#475569;">The assistant uses retrieved policy excerpts and your detected-item context. You remain in control of any proposed outcome.</p>
        <div id="policy-chat-messages" style="display:grid;gap:12px;min-height:280px;"></div>
        <form id="policy-chat-form" style="display:flex;gap:10px;margin-top:18px;">
          <input id="policy-chat-input" required placeholder="Ask about your eligibility or make a counter-offer…" style="min-width:0;flex:1;padding:11px;border:2px solid #1e293b;border-radius:8px;" />
          <button class="btn btn-primary" type="submit" style="border:2px solid #1e293b;">Send</button>
        </form>
      </section>
      <aside class="rc-card rc-card-yellow" style="padding:20px;">
        <div style="font-size:.75rem;font-weight:800;">CASE CONTEXT</div>
        <p style="margin:10px 0 4px;"><strong>${escapeHtml(context.claim_id)}</strong></p>
        <p style="margin:0 0 8px;font-size:.86rem;">Order: ${escapeHtml(context.order_id)}</p>
        <p style="margin:0 0 12px;font-size:.86rem;">Detection: ${escapeHtml(detection)}</p>
        <strong style="font-size:.85rem;">Retrieved policies</strong>
        <ul style="padding-left:18px;font-size:.82rem;line-height:1.5;">${policies}</ul>
      </aside>
    </div>`;
  queueMicrotask(() => bindChat(context));
}

function appendMessage(role, text) {
  const messages = document.getElementById('policy-chat-messages');
  if (!messages) return;
  const mine = role === 'You';
  messages.insertAdjacentHTML('beforeend', `<div style="justify-self:${mine ? 'end' : 'start'};max-width:85%;padding:12px 14px;border:2px solid #1e293b;border-radius:12px;background:${mine ? '#dbeafe' : '#f8fafc'};"><strong style="font-size:.78rem;display:block;margin-bottom:4px;">${role}</strong><span>${escapeHtml(text).replace(/\n/g, '<br>')}</span></div>`);
  messages.scrollTop = messages.scrollHeight;
}

function bindChat(context) {
  const form = document.getElementById('policy-chat-form');
  if (!form || form.dataset.bound) return;
  form.dataset.bound = 'true';
  appendMessage('Policy assistant', `I found your ${context.type} for order ${context.order_id}. I can explain the applicable policy and negotiate an appropriate resolution. What outcome would you like to discuss?`);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const input = document.getElementById('policy-chat-input');
    const message = input.value.trim();
    if (!message) return;
    input.value = '';
    appendMessage('You', message);
    await saveComplaintLog(context.claim_id, 'customer_message', { message });
    try {
      const response = await fetch(`${apiUrl()}/claims/negotiate`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim_id: context.claim_id, order_id: context.order_id, complaint_type: context.type, description: context.description, message, detection: context.detection, policies: context.policies || [] }),
      });
      if (!response.ok) throw new Error('Chat service unavailable');
      const answer = (await response.json()).answer;
      appendMessage('Policy assistant', answer);
      await saveComplaintLog(context.claim_id, 'assistant_response', { message: answer });
    } catch (_) {
      const answer = 'I could not reach the negotiation service right now. Your request has been recorded; please try again shortly or contact support for a manual review.';
      appendMessage('Policy assistant', answer);
      await saveComplaintLog(context.claim_id, 'assistant_response_fallback', { message: answer });
    }
  });
}
