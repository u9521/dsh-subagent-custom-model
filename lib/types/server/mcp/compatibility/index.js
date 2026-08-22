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
import { extractJsonRpcFromText, extractSupportedProtocolVersion, formatMcpError, } from '../tester/protocol.js';
/**
 * Check MCP server compatibility for official @deepseek-ai/dsh-mcp-client.
 * Flow: First test 2026-07-28 stateless protocol feasibility -> Then test downgrade support.
 */
export async function checkMcpCompatibility(server, discoveredInfo, signal) {
    // -------------------------------------------------------------------------
    // STDIO Transport
    // -------------------------------------------------------------------------
    if (server.transport === 'stdio') {
        const protocolVersion = discoveredInfo?.protocolVersion || server.serverInfo?.protocolVersion;
        if (protocolVersion === '2026-07-28') {
            return {
                status: 'incompatible-2026-07-28',
                canEnable: false,
                protocolVersion: '2026-07-28',
                message: '检测到 2026-07-28 无状态协议，官方 MCP 客户端暂不支持',
                warning: '当前官方 @deepseek-ai/dsh-mcp-client 客户端暂未适配 2026-07-28 无状态协议，禁止直接启用。',
                error: '协议版本不受官方客户端支持 (2026-07-28)',
            };
        }
        return {
            status: 'compatible',
            canEnable: true,
            protocolVersion: protocolVersion || '2025-11-25',
            message: '协议兼容，可正常使用官方客户端加载',
        };
    }
    // -------------------------------------------------------------------------
    // HTTP / SSE Transport
    // -------------------------------------------------------------------------
    if (!server.url) {
        return {
            status: 'unknown',
            canEnable: false,
            message: '缺少服务 URL',
            error: '缺少服务 URL',
        };
    }
    const customHeaders = {};
    if (server.headers && typeof server.headers === 'object') {
        for (const [k, v] of Object.entries(server.headers)) {
            if (typeof v === 'string')
                customHeaders[k] = v;
        }
    }
    const timeoutSignal = signal || AbortSignal.timeout(6000);
    try {
        // -----------------------------------------------------------------------
        // Step 1: Probe Stateless (2026-07-28) Feasibility First
        // -----------------------------------------------------------------------
        const statelessMeta = {
            'io.modelcontextprotocol/protocolVersion': '2026-07-28',
            'io.modelcontextprotocol/clientCapabilities': {},
            'io.modelcontextprotocol/clientInfo': {
                name: 'dsh-compat-probe',
                version: '1.0.0',
            },
            protocolVersion: '2026-07-28',
            clientCapabilities: {},
            clientInfo: { name: 'dsh-compat-probe', version: '1.0.0' },
        };
        const statelessRes = await fetch(server.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json, text/event-stream',
                'MCP-Protocol-Version': '2026-07-28',
                'Mcp-Method': 'tools/list',
                ...customHeaders,
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'tools/list',
                params: {
                    _meta: statelessMeta,
                },
            }),
            signal: timeoutSignal,
        });
        const statelessRawText = await statelessRes.text();
        const statelessJson = extractJsonRpcFromText(statelessRawText);
        const isStateless2026Feasible = (statelessRes.ok || statelessRes.status === 202) &&
            (Array.isArray(statelessJson?.result?.tools) ||
                statelessJson?.result !== undefined);
        // -----------------------------------------------------------------------
        // Step 2: Test Legacy Handshake & Downgrade Feasibility
        // (Required because official @deepseek-ai/dsh-mcp-client uses legacy handshake)
        // -----------------------------------------------------------------------
        const legacyRes = await fetch(server.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json, text/event-stream',
                ...customHeaders,
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 10,
                method: 'initialize',
                params: {
                    protocolVersion: '2025-11-25',
                    capabilities: {},
                    clientInfo: { name: 'dsh-compat-probe', version: '1.0.0' },
                },
            }),
            signal: timeoutSignal,
        });
        const legacyRawText = await legacyRes.text();
        const legacyJson = extractJsonRpcFromText(legacyRawText);
        // Case A: Legacy handshake succeeded
        if ((legacyRes.ok || legacyRes.status === 202) &&
            legacyJson?.result?.protocolVersion) {
            const negotiatedVer = legacyJson.result.protocolVersion;
            if (isStateless2026Feasible) {
                // Server supports 2026-07-28, and ALSO accepts legacy handshake -> Downgrade supported!
                return {
                    status: 'downgrade-supported',
                    canEnable: true,
                    protocolVersion: '2026-07-28',
                    negotiatedVersion: negotiatedVer,
                    message: `检测到 2026-07-28 无状态协议，已成功测试并确认支持向下降级至 ${negotiatedVer}，允许使用官方客户端接入`,
                    warning: `服务端支持 2026-07-28 协议，但已自动协商并降级为 ${negotiatedVer} 兼容模式以适配官方客户端。`,
                };
            }
            // Legacy server only
            return {
                status: 'compatible',
                canEnable: true,
                protocolVersion: negotiatedVer,
                negotiatedVersion: negotiatedVer,
                message: `协议兼容 (${negotiatedVer})，官方客户端可正常加载`,
            };
        }
        // Case B: Legacy handshake returned error (check if version negotiation offers legacy version)
        if (legacyJson?.error) {
            const supportedVer = extractSupportedProtocolVersion(legacyJson.error);
            const dataSupported = legacyJson.error?.data?.supported;
            let supportedList = [];
            if (Array.isArray(dataSupported)) {
                supportedList = dataSupported.map(String);
            }
            else if (supportedVer) {
                supportedList = [supportedVer];
            }
            const legacyCandidate = supportedList.find((v) => v === '2025-11-25' ||
                v === '2024-11-05' ||
                v.startsWith('2024-') ||
                v.startsWith('2025-'));
            if (legacyCandidate) {
                return {
                    status: 'downgrade-supported',
                    canEnable: true,
                    protocolVersion: isStateless2026Feasible
                        ? '2026-07-28'
                        : legacyCandidate,
                    supportedVersions: supportedList,
                    negotiatedVersion: legacyCandidate,
                    message: `检测到服务端支持降级到 ${legacyCandidate}，允许使用官方客户端接入`,
                    warning: `服务端支持降级至 ${legacyCandidate}，已自动协商为兼容模式。`,
                };
            }
        }
        // Case C: 2026-07-28 Stateless was feasible in Step 1, but Legacy Handshake in Step 2 failed
        // (Pure 2026-07-28 Stateless Server that rejects legacy handshake)
        if (isStateless2026Feasible) {
            return {
                status: 'incompatible-2026-07-28',
                canEnable: false,
                protocolVersion: '2026-07-28',
                supportedVersions: ['2026-07-28'],
                message: '检测到 2026-07-28 无状态协议，经测试该服务端无法向下降级，官方客户端暂不支持',
                warning: '该 MCP 服务端为纯 2026-07-28 无状态协议（经测试不支持向下降级至 2024-11-05 / 2025-11-25），官方 @deepseek-ai/dsh-mcp-client 暂未支持，禁止启用以防异常。',
                error: '服务端仅支持 2026-07-28 无状态协议，不支持向下降级至旧版握手协议',
            };
        }
        // Case D: Both stateless and legacy probe failed
        if (legacyJson?.error) {
            return {
                status: 'unknown',
                canEnable: false,
                message: `MCP 握手失败: ${formatMcpError(legacyJson.error)}`,
                error: formatMcpError(legacyJson.error),
            };
        }
        return {
            status: 'unknown',
            canEnable: false,
            message: `服务端响应异常 (HTTP ${legacyRes.status} ${legacyRes.statusText})`,
            error: `HTTP ${legacyRes.status} ${legacyRes.statusText}`,
        };
    }
    catch (err) {
        return {
            status: 'unknown',
            canEnable: false,
            message: `兼容性检测异常: ${err?.message || String(err)}`,
            error: err?.message || String(err),
        };
    }
}
