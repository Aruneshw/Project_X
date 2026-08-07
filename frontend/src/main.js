/**
 * Enterprise CX Platform — App Entry Point & Router
 * Maps sidebar navigation to customer & admin pages.
 */
import './style.css';
import { renderSidebar } from './components/sidebar.js';
import {
  renderHome,
  renderRightPanel,
  renderLogin,
  renderCustomerHome,
  renderCustomerCases,
  renderCustomerReview,
  renderCustomerProfile,
  renderAdminDashboard,
  renderDashboard,
  renderClaims,
  renderEvidence,
  renderAgents,
  renderAnalytics,
} from './pages/index.js';

const state = { currentPage: 'home', user: null };

const pages = {
  home:           renderHome,
  cases:          () => (window.cxCurrentRole === 'admin' ? renderClaims() : renderCustomerCases()),
  review:         () => renderCustomerReview(),
  profile:        () => renderCustomerProfile(),
  login:          () => renderLogin(),
  userDashboard:  () => renderCustomerHome(),
  adminDashboard: () => renderAdminDashboard(),
  dashboard:      () => renderDashboard(),
  claims:         () => renderClaims(),
  evidence:       () => renderEvidence(),
  agents:         () => renderAgents(),
  analytics:      () => renderAnalytics(),
};

function navigate(page) {
  state.currentPage = page;
  render();
}

async function handleSignOut() {
  window.cxIsAuthenticated = false;
  window.cxCurrentRole = null;
  state.currentPage = 'login';
  render();
}

function render() {
  const app = document.getElementById('app');

  const pageRenderer = pages[state.currentPage] || renderHome;

  if (!window.cxIsAuthenticated || state.currentPage === 'login') {
    app.innerHTML = `
      <div style="min-height:100vh; background:#f8fafc; display:flex; align-items:center; justify-content:center;">
        ${pageRenderer()}
      </div>
    `;
    return;
  }

  app.innerHTML = `
    <div class="app-layout">
      ${renderSidebar(state.currentPage)}
      <main class="main-content">
        ${pageRenderer(state.user)}
      </main>
      ${renderRightPanel()}
    </div>
  `;

  // Bind sidebar nav
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.nav));
  });

  // Bind sign out
  const signOutBtn = document.getElementById('btn-sign-out');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', handleSignOut);
  }
}

window.cxNavigate = navigate;
window.cxIsAuthenticated = false;

// Initial render
render();
