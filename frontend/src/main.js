/**
 * CX Platform — Customer Resolution Portal
 * Warm, friendly customer-facing UI matching design reference.
 */
import './style.css';
import { renderSidebar } from './components/sidebar.js';
import { renderHome, renderRightPanel } from './pages/home.js';
import { renderAuth, bindAuthEvents } from './pages/auth.js';
import { supabase } from './utils/supabase.js';

const state = { currentPage: 'home', user: null };

const pages = {
  home: renderHome,
  cases: renderHome,
  chat: renderHome,
  notifications: renderHome,
  profile: renderHome,
};

function navigate(page) {
  state.currentPage = page;
  render();
}

async function handleSignOut() {
  await supabase.auth.signOut();
  state.user = null;
  render();
}

function render() {
  const app = document.getElementById('app');
  
  if (!state.user) {
    app.innerHTML = renderAuth();
    bindAuthEvents();
    return;
  }

  const pageRenderer = pages[state.currentPage] || renderHome;

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

// Initialize auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  state.user = session?.user ?? null;
  render();
});

supabase.auth.onAuthStateChange((_event, session) => {
  state.user = session?.user ?? null;
  render();
});
