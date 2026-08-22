export const CSS = `
/* ----------------------------------------------------
   Session Settings View Page (conversation.view Tab after 轨迹)
   Hide bottom composer & make settings page fill bottom
   ---------------------------------------------------- */
[data-conversation-scroll]:has([data-session-settings-view]) > [data-composer-seat],
[data-conversation-scroll]:has(.dsh-session-view-root) > [data-composer-seat],
:has(> * > * > [data-session-settings-view]) > [data-composer-seat],
:has(> * > * > .dsh-session-view-root) > [data-composer-seat],
[data-conversation-scroll]:has([data-session-settings-view]) [class*="composerSeat"],
[data-conversation-scroll]:has(.dsh-session-view-root) [class*="composerSeat"] {
  display: none !important;
}

[data-conversation-scroll]:has([data-session-settings-view]),
[data-conversation-scroll]:has(.dsh-session-view-root) {
  display: flex !important;
  flex-direction: column !important;
  flex: 1 1 0% !important;
  height: 100% !important;
  min-height: 0 !important;
  overflow: hidden !important;
  scrollbar-gutter: auto !important;
}

[data-conversation-scroll]:has([data-session-settings-view]) > [data-slot="conversation.session"],
[data-conversation-scroll]:has(.dsh-session-view-root) > [data-slot="conversation.session"],
[data-conversation-scroll]:has([data-session-settings-view]) [data-slot="conversation.view"],
[data-conversation-scroll]:has(.dsh-session-view-root) [data-slot="conversation.view"],
[data-conversation-scroll]:has([data-session-settings-view]) [class*="viewArea"],
[data-conversation-scroll]:has(.dsh-session-view-root) [class*="viewArea"] {
  display: flex !important;
  flex-direction: column !important;
  flex: 1 1 0% !important;
  height: 100% !important;
  min-height: 0 !important;
  overflow: hidden !important;
}

.dsh-session-view-root {
  background: var(--dsw-alias-bg-layer-1);
  box-sizing: border-box;
  color: var(--dsw-alias-label-primary);
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  position: relative;
  width: 100%;
}
.dsh-session-view-root * {
  box-sizing: border-box;
}

/* Header & Clone Toolbar */
.dsh-session-view-header {
  align-items: center;
  background: var(--dsw-alias-bg-layer-2);
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
  padding: 12px 24px;
}
.dsh-session-view-header-left {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.dsh-session-view-title {
  color: var(--dsw-alias-label-primary);
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  margin: 0;
}

/* Session ID Chip */
.dsh-session-id-chip {
  align-items: center;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  display: inline-flex;
  font-family: monospace;
  font-size: 12px;
  gap: 6px;
  line-height: 16px;
  padding: 4px 10px;
  transition: background-color 0.15s, color 0.15s, border-color 0.15s;
}
.dsh-session-id-chip:hover {
  background: var(--dsw-alias-bg-layer-2);
  border-color: var(--dsw-alias-border-l1);
  color: var(--dsw-alias-label-primary);
}
.dsh-session-id-chip.copied {
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.dsh-sam-status-badge {
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
}
.dsh-sam-status-badge.badge-default {
  background: rgba(147, 51, 234, 0.12);
  color: #a855f7;
}
.dsh-sam-status-badge.badge-custom {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

/* Clone Toolbar */
.dsh-clone-toolbar {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.dsh-clone-label {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  font-weight: 500;
}
.dsh-clone-input {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  color: var(--dsw-alias-label-primary);
  font-family: monospace;
  font-size: 12px;
  height: 30px;
  outline: none;
  padding: 0 10px;
  transition: border-color 0.15s;
  width: 250px;
}
.dsh-clone-input:focus {
  border-color: var(--dsw-alias-brand-primary);
}
.dsh-clone-btn {
  font-size: 12px;
  height: 30px;
  padding: 0 12px;
}
.dsh-btn-icon-left {
  margin-right: 6px;
}

.dsh-view-notice {
  margin: 12px 24px 0;
}

/* Split Body */
.dsh-session-view-body {
  display: flex;
  flex: 1 1 0%;
  min-height: 0;
  overflow: hidden;
}

/* Left Sub-sidebar (clean layout: icon + title + badge) */
.dsh-session-view-sidebar {
  background: var(--dsw-alias-bg-layer-2);
  border-right: 1px solid var(--dsw-alias-border-l2);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 4px;
  overflow-y: auto;
  padding: 16px 12px;
  width: 230px;
}
.dsh-view-sidebar-item {
  align-items: center;
  background: 0 0;
  border: 1px solid transparent;
  border-radius: 8px;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  text-align: left;
  transition: background-color 0.15s, border-color 0.15s;
  width: 100%;
}
.dsh-view-sidebar-item:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-view-sidebar-item.active {
  background: var(--dsw-alias-bg-layer-1);
  border-color: var(--dsw-alias-border-l2);
  box-shadow: var(--dsw-shadow-lv1);
}
.dsh-view-item-icon {
  align-items: center;
  background: var(--dsw-alias-bg-layer-1);
  border-radius: 6px;
  color: var(--dsw-alias-brand-primary);
  display: flex;
  flex-shrink: 0;
  height: 28px;
  justify-content: center;
  width: 28px;
}
.dsh-view-sidebar-item.active .dsh-view-item-icon {
  background: var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-label-primary-foreground);
}
.dsh-view-item-title {
  color: var(--dsw-alias-label-primary);
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  min-width: 0;
}
.dsh-view-sidebar-item.active .dsh-view-item-title {
  font-weight: 600;
}
.dsh-view-item-badge {
  background: var(--dsw-alias-bg-layer-1);
  border-radius: 4px;
  color: var(--dsw-alias-label-secondary);
  flex-shrink: 0;
  font-size: 11px;
  max-width: 80px;
  overflow: hidden;
  padding: 2px 6px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-view-item-badge.highlight {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
  font-weight: 600;
}

/* Right Content Panel */
.dsh-session-view-content {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  padding: 24px 32px 60px;
}
.dsh-view-content-inner {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 760px;
}

/* Section Header inside Content Panel */
.dsh-section-header {
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 4px;
  padding-bottom: 12px;
}
.dsh-section-title {
  color: var(--dsw-alias-label-primary);
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  margin: 0;
}
.dsh-section-desc {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 18px;
  margin: 0;
}

/* Footer Actions */
.dsh-session-view-footer {
  align-items: center;
  background: var(--dsw-alias-bg-layer-2);
  border-top: 1px solid var(--dsw-alias-border-l2);
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  padding: 14px 28px;
}
.dsh-view-footer-left {
  align-items: center;
  display: flex;
  gap: 10px;
}
.dsh-view-footer-right {
  align-items: center;
  display: flex;
  gap: 10px;
}

/* Forms & Selectors */
.dsh-sam-mode-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.dsh-sam-mode-item {
  align-items: flex-start;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  transition: border-color 0.15s, background-color 0.15s;
}
.dsh-sam-mode-item:hover {
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-sam-mode-item.selected {
  background: var(--dsw-alias-bg-layer-2);
  border-color: var(--dsw-alias-brand-primary);
}
.dsh-sam-mode-item input[type="radio"] {
  accent-color: var(--dsw-alias-brand-primary);
  cursor: pointer;
  margin-top: 3px;
}
.dsh-sam-mode-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.dsh-sam-mode-title {
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  font-weight: 600;
}
.dsh-sam-mode-desc {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 18px;
}
.dsh-sam-fields-panel {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
}
.dsh-sam-field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.dsh-sam-field-label {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  font-weight: 500;
}
.dsh-sam-select {
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  box-sizing: border-box;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
  height: 36px;
  line-height: 20px;
  max-width: 100%;
  min-width: 0;
  padding: 0 10px;
  width: 100%;
}
.dsh-sam-select:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 1px;
}
.dsh-sam-select:disabled {
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-tertiary);
  cursor: not-allowed;
  opacity: 0.7;
}
.dsh-sam-notice {
  border-radius: 6px;
  font-size: 13px;
  line-height: 20px;
  padding: 10px 14px;
}
.dsh-sam-notice.success {
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10b981;
}
.dsh-sam-notice.error {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}
.dsh-sam-notice.info {
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #3b82f6;
}
.dsh-sam-notices-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0 16px;
}
.dsh-sam-notices-block .dsh-sam-notice {
  margin: 0;
}
.dsh-sam-btn {
  align-items: center;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  gap: 6px;
  height: 36px;
  justify-content: center;
  padding: 0 16px;
  transition: background-color 0.15s, border-color 0.15s, opacity 0.15s;
}
.dsh-sam-btn.primary {
  background: var(--dsw-alias-brand-primary);
  border: 1px solid var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-label-primary-foreground);
}
.dsh-sam-btn.primary:hover:not(:disabled) {
  background: var(--dsw-alias-button-primary-hover, var(--dsw-alias-brand-primary));
  border-color: var(--dsw-alias-button-primary-hover, var(--dsw-alias-brand-primary));
}
.dsh-sam-btn.secondary {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-primary);
}
.dsh-sam-btn.secondary:hover:not(:disabled) {
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-sam-btn.default-btn {
  background: rgba(147, 51, 234, 0.12);
  border: 1px solid rgba(147, 51, 234, 0.3);
  color: var(--dsw-alias-label-primary);
}
.dsh-sam-btn.default-btn:hover:not(:disabled) {
  background: rgba(147, 51, 234, 0.22);
}
.dsh-sam-btn.tertiary {
  background: 0 0;
  border: 1px solid var(--dsw-alias-border-l1);
  color: var(--dsw-alias-label-secondary);
}
.dsh-sam-btn.tertiary:hover {
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
}
.dsh-sam-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* MCP session checklist */
.dsh-session-mcp-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.dsh-mcp-quick-bar {
  align-items: center;
  display: flex;
  gap: 10px;
  margin-bottom: 2px;
}
.dsh-mcp-select-btn {
  align-items: center;
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  display: inline-flex;
  font-size: 12px;
  font-weight: 500;
  gap: 6px;
  line-height: 16px;
  padding: 6px 12px;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;
}
.dsh-mcp-select-btn:hover {
  background: var(--dsw-alias-bg-layer-3, var(--dsw-alias-bg-layer-1));
  border-color: var(--dsw-alias-border-l1);
}
.dsh-mcp-select-btn.active {
  background: rgba(88, 166, 255, 0.1);
  border-color: var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-brand-primary);
}
.dsh-mcp-text-btn {
  align-items: center;
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  display: inline-flex;
  font-size: 12px;
  font-weight: 500;
  gap: 6px;
  line-height: 16px;
  padding: 6px 12px;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;
}
.dsh-mcp-text-btn:hover {
  background: var(--dsw-alias-bg-layer-3, var(--dsw-alias-bg-layer-1));
  border-color: var(--dsw-alias-border-l1);
}
.dsh-session-mcp-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dsh-session-mcp-item {
  align-items: center;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  gap: 12px;
  outline: none;
  padding: 12px 16px;
  transition: background-color 0.15s, border-color 0.15s;
  user-select: none;
}
.dsh-session-mcp-item:hover:not(.readonly) {
  background: var(--dsw-alias-bg-layer-2);
  border-color: var(--dsw-alias-border-l1);
}
.dsh-session-mcp-item:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: -1px;
}
.dsh-session-mcp-item.active {
  background: var(--dsw-alias-bg-layer-2);
  border-color: var(--dsw-alias-brand-primary);
}
.dsh-session-mcp-item.readonly {
  cursor: default;
  opacity: 0.8;
}
.dsh-session-mcp-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.dsh-session-mcp-row1 {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-start;
}
.dsh-session-mcp-title-wrap {
  align-items: center;
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
}
.dsh-session-mcp-name {
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  font-weight: 600;
}
.dsh-session-mcp-desc {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 16px;
  margin: 0;
}
.dsh-session-mcp-target {
  background: var(--dsw-alias-bg-layer-1);
  border-radius: 4px;
  color: var(--dsw-alias-label-secondary);
  display: inline-block;
  font-family: monospace;
  font-size: 11px;
  overflow: hidden;
  padding: 2px 6px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-session-mcp-check {
  color: var(--dsw-alias-brand-primary);
  display: flex;
  flex: none;
}
.dsh-session-mcp-tools-row {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}
.dsh-session-tools-btn {
  align-items: center;
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 4px;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  display: inline-flex;
  font-size: 11px;
  font-weight: 500;
  gap: 4px;
  line-height: 14px;
  padding: 3px 8px;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;
}
.dsh-session-tools-btn:hover {
  background: var(--dsw-alias-bg-layer-3);
  border-color: var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-brand-primary);
}
.dsh-session-tools-mode-badge {
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  line-height: 14px;
  padding: 2px 6px;
}
.dsh-session-tools-mode-badge.default {
  background: rgba(147, 51, 234, 0.1);
  color: #a855f7;
}
.dsh-session-tools-mode-badge.custom {
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}
.dsh-session-tools-mode-badge.all-active {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}
.dsh-session-tools-modes {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

/* ----------------------------------------------------
   MCP Servers Management (Settings -> Plugins Tab)
   ---------------------------------------------------- */
.dsh-mcp-settings-page {
  box-sizing: border-box;
  color: var(--dsw-alias-label-primary);
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
.dsh-mcp-header-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dsh-mcp-header-title-row {
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
}
.dsh-mcp-page-title {
  color: var(--dsw-alias-label-primary);
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
  margin: 0;
}
.dsh-mcp-page-desc {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 20px;
  margin: 4px 0 0;
}
.dsh-mcp-header-actions {
  align-items: center;
  display: flex;
  gap: 8px;
}

/* Server Cards List */
.dsh-mcp-server-list {
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;
}
.dsh-mcp-server-card {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.dsh-mcp-server-card:hover {
  border-color: var(--dsw-alias-border-l2);
}
.dsh-mcp-card-top {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}
.dsh-mcp-card-identity {
  align-items: center;
  display: flex;
  gap: 10px;
  min-width: 0;
}
.dsh-mcp-transport-icon {
  align-items: center;
  background: var(--dsw-alias-bg-layer-2);
  border-radius: 8px;
  color: var(--dsw-alias-brand-primary);
  display: flex;
  flex: none;
  height: 32px;
  justify-content: center;
  width: 32px;
}
.dsh-mcp-title-wrap {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.dsh-mcp-card-name {
  color: var(--dsw-alias-label-primary);
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
}
.dsh-mcp-card-id {
  color: var(--dsw-alias-label-secondary);
  font-family: monospace;
  font-size: 12px;
  line-height: 16px;
}
.dsh-mcp-badges {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.dsh-mcp-proto-badge {
  border-radius: 4px;
  font-family: monospace;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
}
.dsh-mcp-proto-badge.stdio {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}
.dsh-mcp-proto-badge.streamable-http-or-sse,
.dsh-mcp-proto-badge.streamable-http {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}
.dsh-mcp-proto-badge.sse {
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}
.dsh-mcp-proto-badge.timeout {
  background: rgba(139, 92, 246, 0.12);
  color: #8b5cf6;
}
.dsh-mcp-proto-badge.incompatible {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}
.dsh-mcp-proto-badge.downgrade {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}
.dsh-mcp-default-badge {
  background: rgba(147, 51, 234, 0.12);
  border-radius: 4px;
  color: #a855f7;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 6px;
}
.dsh-mcp-card-desc {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 18px;
  margin: 0;
}
.dsh-mcp-target-box {
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  padding: 8px 10px;
}
.dsh-mcp-code-preview {
  color: var(--dsw-alias-label-primary);
  display: block;
  font-family: monospace;
  font-size: 12px;
  line-height: 16px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
.dsh-mcp-inline-test {
  align-items: center;
  border-radius: 6px;
  display: flex;
  font-size: 12px;
  gap: 6px;
  line-height: 16px;
  padding: 6px 10px;
}
.dsh-mcp-inline-test.success {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}
.dsh-mcp-inline-test.error {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}
.dsh-mcp-card-footer {
  align-items: center;
  border-top: 1px solid var(--dsw-alias-border-l2);
  display: flex;
  justify-content: space-between;
  margin-top: 2px;
  padding-top: 10px;
}
.dsh-mcp-mini-btn {
  align-items: center;
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: 12px;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  transition: background-color 0.15s;
}
.dsh-mcp-mini-btn:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-mcp-footer-right {
  align-items: center;
  display: flex;
  gap: 6px;
}
.dsh-mcp-icon-btn {
  align-items: center;
  background: 0 0;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  display: inline-flex;
  height: 28px;
  justify-content: center;
  padding: 0;
  transition: background-color 0.15s, color 0.15s;
  width: 28px;
}
.dsh-mcp-icon-btn:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
.dsh-mcp-icon-btn.danger:hover {
  background: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

/* Empty Card */
.dsh-mcp-empty-card {
  align-items: center;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px dashed var(--dsw-alias-border-l2);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}
.dsh-mcp-empty-icon {
  color: var(--dsw-alias-label-secondary);
}
.dsh-mcp-empty-text {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  max-width: 400px;
}

/* Form Modal Elements */
.dsh-sam-modal-overlay {
  align-items: center;
  backdrop-filter: var(--dsw-mask-blur);
  background: var(--dsw-alias-bg-mask-1);
  display: flex;
  inset: 0;
  justify-content: center;
  position: fixed;
  z-index: 1000;
}
.dsh-sam-modal-panel {
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 20px;
  box-shadow: var(--dsw-shadow-lv3);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: min(680px, calc(100vh - 48px));
  max-width: calc(100vw - 48px);
  overflow-y: auto;
  padding: 24px 28px;
  position: relative;
  width: 680px;
  z-index: 1;
}
.dsh-sam-modal-panel * {
  box-sizing: border-box;
}
.dsh-mcp-form-modal {
  width: 720px;
}
.dsh-sam-header-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
}
.dsh-sam-title {
  color: var(--dsw-alias-label-primary);
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
  margin: 0;
}
.dsh-sam-close-btn {
  align-items: center;
  background: 0 0;
  border: none;
  border-radius: 6px;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  display: flex;
  font-size: 16px;
  height: 28px;
  justify-content: center;
  padding: 0;
  width: 28px;
}
.dsh-sam-close-btn:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
.dsh-mcp-form-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 14px;
}

/* Top Switch Card */
.dsh-mcp-switch-card {
  align-items: center;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  outline: none;
  padding: 12px 16px;
  transition: border-color 0.15s, background-color 0.15s;
  user-select: none;
}
.dsh-mcp-switch-card:hover {
  background: var(--dsw-alias-bg-layer-2);
  border-color: var(--dsw-alias-border-l1);
}
.dsh-mcp-switch-card:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 1px;
}
.dsh-mcp-switch-card.active {
  border-color: var(--dsw-alias-state-success-primary);
}
.dsh-mcp-switch-card.disabled {
  cursor: not-allowed !important;
  opacity: 0.55;
}
.dsh-mcp-switch-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.dsh-mcp-switch-title {
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}
.dsh-mcp-switch-desc {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 16px;
}
.dsh-mcp-switch-btn {
  align-items: center;
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 9999px;
  display: inline-flex;
  flex-shrink: 0;
  height: 24px;
  padding: 2px;
  pointer-events: none;
  position: relative;
  transition: background-color 0.2s, border-color 0.2s;
  width: 44px;
}
.dsh-mcp-switch-btn.active {
  background: var(--dsw-alias-state-success-primary);
  border-color: var(--dsw-alias-state-success-primary);
}
.dsh-mcp-switch-thumb {
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  display: block;
  height: 18px;
  transform: translateX(0);
  transition: transform 0.2s ease-in-out;
  width: 18px;
}
.dsh-mcp-switch-btn.active .dsh-mcp-switch-thumb {
  transform: translateX(20px);
}

.dsh-mcp-form-row {
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr 1fr;
  width: 100%;
}
.flex-1 {
  flex: 1;
  min-width: 0;
}
.dsh-mcp-textarea {
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  color: var(--dsw-alias-label-primary);
  font-family: monospace;
  font-size: 13px;
  line-height: 18px;
  padding: 8px 10px;
  resize: vertical;
  width: 100%;
}
.dsh-mcp-textarea:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 1px;
}
/* KV Rows for Headers & ENV */
.dsh-mcp-kv-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dsh-mcp-kv-row {
  align-items: center;
  display: grid;
  gap: 8px;
  grid-template-columns: minmax(120px, 0.8fr) minmax(180px, 1.2fr) 34px;
  width: 100%;
}
.dsh-mcp-kv-row .dsh-sam-select {
  height: 34px;
}
.dsh-mcp-kv-del-btn {
  align-items: center;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  display: inline-flex;
  height: 34px;
  justify-content: center;
  padding: 0;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;
  width: 34px;
}
.dsh-mcp-kv-del-btn:hover {
  background: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

/* Add Item Button styled like cust-model-editor */
.dsh-mcp-add-btn {
  align-items: center;
  align-self: flex-start;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  gap: 6px;
  height: 32px;
  justify-content: center;
  line-height: 20px;
  margin-top: 4px;
  padding: 0 12px;
  transition: background-color 0.15s, border-color 0.15s;
}
.dsh-mcp-add-btn:hover:not(:disabled) {
  background: var(--dsw-alias-bg-layer-2);
  border-color: var(--dsw-alias-brand-primary);
}

/* Advanced Settings Box */
.dsh-mcp-advanced-box {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: border-color 0.15s;
}
.dsh-mcp-advanced-header {
  align-items: center;
  background: var(--dsw-alias-bg-layer-2);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  outline: none;
  padding: 12px 16px;
  user-select: none;
}
.dsh-mcp-advanced-header:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-mcp-advanced-header:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: -1px;
}
.dsh-mcp-advanced-title-wrap {
  align-items: center;
  display: flex;
  gap: 10px;
  justify-content: space-between;
  width: 100%;
}
.dsh-mcp-advanced-title {
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  font-weight: 600;
}
.dsh-mcp-advanced-badge {
  color: var(--dsw-alias-brand-primary);
  font-size: 12px;
  font-weight: 500;
}
.dsh-mcp-advanced-content {
  border-top: 1px solid var(--dsw-alias-border-l2);
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
}
.dsh-mcp-switch-card.mini {
  padding: 10px 14px;
}
.dsh-mcp-form-row-3 {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  width: 100%;
}
.dsh-mcp-field-hint {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 16px;
  margin-top: 2px;
}

.dsh-sam-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}
.dsh-mcp-modal-footer {
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.dsh-mcp-modal-footer-left,
.dsh-mcp-modal-footer-right {
  align-items: center;
  display: flex;
  gap: 8px;
}

/* Import Modal */
.dsh-mcp-import-modal {
  width: 680px;
}
.dsh-mcp-import-modal .dsh-sam-desc {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 20px;
  margin: 6px 0 10px;
}
.dsh-mcp-import-textarea {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  box-sizing: border-box;
  color: var(--dsw-alias-label-primary);
  display: flex;
  flex: 1 1 0%;
  font-family: monospace;
  font-size: 12px;
  line-height: 18px;
  min-height: 280px;
  padding: 12px 14px;
  resize: vertical;
  width: 100%;
}
.dsh-mcp-import-textarea:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 1px;
}

/* Tools Management Modal & Tool Cards */
.dsh-mcp-tools-modal {
  display: flex;
  flex-direction: column;
  max-height: 88vh;
  max-width: 780px;
  width: 92vw;
}
.dsh-mcp-tools-header-meta {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}
.dsh-mcp-tools-toolbar {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
  margin: 10px 0;
}
.dsh-mcp-tools-search-box {
  flex: 1 1 200px;
  min-width: 180px;
}
.dsh-mcp-search-wrap {
  align-items: center;
  display: flex;
  position: relative;
  width: 100%;
}
.dsh-mcp-search-icon {
  color: var(--dsw-alias-label-tertiary);
  left: 10px;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.dsh-mcp-search-input {
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  box-sizing: border-box;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
  height: 34px;
  line-height: 20px;
  padding: 0 10px 0 32px;
  transition: border-color 0.15s, box-shadow 0.15s;
  width: 100%;
}
.dsh-mcp-search-input:focus {
  border-color: var(--dsw-alias-brand-primary);
  box-shadow: 0 0 0 2px rgba(88, 166, 255, 0.2);
  outline: none;
}
.dsh-mcp-search-input::placeholder {
  color: var(--dsw-alias-label-tertiary);
}
.dsh-mcp-tools-toolbar-actions {
  align-items: center;
  display: flex;
  gap: 8px;
}
.dsh-mcp-tools-stats-bar {
  align-items: center;
  color: var(--dsw-alias-label-secondary);
  display: flex;
  font-size: 12px;
  justify-content: space-between;
  line-height: 18px;
  margin-bottom: 8px;
  padding: 0 2px;
}
.dsh-mcp-tools-list {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  gap: 8px;
  max-height: 480px;
  min-height: 120px;
  overflow-y: auto;
  padding-right: 4px;
}
.dsh-mcp-tool-card {
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 14px;
  transition: background-color 0.15s, border-color 0.15s, opacity 0.15s;
}
.dsh-mcp-tool-card:hover {
  border-color: var(--dsw-alias-border-l1);
}
.dsh-mcp-tool-card.disabled {
  background: var(--dsw-alias-bg-layer-1);
  border-style: dashed;
  opacity: 0.85;
}
.dsh-mcp-tool-card-main {
  align-items: flex-start;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  width: 100%;
}
.dsh-mcp-tool-card-left {
  align-items: flex-start;
  display: flex;
  flex: 1 1 0%;
  gap: 10px;
  min-width: 0;
  user-select: text;
}
.dsh-mcp-tool-card .dsh-mcp-switch-btn {
  cursor: pointer;
  pointer-events: auto;
}
.dsh-mcp-tool-desc,
.dsh-mcp-tool-name,
.dsh-mcp-tool-schema-preview {
  user-select: text;
}
.dsh-mcp-tool-card-right {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  gap: 8px;
}
.dsh-mcp-tool-info {
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  min-width: 0;
}
.dsh-mcp-tool-title-row {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.dsh-mcp-tool-name {
  color: var(--dsw-alias-label-primary);
  font-family: monospace;
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
  word-break: break-all;
}
.dsh-mcp-tool-status-pill {
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  line-height: 14px;
  padding: 2px 6px;
}
.dsh-mcp-tool-status-pill.active {
  background: rgba(46, 160, 67, 0.15);
  color: var(--dsw-alias-state-success-primary, #2ea043);
}
.dsh-mcp-tool-status-pill.disabled {
  background: rgba(218, 54, 51, 0.15);
  color: var(--dsw-alias-state-error-primary, #da3633);
}
.dsh-mcp-tool-desc {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 18px;
  margin: 4px 0 0;
}
.dsh-mcp-tool-schema-btn,
.dsh-mcp-schema-toggle-btn {
  align-items: center;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  display: inline-flex;
  font-size: 12px;
  font-weight: 500;
  gap: 4px;
  line-height: 16px;
  padding: 4px 10px;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;
}
.dsh-mcp-tool-schema-btn:hover,
.dsh-mcp-schema-toggle-btn:hover {
  background: var(--dsw-alias-bg-layer-3, var(--dsw-alias-bg-layer-2));
  border-color: var(--dsw-alias-border-l1);
  color: var(--dsw-alias-label-primary);
  text-decoration: none;
}
.dsh-mcp-tool-schema-btn.active,
.dsh-mcp-schema-toggle-btn.active {
  background: rgba(88, 166, 255, 0.1);
  border-color: var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-brand-primary);
}
.dsh-mcp-tool-schema-preview {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  color: var(--dsw-alias-label-secondary);
  font-family: monospace;
  font-size: 11px;
  line-height: 16px;
  margin: 0;
  max-height: 220px;
  overflow: auto;
  padding: 8px 10px;
  white-space: pre-wrap;
  word-break: break-all;
}

/* Expanded Parameter Box & Segmented View */
.dsh-mcp-tool-expanded-box {
  border-top: 1px dashed var(--dsw-alias-border-l2);
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  padding-top: 8px;
}
.dsh-mcp-tool-expanded-header {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: space-between;
}
.dsh-mcp-tool-param-stats {
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  font-weight: 500;
}
.dsh-mcp-tool-view-switch {
  align-items: center;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  display: inline-flex;
  gap: 2px;
  padding: 2px;
}
.dsh-mcp-seg-btn {
  background: transparent;
  border: none;
  border-radius: 4px;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  font-size: 11px;
  line-height: 14px;
  padding: 3px 8px;
  transition: background-color 0.15s, color 0.15s;
}
.dsh-mcp-seg-btn:hover {
  color: var(--dsw-alias-label-primary);
}
.dsh-mcp-seg-btn.active {
  background: var(--dsw-alias-bg-layer-3, var(--dsw-alias-bg-layer-2));
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}
.dsh-mcp-tool-params-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 240px;
  overflow-y: auto;
  padding-right: 2px;
}
.dsh-mcp-param-row {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 10px;
}
.dsh-mcp-param-top {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.dsh-mcp-param-name {
  color: var(--dsw-alias-label-primary);
  font-family: monospace;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
}
.dsh-mcp-param-type {
  background: rgba(88, 166, 255, 0.1);
  border-radius: 4px;
  color: var(--dsw-alias-brand-primary);
  font-family: monospace;
  font-size: 11px;
  line-height: 14px;
  padding: 1px 5px;
}
.dsh-mcp-param-badge {
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
  padding: 1px 5px;
}
.dsh-mcp-param-badge.required {
  background: rgba(218, 54, 51, 0.12);
  color: var(--dsw-alias-state-error-primary, #da3633);
}
.dsh-mcp-param-badge.optional {
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-secondary);
}
.dsh-mcp-param-default {
  background: var(--dsw-alias-bg-layer-2);
  border-radius: 4px;
  color: var(--dsw-alias-label-secondary);
  font-family: monospace;
  font-size: 10px;
  line-height: 14px;
  padding: 1px 5px;
}
.dsh-mcp-param-desc {
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  line-height: 16px;
  margin: 0;
  word-break: break-word;
}
.dsh-mcp-param-enum {
  color: var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary));
  font-family: monospace;
  font-size: 10px;
  line-height: 14px;
}
.dsh-mcp-mini-badge.danger {
  background: rgba(218, 54, 51, 0.15);
  border-radius: 4px;
  color: var(--dsw-alias-state-error-primary, #da3633);
  font-size: 10px;
  font-weight: 600;
  line-height: 12px;
  margin-left: 4px;
  padding: 1px 5px;
}
.dsh-mcp-proto-badge.disabled-tools {
  background: rgba(218, 54, 51, 0.12);
  color: var(--dsw-alias-state-error-primary, #da3633);
}
.dsh-mcp-proto-badge.server-version {
  background: rgba(88, 166, 255, 0.12);
  color: var(--dsw-alias-brand-primary, #58a6ff);
  font-family: monospace;
  font-weight: 600;
}

/* MCP Pre-save Test Confirmation Modal */
.dsh-mcp-confirm-overlay {
  z-index: 1050;
}
.dsh-mcp-confirm-modal {
  height: auto;
  max-height: min(520px, calc(100vh - 48px));
  max-width: 480px;
  min-height: unset;
  padding: 20px 24px;
  width: 90vw;
}
.dsh-mcp-confirm-modal .dsh-sam-header-row {
  margin-bottom: 12px;
}
.dsh-mcp-confirm-modal .dsh-sam-header svg {
  color: var(--dsw-alias-state-warning-primary, #d29922);
}
.dsh-mcp-confirm-msg {
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  line-height: 18px;
  margin: 0 0 10px;
}
.dsh-mcp-confirm-detail {
  background: rgba(218, 54, 51, 0.08);
  border: 1px solid rgba(218, 54, 51, 0.2);
  border-radius: 6px;
  color: var(--dsw-alias-state-error-primary, #da3633);
  font-family: monospace;
  font-size: 12px;
  line-height: 16px;
  margin-bottom: 12px;
  max-height: 160px;
  overflow-y: auto;
  padding: 8px 12px;
  white-space: pre-wrap;
  word-break: break-word;
}
.dsh-mcp-confirm-prompt {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
  margin: 0 0 16px;
}
.dsh-mcp-confirm-modal .dsh-sam-actions {
  margin-top: 0;
}

/* Skills Session Management */
.dsh-session-skills-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.dsh-skills-toolbar {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
  margin-bottom: 4px;
}
.dsh-skills-search-wrap {
  display: flex;
  flex: 1;
  min-width: 200px;
  position: relative;
}
.dsh-skills-search-input {
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 6px;
  box-sizing: border-box;
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  line-height: 18px;
  outline: none;
  padding: 6px 10px 6px 30px;
  transition: border-color 0.15s;
  width: 100%;
}
.dsh-skills-search-input:focus {
  border-color: var(--dsw-alias-brand-primary);
}
.dsh-skills-search-icon {
  color: var(--dsw-alias-label-secondary);
  left: 8px;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.dsh-skills-btn-group {
  align-items: center;
  display: flex;
  gap: 8px;
}
.dsh-session-skills-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dsh-session-skill-item {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
  transition: background-color 0.15s, border-color 0.15s;
  width: 100%;
}
.dsh-session-skill-item:hover:not(.readonly) {
  background: var(--dsw-alias-bg-layer-2);
  border-color: var(--dsw-alias-border-l1);
}
.dsh-session-skill-item.active {
  background: var(--dsw-alias-bg-layer-1);
  border-color: var(--dsw-alias-border-l2);
}
.dsh-session-skill-item.active:hover:not(.readonly) {
  background: var(--dsw-alias-bg-layer-2);
  border-color: var(--dsw-alias-border-l1);
}
.dsh-session-skill-item.disabled {
  opacity: 0.7;
}
.dsh-session-skill-item.readonly {
  cursor: default;
}
.dsh-session-skill-main {
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  user-select: none;
  width: 100%;
}
.dsh-session-skill-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.dsh-session-skill-row1 {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.dsh-session-skill-title-wrap {
  align-items: center;
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
}
.dsh-session-skill-name {
  color: var(--dsw-alias-label-primary);
  font-family: monospace;
  font-size: 13px;
  font-weight: 600;
}
.dsh-session-skill-desc {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 18px;
  margin: 0;
}
.dsh-skill-badge {
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  line-height: 14px;
  padding: 2px 6px;
}
.dsh-skill-badge.source-project {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}
.dsh-skill-badge.source-user {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}
.dsh-skill-badge.source-bundled {
  background: rgba(147, 51, 234, 0.12);
  color: #a855f7;
}
.dsh-skill-badge.source-runtime {
  background: rgba(107, 114, 128, 0.15);
  color: var(--dsw-alias-label-secondary);
}
.dsh-skill-badge.inv-model {
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}
.dsh-skill-badge.status-disabled {
  background: rgba(218, 54, 51, 0.12);
  color: var(--dsw-alias-state-error-primary, #da3633);
}
.dsh-skill-badge.status-enabled {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}
.dsh-skill-actions {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  gap: 8px;
}
.dsh-skill-config-btn {
  align-items: center;
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 6px;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  display: inline-flex;
  font-size: 12px;
  font-weight: 500;
  gap: 4px;
  line-height: 16px;
  padding: 5px 12px;
  transition: all 0.15s ease;
}
.dsh-skill-config-btn:hover {
  background: var(--dsw-alias-bg-layer-3);
  border-color: var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-brand-primary);
}

/* Standalone Skill Modal */
.dsh-skill-modal {
  display: flex;
  flex-direction: column;
  height: auto;
  max-height: 88vh;
  max-width: 720px;
  width: 90vw;
}
.dsh-skill-modal-header-meta {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}
.dsh-skill-modal-body {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  gap: 16px;
  max-height: calc(88vh - 140px);
  overflow-y: auto;
  padding: 8px 2px;
}
.dsh-skill-modal-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dsh-skill-modal-section-title {
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
  margin: 0;
}
.dsh-skill-modal-desc {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 20px;
  margin: 0;
}
.dsh-skill-runtime-note {
  background: rgba(245, 158, 11, 0.08);
  border: 1px dashed rgba(245, 158, 11, 0.3);
  border-radius: 6px;
  color: var(--dsw-alias-state-warning-primary, #f59e0b);
  font-size: 12px;
  line-height: 16px;
  padding: 8px 12px;
}
.dsh-skill-detail-meta {
  color: var(--dsw-alias-label-secondary);
  display: flex;
  flex-direction: column;
  font-size: 12px;
  gap: 4px;
}
.dsh-skill-detail-path {
  color: var(--dsw-alias-label-primary);
  font-family: monospace;
  word-break: break-all;
}
.dsh-skill-content-block {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  color: var(--dsw-alias-label-primary);
  font-family: monospace;
  font-size: 12px;
  line-height: 18px;
  margin: 0;
  max-height: 320px;
  overflow-y: auto;
  padding: 12px 14px;
  white-space: pre-wrap;
  word-break: break-word;
}

@keyframes dsh-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.dsh-spin {
  animation: dsh-spin 1s linear infinite;
}
`;
