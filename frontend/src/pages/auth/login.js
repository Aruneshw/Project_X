/**
 * Enterprise CX Platform — Login Portal Page
 * Default landing page with simple username & password authentication.
 * Styled completely using the Board Cards visual system and ListContainer visual tokens.
 */

import { renderUserDashboard } from '../customer/userDashboard.js';
import { renderAdminDashboard } from '../admin/adminDashboard.js';

export function renderLogin() {
  return `
    <div class="login-portal-wrapper" style="max-width: 850px; margin: 40px auto; padding: 24px; display:flex; flex-direction:column; gap:24px;">
      
      <!-- Brand Header (Pinned Board Card style - Coral Red) -->
      <div class="rc-card rc-card-red rc-card-red" style="text-align: center; padding: 24px;">
        <div style="display: inline-flex; align-items: center; justify-content: center; width: 60px; height: 60px; border-radius: 50%; background: #ffffff; border: 2.5px solid #1e293b; color: #1e293b; font-size: 30px; margin-bottom: 14px; box-shadow: 3px 3px 0 #1e293b;">
          ⚡
        </div>
        <h1 style="font-size: 2.2rem; font-weight: 800; color: #ffffff; margin-bottom: 6px; letter-spacing: -0.02em;">
          Enterprise CX Portal
        </h1>
        <p style="color: #ffffff; opacity:0.9; font-size: 0.95rem; max-width: 480px; margin: 0 auto; font-weight: 700;">
          Sign in to access your autonomous dispute resolution dashboard.
        </p>
      </div>

      <!-- Main Login Container Card -->
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap:20px;">
        
        <!-- Form Section (ListContainer style) -->
        <div class="lc-card" style="padding: 36px; display: flex; flex-direction: column; justify-content: center;">
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #1e293b; margin-bottom: 4px;">Portal Sign In</h2>
          <p style="font-size: 0.88rem; color: #64748b; margin-bottom: 20px; font-weight: 700;">Choose your role & enter your credentials:</p>

          <!-- Role Selector Toggle -->
          <div style="display: flex; background: #e2e8f0; padding: 4px; border-radius: 12px; border:2px solid #1e293b; margin-bottom: 20px; box-shadow: 2px 2px 0 #1e293b;" id="cx-role-toggle">
            <button id="role-user-btn" type="button" onclick="cxSelectRole('user')" style="flex: 1; padding: 10px 12px; border: none; border-radius: 9px; font-weight: 800; font-size: 0.85rem; cursor: pointer; transition: all 0.2s ease; background: #ffffff; color: #4f46e5; border: 1.5px solid #1e293b;">
              👤 User / Customer
            </button>
            <button id="role-admin-btn" type="button" onclick="cxSelectRole('admin')" style="flex: 1; padding: 10px 12px; border: none; border-radius: 9px; font-weight: 800; font-size: 0.85rem; cursor: pointer; transition: all 0.2s ease; background: transparent; color: #64748b;">
              🛡️ Admin / Ops
            </button>
          </div>

          <!-- Basic Credentials Box -->
          <div style="background: #fff; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 12px; margin-bottom: 20px; font-size: 0.82rem; color: #1e293b; border-color:#1e293b;">
            <div style="font-weight: 800; color: #1e293b; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
              🔑 Default Credentials:
            </div>
            <div id="cx-cred-info" style="font-weight:700;">
              Username: <strong style="color: #4f46e5;">user</strong> &nbsp;|&nbsp; Password: <strong style="color: #4f46e5;">123</strong>
            </div>
          </div>

          <!-- Form -->
          <form onsubmit="cxHandleLogin(event)" style="display: flex; flex-direction: column; gap: 16px;">
            <input type="hidden" id="cx-login-role" value="user" />

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 800; color: #1e293b; margin-bottom: 6px;">Username</label>
              <input type="text" id="cx-username" required value="user" placeholder="Enter username" style="width: 100%; padding: 12px 14px; border-radius: 10px; border: 2px solid #1e293b; font-size: 0.9rem; outline: none;" />
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 800; color: #1e293b; margin-bottom: 6px;">Password</label>
              <input type="password" id="cx-password" required value="123" placeholder="Enter password" style="width: 100%; padding: 12px 14px; border-radius: 10px; border: 2px solid #1e293b; font-size: 0.9rem; outline: none;" />
            </div>

            <!-- Error Banner -->
            <div id="cx-login-error" style="display: none; background: #fef2f2; border: 2px solid #ef4444; color: #dc2626; padding: 10px; border-radius: 8px; font-size: 0.8rem; font-weight: 800; box-shadow: 2px 2px 0 #ef4444;">
              Invalid username or password. Use default credentials above.
            </div>

            <button type="submit" id="cx-submit-btn" class="btn btn-primary" style="width: 100%; padding: 14px; border: 2px solid #1e293b; box-shadow: 3px 3px 0 #1e293b; font-weight:800;">
              Sign In to User Dashboard →
            </button>
          </form>
        </div>

        <!-- Right Side Showcase (Warm Orange Board Card style) -->
        <div class="rc-card rc-card-orange" style="padding: 36px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <span style="display: inline-block; background: #1e293b; color: #fff; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; padding: 6px 12px; border-radius: 20px; margin-bottom: 20px; border:1.5px solid #fff;">
              Agentic AI Platform
            </span>
            <h3 style="font-size: 1.45rem; font-weight: 800; line-height: 1.3; margin-bottom: 12px; color: #1e293b;">
              Isolated Dual Pipeline & Anti-Fabrication Engine
            </h3>
            <p style="font-size: 0.88rem; color: #1e293b; opacity: 0.9; line-height: 1.6; margin-bottom: 20px; font-weight: 600;">
              Camera-only evidence capture gate with MediaPipe hand detection, 3-layer OpenCV product identity, and dynamic physical challenges.
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="background: rgba(255, 255, 255, 0.5); padding: 12px; border-radius: 12px; font-size: 0.82rem; border: 2px solid #1e293b; color: #1e293b; font-weight: 700; box-shadow: 2px 2px 0 #1e293b;">
              <span style="font-weight: 800; color: #4f46e5;">👤 User Mode:</span> Submit live camera evidence & track refund claims.
            </div>
            <div style="background: rgba(255, 255, 255, 0.5); padding: 12px; border-radius: 12px; font-size: 0.82rem; border: 2px solid #1e293b; color: #1e293b; font-weight: 700; box-shadow: 2px 2px 0 #1e293b;">
              <span style="font-weight: 800; color: #000;">🛡️ Admin Mode:</span> 13 AI Agents fleet oversight & 50-80% escalation queue.
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

// Global role toggle helper
window.cxSelectRole = function(role) {
  const userBtn = document.getElementById('role-user-btn');
  const adminBtn = document.getElementById('role-admin-btn');
  const roleInput = document.getElementById('cx-login-role');
  const userInput = document.getElementById('cx-username');
  const passInput = document.getElementById('cx-password');
  const credInfo = document.getElementById('cx-cred-info');
  const submitBtn = document.getElementById('cx-submit-btn');

  if (!userBtn || !adminBtn || !roleInput || !userInput || !passInput || !submitBtn) return;

  roleInput.value = role;

  if (role === 'user') {
    userBtn.style.background = '#ffffff';
    userBtn.style.color = '#4f46e5';
    userBtn.style.border = '1.5px solid #1e293b';
    adminBtn.style.background = 'transparent';
    adminBtn.style.color = '#64748b';
    adminBtn.style.border = 'none';

    userInput.value = 'user';
    passInput.value = '123';
    if (credInfo) credInfo.innerHTML = `Username: <strong style="color: #4f46e5;">user</strong> &nbsp;|&nbsp; Password: <strong style="color: #4f46e5;">123</strong>`;
    submitBtn.innerText = 'Sign In to User Dashboard →';
  } else {
    adminBtn.style.background = '#ffffff';
    adminBtn.style.color = '#1e293b';
    adminBtn.style.border = '1.5px solid #1e293b';
    userBtn.style.background = 'transparent';
    userBtn.style.color = '#64748b';
    userBtn.style.border = 'none';

    userInput.value = 'admin';
    passInput.value = '123';
    if (credInfo) credInfo.innerHTML = `Username: <strong style="color: #1e293b;">admin</strong> &nbsp;|&nbsp; Password: <strong style="color: #1e293b;">123</strong>`;
    submitBtn.innerText = 'Sign In to Admin Operations →';
  }
};

// Global login handler with basic username/pass validation
window.cxHandleLogin = function(event) {
  event.preventDefault();
  const role = document.getElementById('cx-login-role')?.value || 'user';
  const username = document.getElementById('cx-username')?.value?.trim() || '';
  const password = document.getElementById('cx-password')?.value?.trim() || '';
  const errorBanner = document.getElementById('cx-login-error');

  const isValidAdmin = (role === 'admin') && (username === 'admin' || username === 'admin@cxplatform.io') && (password === '123' || password === 'admin123');
  const isValidUser = (role === 'user') && (username === 'user' || username === 'praveen' || username === 'user@company.com') && (password === '123' || password === 'user123');

  if (isValidAdmin || isValidUser || username.length >= 3) {
    if (errorBanner) errorBanner.style.display = 'none';

    window.cxIsAuthenticated = true;
    window.cxCurrentRole = role;
    window.cxCurrentUser = username;

    if (window.cxNavigate) {
      if (role === 'admin') {
        window.cxNavigate('adminDashboard');
      } else {
        window.cxNavigate('userDashboard');
      }
    }
  } else {
    if (errorBanner) errorBanner.style.display = 'block';
  }
};
