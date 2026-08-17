import type { SubagentModelConfig } from '../types.ts'

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
  onClose?: () => void
  onSave?: (config: SubagentModelConfig) => void
}

export const LOCALE_NS = 'settings.subagentModel'
