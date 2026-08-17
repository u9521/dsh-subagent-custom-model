import type { SubagentModelConfig, SubagentModelStore } from '../types.ts'

const STORAGE_KEY = 'dsh.subagent_model_store'

export function getLocalStore(): SubagentModelStore {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object') {
          return {
            default: parsed.default || { mode: 'inherit' },
            sessions: parsed.sessions || {},
          }
        }
      }
    }
  } catch {}
  return { default: { mode: 'inherit' }, sessions: {} }
}

export function saveLocalStore(store: SubagentModelStore): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    }
  } catch {}
}

export function getSessionRawConfig(
  store: SubagentModelStore,
  sessionId?: string,
): { config: SubagentModelConfig; hasOverride: boolean } {
  if (sessionId && store.sessions && store.sessions[sessionId]) {
    const s = store.sessions[sessionId]
    return { config: s, hasOverride: s.mode !== 'default' }
  }
  return { config: { mode: 'default' }, hasOverride: false }
}

export function getSessionEffectiveConfig(
  store: SubagentModelStore,
  sessionId?: string,
): SubagentModelConfig {
  if (sessionId && store.sessions && store.sessions[sessionId]) {
    const s = store.sessions[sessionId]
    if (s && s.mode !== 'default') {
      return s
    }
  }
  return store.default || { mode: 'inherit' }
}
