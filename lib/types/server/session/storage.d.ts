import type { SubagentModelConfig, McpServerStore, SessionSettingsConfig, SessionSettingsStore, SessionSkillsConfig } from '../../types.ts';
export declare const DEFAULT_SESSION_SETTINGS: SessionSettingsConfig;
export declare function normalizeSubagentModelConfig(raw?: Partial<SubagentModelConfig>): SubagentModelConfig;
export declare function normalizeSkillsConfig(raw?: Partial<SessionSkillsConfig>): SessionSkillsConfig;
export declare function normalizeSessionSettings(raw?: Partial<SessionSettingsConfig>): SessionSettingsConfig;
export declare function loadSessionSettingsStore(): SessionSettingsStore;
export declare function saveSessionSettingsStore(store: SessionSettingsStore): void;
export declare function resolveEffectiveSubagentModel(store: SessionSettingsStore, sessionId?: string): SubagentModelConfig;
export declare function resolveEffectiveMcp(store: SessionSettingsStore, mcpStore: McpServerStore, sessionId?: string): {
    mode: 'default' | 'custom';
    enabledServerIds: string[];
    toolsMode: Record<string, 'default' | 'custom'>;
    disabledTools: Record<string, string[]>;
    effectiveDisabledTools: Record<string, string[]>;
};
export declare function resolveEffectiveSkills(store: SessionSettingsStore, sessionId?: string): {
    mode: 'default' | 'custom';
    disabledSkills: string[];
    disabledModelSkills: string[];
    disabledUserSkills: string[];
    effectiveDisabledSkills: string[];
    effectiveDisabledModelSkills: string[];
    effectiveDisabledUserSkills: string[];
};
export declare function resolveEffectiveSessionSettings(store: SessionSettingsStore, mcpStore: McpServerStore, sessionId?: string): SessionSettingsConfig;
