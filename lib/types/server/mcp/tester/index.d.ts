/**
 * MCP Server Connection & Discovery Tester subsystem.
 */
export * from './protocol.ts';
export * from './sse.ts';
export * from './stdio-runner.ts';
export * from './http-runner.ts';
import type { GlobalMcpServerConfig, McpTestResult } from '../../../types.ts';
/** Test if an MCP server can be connected to and successfully list its tools via MCP JSON-RPC protocol */
export declare function testMcpConnection(server: Partial<GlobalMcpServerConfig>): Promise<McpTestResult>;
