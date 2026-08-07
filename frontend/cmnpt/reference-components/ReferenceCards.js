/**
 * Playful, Illustrative Card Components (ui-reference-rules-aligned)
 * Created based on the mentor app visual reference.
 */

// SVG Right Arrow Icon used for the circular navigation buttons
const ArrowRightIcon = `
  <svg viewBox="0 0 24 24">
    <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

/**
 * 1. Ask a Doubt Card (Coral Red)
 */
export function AskADoubtCard({ title = "Ask a Doubt", description = "Post your question and get help from nearby mentors" } = {}) {
  return `
    <div class="rc-card rc-card-red rc-card-red" style="min-height: 200px;">
      <div class="rc-flex-container">
        <div class="rc-left-content">
          <div class="rc-card-header">?</div>
          <h2 class="rc-card-title">${title}</h2>
          <p class="rc-card-desc">${description}</p>
          <button class="rc-circle-btn" aria-label="Ask question">
            ${ArrowRightIcon}
          </button>
        </div>
        <div class="rc-right-illustration" style="background: rgba(255,255,255,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <!-- SVG Book & Lightbulb Illustration -->
          <svg width="80" height="80" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="28" fill="rgba(255,255,255,0.2)"/>
            <path d="M22 44h20v4H22zM24 18a8 8 0 0 1 16 0c0 4-3 6-5 9v3h-6v-3c-2-3-5-5-5-9z" fill="#fff" stroke="#1e293b" stroke-width="2"/>
            <rect x="20" y="32" width="24" height="8" rx="2" fill="#ffd875" stroke="#1e293b" stroke-width="2"/>
          </svg>
        </div>
      </div>
    </div>
  `;
}

/**
 * 2. My Chats Card (Warm Yellow)
 */
export function MyChatsCard({ title = "My Chats", description = "Continue your conversations" } = {}) {
  return `
    <div class="rc-card rc-card-yellow rc-card-blue">
      <div class="rc-flex-container">
        <div class="rc-left-content">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: #ffd875; border: 2px solid #1e293b; display:flex; align-items:center; justify-content:center; font-size:1.2rem;">✉️</div>
          <h3 class="rc-card-title">${title}</h3>
          <p class="rc-card-desc">${description}</p>
          <button class="rc-circle-btn" aria-label="View chats">
            ${ArrowRightIcon}
          </button>
        </div>
        <div class="rc-right-illustration" style="display:flex; flex-direction:column; gap:8px; justify-content:center;">
          <!-- Chat Bubbles mockup -->
          <div style="background:#fff; border: 2px solid #1e293b; border-radius:10px; padding:6px 10px; font-size:0.75rem; display:flex; align-items:center; gap:6px; box-shadow: 2px 2px 0 #1e293b;">
            <div style="width:16px; height:16px; border-radius:50%; background:#76c893;"></div>
            <div style="width:40px; height:6px; background:#e2e8f0; border-radius:3px;"></div>
          </div>
          <div style="background:#fff; border: 2px solid #1e293b; border-radius:10px; padding:6px 10px; font-size:0.75rem; display:flex; align-items:center; gap:6px; box-shadow: 2px 2px 0 #1e293b; transform: translateX(10px);">
            <div style="width:40px; height:6px; background:#e2e8f0; border-radius:3px;"></div>
            <div style="width:16px; height:16px; border-radius:50%; background:#ffb875;"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * 3. Schedule Call Card (Peach Orange)
 */
export function ScheduleCallCard({ title = "Schedule Call", description = "Book 1-on-1 Jitsi call" } = {}) {
  return `
    <div class="rc-card rc-card-orange rc-card-red">
      <div class="rc-flex-container">
        <div class="rc-left-content">
          <!-- Calendar Badge -->
          <div style="width:44px; background:#fff; border:2px solid #1e293b; border-radius:8px; overflow:hidden; text-align:center; box-shadow: 2px 2px 0 #1e293b;">
            <div style="background:#ef4444; color:#fff; font-size:0.55rem; font-weight:800; padding:2px 0;">July</div>
            <div style="font-size:0.95rem; font-weight:800; padding:2px 0; color:#1e293b;">17</div>
          </div>
          <h3 class="rc-card-title">${title}</h3>
          <p class="rc-card-desc">${description}</p>
          <button class="rc-circle-btn" aria-label="Schedule call">
            ${ArrowRightIcon}
          </button>
        </div>
        <div class="rc-right-illustration" style="display:flex; align-items:center; justify-content:center;">
          <!-- Illustrative Headphones SVG -->
          <svg width="70" height="70" viewBox="0 0 64 64" fill="none">
            <path d="M12 36c0-11 9-20 20-20s20 9 20 20v8h-6v-8c0-7.7-6.3-14-14-14S18 28.3 18 36v8h-6v-8z" fill="#1e293b"/>
            <rect x="10" y="34" width="8" height="14" rx="4" fill="#ffd875" stroke="#1e293b" stroke-width="2"/>
            <rect x="46" y="34" width="8" height="14" rx="4" fill="#ffd875" stroke="#1e293b" stroke-width="2"/>
            <path d="M14 48c0 4 3 7 7 7h10" stroke="#1e293b" stroke-width="2"/>
          </svg>
        </div>
      </div>
    </div>
  `;
}

/**
 * 4. Nearby Mentors Card (Mint Green)
 */
export function NearbyMentorsCard({ title = "Nearby Mentors", description = "View mentors available near you" } = {}) {
  return `
    <div class="rc-card rc-card-green rc-card-yellow">
      <div style="position:absolute; top:16px; right:16px; font-size:1.2rem; color:#1e293b;">🌐</div>
      <div class="rc-flex-container">
        <div class="rc-left-content">
          <h3 class="rc-card-title" style="margin-top:0;">${title}</h3>
          <p class="rc-card-desc" style="margin-bottom:16px;">${description}</p>
          <div style="display:flex; gap:12px; align-items:center;">
            <button class="rc-circle-btn" aria-label="View mentors">
              ${ArrowRightIcon}
            </button>
            <span style="font-size:1.4rem;">📍</span>
          </div>
        </div>
        
        <!-- Overlapping Profile Avatars -->
        <div style="display:flex; align-items:center; margin-left:auto; padding-right:10px;">
          <div style="width:46px; height:46px; border-radius:50%; border:2.5px solid #fff; background:#e2e8f0; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.15); margin-right:-14px; z-index:3;">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop" style="width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="width:46px; height:46px; border-radius:50%; border:2.5px solid #fff; background:#e2e8f0; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.15); margin-right:-14px; z-index:2;">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop" style="width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="width:46px; height:46px; border-radius:50%; border:2.5px solid #fff; background:#e2e8f0; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.15); z-index:1;">
            <img src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&fit=crop" style="width:100%; height:100%; object-fit:cover;">
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * 5. Full Component Assembly Group
 */
export function renderReferenceUI() {
  return `
    <div class="rc-container">
      <!-- 1. Ask a Doubt -->
      ${AskADoubtCard()}

      <!-- 2 & 3. Column Grid -->
      <div class="rc-row">
        ${MyChatsCard()}
        ${ScheduleCallCard()}
      </div>

      <!-- 4. Nearby Mentors -->
      ${NearbyMentorsCard()}
    </div>
  `;
}
