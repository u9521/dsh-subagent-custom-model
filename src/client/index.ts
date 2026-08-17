import * as React from 'react'
import { IconAgentPresetOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'
import * as i18n from './i18n.ts'
import type { SubagentModelConfig } from '../types.ts'
import { LOCALE_NS } from './types.ts'
import { SubagentModelSection } from './SubagentModelSection.ts'
import { getLocalStore, getSessionRawConfig } from './storage.ts'

const e = React.createElement

export const inject = ['slots', 'connection', 'locale']

const CSS = `
/* Sidebar footer trigger — dimensions mirror the settings trigger below it
   (dsh-client-ui-settings-general .VOzbGW_trigger) so both entries align.
   Multiple footer actions (e.g. the cordis-panel) coexist via the
   .hHd-Xa_footerActions wrap rule at the end of this stylesheet. */
.dsh-sam-trigger {
  align-items: center;
  background: 0 0;
  border: none;
  border-radius: 12px;
  box-sizing: border-box;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  display: flex;
  flex: none;
  font-family: inherit;
  font-size: 14px;
  gap: 8px;
  height: 34px;
  line-height: 22px;
  margin: 4px -4px;
  overflow: hidden;
  padding: 6px 2px 6px 10px;
  text-align: left;
  transition: background-color 0.15s;
  width: calc(100% + 8px);
}
.dsh-sam-trigger:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
/* Sidebar footer actions (e.g. the cordis-panel entry) are 100%-wide with
   flex:none; wrap the row so multiple entries stack instead of pushing each
   other out of the sidebar. Hash class from dsh-client-ui-sidebar (CSS
   Modules) — if it changes in a product update, re-derive it from the
   footerActions class map in that package's client bundle. */
.hHd-Xa_footerActions {
  flex-wrap: wrap;
}
.dsh-sam-trigger.rail {
  border-radius: 50%;
  gap: 0;
  height: 36px;
  justify-content: center;
  margin: 8px 0 10px;
  padding: 0;
  width: 36px;
}
.dsh-sam-trigger-icon {
  align-items: center;
  display: flex;
  flex: none;
  justify-content: center;
  width: 16px;
}
.dsh-sam-trigger-label {
  flex: 1;
  /* Inherit the trigger's 14px, like the settings trigger label */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-sam-trigger-badge {
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  font-weight: 500;
  line-height: 16px;
  padding: 0 6px;
  white-space: nowrap;
}
.dsh-sam-trigger-badge.active {
  background: rgba(59, 130, 246, 0.12);
  border-color: rgba(59, 130, 246, 0.3);
  color: #3b82f6;
}
.dsh-sam-trigger-badge.global {
  background: rgba(147, 51, 234, 0.12);
  border-color: rgba(147, 51, 234, 0.3);
  color: #a855f7;
}
.dsh-sam-trigger-badge.inherit {
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.3);
  color: #10b981;
}

/* Modal Overlay & Dialog */
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
  height: min(640px, calc(100vh - 48px));
  max-width: calc(100vw - 48px);
  overflow-y: auto;
  padding: 24px 28px;
  position: relative;
  width: 640px;
  z-index: 1;
}

/* Section & Page styling */
.dsh-sam-page {
  box-sizing: border-box;
  color: var(--dsw-alias-label-primary);
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 800px;
  padding-bottom: 24px;
  width: 100%;
}
.dsh-sam-page * {
  box-sizing: border-box;
}
.dsh-sam-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
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
.dsh-sam-desc {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 20px;
  margin: 0;
}
.dsh-sam-status-card {
  align-items: center;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: space-between;
  padding: 10px 14px;
}
.dsh-sam-status-left {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.dsh-sam-status-detail {
  color: var(--dsw-alias-label-secondary);
  flex-basis: 100%;
  font-size: 12px;
  line-height: 18px;
}
.dsh-sam-scope-badge {
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  font-weight: 500;
}
.dsh-sam-status-badge {
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
}
.dsh-sam-status-badge.badge-inherit {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}
.dsh-sam-status-badge.badge-default {
  background: rgba(147, 51, 234, 0.12);
  color: #a855f7;
}
.dsh-sam-status-badge.badge-custom {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}
.dsh-sam-loading {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  padding: 20px 0;
}
.dsh-sam-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
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
  padding: 12px 14px;
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
  padding: 16px;
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
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
  height: 36px;
  line-height: 20px;
  padding: 0 10px;
  width: 100%;
}
.dsh-sam-select:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 1px;
}
.dsh-sam-checkbox-label {
  align-items: center;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  display: flex;
  font-size: 13px;
  gap: 8px;
  margin-top: 4px;
}
.dsh-sam-checkbox-label input[type="checkbox"] {
  accent-color: var(--dsw-alias-brand-primary);
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
.dsh-sam-actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}
.dsh-sam-btn {
  align-items: center;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  height: 34px;
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
`

type BadgeKind = 'custom' | 'default' | 'inherit'

const BADGE_CLASS: Record<BadgeKind, string> = {
  custom: 'active',
  default: 'global',
  inherit: 'inherit',
}

/**
 * Three-state badge: has the current session been configured?
 * - no  -> global default
 * - yes -> custom (model name when showModel) or inherit parent
 * The global default is never expanded into the badge.
 */
function badgeState(
  raw: { config: SubagentModelConfig; hasOverride: boolean },
  t: (key: string) => string,
  showModel: boolean,
): { text: string; kind: BadgeKind } {
  if (!raw.hasOverride) return { text: t('status.default'), kind: 'default' }
  if (raw.config.mode === 'custom') {
    return {
      text:
        showModel && raw.config.model ? raw.config.model : t('status.custom'),
      kind: 'custom',
    }
  }
  return { text: t('status.inherit'), kind: 'inherit' }
}

function SidebarSubagentTrigger(props: any) {
  const { wide, useSessions, api, t } = props
  const [open, setOpen] = React.useState(false)

  // The `sidebar.footer.action` slot always supplies `useSessions`, so the
  // current session id comes from the standard prop (no service fallback).
  const hookState = useSessions((s: any) => ({
    id: s?.current,
    title: s?.current
      ? s?.byId?.[s.current]?.title || s?.byId?.[s.current]?.header?.title || ''
      : '',
  }))

  const currentSessionId = hookState?.id
  const sessionTitle = hookState?.title || ''

  const [badge, setBadge] = React.useState<{ text: string; kind: BadgeKind }>(
    () => {
      const store = getLocalStore()
      return badgeState(getSessionRawConfig(store, currentSessionId), t, true)
    },
  )

  // Instantly update badge when currentSessionId changes, then sync from server
  React.useEffect(() => {
    const store = getLocalStore()
    setBadge(badgeState(getSessionRawConfig(store, currentSessionId), t, true))
  }, [currentSessionId, t])

  const refreshStatus = React.useCallback(async () => {
    try {
      const url = currentSessionId
        ? `/api/subagent-model?sessionId=${encodeURIComponent(currentSessionId)}`
        : '/api/subagent-model'
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setBadge(
          badgeState(
            {
              config: data?.config || { mode: 'default' },
              hasOverride: Boolean(data?.hasSessionOverride),
            },
            t,
            true,
          ),
        )
      }
    } catch {}
  }, [currentSessionId, t])

  React.useEffect(() => {
    refreshStatus()
  }, [refreshStatus, open, currentSessionId])

  // The modal persists to the server itself; re-sync the badge from it.
  const handleChildSave = React.useCallback(() => {
    refreshStatus()
  }, [refreshStatus])

  return e(
    React.Fragment,
    null,
    e(
      'button',
      {
        type: 'button',
        className: `dsh-sam-trigger ${wide ? '' : 'rail'}`,
        'aria-label': t('sidebar.tooltip'),
        title: wide ? undefined : t('sidebar.tooltip'),
        onClick: () => setOpen(true),
      },
      e(
        'div',
        { className: 'dsh-sam-trigger-icon' },
        e(IconAgentPresetOutline16, { size: wide ? 16 : 18 }),
      ),
      wide
        ? e(
            React.Fragment,
            null,
            e(
              'span',
              { className: 'dsh-sam-trigger-label' },
              t('sidebar.label'),
            ),
            badge.text
              ? e(
                  'span',
                  {
                    className: `dsh-sam-trigger-badge ${BADGE_CLASS[badge.kind] || ''}`,
                  },
                  badge.text,
                )
              : null,
          )
        : null,
    ),
    open
      ? e(
          'div',
          {
            className: 'dsh-sam-modal-overlay',
            onClick: (evt: any) => {
              if (evt.target === evt.currentTarget) setOpen(false)
            },
          },
          e(
            'div',
            { className: 'dsh-sam-modal-panel' },
            e(SubagentModelSection, {
              api,
              t,
              sessionId: currentSessionId,
              sessionTitle,
              onClose: () => setOpen(false),
              onSave: handleChildSave,
            }),
          ),
        )
      : null,
  )
}

