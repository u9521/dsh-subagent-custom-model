/**
 * SSE endpoint discovery and message streaming utilities for MCP SSE transport.
 */
/** Helper to discover the actual POST endpoint from an SSE GET stream */
export async function discoverSseEndpoint(url, customHeaders) {
    try {
        const res = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                Accept: 'text/event-stream',
                ...customHeaders,
            },
            signal: AbortSignal.timeout(4000),
        });
        if (!res.ok || !res.body)
            return null;
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf8');
        let buffer = '';
        const readTimer = setTimeout(() => {
            try {
                reader.cancel();
            }
            catch { }
        }, 3000);
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                buffer += decoder.decode(value, { stream: true });
                // Check for event: endpoint \n data: <url>
                const endpointMatch = buffer.match(/event:\s*endpoint[\r\n]+data:\s*([^\r\n]+)/i) ||
                    buffer.match(/data:\s*([^\r\n]*\/messages[^\r\n]*)/i);
                if (endpointMatch) {
                    const relOrAbs = endpointMatch[1].trim();
                    clearTimeout(readTimer);
                    try {
                        reader.cancel();
                    }
                    catch { }
                    return new URL(relOrAbs, url).toString();
                }
                if (buffer.length > 4000)
                    break;
            }
        }
        finally {
            clearTimeout(readTimer);
            try {
                reader.cancel();
            }
            catch { }
        }
    }
    catch { }
    return null;
}
/** Helper to start listening to an SSE stream and buffer/dispatch JSON-RPC messages */
export function startSseStream(parsedUrl, customHeaders, abortSignal) {
    const sseMessages = [];
    const messageListeners = [];
    let resolveEndpoint = () => { };
    const endpointPromise = new Promise((resolve) => {
        resolveEndpoint = resolve;
    });
    (async () => {
        try {
            const sseRes = await fetch(parsedUrl.toString(), {
                method: 'GET',
                headers: {
                    Accept: 'text/event-stream',
                    ...customHeaders,
                },
                signal: abortSignal,
            });
            if (!sseRes.ok || !sseRes.body) {
                resolveEndpoint(parsedUrl.toString());
                return;
            }
            const reader = sseRes.body.getReader();
            const decoder = new TextDecoder('utf8');
            let sseBuffer = '';
            while (!abortSignal.aborted) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                sseBuffer += decoder.decode(value, { stream: true });
                let keepScanning = true;
                while (keepScanning) {
                    keepScanning = false;
                    const sepIdx = sseBuffer.indexOf('\n\n');
                    const crlfIdx = sseBuffer.indexOf('\r\n\r\n');
                    const actualEnd = sepIdx !== -1
                        ? crlfIdx !== -1
                            ? Math.min(sepIdx, crlfIdx)
                            : sepIdx
                        : crlfIdx;
                    const sepLen = actualEnd === sepIdx ? 2 : 4;
                    if (actualEnd !== -1) {
                        const eventBlock = sseBuffer.slice(0, actualEnd).trim();
                        sseBuffer = sseBuffer.slice(actualEnd + sepLen);
                        // 1. Check if event: endpoint
                        const endpointMatch = eventBlock.match(/event:\s*endpoint[\r\n]+data:\s*([^\r\n]+)/i) ||
                            eventBlock.match(/^data:\s*([^\r\n]*\/messages[^\r\n]*)$/m);
                        if (endpointMatch) {
                            const relOrAbs = endpointMatch[1].trim();
                            const resolvedEndpoint = new URL(relOrAbs, parsedUrl).toString();
                            resolveEndpoint(resolvedEndpoint);
                        }
                        // 2. Check if data: JSON-RPC message
                        const dataMatch = eventBlock.match(/data:\s*(\{[\s\S]*\})/s);
                        if (dataMatch) {
                            try {
                                const parsedMsg = JSON.parse(dataMatch[1].trim());
                                if (parsedMsg && typeof parsedMsg === 'object') {
                                    let handled = false;
                                    for (let i = 0; i < messageListeners.length; i++) {
                                        if (messageListeners[i](parsedMsg)) {
                                            messageListeners.splice(i, 1);
                                            handled = true;
                                            break;
                                        }
                                    }
                                    if (!handled) {
                                        sseMessages.push(parsedMsg);
                                    }
                                }
                            }
                            catch { }
                        }
                        keepScanning = true;
                    }
                }
            }
        }
        catch {
            resolveEndpoint(parsedUrl.toString());
        }
    })();
    const timeoutEndpoint = new Promise((res) => setTimeout(() => res(parsedUrl.toString()), 2500));
    const postEndpointPromise = Promise.race([endpointPromise, timeoutEndpoint]);
    const waitForMessageWithId = (targetId, timeoutMs = 6000) => {
        const existingIdx = sseMessages.findIndex((m) => m?.id === targetId);
        if (existingIdx !== -1) {
            const msg = sseMessages[existingIdx];
            sseMessages.splice(existingIdx, 1);
            return Promise.resolve(msg);
        }
        return new Promise((resolve) => {
            let timer = null;
            const listener = (msg) => {
                if (msg?.id === targetId) {
                    if (timer)
                        clearTimeout(timer);
                    resolve(msg);
                    return true;
                }
                return false;
            };
            timer = setTimeout(() => {
                const idx = messageListeners.indexOf(listener);
                if (idx !== -1)
                    messageListeners.splice(idx, 1);
                resolve(null);
            }, timeoutMs);
            messageListeners.push(listener);
        });
    };
    return {
        postEndpointPromise,
        waitForMessageWithId,
    };
}
