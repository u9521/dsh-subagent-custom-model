import type { McpServerStore } from '../../types.ts';
import type { McpManager } from './manager.ts';
export declare function registerMcpRoutes(webServer: any, getMcpStore: () => McpServerStore, setMcpStore: (s: McpServerStore) => void, mcpManager?: McpManager): () => void;
