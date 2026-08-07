/**
 * Enterprise CX Platform — Dashboard Router
 */
import { renderUserDashboard } from './customer/userDashboard.js';
import { renderAdminDashboard } from './admin/adminDashboard.js';
import { renderLogin } from './auth/login.js';

export { renderUserDashboard, renderAdminDashboard, renderLogin };

export function renderDashboard() {
  if (!window.cxIsAuthenticated) return renderLogin();
  if (window.cxCurrentRole === 'admin') return renderAdminDashboard();
  return renderUserDashboard();
}
