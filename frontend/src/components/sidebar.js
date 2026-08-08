export function renderSidebar(currentPage) {
  const NAV = [
    { id: 'userDashboard', label: 'File a Complaint', icon: '🏠' },
    { id: 'cases', label: 'My Cases', icon: '📋' },
    { id: 'policyChat', label: 'Policy Chat', icon: '💬' },
    { id: 'review', label: 'Review', icon: '⭐' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return `
    <aside class="sidebar" id="app-sidebar">
      <div class="sidebar__brand">
        <div style="display:flex; align-items:center; gap:10px;">
          <div class="sidebar__logo-icon">🌿</div>
          <div class="sidebar__brand-text">
            <div class="sidebar__brand-name">cxplatform</div>
            <div class="sidebar__brand-sub">Customer Resolution</div>
          </div>
        </div>
        <button class="mobile-menu-btn" onclick="document.getElementById('app-sidebar').classList.toggle('mobile-open')">⋮</button>
      </div>

      <nav class="sidebar__nav">
        ${NAV.map(n => `
          <button class="sidebar__link ${currentPage === n.id ? 'active' : ''}" data-nav="${n.id}" onclick="document.getElementById('app-sidebar').classList.remove('mobile-open'); if(window.cxNavigate) window.cxNavigate('${n.id}')">
            <span class="nav-icon">${n.icon}</span>
            <span>${n.label}</span>
          </button>
        `).join('')}
        <button class="sidebar__link" id="btn-sign-out" style="margin-top: 10px; border-top: 1px solid var(--cx-border); border-radius: 0; padding-top: 14px;">
          <span class="nav-icon">🚪</span>
          <span>Sign Out</span>
        </button>
      </nav>

      <div class="sidebar__scene">
        <svg viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#d4edda" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#c8e6c9"/>
            </linearGradient>
            <linearGradient id="mountain1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#5d8a68"/>
              <stop offset="100%" stop-color="#4a7a5a"/>
            </linearGradient>
            <linearGradient id="mountain2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#3d6b4a"/>
              <stop offset="100%" stop-color="#2d5a3a"/>
            </linearGradient>
          </defs>
          <rect width="220" height="200" fill="url(#sky)"/>
          <circle cx="160" cy="50" r="22" fill="#f5c842" opacity="0.8"/>
          <circle cx="160" cy="50" r="28" fill="#f5c842" opacity="0.15"/>
          <ellipse cx="60" cy="45" rx="22" ry="8" fill="white" opacity="0.6"/>
          <ellipse cx="50" cy="42" rx="16" ry="7" fill="white" opacity="0.5"/>
          <polygon points="0,130 50,70 100,130" fill="url(#mountain1)" opacity="0.6"/>
          <polygon points="60,130 130,55 200,130" fill="url(#mountain1)" opacity="0.7"/>
          <polygon points="140,130 190,80 220,130" fill="url(#mountain1)" opacity="0.5"/>
          <polygon points="0,160 70,90 140,160" fill="url(#mountain2)" opacity="0.8"/>
          <polygon points="80,160 150,95 220,160" fill="url(#mountain2)" opacity="0.9"/>
          <polygon points="30,155 38,120 46,155" fill="#2d5a3a"/>
          <polygon points="35,140 38,110 41,140" fill="#3d6b4a"/>
          <rect x="36" y="155" width="4" height="8" fill="#5d4037"/>
          <polygon points="60,160 70,125 80,160" fill="#2d5a3a"/>
          <polygon points="65,145 70,115 75,145" fill="#3d6b4a"/>
          <rect x="68" y="160" width="4" height="8" fill="#5d4037"/>
          <polygon points="170,155 178,125 186,155" fill="#2d5a3a"/>
          <polygon points="174,140 178,115 182,140" fill="#3d6b4a"/>
          <rect x="176" y="155" width="4" height="8" fill="#5d4037"/>
          <ellipse cx="110" cy="200" rx="130" ry="50" fill="#4a7a5a"/>
          <ellipse cx="110" cy="200" rx="120" ry="42" fill="#5d8a68"/>
        </svg>

        <div class="sidebar__help">
          <div class="sidebar__help-icon">🛡️</div>
          <div>
            <div class="sidebar__help-text">Protected Session</div>
            <div class="sidebar__help-sub">Anti-Fabrication Active</div>
          </div>
        </div>
      </div>
    </aside>
  `;
}
