/**
 * Protocol utilities for MCP JSON-RPC parsing, version extraction, and error formatting.
 */
/** Helper to parse line-delimited and Content-Length framed JSON-RPC messages from MCP streams */
export function createJsonRpcParser(onMessage) {
    let buffer = '';
    return (chunk) => {
        buffer += chunk.toString('utf8');
        let keepScanning = true;
        while (keepScanning) {
            keepScanning = false;
            buffer = buffer.trimStart();
            if (!buffer)
                break;
            // 1. LSP / Content-Length framed JSON
            if (buffer.startsWith('Content-Length:')) {
                const headerEnd = buffer.indexOf('\r\n\r\n');
                const altHeaderEnd = buffer.indexOf('\n\n');
                const actualEnd = headerEnd !== -1 ? headerEnd : altHeaderEnd;
                const sepLen = headerEnd !== -1 ? 4 : 2;
                if (actualEnd !== -1) {
                    const header = buffer.slice(0, actualEnd);
                    const match = header.match(/Content-Length:\s*(\d+)/i);
                    if (match) {
                        const contentLength = parseInt(match[1], 10);
                        const bodyStart = actualEnd + sepLen;
                        if (buffer.length >= bodyStart + contentLength) {
                            const body = buffer.slice(bodyStart, bodyStart + contentLength);
                            buffer = buffer.slice(bodyStart + contentLength);
                            try {
                                const parsed = JSON.parse(body);
                                if (parsed && typeof parsed === 'object') {
                                    onMessage(parsed);
                                }
                            }
                            catch { }
                            keepScanning = true;
                            continue;
                        }
                    }
                }
            }
            // 2. Line-delimited JSON (standard MCP)
            const newlineIdx = buffer.indexOf('\n');
            if (newlineIdx !== -1) {
                const line = buffer.slice(0, newlineIdx).trim();
                buffer = buffer.slice(newlineIdx + 1);
                if (line) {
                    try {
                        const parsed = JSON.parse(line);
                        if (parsed && typeof parsed === 'object') {
                            onMessage(parsed);
                        }
                    }
                    catch {
                        // Ignore non-JSON log lines
                    }
                }
                keepScanning = true;
                continue;
            }
        }
    };
}
/** Helper to extract JSON-RPC response from text, handling both plain JSON and SSE data lines */
export function extractJsonRpcFromText(text) {
    const trimmed = text.trim();
    if (!trimmed)
        return null;
    // 1. Direct JSON parse
    try {
        const parsed = JSON.parse(trimmed);
        if (parsed && typeof parsed === 'object')
            return parsed;
    }
    catch { }
    // 2. Line by line parse for SSE data: lines
    const lines = trimmed.split(/\r?\n/);
    for (const line of lines) {
        const match = line.match(/^data:\s*(.+)$/i);
        if (match) {
            try {
                const parsed = JSON.parse(match[1].trim());
                if (parsed &&
                    typeof parsed === 'object' &&
                    (parsed.result !== undefined ||
                        parsed.error !== undefined ||
                        parsed.id !== undefined)) {
                    return parsed;
                }
            }
            catch { }
        }
    }
    // 3. Fallback regex match for { ... }
    const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        try {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed && typeof parsed === 'object')
                return parsed;
        }
        catch { }
    }
    return null;
}
/** Helper to format an MCP error object with detailed data */
export function formatMcpError(err) {
    if (!err)
        return '未知错误';
    if (typeof err === 'string')
        return err;
    const msg = err.message || `错误码 ${err.code}`;
    if (err.data !== undefined && err.data !== null) {
        const dataStr = typeof err.data === 'object' ? JSON.stringify(err.data) : String(err.data);
        return `${msg} (服务端返回: ${dataStr})`;
    }
    return msg;
}
/** Helper to extract supported protocol version from an MCP error object or message */
export function extractSupportedProtocolVersion(error) {
    if (!error || typeof error !== 'object')
        return null;
    // 1. Check data.supported / data.supportedVersions / data.supported_versions / data.versions
    const data = error.data;
    if (data !== undefined && data !== null) {
        if (typeof data === 'string' && data.trim()) {
            return data.trim();
        }
        if (typeof data === 'object') {
            const candidates = data.supported ??
                data.supportedVersions ??
                data.supported_versions ??
                data.versions;
            if (Array.isArray(candidates) && candidates.length > 0) {
                const found = candidates.find((v) => typeof v === 'string' && v.trim().length > 0);
                if (found)
                    return String(found).trim();
            }
            else if (typeof candidates === 'string' && candidates.trim()) {
                return candidates.trim();
            }
        }
    }
    // 2. Check message string for patterns like:
    // "Unsupported protocol version: 2024-11-05 (supported versions: 2025-11-25, 2024-10-07)"
    // "supported: ['2026-07-28']"
    // "supported protocol version: 2025-11-25"
    const message = typeof error.message === 'string' ? error.message : '';
    if (error.code === -32022 ||
        /protocol version/i.test(message) ||
        /unsupported version/i.test(message)) {
        const listMatch = message.match(/supported versions?:\s*([^\)\n]+)/i) ||
            message.match(/supported:\s*\[?([^\s\]]+)\]?/i) ||
            message.match(/supported protocol versions?:\s*([^\)\n]+)/i);
        if (listMatch && listMatch[1]) {
            const first = listMatch[1]
                .split(/[,;]/)[0]
                .replace(/['"\[\]]/g, '')
                .trim();
            if (first)
                return first;
        }
    }
    return null;
}
