/**
 * Enterprise CX Platform — App Entry Point & Router
 * Maps sidebar navigation to customer & admin pages.
 */
import './style.css';
import { renderSidebar } from './components/sidebar.js';
import { supabase } from './utils/supabase.js';
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
  await supabase.auth.signOut();
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
window.cxCurrentRole = null;
window.cxCurrentUser = null;

function setSessionState(session) {
  if (session?.user) {
    window.cxIsAuthenticated = true;
    window.cxCurrentUser = session.user.user_metadata?.full_name || session.user.email;
    const email = session.user.email || '';
    window.cxCurrentRole = (email.includes('admin') || email.includes('cxplatform.io') || email === 'aruneshwaran') ? 'admin' : 'user';
    state.user = session.user;
  } else {
    window.cxIsAuthenticated = false;
    window.cxCurrentRole = null;
    window.cxCurrentUser = null;
    state.user = null;
  }
}

// Initialize auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  setSessionState(session);
  render();
});

supabase.auth.onAuthStateChange((_event, session) => {
  setSessionState(session);
  render();
});
