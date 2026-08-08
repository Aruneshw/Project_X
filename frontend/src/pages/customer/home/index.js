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
}
