import type { Context } from '@deepseek-ai/cordis';
import type { GlobalMcpServerConfig, McpServerStore, SessionSettingsStore } from '../../types.ts';
import { type McpCompatibilityResult } from './compatibility/index.ts';
export interface ToolMeta {
    serverId: string;
    rawName: string;
}
/**
 * Resolve the official @deepseek-ai/dsh-mcp-client Cordis plugin module from DSH.
 */
export declare function loadOfficialMcpClientPlugin(): Promise<any>;
export declare class McpManager {
    private ctx;
    private getMcpStore;
    private setMcpStore;
    private getSessionSettingsStore?;
    /** Map of serverId -> active Cordis Plugin Fork instance of @deepseek-ai/dsh-mcp-client */
    private officialForks;
    /** Map of publicToolName -> { serverId, rawName } metadata */
    private toolMeta;
    /** Map of serverId -> Set of publicToolNames registered for that server */
    private serverToolMap;
    /** Active sync promises to prevent race conditions */
    private activeSyncs;
    constructor(ctx: Context, getMcpStore: () => McpServerStore, setMcpStore: (store: McpServerStore) => void, getSessionSettingsStore?: () => SessionSettingsStore);
    /**
     * Check if an MCP server is currently needed (enabled by default or enabled in any active session).
     */
    isServerNeeded(serverId: string): boolean;
    /**
     * Get metadata for a public tool name.
     */
    getToolMeta(publicName: string): ToolMeta | undefined;
    /**
     * Check if a tool is an MCP tool managed by this plugin.
     */
    isMcpTool(publicName: string): boolean;
    /**
     * Check compatibility for an MCP server against the official client.
     */
    checkCompatibility(server: Partial<GlobalMcpServerConfig>): Promise<McpCompatibilityResult>;
    /**
     * Mount official @deepseek-ai/dsh-mcp-client plugin instance dynamically in memory.
     */
    mountOfficialClient(server: GlobalMcpServerConfig, officialPlugin: any): Promise<boolean>;
    /**
     * Unmount official mcp-client fork for a server.
     */
    unmountOfficialClient(serverId: string): void;
    /**
     * Unregister / unmount a specific server.
     */
    unregisterServer(serverId: string): void;
    /**
     * Synchronize tool registrations for a single server:
     * 1. Checks protocol compatibility with 2-stage probe.
     * 2. If compatible (or downgrade supported), mounts official client.
     * 3. If incompatible (e.g. 2026-07-28 without downgrade), prohibits enabling and issues warning.
     */
    syncServer(server: GlobalMcpServerConfig): Promise<void>;
    /**
     * Synchronize all servers in the store.
     */
    syncAll(): void;
    /**
     * Teardown and unmount all official client forks on plugin unload.
     */
    dispose(): void;
}
