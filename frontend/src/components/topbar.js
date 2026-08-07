import { ICONS } from '../utils/icons.js';

export function renderTopbar(state) {
  return `
    <header class="topbar" id="topbar">
      <div class="topbar__search">
        ${ICONS.search}
        <input type="text" placeholder="Search claims, customers, agents..." id="global-search" />
      </div>
      <div class="topbar__actions">
        <button class="topbar__icon-btn" id="btn-notifications" aria-label="Notifications">
          ${ICONS.bell}
          ${state.notifications > 0 ? `<span class="badge">${state.notifications}</span>` : ''}
        </button>
        <button class="topbar__icon-btn" id="btn-settings" aria-label="Settings">
          ${ICONS.settings}
        </button>
        <div class="topbar__avatar" id="user-avatar">AW</div>
      </div>
    </header>
  `;
}
