/**
 * Protocol utilities for MCP JSON-RPC parsing, version extraction, and error formatting.
 */
/** Helper to parse line-delimited and Content-Length framed JSON-RPC messages from MCP streams */
export declare function createJsonRpcParser(onMessage: (msg: any) => void): (chunk: Buffer | string) => void;
/** Helper to extract JSON-RPC response from text, handling both plain JSON and SSE data lines */
export declare function extractJsonRpcFromText(text: string): any;
/** Helper to format an MCP error object with detailed data */
export declare function formatMcpError(err: any): string;
/** Helper to extract supported protocol version from an MCP error object or message */
export declare function extractSupportedProtocolVersion(error: any): string | null;
