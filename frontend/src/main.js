/**
 * Enterprise CX Platform — App Entry Point & Router
 * Maps sidebar navigation to customer & admin pages.
 */
import './style.css';
import { renderSidebar } from './components/sidebar.js';
import { supabase } from './utils/supabase.js';
window.supabase = supabase; // Expose for profile saving

import {
  renderHome,
  renderRightPanel,
  renderLogin,
  renderCustomerHome,
  renderPolicyChat,
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

const state = { currentPage: sessionStorage.getItem('currentPage') || 'home', user: null };

const pages = {
  home:           renderHome,
  cases:          () => (window.cxCurrentRole === 'admin' ? renderClaims() : renderCustomerCases()),
  review:         () => renderCustomerReview(),
  profile:        () => renderCustomerProfile(),
  login:          () => renderLogin(),
  userDashboard:  () => renderCustomerHome(),
  policyChat:     () => renderPolicyChat(),
  adminDashboard: () => renderAdminDashboard(),
  dashboard:      () => renderDashboard(),
  claims:         () => renderClaims(),
  evidence:       () => renderEvidence(),
  agents:         () => renderAgents(),
  analytics:      () => renderAnalytics(),
};

function navigate(page) {
  state.currentPage = page;
  sessionStorage.setItem('currentPage', page);
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
    window.cxCurrentUserEmail = session.user.email || '';
    const email = session.user.email || '';
    window.cxCurrentRole = (email.includes('admin') || email.includes('cxplatform.io') || email === 'aruneshownsty1@gmail.com') ? 'admin' : 'user';
    state.user = session.user;
  } else {
    window.cxIsAuthenticated = false;
    window.cxCurrentRole = null;
    window.cxCurrentUser = null;
    state.user = null;
  }
}

// Initialize auth state
if (supabase) {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSessionState(session);
    render();
  }).catch((err) => {
    console.error("Supabase auth error during initialization:", err);
    setSessionState(null);
    render();
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    const wasAuth = window.cxIsAuthenticated;
    setSessionState(session);
    
    // Only re-render if the authentication status actually changed (e.g. login/logout)
    // This prevents the UI (and modals) from resetting when returning from a file picker
    // or when Supabase silently refreshes the token in the background.
    if (wasAuth !== window.cxIsAuthenticated || _event === 'SIGNED_OUT' || _event === 'SIGNED_IN') {
      // If we just signed in and we are on the login page, go to the default dashboard
      if (window.cxIsAuthenticated && state.currentPage === 'login') {
        navigate(window.cxCurrentRole === 'admin' ? 'adminDashboard' : 'userDashboard');
      } else {
        render();
      }
    }
  });
} else {
  // Graceful degradation for missing env vars
  document.getElementById('app').innerHTML = `
    <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; background:#fef2f2; color:#dc2626; padding: 24px; text-align: center; font-family: sans-serif;">
      <div style="max-width: 600px; border: 2px solid #ef4444; border-radius: 12px; padding: 32px; background: white; box-shadow: 4px 4px 0 #ef4444;">
        <h1 style="font-size: 2rem; margin-bottom: 12px; font-weight: 800;">Configuration Error</h1>
        <p style="font-size: 1.1rem; font-weight: 600;">Missing Supabase environment variables.</p>
        <p style="font-size: 0.95rem; margin-top: 16px; color: #7f1d1d; line-height: 1.5;">Please add <b>VITE_SUPABASE_URL</b> and <b>VITE_SUPABASE_ANON_KEY</b> to your Vercel project's Environment Variables and redeploy.</p>
      </div>
    </div>
  `;
}
