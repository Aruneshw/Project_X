import { ICONS } from '../utils/icons.js';

export function renderEvidence() {
  return `
    <div class="page-header">
      <div class="page-header__left">
        <h1>Evidence Collection</h1>
        <p>Dual-pipeline evidence system — Pipeline A (camera-only) + Pipeline B (documents)</p>
      </div>
    </div>

    <div class="content-grid">
      <!-- Pipeline A: Camera-Only -->
      <div class="card" id="card-pipeline-a">
        <div class="card__header">
          <span class="card__title">${ICONS.camera} Pipeline A — Camera Only</span>
          <span class="badge-status processing">Live</span>
        </div>
        <div class="card__body">
          <div class="evidence-zone evidence-zone--camera" id="evidence-camera-zone">
            <div class="evidence-zone__icon">${ICONS.camera}</div>
            <div class="evidence-zone__label">Camera-Only Capture</div>
            <div class="evidence-zone__hint">Gallery / file picker is <strong>blocked</strong> — camera only.<br>This is the platform's core anti-fabrication differentiator.</div>
          </div>
          <div style="margin-top:18px;padding:14px;background:var(--cx-bg-input);border-radius:var(--cx-radius-md);border:1px solid var(--cx-border);">
            <div style="font-size:0.82rem;font-weight:700;margin-bottom:10px;">3-Layer CV Analysis</div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="width:22px;text-align:center;">1️⃣</span>
                <span style="font-size:0.82rem;">Hand + Object Detection (MediaPipe)</span>
                <span style="margin-left:auto;font-size:0.72rem;color:var(--cx-success);">✓ Pass</span>
              </div>
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="width:22px;text-align:center;">2️⃣</span>
                <span style="font-size:0.82rem;">Product Identity Matching (YOLO)</span>
                <span style="margin-left:auto;font-size:0.72rem;color:var(--cx-success);">✓ Pass</span>
              </div>
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="width:22px;text-align:center;">3️⃣</span>
                <span style="font-size:0.82rem;">Damage Region Segmentation (OpenCV)</span>
                <span style="margin-left:auto;font-size:0.72rem;color:var(--cx-warning);">⏳ Processing</span>
              </div>
            </div>
            <div style="margin-top:10px;font-size:0.72rem;color:var(--cx-text-muted);">ALL 3 layers must pass for valid evidence score</div>
          </div>
        </div>
      </div>

      <!-- Pipeline B: Document Upload -->
      <div class="card" id="card-pipeline-b">
        <div class="card__header">
          <span class="card__title">${ICONS.doc} Pipeline B — Documents</span>
          <span class="badge-status resolved">Ready</span>
        </div>
        <div class="card__body">
          <div class="evidence-zone" id="evidence-doc-zone">
            <div class="evidence-zone__icon">${ICONS.doc}</div>
            <div class="evidence-zone__label">Upload Documents</div>
            <div class="evidence-zone__hint">Invoice, receipt, warranty card, shipping label<br>Sandboxed upload → OCR → document score</div>
          </div>
          <div style="margin-top:18px;padding:14px;background:var(--cx-bg-input);border-radius:var(--cx-radius-md);border:1px solid var(--cx-border);">
            <div style="font-size:0.82rem;font-weight:700;margin-bottom:10px;">Document Processing</div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="width:22px;text-align:center;">📝</span>
                <span style="font-size:0.82rem;">OCR Text Extraction</span>
              </div>
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="width:22px;text-align:center;">🔍</span>
                <span style="font-size:0.82rem;">Document Structure Parsing</span>
              </div>
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="width:22px;text-align:center;">✅</span>
                <span style="font-size:0.82rem;">Cross-reference with Order DB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Anti-Fraud Challenge -->
    <div class="card" style="margin-top:18px;" id="card-anti-fraud">
      <div class="card__header">
        <span class="card__title">${ICONS.shield} Anti-Fraud Dynamic Challenges</span>
        <span style="font-size:0.72rem;color:var(--cx-text-muted);font-family:var(--cx-font-mono);">Agent #4</span>
      </div>
      <div class="card__body">
        <p style="font-size:0.85rem;color:var(--cx-text-secondary);margin-bottom:16px;">
          Session-unique physical challenges ensure pre-recorded videos cannot pass verification.
          Each challenge is generated per-session with random codes.
        </p>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;">
          <div style="padding:16px;background:var(--cx-bg-input);border-radius:var(--cx-radius-md);border:1px solid var(--cx-border);text-align:center;">
            <div style="font-size:1.6rem;margin-bottom:6px;">🔦</div>
            <div style="font-size:0.82rem;font-weight:700;">LED Pen Test</div>
            <div style="font-size:0.72rem;color:var(--cx-text-muted);margin-top:4px;">Point LED at product</div>
          </div>
          <div style="padding:16px;background:var(--cx-bg-input);border-radius:var(--cx-radius-md);border:1px solid var(--cx-border);text-align:center;">
            <div style="font-size:1.6rem;margin-bottom:6px;">🔄</div>
            <div style="font-size:0.82rem;font-weight:700;">360° Rotation</div>
            <div style="font-size:0.72rem;color:var(--cx-text-muted);margin-top:4px;">Rotate product fully</div>
          </div>
          <div style="padding:16px;background:var(--cx-bg-input);border-radius:var(--cx-radius-md);border:1px solid var(--cx-border);text-align:center;">
            <div style="font-size:1.6rem;margin-bottom:6px;">💡</div>
            <div style="font-size:0.82rem;font-weight:700;">Shadow / Light</div>
            <div style="font-size:0.72rem;color:var(--cx-text-muted);margin-top:4px;">Test light response</div>
          </div>
          <div style="padding:16px;background:var(--cx-bg-input);border-radius:var(--cx-radius-md);border:1px solid var(--cx-border);text-align:center;">
            <div style="font-size:1.6rem;margin-bottom:6px;">🔢</div>
            <div style="font-size:0.82rem;font-weight:700;">Session Code</div>
            <div style="font-size:0.72rem;color:var(--cx-text-muted);margin-top:4px;">Random 4-digit code</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Isolation Warning -->
    <div style="margin-top:18px;padding:16px 20px;background:var(--cx-warning-bg);border:1px solid rgba(245,158,11,0.25);border-radius:var(--cx-radius-md);display:flex;gap:12px;align-items:flex-start;">
      <span style="font-size:1.2rem;">${ICONS.warning}</span>
      <div>
        <div style="font-size:0.88rem;font-weight:700;color:var(--cx-warning);margin-bottom:4px;">Pipeline Isolation</div>
        <div style="font-size:0.82rem;color:var(--cx-text-secondary);">Pipeline A and B data cannot cross-contaminate until the Score Evaluation Agent (Agent #8) merge step. Implemented as separate service boundaries and queues.</div>
      </div>
    </div>
  `;
}
