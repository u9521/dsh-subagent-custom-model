export type SubagentModelMode = 'default' | 'inherit' | 'custom';
export interface SubagentModelConfig {
    mode: SubagentModelMode;
    provider?: string;
    model?: string;
    reasoningEffort?: string;
}
export type McpTransportType = 'stdio' | 'streamable-http-or-sse';
export interface McpReconnectConfig {
    enabled?: boolean;
    initialDelayMs?: number;
    maxDelayMs?: number;
    maxAttempts?: number;
}
export interface GlobalMcpServerConfig {
    id: string;
    name: string;
    description?: string;
    transport: McpTransportType;
    command?: string;
    args?: string[];
    env?: Record<string, string>;
    cwd?: string;
    url?: string;
    headers?: Record<string, string>;
    enabledByDefault: boolean;
    toolCallTimeoutMs?: number;
    failOnStartupError?: boolean;
    reconnect?: McpReconnectConfig;
    disabledTools?: string[];
    tools?: string[];
    toolDetails?: McpDiscoveredTool[];
    detectedTransport?: 'stdio' | 'streamable-http' | 'sse';
    serverInfo?: McpServerInfo;
    compatibility?: {
        status: 'compatible' | 'downgrade-supported' | 'incompatible-2026-07-28' | 'unknown';
        canEnable: boolean;
        protocolVersion?: string;
        supportedVersions?: string[];
        negotiatedVersion?: string;
        message: string;
        warning?: string;
        error?: string;
    };
    lastTestedAt?: number;
    createdAt?: number;
    updatedAt?: number;
}
export interface McpDiscoveredTool {
    name: string;
    description?: string;
    inputSchema?: Record<string, any>;
}
export interface McpServerInfo {
    name?: string;
    version?: string;
    protocolVersion?: string;
}
export interface McpTestResult {
    ok: boolean;
    message: string;
    tools?: string[];
    toolDetails?: McpDiscoveredTool[];
    serverInfo?: McpServerInfo;
    detectedTransport?: 'stdio' | 'streamable-http' | 'sse';
    compatibility?: {
        status: 'compatible' | 'downgrade-supported' | 'incompatible-2026-07-28' | 'unknown';
        canEnable: boolean;
        protocolVersion?: string;
        supportedVersions?: string[];
        negotiatedVersion?: string;
        message: string;
        warning?: string;
        error?: string;
    };
    count?: number;
}
export interface McpServerStore {
    servers: Record<string, GlobalMcpServerConfig>;
}
export type SessionMcpMode = 'default' | 'custom';
export interface SessionMcpConfig {
    mode: SessionMcpMode;
    enabledServerIds: string[];
    toolsMode?: Record<string, 'default' | 'custom'>;
    disabledTools?: Record<string, string[]>;
    effectiveDisabledTools?: Record<string, string[]>;
}
export type SessionSkillsMode = 'default' | 'custom';
export interface SessionSkillsConfig {
    mode: SessionSkillsMode;
    disabledSkills: string[];
    disabledModelSkills?: string[];
    disabledUserSkills?: string[];
    effectiveDisabledSkills?: string[];
    effectiveDisabledModelSkills?: string[];
    effectiveDisabledUserSkills?: string[];
}
export interface SkillItem {
    name: string;
    description: string;
    whenToUse?: string;
    provider: string;
    source?: string;
    path?: string;
    content?: string;
    modelInvocable?: boolean;
    userInvocable?: boolean;
    isRuntime?: boolean;
}
export interface SessionSettingsConfig {
    subagentModel: SubagentModelConfig;
    mcp: SessionMcpConfig;
    skills: SessionSkillsConfig;
}
export interface SessionSettingsStore {
    default: SessionSettingsConfig;
    sessions: Record<string, SessionSettingsConfig>;
}
