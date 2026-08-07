/**
 * Enterprise CX Platform — Evidence Collection Page
 */
import { ICONS } from '../../utils/icons.js';

export function renderEvidence() {
  return `
    <div class="page-header">
      <div class="page-header__left">
        <h1>Evidence Collection — Dual Pipeline</h1>
        <p>Pipeline A (Camera-Only, gallery blocked) + Pipeline B (Sandboxed documents) — fully isolated until Score Evaluation Agent #8</p>
      </div>
      <button class="btn btn-primary" onclick="cxNavigate('claims')" id="btn-back-to-claims">
        ← Back to Claims
      </button>
    </div>

    <div class="content-grid">
      <!-- Pipeline A: Camera-Only -->
      <div class="card" id="card-pipeline-a">
        <div class="card__header">
          <span class="card__title">${ICONS.camera} Pipeline A — Live Camera Capture</span>
          <span class="badge-status processing">Live</span>
        </div>
        <div class="card__body">
          <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:var(--cx-radius-md);padding:10px 14px;margin-bottom:14px;display:flex;gap:8px;align-items:center;">
            <span>🚫</span>
            <div>
              <div style="font-size:0.82rem;font-weight:700;color:#dc2626;">Gallery Upload Blocked</div>
              <div style="font-size:0.75rem;color:#991b1b;">
                Platform policy: No file picker shown. Only live camera capture accepted for visual evidence.
                This is the core anti-fabrication differentiator (README §3.2).
              </div>
            </div>
          </div>

          <div class="evidence-zone evidence-zone--camera" id="evidence-camera-zone">
            <div class="evidence-zone__icon">${ICONS.camera}</div>
            <div class="evidence-zone__label">Camera-Only Capture</div>
            <div class="evidence-zone__hint">
              Gallery / file picker is <strong>blocked</strong> — live camera only.<br>
              WebRTC stream opened → Anti-Fabrication Engine validates frames.
            </div>
            <button onclick="cxOpenCamera()" id="btn-open-camera-gate"
              style="margin-top:12px;padding:10px 20px;background:linear-gradient(135deg,#4f46e5,#6366f1);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:0.88rem;cursor:pointer;box-shadow:0 4px 12px rgba(99,102,241,0.3);">
              📷 Open Live Camera
            </button>
          </div>

          <div style="margin-top:16px;padding:14px;background:var(--cx-bg-input);border-radius:var(--cx-radius-md);border:1px solid var(--cx-border);">
            <div style="font-size:0.82rem;font-weight:700;margin-bottom:10px;">3-Layer CV Analysis (Agent #3 — ALL must pass)</div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="width:22px;text-align:center;">1️⃣</span>
                <div style="flex:1;">
                  <div style="font-size:0.82rem;font-weight:600;">Hand + Object Detection</div>
                  <div style="font-size:0.72rem;color:var(--cx-text-muted);">MediaPipe — confirms human hand interacting with physical product</div>
                </div>
                <span style="font-size:0.72rem;color:var(--cx-success);font-weight:700;">✓ Pass</span>
              </div>
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="width:22px;text-align:center;">2️⃣</span>
                <div style="flex:1;">
                  <div style="font-size:0.82rem;font-weight:600;">Product Identity Matching</div>
                  <div style="font-size:0.72rem;color:var(--cx-text-muted);">YOLO — frame-by-frame product classification vs. claimed item</div>
                </div>
                <span style="font-size:0.72rem;color:var(--cx-success);font-weight:700;">✓ Pass</span>
              </div>
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="width:22px;text-align:center;">3️⃣</span>
                <div style="flex:1;">
                  <div style="font-size:0.82rem;font-weight:600;">Damage Region Validation</div>
                  <div style="font-size:0.72rem;color:var(--cx-text-muted);">OpenCV — verifies damage area visible and consistent across frames</div>
                </div>
                <span style="font-size:0.72rem;color:var(--cx-warning);font-weight:700;">⏳ Processing</span>
              </div>
            </div>
            <div style="margin-top:10px;font-size:0.72rem;color:var(--cx-danger);font-weight:600;">
              Failure in ANY layer reduces score and may trigger Anti-Fraud Challenge (Agent #4)
            </div>
          </div>
        </div>
      </div>

      <!-- Pipeline B: Document Upload -->
      <div class="card" id="card-pipeline-b">
        <div class="card__header">
          <span class="card__title">${ICONS.doc} Pipeline B — Sandboxed Documents</span>
          <span class="badge-status resolved">Ready</span>
        </div>
        <div class="card__body">
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:var(--cx-radius-md);padding:10px 14px;margin-bottom:14px;font-size:0.78rem;color:#166534;">
            <strong>Accepted:</strong> Invoice, receipt, warranty card, shipping label, purchase order PDF.
            Sandboxed upload — scored in isolation from Pipeline A.
          </div>

          <div class="evidence-zone" id="evidence-doc-zone">
            <div class="evidence-zone__icon">${ICONS.doc}</div>
            <div class="evidence-zone__label">Upload Documents</div>
            <div class="evidence-zone__hint">
              Invoice, receipt, warranty card, shipping label<br>
              Sandboxed upload → OCR → cross-reference with Order DB
            </div>
            <button onclick="cxUploadDocument()" id="btn-upload-document"
              style="margin-top:12px;padding:10px 20px;background:linear-gradient(135deg,#059669,#10b981);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:0.88rem;cursor:pointer;box-shadow:0 4px 12px rgba(16,185,129,0.3);">
              📄 Upload Document
            </button>
          </div>

          <div style="margin-top:16px;padding:14px;background:var(--cx-bg-input);border-radius:var(--cx-radius-md);border:1px solid var(--cx-border);">
            <div style="font-size:0.82rem;font-weight:700;margin-bottom:10px;">Document Processing (Agent #5 — Evidence Verification)</div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              <div style="display:flex;align-items:center;gap:10px;">
                <span>📝</span>
                <div style="flex:1;">
                  <div style="font-size:0.82rem;font-weight:600;">OCR Text Extraction</div>
                  <div style="font-size:0.72rem;color:var(--cx-text-muted);">Extract text from invoice / PDF / warranty card</div>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:10px;">
                <span>🔍</span>
                <div style="flex:1;">
                  <div style="font-size:0.82rem;font-weight:600;">Document Structure Parsing</div>
                  <div style="font-size:0.72rem;color:var(--cx-text-muted);">Validate document authenticity and format</div>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:10px;">
                <span>✅</span>
                <div style="flex:1;">
                  <div style="font-size:0.82rem;font-weight:600;">Cross-Reference with Order DB</div>
                  <div style="font-size:0.72rem;color:var(--cx-text-muted);">Match extracted data against purchase records</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Anti-Fraud Challenge System -->
    <div class="card" style="margin-top:18px;" id="card-anti-fraud">
      <div class="card__header">
        <span class="card__title">${ICONS.shield} Anti-Fraud Dynamic Challenge System — Agent #4</span>
        <span style="font-size:0.72rem;color:var(--cx-text-muted);font-family:var(--cx-font-mono);">Triggered when CV Agent detects moire patterns / screen replay</span>
      </div>
      <div class="card__body">
        <p style="font-size:0.85rem;color:var(--cx-text-secondary);margin-bottom:16px;">
          Session-unique physical challenges ensure pre-recorded AI-generated videos cannot pass verification.
          Each challenge is generated dynamically per session — a fraudster would need to generate a specific,
          physically accurate, real-time video on demand (which current AI video generation cannot do reliably).
        </p>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;">
          <div style="padding:16px;background:var(--cx-bg-input);border-radius:var(--cx-radius-md);border:1px solid var(--cx-border);text-align:center;" id="challenge-led">
            <div style="font-size:1.6rem;margin-bottom:6px;">🔦</div>
            <div style="font-size:0.85rem;font-weight:700;">LED Pen Test</div>
            <div style="font-size:0.75rem;color:var(--cx-text-muted);margin-top:4px;">
              "Place LED pen touching damaged corner and hold steady"<br>
              <span style="color:var(--cx-text-secondary);font-size:0.7rem;">AI cannot generate specific real object interaction in real-time</span>
            </div>
          </div>
          <div style="padding:16px;background:var(--cx-bg-input);border-radius:var(--cx-radius-md);border:1px solid var(--cx-border);text-align:center;" id="challenge-360">
            <div style="font-size:1.6rem;margin-bottom:6px;">🔄</div>
            <div style="font-size:0.85rem;font-weight:700;">360° Rotation</div>
            <div style="font-size:0.75rem;color:var(--cx-text-muted);margin-top:4px;">
              "Slowly rotate product 360° keeping damage in frame"<br>
              <span style="color:var(--cx-text-secondary);font-size:0.7rem;">Full-rotation of physical object impossible to screen-replay</span>
            </div>
          </div>
          <div style="padding:16px;background:var(--cx-bg-input);border-radius:var(--cx-radius-md);border:1px solid var(--cx-border);text-align:center;" id="challenge-light">
            <div style="font-size:1.6rem;margin-bottom:6px;">💡</div>
            <div style="font-size:0.85rem;font-weight:700;">Shadow / Light Test</div>
            <div style="font-size:0.75rem;color:var(--cx-text-muted);margin-top:4px;">
              "Move product closer to light source and back"<br>
              <span style="color:var(--cx-text-secondary);font-size:0.7rem;">Real-world lighting physics cannot be replicated by pre-generated clip</span>
            </div>
          </div>
          <div style="padding:16px;background:var(--cx-bg-input);border-radius:var(--cx-radius-md);border:1px solid var(--cx-border);text-align:center;" id="challenge-code">
            <div style="font-size:1.6rem;margin-bottom:6px;">🔢</div>
            <div style="font-size:0.85rem;font-weight:700;">Session Code</div>
            <div style="font-size:0.75rem;color:var(--cx-text-muted);margin-top:4px;">
              "Write 4-digit code shown on screen on paper next to product"<br>
              <span style="color:var(--cx-text-secondary);font-size:0.7rem;">Unique per session — pre-generated videos cannot contain it</span>
            </div>
            <div style="margin-top:8px;font-family:monospace;font-size:1.2rem;font-weight:800;color:var(--cx-accent);letter-spacing:0.1em;">
              ${Math.floor(1000 + Math.random() * 9000)}
            </div>
          </div>
        </div>
        <button onclick="cxTriggerChallenge()" id="btn-trigger-challenge"
          style="margin-top:14px;padding:10px 20px;background:linear-gradient(135deg,#0f172a,#1e293b);color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer;">
          🛡️ Simulate Anti-Fraud Challenge
        </button>
      </div>
    </div>

    <!-- Pipeline Isolation Warning -->
    <div style="margin-top:18px;padding:16px 20px;background:var(--cx-warning-bg);border:1px solid rgba(245,158,11,0.25);border-radius:var(--cx-radius-md);display:flex;gap:12px;align-items:flex-start;" id="pipeline-isolation-notice">
      <span style="font-size:1.2rem;">${ICONS.warning}</span>
      <div>
        <div style="font-size:0.88rem;font-weight:700;color:var(--cx-warning);margin-bottom:4px;">Pipeline Isolation Enforced</div>
        <div style="font-size:0.82rem;color:var(--cx-text-secondary);">
          Pipeline A (CV camera score) and Pipeline B (document score) run in fully isolated sandboxes and separate service boundaries/queues.
          They cannot cross-contaminate until <strong>Score Evaluation Agent (#8)</strong> merge step — preventing evidence laundering between the two trust boundaries.
          Merged score then routes: ≥80% → auto-resolve, 50–79% → human review, &lt;50% → fraud reject.
        </div>
      </div>
    </div>
  `;
}

