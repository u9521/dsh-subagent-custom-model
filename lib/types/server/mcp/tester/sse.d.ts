/**
 * SSE endpoint discovery and message streaming utilities for MCP SSE transport.
 */
export interface SseStreamHandler {
    postEndpointPromise: Promise<string>;
    waitForMessageWithId: (targetId: number, timeoutMs?: number) => Promise<any>;
}
/** Helper to discover the actual POST endpoint from an SSE GET stream */
export declare function discoverSseEndpoint(url: URL, customHeaders: Record<string, string>): Promise<string | null>;
/** Helper to start listening to an SSE stream and buffer/dispatch JSON-RPC messages */
export declare function startSseStream(parsedUrl: URL, customHeaders: Record<string, string>, abortSignal: AbortSignal): SseStreamHandler;
