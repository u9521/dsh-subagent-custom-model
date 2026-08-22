/**
 * Streamable HTTP & SSE transport tester.
 * Minimal reference implementation supporting both Stateful (Legacy Handshake)
 * and Stateless (MCP 2026-07-28 / SEP-2575) specifications.
 */

import type {
  GlobalMcpServerConfig,
  McpDiscoveredTool,
  McpTestResult,
} from '../../../types.ts'
import {
  extractJsonRpcFromText,
  extractSupportedProtocolVersion,
  formatMcpError,
} from './protocol.ts'
import { startSseStream } from './sse.ts'

/** Test an MCP server over Streamable HTTP or SSE transport */
export async function testHttpConnection(
  server: Partial<GlobalMcpServerConfig>,
): Promise<McpTestResult> {
  const urlStr = server.url?.trim()
  if (!urlStr) {
    return { ok: false, message: 'HTTP/SSE 模式需要填写服务器地址 (url)' }
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(urlStr)
  } catch (err: any) {
    return {
      ok: false,
      message: `URL 格式不正确: ${err?.message || String(err)}`,
    }
  }

  const abortCtrl = new AbortController()
  const timeoutTimer = setTimeout(() => {
    try {
      abortCtrl.abort()
    } catch {}
  }, 12000)

  try {
    const isSseMode =
      parsedUrl.pathname.endsWith('/sse') || parsedUrl.pathname.includes('/sse')
    const customHeaders = server.headers || {}

    let postEndpointUrl: string = parsedUrl.toString()
    let waitForSseMessageWithId: (
      targetId: number,
      timeoutMs?: number,
    ) => Promise<any> = () => Promise.resolve(null)

    // If SSE mode, open GET SSE stream and listen for endpoint + asynchronous JSON-RPC responses
    if (isSseMode) {
      const sseHandler = startSseStream(
        parsedUrl,
        customHeaders,
        abortCtrl.signal,
      )
      postEndpointUrl = await sseHandler.postEndpointPromise
      waitForSseMessageWithId = sseHandler.waitForMessageWithId
    }

    let activeProtocolVersion = '2025-11-25'

    const baseHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
      ...customHeaders,
    }

    let sessionId: string | undefined = undefined

    const sendJsonRpc = async (
      msg: any,
      customReqHeaders?: Record<string, string>,
      targetUrl: string = postEndpointUrl,
    ): Promise<{ res: Response; json: any; rawText: string }> => {
      const headers: Record<string, string> = {
        ...baseHeaders,
        ...(sessionId ? { 'mcp-session-id': sessionId } : {}),
        ...(customReqHeaders || {}),
      }

      const res = await fetch(targetUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(msg),
        signal: abortCtrl.signal,
      })

      // Track session ID from headers
      const headerSessionId =
        res.headers.get('mcp-session-id') ||
        res.headers.get('Mcp-Session-Id') ||
        res.headers.get('x-session-id')
      if (headerSessionId) {
        sessionId = headerSessionId.trim()
      }

      const rawText = await res.text().catch(() => '')
      let json = extractJsonRpcFromText(rawText)

      // If response is 202 Accepted or empty or body is "Accepted", wait for the response on the SSE stream!
      if (
        (res.status === 202 ||
          !json ||
          rawText.trim().toLowerCase() === 'accepted') &&
        isSseMode &&
        msg.id !== undefined
      ) {
        const sseJson = await waitForSseMessageWithId(msg.id, 5000)
        if (sseJson) {
          json = sseJson
        }
      }

      // Track session ID from JSON result if present
      if (
        json?.result?.sessionId &&
        typeof json.result.sessionId === 'string'
      ) {
        sessionId = json.result.sessionId
      }

      return { res, json, rawText }
    }

    // Step 1: initialize (do NOT send MCP-Protocol-Version header during initialize handshake per MCP spec)
    let initResult = await sendJsonRpc({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: activeProtocolVersion,
        capabilities: {},
        clientInfo: { name: 'dsh-mcp-tester', version: '1.0.0' },
      },
    })

    // Protocol Version Negotiation if server rejected requested version
    if (
      initResult.json?.error &&
      (initResult.json.error.code === -32022 ||
        /protocol version/i.test(initResult.json.error.message || '') ||
        initResult.json.error.data?.supported ||
        initResult.json.error.data?.supportedVersions)
    ) {
      const supportedVersion =
        extractSupportedProtocolVersion(initResult.json.error) ||
        (activeProtocolVersion === '2025-11-25' ? '2024-11-05' : null)

      if (supportedVersion && supportedVersion !== activeProtocolVersion) {
        activeProtocolVersion = supportedVersion

        // If the server explicitly declared 2026-07-28 Stateless spec, skip legacy initialize retry
        // because 2026-07-28 removed the initialize method entirely!
        if (supportedVersion !== '2026-07-28') {
          // Re-attempt initialize with negotiated legacy protocol version in body (still without header)
          initResult = await sendJsonRpc({
            jsonrpc: '2.0',
            id: 1,
            method: 'initialize',
            params: {
              protocolVersion: activeProtocolVersion,
              capabilities: {},
              clientInfo: { name: 'dsh-mcp-tester', version: '1.0.0' },
            },
          })
        }
      }
    }

    let serverInfo: any = undefined
    if (initResult.json?.result && typeof initResult.json.result === 'object') {
      if (typeof initResult.json.result.protocolVersion === 'string') {
        activeProtocolVersion = initResult.json.result.protocolVersion
      }
      // Set MCP-Protocol-Version header for all subsequent post-initialization requests
      baseHeaders['MCP-Protocol-Version'] = activeProtocolVersion

      serverInfo = {
        name:
          typeof initResult.json.result.serverInfo?.name === 'string'
            ? initResult.json.result.serverInfo.name
            : undefined,
        version:
          typeof initResult.json.result.serverInfo?.version === 'string'
            ? initResult.json.result.serverInfo.version
            : undefined,
        protocolVersion: activeProtocolVersion,
      }
    }

    // Fallback: If initialize failed (e.g. server is Stateless MCP 2026-07-28 / SEP-2575 which dropped initialize handshake),
    // attempt direct Stateless tools/list request with MCP-Protocol-Version: 2026-07-28 header per SEP-2243 & SEP-2575!
    if (
      (initResult.json?.error || !initResult.res.ok) &&
      (activeProtocolVersion === '2026-07-28' ||
        /2026-07-28/i.test(initResult.json?.error?.message || '') ||
        /2026-07-28/i.test(
          JSON.stringify(initResult.json?.error?.data || ''),
        ) ||
        /legacy handshake/i.test(initResult.json?.error?.message || '') ||
        /stateless/i.test(initResult.json?.error?.message || '') ||
        initResult.json?.error?.code === -32601 ||
        initResult.json?.error?.code === -32022)
    ) {
      const statelessVersion =
        activeProtocolVersion === '2026-07-28' ||
        /2026-07-28/i.test(initResult.json?.error?.message || '') ||
        /2026-07-28/i.test(JSON.stringify(initResult.json?.error?.data || ''))
          ? '2026-07-28'
          : activeProtocolVersion

      const statelessMeta = {
        'io.modelcontextprotocol/protocolVersion': statelessVersion,
        'io.modelcontextprotocol/clientCapabilities': {},
        'io.modelcontextprotocol/clientInfo': {
          name: 'dsh-mcp-tester',
          version: '1.0.0',
        },
        protocolVersion: statelessVersion,
        clientCapabilities: {},
        clientInfo: {
          name: 'dsh-mcp-tester',
          version: '1.0.0',
        },
      }

      const statelessHeaders = {
        'MCP-Protocol-Version': statelessVersion,
        'Mcp-Method': 'tools/list',
      }

      try {
        let statelessResult = await sendJsonRpc(
          {
            jsonrpc: '2.0',
            id: 2,
            method: 'tools/list',
            params: {
              _meta: statelessMeta,
            },
          },
          statelessHeaders,
        )

        // If tools list was returned
        let statelessTools = statelessResult.json?.result?.tools

        // If postEndpointUrl failed or returned error in SSE mode, also try direct parsedUrl
        if (
          !Array.isArray(statelessTools) &&
          postEndpointUrl !== parsedUrl.toString()
        ) {
          const directResult = await sendJsonRpc(
            {
              jsonrpc: '2.0',
              id: 2,
              method: 'tools/list',
              params: {
                _meta: statelessMeta,
              },
            },
            statelessHeaders,
            parsedUrl.toString(),
          )
          if (Array.isArray(directResult.json?.result?.tools)) {
            statelessResult = directResult
            statelessTools = directResult.json.result.tools
          }
        }

        if (Array.isArray(statelessTools)) {
          const toolDetails: McpDiscoveredTool[] = statelessTools
            .map((t: any) => ({
              name: typeof t === 'string' ? t : t?.name || t?.id || '',
              description:
                typeof t === 'object' ? t?.description || '' : undefined,
              inputSchema: typeof t === 'object' ? t?.inputSchema : undefined,
            }))
            .filter((t) => Boolean(t.name))

          const toolNames = toolDetails.map((t) => t.name)
          const count = toolNames.length
          return {
            ok: true,
            count,
            tools: toolNames,
            toolDetails,
            serverInfo: {
              protocolVersion: statelessVersion,
            },
            detectedTransport: isSseMode ? 'sse' : 'streamable-http',
            message:
              count > 0
                ? `成功获取到 ${count} 个工具`
                : '成功连接并完成 MCP 握手 (未声明可用工具)',
          }
        }

        if (statelessResult.json?.error) {
          return {
            ok: false,
            message: `MCP tools/list 返回错误: ${formatMcpError(statelessResult.json.error)}`,
          }
        }

        if (!statelessResult.res.ok && statelessResult.res.status !== 202) {
          const errDetail = statelessResult.rawText
            ? `: ${statelessResult.rawText.slice(0, 200)}`
            : ''
          return {
            ok: false,
            message: `HTTP tools/list 请求失败 (HTTP ${statelessResult.res.status} ${statelessResult.res.statusText})${errDetail}`,
          }
        }
      } catch (statelessErr: any) {
        return {
          ok: false,
          message: `Stateless tools/list 请求失败: ${statelessErr?.message || String(statelessErr)}`,
        }
      }
    }

    if (initResult.json?.error) {
      return {
        ok: false,
        message: `MCP 初始化返回错误: ${formatMcpError(initResult.json.error)}`,
      }
    }

    if (!initResult.res.ok && initResult.res.status !== 202) {
      const errDetail = initResult.rawText
        ? `: ${initResult.rawText.slice(0, 200)}`
        : ''
      return {
        ok: false,
        message: `HTTP initialize 请求失败 (HTTP ${initResult.res.status} ${initResult.res.statusText})${errDetail}`,
      }
    }

    // Step 2: notifications/initialized (required by MCP stateful servers)
    try {
      await sendJsonRpc(
        {
          jsonrpc: '2.0',
          method: 'notifications/initialized',
        },
        {
          'Mcp-Method': 'notifications/initialized',
        },
        undefined,
      )
    } catch {
      // Continue if server is stateless
    }

    // Step 3: tools/list
    const toolsResult = await sendJsonRpc(
      {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list',
        params: {},
      },
      {
        'Mcp-Method': 'tools/list',
      },
    )

    if (toolsResult.json?.error) {
      return {
        ok: false,
        message: `MCP tools/list 返回错误: ${formatMcpError(toolsResult.json.error)}`,
      }
    }

    if (!toolsResult.res.ok && toolsResult.res.status !== 202) {
      const errDetail = toolsResult.rawText
        ? `: ${toolsResult.rawText.slice(0, 200)}`
        : ''
      return {
        ok: false,
        message: `HTTP tools/list 请求失败 (HTTP ${toolsResult.res.status} ${toolsResult.res.statusText})${errDetail}`,
      }
    }

    const rawTools = toolsResult.json?.result?.tools
    if (Array.isArray(rawTools)) {
      const toolDetails: McpDiscoveredTool[] = rawTools
        .map((t: any) => ({
          name: typeof t === 'string' ? t : t?.name || t?.id || '',
          description: typeof t === 'object' ? t?.description || '' : undefined,
          inputSchema: typeof t === 'object' ? t?.inputSchema : undefined,
        }))
        .filter((t) => Boolean(t.name))

      const toolNames = toolDetails.map((t) => t.name)
      const count = toolNames.length
      return {
        ok: true,
        count,
        tools: toolNames,
        toolDetails,
        serverInfo,
        detectedTransport: isSseMode ? 'sse' : 'streamable-http',
        message:
          count > 0
            ? `成功获取到 ${count} 个工具`
            : '成功连接并完成 MCP 握手 (未声明可用工具)',
      }
    }

    return {
      ok: false,
      message: `HTTP 响应格式异常 (未包含有效的 tools 列表): ${toolsResult.rawText.slice(0, 150)}`,
    }
  } catch (err: any) {
    return {
      ok: false,
      message: `HTTP 连接测试失败: ${err?.message || String(err)}`,
    }
  } finally {
    clearTimeout(timeoutTimer)
    try {
      abortCtrl.abort()
    } catch {}
  }
}