export function apply(ctx: any) {
  // 1. Register Locale
  ctx.effect(
    () =>
      ctx.locale.register(LOCALE_NS, {
        zh: i18n.flattenDictionary(i18n.zh),
        en: i18n.flattenDictionary(i18n.en),
      }),
    'subagent-custom-model: locale',
  )

  let translator = ctx.locale.bind(LOCALE_NS)
  ctx.effect(
    () =>
      ctx.locale.subscribe(() => {
        translator = ctx.locale.bind(LOCALE_NS)
      }),
    'subagent-custom-model: locale updates',
  )

  // 2. Inject CSS
  ctx.effect(() => {
    const style = document.createElement('style')
    style.dataset.plugin = '@local/dsh-subagent-custom-model'
    style.textContent = CSS
    document.head.appendChild(style)
    return () => style.remove()
  }, 'subagent-custom-model: styles')

  // 3. Register sidebar.footer.action slot (placed directly above Settings)
  ctx.slots.inject('sidebar.footer.action', () =>
    ctx.slots.register(
      {
        name: 'sidebar.footer.action',
        id: 'subagent-model-action',
        order: 10,
      },
      function FooterTrigger(props: any) {
        // Stable `t` identity: the translator closure is re-read at call time,
        // so memoized callbacks/effects below stay stable across re-renders.
        const t = React.useCallback(
          (key: string, vars?: Record<string, string | number>) =>
            translator(key, vars),
          [],
        )
        return e(SidebarSubagentTrigger, {
          ...props,
          api: ctx.connection.api,
          t,
        })
      },
    ),
  )
}
