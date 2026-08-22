import { createHash } from 'node:crypto';
const MAX_PUBLIC_NAME_LENGTH = 64;
const INVALID_NAME_CHARS = /[^A-Za-z0-9_-]/g;
const HASH_LENGTH = 12;
/**
 * Deterministic public tool name calculation, matching DSH @deepseek-ai/dsh-mcp-client
 */
export function publicToolName(serverName, rawName) {
    const joined = `mcp__${serverName}__${rawName}`;
    const normalized = joined.replace(INVALID_NAME_CHARS, '_');
    if (normalized === joined && normalized.length <= MAX_PUBLIC_NAME_LENGTH) {
        return normalized;
    }
    const hash = createHash('sha256')
        .update(`${serverName}\0${rawName}`)
        .digest('hex')
        .slice(0, HASH_LENGTH);
    return `${normalized.slice(0, MAX_PUBLIC_NAME_LENGTH - HASH_LENGTH - 1)}_${hash}`;
}
