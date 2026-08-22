import fs from 'node:fs'
import type {
  SubagentModelConfig,
  McpServerStore,
  SessionSettingsConfig,
  SessionSettingsStore,
  SessionSkillsConfig,
} from '../../types.ts'
import { getSessionSettingsStoragePath } from '../common/paths.ts'

export const DEFAULT_SESSION_SETTINGS: SessionSettingsConfig = {
  subagentModel: { mode: 'inherit' },
  mcp: {
    mode: 'default',
    enabledServerIds: [],
    toolsMode: {},
    disabledTools: {},
  },
  skills: {
    mode: 'default',
    disabledSkills: [],
    disabledModelSkills: [],
    disabledUserSkills: [],
  },
}

export function normalizeSubagentModelConfig(
  raw?: Partial<SubagentModelConfig>,
): SubagentModelConfig {
  if (!raw || typeof raw !== 'object') return { mode: 'inherit' }
  const mode =
    raw.mode === 'custom'
      ? 'custom'
      : raw.mode === 'inherit'
        ? 'inherit'
        : 'default'
  if (mode === 'custom') {
    const provider = typeof raw.provider === 'string' ? raw.provider.trim() : ''
    const model = typeof raw.model === 'string' ? raw.model.trim() : ''
    if (!provider || !model) {
      return { mode: 'inherit' }
    }
    return {
      mode: 'custom',
      provider,
      model,
      reasoningEffort:
        typeof raw.reasoningEffort === 'string' && raw.reasoningEffort.trim()
          ? raw.reasoningEffort.trim()
          : undefined,
    }
  }
  return { mode }
}

export function normalizeSkillsConfig(
  raw?: Partial<SessionSkillsConfig>,
): SessionSkillsConfig {
  if (!raw || typeof raw !== 'object') {
    return {
      mode: 'default',
      disabledSkills: [],
      disabledModelSkills: [],
      disabledUserSkills: [],
    }
  }
  const mode = raw.mode === 'custom' ? 'custom' : 'default'

  let disabledModelSkills: string[] = []
  if (Array.isArray(raw.disabledModelSkills)) {
    disabledModelSkills = raw.disabledModelSkills.filter(
      (s): s is string => typeof s === 'string' && s.trim().length > 0,
    )
  } else if (Array.isArray(raw.disabledSkills)) {
    disabledModelSkills = raw.disabledSkills.filter(
      (s): s is string => typeof s === 'string' && s.trim().length > 0,
    )
  }

  const disabledUserSkills = Array.isArray(raw.disabledUserSkills)
    ? raw.disabledUserSkills.filter(
        (s): s is string => typeof s === 'string' && s.trim().length > 0,
      )
    : []

  return {
    mode,
    disabledSkills: disabledModelSkills,
    disabledModelSkills,
    disabledUserSkills,
  }
}

export function normalizeSessionSettings(
  raw?: Partial<SessionSettingsConfig>,
): SessionSettingsConfig {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_SESSION_SETTINGS }
  }

  const subagentModel = normalizeSubagentModelConfig(raw.subagentModel)
  const rawMcp = raw.mcp
  const mcpMode = rawMcp?.mode === 'custom' ? 'custom' : 'default'
  const enabledServerIds = Array.isArray(rawMcp?.enabledServerIds)
    ? rawMcp.enabledServerIds.filter(
        (id): id is string => typeof id === 'string',
      )
    : []

  const toolsMode: Record<string, 'default' | 'custom'> = {}
  if (rawMcp?.toolsMode && typeof rawMcp.toolsMode === 'object') {
    for (const [k, v] of Object.entries(rawMcp.toolsMode)) {
      if (typeof k === 'string' && (v === 'custom' || v === 'default')) {
        toolsMode[k] = v
      }
    }
  }

  const disabledTools: Record<string, string[]> = {}
  if (rawMcp?.disabledTools && typeof rawMcp.disabledTools === 'object') {
    for (const [k, v] of Object.entries(rawMcp.disabledTools)) {
      if (typeof k === 'string' && Array.isArray(v)) {
        disabledTools[k] = v.filter(
          (name): name is string => typeof name === 'string',
        )
      }
    }
  }

  const skills = normalizeSkillsConfig(raw.skills)

  return {
    subagentModel,
    mcp: {
      mode: mcpMode,
      enabledServerIds,
      toolsMode,
      disabledTools,
    },
    skills,
  }
}

export function loadSessionSettingsStore(): SessionSettingsStore {
  try {
    const file = getSessionSettingsStoragePath()
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'))
      if (data && typeof data === 'object') {
        const def = normalizeSessionSettings(data.default)
        const sessions: Record<string, SessionSettingsConfig> = {}
        if (data.sessions && typeof data.sessions === 'object') {
          for (const [id, s] of Object.entries(data.sessions)) {
            if (s && typeof s === 'object') {
              sessions[id] = normalizeSessionSettings(s as any)
            }
          }
        }
        return { default: def, sessions }
      }
    }
  } catch {}

  return {
    default: { ...DEFAULT_SESSION_SETTINGS },
    sessions: {},
  }
}

export function saveSessionSettingsStore(store: SessionSettingsStore): void {
  try {
    const file = getSessionSettingsStoragePath()
    const tmp = `${file}.tmp`
    fs.writeFileSync(tmp, JSON.stringify(store, null, 2), 'utf8')
    fs.renameSync(tmp, file)
  } catch {}
}

