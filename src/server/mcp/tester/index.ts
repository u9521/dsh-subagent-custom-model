/**
 * MCP Server Connection & Discovery Tester subsystem.
 */

export * from './protocol.ts'
export * from './sse.ts'
export * from './stdio-runner.ts'
export * from './http-runner.ts'

import type { GlobalMcpServerConfig, McpTestResult } from '../../../types.ts'
import { testStdioConnection } from './stdio-runner.ts'
import { testHttpConnection } from './http-runner.ts'
import { checkMcpCompatibility } from '../compatibility/index.ts'

/** Test if an MCP server can be connected to and successfully list its tools via MCP JSON-RPC protocol */
export async function testMcpConnection(
  server: Partial<GlobalMcpServerConfig>,
): Promise<McpTestResult> {
  if (!server.transport) {
    return { ok: false, message: '缺少传输协议类型 (transport)' }
  }

  let result: McpTestResult
  // 1. STDIO Transport
  if (server.transport === 'stdio') {
    result = await testStdioConnection(server)
  } else if (server.transport === 'streamable-http-or-sse') {
    // 2. Streamable HTTP / SSE Transport
    result = await testHttpConnection(server)
  } else {
    return { ok: false, message: `不支持的传输协议: ${server.transport}` }
  }

  // 3. Attach compatibility analysis
  try {
    const compat = await checkMcpCompatibility(server, result.serverInfo)
    result.compatibility = compat
    if (!compat.canEnable && compat.warning) {
      result.message = `${result.message} [警告: ${compat.warning}]`
    }
  } catch {}

  return result
}
