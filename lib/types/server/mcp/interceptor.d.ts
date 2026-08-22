import type { Context } from '@deepseek-ai/cordis';
import type { McpServerStore, SessionSettingsStore } from '../../types.ts';
import type { McpManager } from './manager.ts';
export declare function registerMcpInterceptors(ctx: Context, getSessionSettingsStore: () => SessionSettingsStore, getMcpStore: () => McpServerStore, mcpManager?: McpManager): void;
