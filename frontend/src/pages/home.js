export function renderHome(user) {
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'User';
  const initial = firstName.charAt(0).toUpperCase();

  return `
    <!-- Greeting Bar -->
    <div class="greeting-bar">
      <div>
        <h1>Hello, ${firstName} 👋</h1>
        <p>How can we help you today?</p>
      </div>
      <div class="greeting-bar__actions">
        <div class="greeting-bar__bell">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <div class="dot"></div>
        </div>
        <div class="greeting-bar__user" id="btn-sign-out" title="Sign Out">
          <div class="greeting-bar__avatar">${initial}</div>
          <span class="greeting-bar__name">${firstName}</span>
          <span class="greeting-bar__chevron" style="margin-left: 4px; font-size: 1rem;">🚪</span>
        </div>
      </div>
    </div>

    <!-- Hero Banner -->
    <div class="hero-banner">
      <div class="hero-banner__content">
        <div class="hero-banner__title">Report an Issue</div>
        <div class="hero-banner__desc">Facing a problem? Let us know and we'll take care of it.</div>
      </div>
      <div class="hero-banner__icon">
        <div class="hero-banner__clipboard" style="position:relative;">
          📋
          <div class="hero-banner__alert">⚠</div>
        </div>
      </div>
    </div>

    <!-- Your Active Case -->
    <div class="card active-case" id="active-case-card">
      <div class="card__header">
        <span class="card__title">Your Active Case</span>
      </div>
      <div class="active-case__content">
        <div class="active-case__icon">💻</div>
        <div class="active-case__info">
          <div class="active-case__name">Dell Laptop Refund</div>
          <span class="active-case__badge">Processing</span>
        </div>
        <div class="active-case__resolution">
          <div class="active-case__resolution-label">Estimated Resolution</div>
          <div class="active-case__resolution-time">2 <span class="active-case__resolution-unit">mins</span></div>
          <div class="active-case__progress">
            <div class="active-case__progress-fill"></div>
          </div>
        </div>
        <div class="active-case__arrow">→</div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <div class="quick-actions__title">Quick Actions</div>
      <div class="quick-actions__grid">
        <div class="quick-action-card" id="qa-upload">
          <div class="quick-action-card__icon red">📤</div>
          <div class="quick-action-card__label">Upload Documents</div>
          <div class="quick-action-card__arrow">→</div>
        </div>
        <div class="quick-action-card" id="qa-track">
          <div class="quick-action-card__icon orange">📦</div>
          <div class="quick-action-card__label">Track Order</div>
          <div class="quick-action-card__arrow">→</div>
        </div>
        <div class="quick-action-card" id="qa-warranty">
          <div class="quick-action-card__icon green">✅</div>
          <div class="quick-action-card__label">Warranty Claim</div>
          <div class="quick-action-card__arrow">→</div>
        </div>
        <div class="quick-action-card" id="qa-return">
          <div class="quick-action-card__icon teal">🔄</div>
          <div class="quick-action-card__label">Return Product</div>
          <div class="quick-action-card__arrow">→</div>
        </div>
      </div>
    </div>

    <!-- Recent Updates -->
    <div class="card" id="recent-updates-card">
      <div class="card__header">
        <span class="card__title">Recent Updates</span>
        <span class="view-all">View all</span>
      </div>
      <div class="card__body">
        <div class="updates-list">
          <div class="update-item">
            <div class="update-item__icon green">✓</div>
            <div class="update-item__content">
              <div class="update-item__title">Evidence Verified</div>
              <div class="update-item__desc">Your submitted evidence has been verified by our system.</div>
            </div>
            <div class="update-item__time">Yesterday, 10:45 AM</div>
          </div>
          <div class="update-item">
            <div class="update-item__icon green">✓</div>
            <div class="update-item__content">
              <div class="update-item__title">Case Received</div>
              <div class="update-item__desc">We have received your request and assigned it to our team.</div>
            </div>
            <div class="update-item__time">2 days ago</div>
          </div>
          <div class="update-item">
            <div class="update-item__icon orange">!</div>
            <div class="update-item__content">
              <div class="update-item__title">Documents Requested</div>
              <div class="update-item__desc">Additional documents are needed to process your request.</div>
            </div>
            <div class="update-item__time">2 days ago</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderRightPanel() {
  return `
    <div class="right-panel">
      <!-- AI Assistant Card -->
      <div class="ai-card">
        <div class="ai-card__sparkle">✨ AI Assistant</div>
        <div class="ai-card__title">Need help?</div>
        <div class="ai-card__desc">Ask our AI Assistant any questions.</div>
        <div class="ai-card__bot">
          <div class="ai-card__bot-antenna"></div>
          <div class="ai-card__bot-body">
            <div class="ai-card__bot-eyes">
              <div class="ai-card__bot-eye"></div>
              <div class="ai-card__bot-eye"></div>
            </div>
          </div>
          <div class="ai-card__bot-shadow"></div>
        </div>
        <button class="ai-card__chat-btn">💬 Start Chat</button>
      </div>

      <!-- Security Card -->
      <div class="security-card">
        <div class="security-card__icon">🛡️</div>
        <div>
          <div class="security-card__title">Your data is safe with us</div>
          <div class="security-card__desc">We use enterprise-grade security to protect your information.</div>
        </div>
        <div class="security-card__lock">🔒</div>
      </div>
    </div>
  `;
}
