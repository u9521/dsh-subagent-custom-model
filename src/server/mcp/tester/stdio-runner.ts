/**
 * STDIO transport tester.
 * Minimal reference implementation managing local subprocesses without bulky dependencies.
 */

import { spawn } from 'node:child_process'
import type {
  GlobalMcpServerConfig,
  McpDiscoveredTool,
  McpTestResult,
} from '../../../types.ts'
import {
  createJsonRpcParser,
  extractSupportedProtocolVersion,
  formatMcpError,
} from './protocol.ts'

/** Test an MCP server over STDIO transport */
export async function testStdioConnection(
  server: Partial<GlobalMcpServerConfig>,
): Promise<McpTestResult> {
  const command = server.command?.trim()
  if (!command) {
    return { ok: false, message: 'stdio 模式需要填写启动命令 (command)' }
  }

  return new Promise((resolve) => {
    let settled = false
    let stderrBuffer = ''

    const cleanExit = (res: McpTestResult) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      try {
        proc.kill('SIGTERM')
        setTimeout(() => {
          try {
            proc.kill('SIGKILL')
          } catch {}
        }, 600)
      } catch {}
      resolve(res)
    }

    const timer = setTimeout(() => {
      const errDetail = stderrBuffer.trim()
        ? ` (stderr: ${stderrBuffer.trim().slice(-200)})`
        : ''
      cleanExit({
        ok: false,
        message: `连接超时 (10s)：未能通过 MCP 协议成功获取工具列表${errDetail}`,
      })
    }, 10000)

    let proc: any
    try {
      proc = spawn(command, server.args || [], {
        cwd: server.cwd || process.cwd(),
        env: { ...process.env, ...(server.env || {}) },
        stdio: ['pipe', 'pipe', 'pipe'],
      })
    } catch (err: any) {
      cleanExit({
        ok: false,
        message: `无法启动子进程: ${err?.message || String(err)}`,
      })
      return
    }

    proc.on('error', (err: any) => {
      cleanExit({
        ok: false,
        message: `子进程启动失败: ${err?.message || String(err)}`,
      })
    })

    proc.stderr?.on('data', (chunk: Buffer) => {
      stderrBuffer += chunk.toString('utf8')
      if (stderrBuffer.length > 2000) {
        stderrBuffer = stderrBuffer.slice(-2000)
      }
    })

    proc.on('close', (code: number | null, signal: string | null) => {
      if (!settled) {
        const errDetail = stderrBuffer.trim()
          ? `\n输出: ${stderrBuffer.trim().slice(-300)}`
          : ''
        cleanExit({
          ok: false,
          message: `MCP 子进程退出 (退出码: ${code ?? signal ?? '未知'})${errDetail}`,
        })
      }
    })

    const sendRpc = (msg: any) => {
      if (proc.stdin && !proc.stdin.destroyed) {
        proc.stdin.write(JSON.stringify(msg) + '\n')
      }
    }

    let activeProtocolVersion = '2025-11-25'
    let hasRetriedNegotiation = false
    let serverInfo: any = undefined

    const parser = createJsonRpcParser((msg: any) => {
      if (settled) return

      // 1. Initialize Response (id: 1)
      if (msg.id === 1) {
        if (msg.error) {
          const supportedVersion =
            extractSupportedProtocolVersion(msg.error) ||
            (activeProtocolVersion === '2025-11-25' ? '2024-11-05' : null)

          if (
            supportedVersion &&
            supportedVersion !== activeProtocolVersion &&
            !hasRetriedNegotiation
          ) {
            hasRetriedNegotiation = true
            activeProtocolVersion = supportedVersion

            if (supportedVersion === '2026-07-28') {
              // Stateless MCP 2026-07-28 removed initialize -> send tools/list directly with namespaced _meta envelope
              sendRpc({
                jsonrpc: '2.0',
                id: 2,
                method: 'tools/list',
                params: {
                  _meta: {
                    'io.modelcontextprotocol/protocolVersion': '2026-07-28',
                    'io.modelcontextprotocol/clientCapabilities': {},
                    'io.modelcontextprotocol/clientInfo': {
                      name: 'dsh-mcp-tester',
                      version: '1.0.0',
                    },
                    protocolVersion: '2026-07-28',
                    clientCapabilities: {},
                    clientInfo: {
                      name: 'dsh-mcp-tester',
                      version: '1.0.0',
                    },
                  },
                },
              })
              return
            }

            sendRpc({
              jsonrpc: '2.0',
              id: 1,
              method: 'initialize',
              params: {
                protocolVersion: activeProtocolVersion,
                capabilities: {},
                clientInfo: {
                  name: 'dsh-mcp-tester',
                  version: '1.0.0',
                },
              },
            })
            return
          }

          cleanExit({
            ok: false,
            message: `MCP 初始化失败: ${formatMcpError(msg.error)}`,
          })
          return
        }

        if (msg.result && typeof msg.result === 'object') {
          if (typeof msg.result.protocolVersion === 'string') {
            activeProtocolVersion = msg.result.protocolVersion
          }
          serverInfo = {
            name:
              typeof msg.result.serverInfo?.name === 'string'
                ? msg.result.serverInfo.name
                : undefined,
            version:
              typeof msg.result.serverInfo?.version === 'string'
                ? msg.result.serverInfo.version
                : undefined,
            protocolVersion: activeProtocolVersion,
          }
        }

        // Send initialized notification + tools/list request
        sendRpc({
          jsonrpc: '2.0',
          method: 'notifications/initialized',
        })
        sendRpc({
          jsonrpc: '2.0',
          id: 2,
          method: 'tools/list',
          params: {},
        })
        return
      }

      // 2. Tools List Response (id: 2)
      if (msg.id === 2) {
        if (msg.error) {
          cleanExit({
            ok: false,
            message: `获取工具列表失败: ${formatMcpError(msg.error)}`,
          })
          return
        }

        const rawTools = msg.result?.tools
        if (Array.isArray(rawTools)) {
          const toolDetails: McpDiscoveredTool[] = rawTools
            .map((t: any) => ({
              name: typeof t === 'string' ? t : t?.name || t?.id || '',
              description:
                typeof t === 'object' ? t?.description || '' : undefined,
              inputSchema: typeof t === 'object' ? t?.inputSchema : undefined,
            }))
            .filter((t) => Boolean(t.name))

          const toolNames: string[] = toolDetails.map((t) => t.name)
          const count = toolNames.length
          const summary =
            count > 0
              ? `成功获取到 ${count} 个工具`
              : '成功连接并完成 MCP 握手 (未声明可用工具)'
          cleanExit({
            ok: true,
            message: summary,
            tools: toolNames,
            toolDetails,
            serverInfo,
            detectedTransport: 'stdio',
            count,
          })
          return
        } else {
          cleanExit({
            ok: false,
            message: `MCP tools/list 返回格式不正确 (未找到 tools 数组): ${JSON.stringify(msg.result).slice(0, 150)}`,
          })
          return
        }
      }
    })

    proc.stdout?.on('data', parser)

    // Send initial handshake request
    sendRpc({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-11-25',
        capabilities: {},
        clientInfo: {
          name: 'dsh-mcp-tester',
          version: '1.0.0',
        },
      },
    })
  })
}
