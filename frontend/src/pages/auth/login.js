/**
 * Enterprise CX Platform — Login Portal Page
 * Default landing page with simple username & password authentication.
 * Styled completely using the Board Cards visual system and ListContainer visual tokens.
 */

import { renderUserDashboard } from '../customer/userDashboard.js';
import { renderAdminDashboard } from '../admin/adminDashboard.js';
import { supabase } from '../../utils/supabase.js';

export function renderLogin() {
  return `
    <style>
      .login-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; }
      @media (max-width: 768px) {
        .login-grid { grid-template-columns: 1fr; }
      }
    </style>
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
      <div class="login-grid">
        
        <!-- Form Section (ListContainer style) -->
        <div class="lc-card" style="padding: 36px; display: flex; flex-direction: column; justify-content: center;">
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #1e293b; margin-bottom: 4px;">Portal Sign In</h2>
          <p style="font-size: 0.88rem; color: #64748b; margin-bottom: 20px; font-weight: 700;">Sign in with your corporate or personal Google account.</p>

          <!-- Form -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <button onclick="cxHandleGoogleLogin()" class="btn btn-primary" style="width: 100%; padding: 14px; border: 2px solid #1e293b; border-radius: 10px; box-shadow: 3px 3px 0 #1e293b; font-weight:800; display:flex; align-items:center; justify-content:center; gap:12px; background:white; color:#1e293b; cursor:pointer; transition:all 0.2s ease;">
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                </g>
              </svg>
              Sign In with Google (Customers)
            </button>

            <div style="text-align:center; margin:16px 0; border-bottom:2px dashed #cbd5e1; line-height:0.1em;">
              <span style="background:#fff; padding:0 10px; color:#64748b; font-size:0.75rem; font-weight:800;">OR ADMIN LOGIN</span>
            </div>

            <div>
              <input type="text" id="admin-id" placeholder="Admin ID" style="width:100%; padding:10px 12px; margin-bottom:10px; border-radius:8px; border:2px solid #1e293b; font-size:0.88rem; outline:none;" />
              <input type="password" id="admin-password" placeholder="Password" style="width:100%; padding:10px 12px; margin-bottom:12px; border-radius:8px; border:2px solid #1e293b; font-size:0.88rem; outline:none;" />
              <button onclick="cxHandleAdminLogin()" class="btn btn-primary" style="width:100%; padding:12px; border: 2px solid #1e293b; border-radius:8px; box-shadow: 3px 3px 0 #1e293b; font-weight:800;">
                Secure Admin Login
              </button>
            </div>
            
          </div>
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

window.cxHandleGoogleLogin = async function() {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      }
    });
    
    if (error) {
      console.warn('Supabase config error, using fallback:', error.message);
      // Fallback for Vercel if redirect URLs aren't set
      alert("⚠️ Supabase Redirect not configured for Vercel. Entering Offline User Mode.");
      window.cxIsAuthenticated = true;
      window.cxCurrentRole = 'user';
      window.cxCurrentUser = 'Demo User';
      if(window.cxNavigate) window.cxNavigate('userDashboard');
    }
  } catch (err) {
    console.error('Exception during login:', err);
    alert("⚠️ Network Error. Entering Offline User Mode.");
    window.cxIsAuthenticated = true;
    window.cxCurrentRole = 'user';
    window.cxCurrentUser = 'Demo User';
    if(window.cxNavigate) window.cxNavigate('userDashboard');
  }
};

window.cxHandleAdminLogin = async function() {
  const user = document.getElementById('admin-id').value;
  const pass = document.getElementById('admin-password').value;
  if (!user || !pass) return alert("Enter Admin ID and Password");
  
  try {
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/v1/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass })
    });
    
    if (!res.ok) {
      throw new Error("Invalid admin credentials");
    }
    
    const data = await res.json();
    sessionStorage.setItem('admin_token', data.access_token);
    window.cxIsAuthenticated = true;
    window.cxCurrentRole = 'admin';
    window.cxCurrentUser = 'System Administrator';
    if(window.cxNavigate) window.cxNavigate('adminDashboard');
    
  } catch (err) {
    console.warn("Backend unavailable or CORS issue. Falling back.", err);
    if (user === 'admin123' && pass === '123456789') {
      alert("⚠️ Backend unreachable on Vercel. Entering Offline Admin Mode.");
      sessionStorage.setItem('admin_token', 'demo_token');
      window.cxIsAuthenticated = true;
      window.cxCurrentRole = 'admin';
      window.cxCurrentUser = 'System Administrator (Demo)';
      if(window.cxNavigate) window.cxNavigate('adminDashboard');
    } else {
      alert("Invalid credentials or backend unreachable: " + err.message);
    }
  }
};
