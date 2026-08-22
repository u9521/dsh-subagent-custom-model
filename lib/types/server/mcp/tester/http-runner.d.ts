/**
 * Streamable HTTP & SSE transport tester.
 * Minimal reference implementation supporting both Stateful (Legacy Handshake)
 * and Stateless (MCP 2026-07-28 / SEP-2575) specifications.
 */
import type { GlobalMcpServerConfig, McpTestResult } from '../../../types.ts';
/** Test an MCP server over Streamable HTTP or SSE transport */
export declare function testHttpConnection(server: Partial<GlobalMcpServerConfig>): Promise<McpTestResult>;