window.cxOpenCamera = function() {
  alert('📷 Camera Gate Opening...\n\nWebRTC stream starting.\nGallery/file picker is blocked system-wide.\n\nEvidence Capture Agent (#2) is now monitoring the live feed.\nCV Object Detection Agent (#3) will begin 3-layer analysis on first frame capture.\n\nIf moire patterns or replay attack detected → Anti-Fraud Challenge Agent (#4) will issue a dynamic physical challenge.');
};

window.cxUploadDocument = function() {
  alert('📄 Document Upload — Pipeline B\n\nSandboxed file picker opened.\nOnly invoice, receipt, warranty card, or shipping label accepted.\n\nEvidence Verification Agent (#5) will perform:\n• OCR text extraction\n• Document structure parsing\n• Cross-reference with Order DB\n\nPipeline B score is generated independently and remains isolated from Pipeline A until Score Evaluation Agent (#8) merge.');
};

window.cxTriggerChallenge = function() {
  const challenges = [
    'LED Pen Test: Place an LED pen touching the damaged corner and hold it steady for 3 seconds.',
    '360° Rotation: Slowly rotate the product 360 degrees keeping the damaged area in frame at all times.',
    'Shadow/Light Test: Move the product closer to the light source and then back three times.',
    'Session Code: Write the 4-digit code shown on screen on a piece of paper and hold it next to the product.',
  ];
  const chosen = challenges[Math.floor(Math.random() * challenges.length)];
  alert(`🛡️ Anti-Fraud Challenge Issued (Agent #4)\n\nChallenge: "${chosen}"\n\nThis challenge is unique to your session. Challenge Validator Agent will verify your response via CV in real-time.\n\nPurpose: Defeats screen-replay attacks and AI-generated video fraud.`);
};
