/**
 * STDIO transport tester.
 * Minimal reference implementation managing local subprocesses without bulky dependencies.
 */
import type { GlobalMcpServerConfig, McpTestResult } from '../../../types.ts';
/** Test an MCP server over STDIO transport */
export declare function testStdioConnection(server: Partial<GlobalMcpServerConfig>): Promise<McpTestResult>;
