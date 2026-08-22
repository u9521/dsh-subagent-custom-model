/**
 * MCP Protocol Compatibility & Downgrade Detection Module.
 *
 * Detection Flow:
 * 1. Step 1: Probe modern 2026-07-28 Stateless protocol feasibility.
 * 2. Step 2: If the server supports/uses 2026-07-28, test whether it supports
 *    downgrading to legacy stateful handshake (2024-11-05 / 2025-11-25)
 *    to work with official @deepseek-ai/dsh-mcp-client.
 * 3. Step 3: If downgrade is supported, permit enabling with downgrade warning;
 *    if downgrade is rejected (pure stateless), prohibit enabling.
 *
 * NOTE: When the official @modelcontextprotocol/sdk and @deepseek-ai/dsh-mcp-client
 * are upgraded to support 2026-07-28 natively, this module can be easily removed
 * or bypassed.
 */
import type { GlobalMcpServerConfig, McpServerInfo } from '../../../types.ts';
export type CompatibilityStatus = 'compatible' | 'downgrade-supported' | 'incompatible-2026-07-28' | 'unknown';
export interface McpCompatibilityResult {
    status: CompatibilityStatus;
    canEnable: boolean;
    protocolVersion?: string;
    supportedVersions?: string[];
    negotiatedVersion?: string;
    message: string;
    warning?: string;
    error?: string;
}
/**
 * Check MCP server compatibility for official @deepseek-ai/dsh-mcp-client.
 * Flow: First test 2026-07-28 stateless protocol feasibility -> Then test downgrade support.
 */
export declare function checkMcpCompatibility(server: Partial<GlobalMcpServerConfig>, discoveredInfo?: McpServerInfo, signal?: AbortSignal): Promise<McpCompatibilityResult>;
