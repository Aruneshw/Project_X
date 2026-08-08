import { renderLogin } from './auth/login.js';
import { renderCustomerHome } from './customer/home/index.js';
import { renderAdminDashboard } from './admin/adminDashboard.js';

/** Landing page: shows Login if unauthenticated, then routes to role dashboard */
export function renderHome() {
  if (!window.cxIsAuthenticated) return renderLogin();
  if (window.cxCurrentRole === 'admin') return renderAdminDashboard();
  return renderCustomerHome();
}

/** Right panel — Quick Nav & Security badges with styled buttons */
export function renderRightPanel() {
  if (!window.cxIsAuthenticated) return `<div></div>`;

  const isAdmin = window.cxCurrentRole === 'admin';

  return `
    <div class="right-panel">
      <!-- Security & Compliance Card -->
      <div class="security-card" style="flex-direction:column; gap:6px; align-items:flex-start;">
        <div style="display:flex; gap:8px; align-items:center;">
          <div class="security-card__icon">🛡️</div>
          <div class="security-card__title">Enterprise Security</div>
          <div class="security-card__lock">🔒</div>
        </div>
        <div class="security-card__desc" style="font-size:0.78rem; color:#64748b;">
          TLS 1.3 · JWT Auth · RBAC · E2E Encryption · GDPR · SOC2 · 99.9% Uptime SLA
        </div>
      </div>
    </div>
  `;
}
