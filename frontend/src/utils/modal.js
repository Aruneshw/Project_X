/**
 * cx-modal — Reusable neo-brutalist modal system
 * Replaces all native alert() calls with styled modal popups.
 *
 * Usage:
 *   showModal({ title, body, icon, type })
 *   showModal({ title, body, icon, type, confirmText, cancelText, onConfirm })
 *
 * Types: 'success' | 'error' | 'info' | 'warning' | 'camera'
 */

const TYPE_STYLES = {
  success:  { accent: '#22c55e', bg: '#f0fdf4', iconBg: '#dcfce7', border: '#86efac' },
  error:    { accent: '#ef4444', bg: '#fef2f2', iconBg: '#fee2e2', border: '#fca5a5' },
  warning:  { accent: '#f59e0b', bg: '#fffbeb', iconBg: '#fef3c7', border: '#fcd34d' },
  info:     { accent: '#3b82f6', bg: '#eff6ff', iconBg: '#dbeafe', border: '#93c5fd' },
  camera:   { accent: '#6366f1', bg: '#f5f3ff', iconBg: '#ede9fe', border: '#a5b4fc' },
};

function injectModalStyles() {
  if (document.getElementById('cx-modal-styles')) return;
  const style = document.createElement('style');
  style.id = 'cx-modal-styles';
  style.textContent = `
    #cx-modal-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(15, 23, 42, 0.55);
      backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      animation: cxFadeIn 0.18s ease;
    }
    @keyframes cxFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes cxSlideUp {
      from { transform: translateY(24px) scale(0.97); opacity: 0; }
      to   { transform: translateY(0)    scale(1);    opacity: 1; }
    }
    .cx-modal-box {
      background: #fff;
      border: 2.5px solid #1e293b;
      border-radius: 20px;
      box-shadow: 0 8px 0 #1e293b;
      width: 100%;
      max-width: 480px;
      animation: cxSlideUp 0.22s cubic-bezier(0.34,1.56,0.64,1);
      font-family: 'Inter', 'Outfit', sans-serif;
    }
    .cx-modal-head {
      display: flex; align-items: center; gap: 14px;
      padding: 20px 22px 16px;
      border-bottom: 2px solid #1e293b;
    }
    .cx-modal-icon {
      width: 44px; height: 44px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.3rem; flex-shrink: 0;
      border: 2px solid currentColor;
    }
    .cx-modal-title {
      font-size: 1.05rem; font-weight: 800; color: #0f172a;
      margin: 0; line-height: 1.3;
    }
    .cx-modal-body {
      padding: 18px 22px;
      font-size: 0.88rem; color: #334155;
      line-height: 1.7; white-space: pre-wrap;
    }
    .cx-modal-list {
      list-style: none; padding: 0; margin: 10px 0 0;
    }
    .cx-modal-list li {
      padding: 5px 0;
      border-bottom: 1px dashed #e2e8f0;
      font-size: 0.83rem; color: #475569;
    }
    .cx-modal-list li:last-child { border-bottom: none; }
    .cx-modal-actions {
      display: flex; gap: 10px; justify-content: flex-end;
      padding: 14px 22px 20px;
    }
    .cx-modal-btn {
      padding: 10px 22px;
      border-radius: 10px;
      font-size: 0.88rem;
      font-weight: 800;
      cursor: pointer;
      border: 2px solid #1e293b;
      box-shadow: 3px 3px 0 #1e293b;
      transition: transform 0.1s, box-shadow 0.1s;
    }
    .cx-modal-btn:hover {
      transform: translate(-2px, -2px);
      box-shadow: 5px 5px 0 #1e293b;
    }
    .cx-modal-btn:active {
      transform: translate(2px, 2px);
      box-shadow: 1px 1px 0 #1e293b;
    }
    .cx-modal-btn-primary {
      background: #0f172a; color: #fff;
    }
    .cx-modal-btn-secondary {
      background: #fff; color: #0f172a;
    }
  `;
  document.head.appendChild(style);
}

export function showModal({ title = 'Notice', body = '', icon = 'ℹ️', type = 'info', lines = null, confirmText = 'Got it', cancelText = null, onConfirm = null }) {
  injectModalStyles();

  // Remove any existing modal
  const existing = document.getElementById('cx-modal-overlay');
  if (existing) existing.remove();

  const s = TYPE_STYLES[type] || TYPE_STYLES.info;

  const linesHTML = lines
    ? `<ul class="cx-modal-list">${lines.map(l => `<li>${l}</li>`).join('')}</ul>`
    : '';

  const cancelBtn = cancelText
    ? `<button class="cx-modal-btn cx-modal-btn-secondary" id="cx-modal-cancel">${cancelText}</button>`
    : '';

  const overlay = document.createElement('div');
  overlay.id = 'cx-modal-overlay';
  overlay.innerHTML = `
    <div class="cx-modal-box" role="dialog" aria-modal="true" aria-labelledby="cx-modal-title-text">
      <div class="cx-modal-head" style="background:${s.bg};">
        <div class="cx-modal-icon" style="background:${s.iconBg}; border-color:${s.border}; color:${s.accent};">
          ${icon}
        </div>
        <p class="cx-modal-title" id="cx-modal-title-text">${title}</p>
      </div>
      <div class="cx-modal-body">
        ${body ? `<span>${body}</span>` : ''}
        ${linesHTML}
      </div>
      <div class="cx-modal-actions">
        ${cancelBtn}
        <button class="cx-modal-btn cx-modal-btn-primary" id="cx-modal-confirm" style="background:${s.accent}; border-color:${s.accent}; box-shadow: 3px 3px 0 #1e293b;">
          ${confirmText}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = () => overlay.remove();

  document.getElementById('cx-modal-confirm').addEventListener('click', () => {
    close();
    if (onConfirm) onConfirm();
  });

  const cancelEl = document.getElementById('cx-modal-cancel');
  if (cancelEl) cancelEl.addEventListener('click', close);

  // Click outside to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  // Esc key to close
  const escHandler = (e) => {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); }
  };
  document.addEventListener('keydown', escHandler);
}

// Expose globally so inline onclick strings can call it
window.showModal = showModal;
