/**
 * Enterprise CX Platform — Customer Profile Page
 * Styled completely using the Board Cards visual system and ListContainer visual tokens.
 */

export function renderCustomerProfile() {
  const user = window.cxCurrentUser || 'Praveen';

  return `
    <div class="customer-profile-wrapper" style="display:flex; flex-direction:column; gap:24px;">
      <!-- Pinned Header Card (Warm Yellow Board Card style) -->
      <div class="rc-card rc-card-yellow rc-card-yellow" style="padding:24px;">
        <span style="font-size:0.75rem; font-weight:800; color:#1e293b; text-transform:uppercase; letter-spacing:0.08em;">User Account</span>
        <h1 style="font-size:1.6rem; font-weight:800; color:#1e293b; margin:4px 0 0 0;">Customer Profile</h1>
        <p style="color:#1e293b; opacity:0.85; font-size:0.88rem; margin-top:2px;">Manage your profile information, authentication credentials, and dispute preferences.</p>
      </div>

      <!-- Profile Details Card (Cream ListContainer style) -->
      <div class="lc-card" style="padding:24px; display:flex; align-items:center; gap:20px;">
        <div style="width:70px; height:70px; border-radius:50%; background:var(--rc-color-red-bg); border: 2.5px solid #1e293b; color:#fff; display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:800; box-shadow: 3px 3px 0 #1e293b;">
          ${user.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 style="font-size:1.4rem; font-weight:800; color:#1e293b; margin:0;">${user}</h2>
          <div style="font-size:0.85rem; color:#64748b; margin-top:2px; font-weight:700;">Verified Platform Customer · ID #CUST-91823</div>
          <div style="display:flex; gap:10px; margin-top:10px;">
            <span style="background:#dcfce7; color:#15803d; font-size:0.75rem; font-weight:800; padding:4px 10px; border-radius:12px; border:1.5px solid #1e293b;">Verified Account</span>
            <span style="background:#e0e7ff; color:#4338ca; font-size:0.75rem; font-weight:800; padding:4px 10px; border-radius:12px; border:1.5px solid #1e293b;">Camera Evidence Enabled</span>
          </div>
        </div>
      </div>

      <!-- Account Settings Form (Cream ListContainer style) -->
      <div class="lc-card" style="padding:24px;">
        <h3 class="lc-card-header" style="margin-top:0; border-bottom:2px solid #1e293b; padding-bottom:12px; margin-bottom:20px;">
          Account Details & Security
        </h3>
        
        <form onsubmit="cxSaveProfile(event)" style="display:flex; flex-direction:column; gap:16px; max-width:480px;">
          <div>
            <label style="font-size:0.85rem; font-weight:800; color:#1e293b; display:block; margin-bottom:6px;">Full Name</label>
            <input type="text" id="profile-name" value="${user}" required style="width:100%; padding:10px 12px; border-radius:10px; border:2px solid #1e293b; font-size:0.88rem; outline:none;" />
          </div>
          <div>
            <label style="font-size:0.85rem; font-weight:800; color:#1e293b; display:block; margin-bottom:6px;">Email Address (Auto-Detected)</label>
            <input type="email" value="${window.cxCurrentUserEmail || ''}" disabled style="width:100%; padding:10px 12px; border-radius:10px; border:2px solid #1e293b; font-size:0.88rem; outline:none; background:#f1f5f9; cursor:not-allowed;" />
          </div>
          <div>
            <label style="font-size:0.85rem; font-weight:800; color:#1e293b; display:block; margin-bottom:6px;">Preferred Notification Channel</label>
            <select style="width:100%; padding:10px 12px; border-radius:10px; border:2px solid #1e293b; font-size:0.88rem; outline:none; background:#fff;">
              <option>Email & In-App Alerts</option>
              <option>WhatsApp Instant Status</option>
              <option>SMS Text Alerts</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary" style="width:180px; border:2px solid #1e293b; box-shadow:3px 3px 0 #1e293b;">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  `;
}

window.cxSaveProfile = async function(event) {
  event.preventDefault();
  const name = document.getElementById('profile-name').value;
  const btn = event.target.querySelector('button[type="submit"]');
  
  if (!window.supabase) {
    alert('✅ Profile details updated locally.');
    window.cxCurrentUser = name;
    return;
  }
  
  btn.disabled = true;
  btn.innerText = 'Saving...';
  
  try {
    const { data, error } = await window.supabase.auth.updateUser({
      data: { full_name: name }
    });
    if (error) throw error;
    alert('✅ Profile details successfully updated and stored in Supabase.');
    window.cxCurrentUser = name;
  } catch (err) {
    alert('Error updating profile: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.innerText = 'Save Profile';
  }
};