export function resolveEffectiveSubagentModel(
  store: SessionSettingsStore,
  sessionId?: string,
): SubagentModelConfig {
  if (sessionId && store.sessions?.[sessionId]) {
    const entry = store.sessions[sessionId]
    if (entry.subagentModel?.mode !== 'default') {
      return entry.subagentModel
    }
  }
  return store.default?.subagentModel || { mode: 'inherit' }
}

export function resolveEffectiveMcp(
  store: SessionSettingsStore,
  mcpStore: McpServerStore,
  sessionId?: string,
): {
  mode: 'default' | 'custom'
  enabledServerIds: string[]
  toolsMode: Record<string, 'default' | 'custom'>
  disabledTools: Record<string, string[]>
  effectiveDisabledTools: Record<string, string[]>
} {
  let mode: 'default' | 'custom' = 'default'
  let enabledServerIds: string[] = []
  let toolsMode: Record<string, 'default' | 'custom'> = {}
  let disabledTools: Record<string, string[]> = {}

  if (sessionId && store.sessions?.[sessionId]) {
    const entry = store.sessions[sessionId]
    if (entry.mcp?.mode === 'custom') {
      mode = 'custom'
      enabledServerIds = entry.mcp.enabledServerIds || []
      toolsMode = entry.mcp.toolsMode || {}
      disabledTools = entry.mcp.disabledTools || {}
    } else {
      if (store.default?.mcp?.mode === 'custom') {
        enabledServerIds = store.default.mcp.enabledServerIds || []
      } else {
        enabledServerIds = Object.values(mcpStore.servers)
          .filter((s) => s.enabledByDefault)
          .map((s) => s.id)
      }
      toolsMode = store.default?.mcp?.toolsMode || {}
      disabledTools = store.default?.mcp?.disabledTools || {}
    }
  } else {
    if (store.default?.mcp?.mode === 'custom') {
      mode = 'custom'
      enabledServerIds = store.default.mcp.enabledServerIds || []
    } else {
      enabledServerIds = Object.values(mcpStore.servers)
        .filter((s) => s.enabledByDefault)
        .map((s) => s.id)
    }
    toolsMode = store.default?.mcp?.toolsMode || {}
    disabledTools = store.default?.mcp?.disabledTools || {}
  }

  // Calculate effective disabled tools per server
  const effectiveDisabledTools: Record<string, string[]> = {}
  for (const server of Object.values(mcpStore.servers)) {
    const isCustomTools = toolsMode[server.id] === 'custom'
    if (isCustomTools && disabledTools[server.id]) {
      effectiveDisabledTools[server.id] = disabledTools[server.id]
    } else {
      // Default: follow server.disabledTools
      effectiveDisabledTools[server.id] = server.disabledTools || []
    }
  }

  return {
    mode,
    enabledServerIds,
    toolsMode,
    disabledTools,
    effectiveDisabledTools,
  }
}

export function resolveEffectiveSkills(
  store: SessionSettingsStore,
  sessionId?: string,
): {
  mode: 'default' | 'custom'
  disabledSkills: string[]
  disabledModelSkills: string[]
  disabledUserSkills: string[]
  effectiveDisabledSkills: string[]
  effectiveDisabledModelSkills: string[]
  effectiveDisabledUserSkills: string[]
} {
  let mode: 'default' | 'custom' = 'default'
  let disabledModelSkills: string[] = []
  let disabledUserSkills: string[] = []

  if (sessionId && store.sessions?.[sessionId]) {
    const entry = store.sessions[sessionId]
    if (entry.skills?.mode === 'custom') {
      mode = 'custom'
      disabledModelSkills =
        entry.skills.disabledModelSkills || entry.skills.disabledSkills || []
      disabledUserSkills = entry.skills.disabledUserSkills || []
    } else {
      disabledModelSkills =
        store.default?.skills?.disabledModelSkills ||
        store.default?.skills?.disabledSkills ||
        []
      disabledUserSkills = store.default?.skills?.disabledUserSkills || []
    }
  } else {
    if (store.default?.skills?.mode === 'custom') {
      mode = 'custom'
    }
    disabledModelSkills =
      store.default?.skills?.disabledModelSkills ||
      store.default?.skills?.disabledSkills ||
      []
    disabledUserSkills = store.default?.skills?.disabledUserSkills || []
  }

  return {
    mode,
    disabledSkills: [...disabledModelSkills],
    disabledModelSkills: [...disabledModelSkills],
    disabledUserSkills: [...disabledUserSkills],
    effectiveDisabledSkills: [...disabledModelSkills],
    effectiveDisabledModelSkills: [...disabledModelSkills],
    effectiveDisabledUserSkills: [...disabledUserSkills],
  }
}

export function resolveEffectiveSessionSettings(
  store: SessionSettingsStore,
  mcpStore: McpServerStore,
  sessionId?: string,
): SessionSettingsConfig {
  return {
    subagentModel: resolveEffectiveSubagentModel(store, sessionId),
    mcp: resolveEffectiveMcp(store, mcpStore, sessionId),
    skills: resolveEffectiveSkills(store, sessionId),
  }
}
