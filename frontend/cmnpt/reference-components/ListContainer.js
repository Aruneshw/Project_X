/**
 * Reusable List & Progress Container Component
 * Designed based on the second UI reference (e.g. Duolingo-style Daily Quests card).
 */

/**
 * Renders a single list row item with a square badge, title, progress bar, and value text.
 */
export function ListRowItem({ badgeText = "XP", title = "Task Title", current = 0, total = 10, fillPercent = 0 }) {
  // Calculate percentage if not explicitly provided
  const pct = fillPercent || Math.min(100, Math.round((current / total) * 100));

  return `
    <div class="lc-item">
      <!-- Square Badge -->
      <div class="lc-badge">
        ${badgeText}
      </div>

      <!-- Center Title & Progress Bar -->
      <div class="lc-content">
        <h4 class="lc-title">${title}</h4>
        <div class="lc-progress-track">
          <div class="lc-progress-fill" style="width: ${pct}%;"></div>
        </div>
      </div>

      <!-- Value text on the right -->
      <div class="lc-value">
        ${current} / ${total}
      </div>
    </div>
  `;
}

/**
 * Outer Container Component holding multiple list rows
 */
export function ListContainer({ title = "Daily Quests", items = [] } = {}) {
  // If no items provided, use mock reference items matching the image
  const displayItems = items.length > 0 ? items : [
    { badgeText: "XP", title: "Earn 20 XP", current: 14, total: 20 },
    { badgeText: "OW", title: "Get 5 in a row correct", current: 1, total: 2 },
    { badgeText: "TM", title: "Spend 15 minutes learning", current: 3, total: 15 }
  ];

  return `
    <div class="lc-card">
      <div class="lc-card-header">${title}</div>
      <div class="lc-list">
        ${displayItems.map(item => ListRowItem(item)).join('')}
      </div>
    </div>
  `;
}
