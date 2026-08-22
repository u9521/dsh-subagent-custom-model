import type { SessionSettingsConfig } from '../types.ts'

export type {
  SubagentModelMode,
  SubagentModelConfig,
  McpTransportType,
  McpReconnectConfig,
  GlobalMcpServerConfig,
  McpDiscoveredTool,
  McpServerInfo,
  McpTestResult,
  McpServerStore,
  SessionMcpMode,
  SessionMcpConfig,
  SessionSkillsMode,
  SessionSkillsConfig,
  SkillItem,
  SessionSettingsConfig,
  SessionSettingsStore,
} from '../types.ts'

export interface ModelReasoningEffort {
  id: string
  name: string
  description?: string
}

export interface ModelReasoning {
  efforts: ModelReasoningEffort[]
  defaultEffort?: string
}

export interface ModelCatalogItem {
  id: string
  name: string
  description?: string
  reasoning?: ModelReasoning
}

export interface ModelProviderGroup {
  id: string
  name: string
  models: ModelCatalogItem[]
}

export interface ModelCatalogResponse {
  groups?: ModelProviderGroup[]
  failures?: Array<{ id: string; name: string; message: string }>
}

export interface ClientPageProps {
  api: any
  t: (key: string, vars?: Record<string, string | number>) => string
  sessionId?: string
  sessionTitle?: string
  useSessions?: any
  onClose?: () => void
  onSave?: (config: SessionSettingsConfig) => void
}

export interface McpSettingsProps {
  api: any
  t: (key: string, vars?: Record<string, string | number>) => string
  close?: () => void
}

export interface SkillsSettingsProps {
  api: any
  t: (key: string, vars?: Record<string, string | number>) => string
  close?: () => void
}

export interface ToolParamItem {
  name: string
  type: string
  required: boolean
  description?: string
  default?: any
  enum?: string[]
}

export function parseToolParameters(
  schema?: Record<string, any>,
): ToolParamItem[] {
  if (!schema || typeof schema !== 'object') return []
  const properties = schema.properties
  if (!properties || typeof properties !== 'object') return []

  const requiredSet = new Set(
    Array.isArray(schema.required) ? schema.required : [],
  )

  const items: ToolParamItem[] = []

  for (const [name, rawProp] of Object.entries(properties)) {
    if (!rawProp || typeof rawProp !== 'object') {
      items.push({
        name,
        type: 'any',
        required: requiredSet.has(name),
      })
      continue
    }

    const prop = rawProp as any
    let typeStr = prop.type || 'any'
    if (prop.type === 'array') {
      const itemType = prop.items?.type || 'any'
      typeStr = `array<${itemType}>`
    } else if (Array.isArray(prop.type)) {
      typeStr = prop.type.join(' | ')
    }

    items.push({
      name,
      type: typeStr,
      required: requiredSet.has(name),
      description:
        typeof prop.description === 'string' ? prop.description : undefined,
      default: prop.default,
      enum: Array.isArray(prop.enum) ? prop.enum : undefined,
    })
  }

  items.sort((a, b) => {
    if (a.required !== b.required) return a.required ? -1 : 1
    return a.name.localeCompare(b.name)
  })

  return items
}

export const LOCALE_NS = 'settings.sessionSettings'
export const MCP_LOCALE_NS = 'settings.mcpServers'
export const SKILLS_LOCALE_NS = 'settings.skillsSettings'
