/** Customer complaint intake: object detection starts the policy conversation. */
import { saveComplaintLog, saveComplaint } from '../../../utils/complaintLogs.js';

const ISSUE_TYPES = [
  'Customer Complaint', 'Order Dispute', 'Refund Request', 'Warranty Claim',
  'Delivery Issue', 'Subscription Cancellation', 'Service Escalation',
  'Product Return', 'Billing Dispute',
];

const apiUrl = () => `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1`;

export function renderCustomerHome() {
  return `
    <div style="display:flex;flex-direction:column;gap:24px;max-width:920px;">
      <section class="rc-card rc-card-blue" style="padding:28px;">
        <span style="font-size:.75rem;font-weight:800;letter-spacing:.08em;">COMPLAINT RESOLUTION</span>
        <h1 style="margin:8px 0;font-size:1.8rem;">Detect the item, then discuss your policy options</h1>
        <p style="margin:0;color:#334155;max-width:700px;">Upload a photo of the item or damage. Object detection creates a case context and takes you directly to the policy-aware AI negotiation chat.</p>
      </section>

      <section class="lc-card" style="padding:26px;">
        <div class="lc-card-header" style="font-size:1.2rem;margin-bottom:18px;">1. Object detection</div>
        <form id="detection-form" style="display:grid;gap:16px;">
          <label style="font-weight:700;">Complaint type
            <select id="complaint-type" required style="display:block;width:100%;margin-top:6px;padding:10px;border:2px solid #1e293b;border-radius:8px;background:white;">
              ${ISSUE_TYPES.map(type => `<option value="${type}">${type}</option>`).join('')}
            </select>
          </label>
          <label style="font-weight:700;">Order ID
            <input id="complaint-order" required placeholder="e.g. ORD-91823" style="display:block;width:100%;margin-top:6px;padding:10px;border:2px solid #1e293b;border-radius:8px;box-sizing:border-box;" />
          </label>
          <label style="font-weight:700;">What happened?
            <textarea id="complaint-description" required placeholder="Describe the item, issue, and the resolution you want." style="display:block;width:100%;min-height:95px;margin-top:6px;padding:10px;border:2px solid #1e293b;border-radius:8px;box-sizing:border-box;"></textarea>
          </label>
          <label style="font-weight:700;">Item / damage photo <span style="font-weight:400;color:#64748b;">(optional)</span>
            <input id="complaint-image" type="file" accept="image/*" style="display:block;margin-top:8px;" />
          </label>
          <p id="detection-status" style="margin:0;min-height:20px;color:#475569;font-size:.9rem;" aria-live="polite"></p>
          <button id="detect-submit" class="btn btn-primary" type="submit" style="justify-self:start;border:2px solid #1e293b;box-shadow:3px 3px 0 #1e293b;">Detect item and continue to policy chat →</button>
        </form>

        <div style="margin-top:24px;padding-top:20px;border-top:2px dashed #cbd5e1;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <span style="font-size:1.1rem;">💬</span>
            <strong>Quick policy assistant</strong>
            <span style="font-size:.72rem;color:#64748b;">Powered by OpenRouter</span>
          </div>
          <div id="mini-chat-messages" style="display:grid;gap:8px;max-height:180px;overflow-y:auto;padding:2px 0 8px;">
            <div style="padding:9px 11px;background:#f1f5f9;border-radius:9px;font-size:.84rem;">Ask about eligibility, policy, or a possible resolution. Add an Order ID and description above for a more relevant answer.</div>
          </div>
          <form id="mini-chat-form" style="display:flex;gap:8px;">
            <input id="mini-chat-input" required placeholder="Ask the policy assistant…" style="min-width:0;flex:1;padding:9px 10px;border:1.5px solid #1e293b;border-radius:8px;" />
            <button class="btn btn-secondary" type="submit" style="border:1.5px solid #1e293b;">Ask</button>
          </form>
        </div>
      </section>

      <section class="rc-card rc-card-green" style="padding:20px;">
        <strong>Your complaint log stays yours.</strong>
        <p style="margin:6px 0 0;color:#334155;">Every detection and chat message is saved under your signed-in user ID. You can see your cases in “My Cases”; authorized admins can audit those logs by user ID.</p>
      </section>
    </div>`;

  queueMicrotask(bindDetectionForm);
}

