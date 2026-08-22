import type { SessionSettingsConfig } from '../types.ts';
export type { SubagentModelMode, SubagentModelConfig, McpTransportType, McpReconnectConfig, GlobalMcpServerConfig, McpDiscoveredTool, McpServerInfo, McpTestResult, McpServerStore, SessionMcpMode, SessionMcpConfig, SessionSkillsMode, SessionSkillsConfig, SkillItem, SessionSettingsConfig, SessionSettingsStore, } from '../types.ts';
export interface ModelReasoningEffort {
    id: string;
    name: string;
    description?: string;
}
export interface ModelReasoning {
    efforts: ModelReasoningEffort[];
    defaultEffort?: string;
}
export interface ModelCatalogItem {
    id: string;
    name: string;
    description?: string;
    reasoning?: ModelReasoning;
}
export interface ModelProviderGroup {
    id: string;
    name: string;
    models: ModelCatalogItem[];
}
export interface ModelCatalogResponse {
    groups?: ModelProviderGroup[];
    failures?: Array<{
        id: string;
        name: string;
        message: string;
    }>;
}
export interface ClientPageProps {
    api: any;
    t: (key: string, vars?: Record<string, string | number>) => string;
    sessionId?: string;
    sessionTitle?: string;
    useSessions?: any;
    onClose?: () => void;
    onSave?: (config: SessionSettingsConfig) => void;
}
export interface McpSettingsProps {
    api: any;
    t: (key: string, vars?: Record<string, string | number>) => string;
    close?: () => void;
}
export interface SkillsSettingsProps {
    api: any;
    t: (key: string, vars?: Record<string, string | number>) => string;
    close?: () => void;
}
export interface ToolParamItem {
    name: string;
    type: string;
    required: boolean;
    description?: string;
    default?: any;
    enum?: string[];
}
export declare function parseToolParameters(schema?: Record<string, any>): ToolParamItem[];
export declare const LOCALE_NS = "settings.sessionSettings";
export declare const MCP_LOCALE_NS = "settings.mcpServers";
export declare const SKILLS_LOCALE_NS = "settings.skillsSettings";
