import type { Context } from '@deepseek-ai/cordis';
import type { McpServerStore, SessionSettingsStore } from '../../types.ts';
import type { McpManager } from '../mcp/manager.ts';
export declare function registerSessionSettingsRoutes(ctx: Context, webServer: any, getSessionSettingsStore: () => SessionSettingsStore, setSessionSettingsStore: (s: SessionSettingsStore) => void, getMcpStore: () => McpServerStore, mcpManager?: McpManager): () => void;
