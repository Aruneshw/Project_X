/**
 * Enterprise CX Platform — Customer Review Page
 * Ratings, CSAT Feedback, & Learning Agent (#13) RL Feedback Submission.
 * Styled completely using the Board Cards visual system and ListContainer visual tokens.
 */

export function renderCustomerReview() {
  return `
    <div class="customer-review-wrapper" style="display:flex; flex-direction:column; gap:24px;">
      <!-- Pinned Header Card (Warm Orange Board Card style) -->
      <div class="rc-card rc-card-orange rc-card-orange" style="padding:24px;">
        <span style="font-size:0.75rem; font-weight:800; color:#1e293b; text-transform:uppercase; letter-spacing:0.08em;">Resolution Quality Feedback</span>
        <h1 style="font-size:1.6rem; font-weight:800; color:#1e293b; margin:4px 0 0 0;">Customer Reviews & Feedback</h1>
        <p style="color:#1e293b; opacity:0.85; font-size:0.88rem; margin-top:2px;">Rate your experience. Your feedback directly trains our Reinforcement Learning Agent (Agent #13).</p>
      </div>

      <!-- Submit Review Card (ListContainer cream style) -->
      <div class="lc-card" style="padding:24px;">
        <h2 style="font-size:1.2rem; font-weight:800; color:#1e293b; margin:0 0 6px 0;">Submit a Resolution Review</h2>
        <p style="font-size:0.85rem; color:#64748b; margin:0 0 20px 0;">How satisfied were you with the AI auto-resolution or human reviewer decision?</p>

        <form onsubmit="cxSubmitReview(event)" style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <label style="font-size:0.85rem; font-weight:800; color:#1e293b; display:block; margin-bottom:6px;">Select Resolved Case</label>
            <select id="review-case-id" required style="width:100%; padding:10px 12px; border-radius:10px; border:2px solid #1e293b; font-size:0.88rem; outline:none; background:#fff;">
              <option value="CLM-2846">CLM-2846 — Wrong Item (Score: 94%) — Auto-Resolved</option>
              <option value="CLM-2843">CLM-2843 — Return Request (Score: 91%) — Auto-Resolved</option>
              <option value="CLM-2841">CLM-2841 — Late Delivery (Score: 88%) — Auto-Resolved</option>
            </select>
          </div>

          <div>
            <label style="font-size:0.85rem; font-weight:800; color:#1e293b; display:block; margin-bottom:6px;">Resolution Satisfaction Rating</label>
            <div style="display:flex; gap:12px; font-size:1.8rem; cursor:pointer;" id="star-rating">
              <span onclick="cxSetStars(1)">⭐</span>
              <span onclick="cxSetStars(2)">⭐</span>
              <span onclick="cxSetStars(3)">⭐</span>
              <span onclick="cxSetStars(4)">⭐</span>
              <span onclick="cxSetStars(5)">⭐</span>
            </div>
            <input type="hidden" id="review-rating" value="5" />
          </div>

          <div>
            <label style="font-size:0.85rem; font-weight:800; color:#1e293b; display:block; margin-bottom:6px;">Feedback Details</label>
            <textarea id="review-text" required placeholder="Share your experience with the evidence capture and speed of resolution..." style="width:100%; padding:10px 12px; border-radius:10px; border:2px solid #1e293b; font-size:0.88rem; outline:none; resize:vertical; min-height:80px;"></textarea>
          </div>

          <button type="submit" class="btn btn-primary" style="width:240px; border:2px solid #1e293b; box-shadow:3px 3px 0 #1e293b;">
            Submit Review & RL Feedback →
          </button>
        </form>
      </div>

      <!-- Past Reviews List (ListContainer style with dashed lines) -->
      <div class="lc-card" style="padding:24px;">
        <h3 class="lc-card-header" style="margin-top:0; border-bottom:2px solid #1e293b; padding-bottom:12px;">Recent Platform Reviews</h3>

        <div class="lc-list" style="margin-top:16px;">
          <div class="lc-item">
            <div class="lc-badge">P</div>
            <div class="lc-content">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <h4 class="lc-title" style="margin:0;">Praveen — Case #CLM-2846</h4>
                <span style="color:#f59e0b; font-weight:800;">⭐⭐⭐⭐⭐ 5.0</span>
              </div>
              <p style="font-size:0.82rem; color:#475569; margin:4px 0 0 0;">"Camera capture gate was very smooth. Received full refund in under 2 minutes!"</p>
            </div>
          </div>

          <div class="lc-item">
            <div class="lc-badge">S</div>
            <div class="lc-content">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <h4 class="lc-title" style="margin:0;">Sarah M. — Case #CLM-2847</h4>
                <span style="color:#f59e0b; font-weight:800;">⭐⭐⭐⭐⭐ 5.0</span>
              </div>
              <p style="font-size:0.82rem; color:#475569; margin:4px 0 0 0;">"The LED pen physical challenge was unique and quick to complete. Great security!"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.cxSetStars = function(count) {
  const ratingInput = document.getElementById('review-rating');
  if (ratingInput) ratingInput.value = count;
  alert(`Rating set to ${count} stars ⭐`);
};

window.cxSubmitReview = function(event) {
  event.preventDefault();
  const caseId = document.getElementById('review-case-id')?.value || 'CLM-2846';
  const rating = document.getElementById('review-rating')?.value || '5';
  alert(`✅ Thank you for your review!\n\nCase: ${caseId}\nRating: ${rating}/5 Stars\n\nYour feedback has been fed into Learning Agent (#13) for reinforcement learning weight tuning.`);
};
