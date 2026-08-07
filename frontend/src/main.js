/**
 * CX Platform — Customer Resolution Portal
 * Warm, friendly customer-facing UI matching design reference.
 */
import './style.css';
import { renderSidebar } from './components/sidebar.js';
import { renderHome, renderRightPanel } from './pages/home.js';

const state = { currentPage: 'home' };

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

function render() {
  const app = document.getElementById('app');
  const pageRenderer = pages[state.currentPage] || renderHome;

  app.innerHTML = `
    <div class="app-layout">
      ${renderSidebar(state.currentPage)}
      <main class="main-content">
        ${pageRenderer()}
      </main>
      ${renderRightPanel()}
    </div>
  `;

  // Bind sidebar nav
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.nav));
  });
}

window.cxNavigate = navigate;
render();
