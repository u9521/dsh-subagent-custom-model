export type SubagentModelMode = 'default' | 'inherit' | 'custom'

export interface SubagentModelConfig {
  mode: SubagentModelMode
  provider?: string
  model?: string
  reasoningEffort?: string
}

export interface SubagentModelStore {
  default: SubagentModelConfig
  sessions: Record<string, SubagentModelConfig>
}