async function toDataUrl(file) {
  if (!file) return null;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function bindDetectionForm() {
  const form = document.getElementById('detection-form');
  if (!form || form.dataset.bound) return;
  form.dataset.bound = 'true';
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const type = document.getElementById('complaint-type').value;
    const orderId = document.getElementById('complaint-order').value.trim();
    const description = document.getElementById('complaint-description').value.trim();
    const image = document.getElementById('complaint-image').files[0];
    const status = document.getElementById('detection-status');
    const submit = document.getElementById('detect-submit');
    submit.disabled = true;
    status.textContent = 'Running object detection and selecting relevant policy context…';

    const payload = { type, order_id: orderId, description, image_b64: await toDataUrl(image) };
    let result;
    try {
      const response = await fetch(`${apiUrl()}/claims/detect`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Detection service is unavailable');
      result = await response.json();
    } catch (error) {
      result = {
        claim_id: `CLM-${Math.floor(100000 + Math.random() * 899999)}`,
        detection: { label: image ? 'Item image submitted' : 'No image submitted', confidence: image ? 0.7 : 0 },
        policies: [],
        notice: 'The API is unavailable, so the chat will use your written complaint context.',
      };
    }

    const context = { ...payload, ...result, created_at: new Date().toISOString() };
    sessionStorage.setItem('cxComplaintContext', JSON.stringify(context));
    await saveComplaint(context);
    await saveComplaintLog(context.claim_id, 'object_detection_completed', {
      order_id: orderId, detection: result.detection, policy_count: result.policies?.length || 0,
    });
    status.textContent = 'Detection complete. Opening your policy conversation…';
    window.cxNavigate('policyChat');
  });

  bindMiniChat();
}

function appendMiniChat(role, message) {
  const messages = document.getElementById('mini-chat-messages');
  if (!messages) return;
  const safe = String(message).replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
  messages.insertAdjacentHTML('beforeend', `<div style="justify-self:${role === 'You' ? 'end' : 'start'};max-width:90%;padding:9px 11px;background:${role === 'You' ? '#dbeafe' : '#f1f5f9'};border-radius:9px;font-size:.84rem;"><strong style="font-size:.7rem;display:block;margin-bottom:2px;">${role}</strong>${safe.replace(/\n/g, '<br>')}</div>`);
  messages.scrollTop = messages.scrollHeight;
}

function bindMiniChat() {
  const form = document.getElementById('mini-chat-form');
  if (!form || form.dataset.bound) return;
  form.dataset.bound = 'true';
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const input = document.getElementById('mini-chat-input');
    const message = input.value.trim();
    if (!message) return;
    const type = document.getElementById('complaint-type')?.value || 'Customer Complaint';
    const orderId = document.getElementById('complaint-order')?.value.trim() || 'Not provided';
    const description = document.getElementById('complaint-description')?.value.trim() || 'No complaint description provided yet.';
    const context = JSON.parse(sessionStorage.getItem('cxComplaintContext') || 'null');
    const claimId = context?.claim_id || `CHAT-${crypto.randomUUID?.() || Date.now()}`;
    input.value = '';
    appendMiniChat('You', message);
    try {
      const response = await fetch(`${apiUrl()}/claims/negotiate`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim_id: claimId, order_id: orderId, complaint_type: type, description, message, detection: context?.detection || {}, policies: context?.policies || [] }),
      });
      if (!response.ok) throw new Error('Policy assistant is unavailable');
      const { answer } = await response.json();
      appendMiniChat('Policy assistant', answer);
      await saveComplaintLog(claimId, 'quick_chat_message', { message, answer });
    } catch (_) {
      appendMiniChat('Policy assistant', 'I could not reach the AI service. Please try again in a moment.');
    }
  });
}
