import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
//#region lib/types/server/common/paths.js
function getStorageDir() {
	const dshHome = process.env.DSH_HOME || path.join(os.homedir(), ".dsh");
	const storageDir = path.join(dshHome, "storages");
	try {
		if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });
	} catch {}
	return storageDir;
}
function getMcpStoragePath() {
	return path.join(getStorageDir(), "mcp_servers.json");
}
function getSessionSettingsStoragePath() {
	return path.join(getStorageDir(), "session_settings.json");
}
//#endregion
//#region lib/types/server/mcp/storage.js
function loadMcpStore() {
	try {
		const file = getMcpStoragePath();
		if (fs.existsSync(file)) {
			const data = JSON.parse(fs.readFileSync(file, "utf8"));
			if (data && typeof data === "object" && data.servers) return { servers: data.servers };
		}
	} catch {}
	return { servers: {} };
}
function saveMcpStore(store) {
	try {
		const file = getMcpStoragePath();
		const tmp = `${file}.tmp`;
		fs.writeFileSync(tmp, JSON.stringify(store, null, 2), "utf8");
		fs.renameSync(tmp, file);
	} catch {}
}
//#endregion
//#region lib/types/server/session/storage.js
const DEFAULT_SESSION_SETTINGS = {
	subagentModel: { mode: "inherit" },
	mcp: {
		mode: "default",
		enabledServerIds: [],
		toolsMode: {},
		disabledTools: {}
	},
	skills: {
		mode: "default",
		disabledSkills: [],
		disabledModelSkills: [],
		disabledUserSkills: []
	}
};
function normalizeSubagentModelConfig(raw) {
	if (!raw || typeof raw !== "object") return { mode: "inherit" };
	const mode = raw.mode === "custom" ? "custom" : raw.mode === "inherit" ? "inherit" : "default";
	if (mode === "custom") {
		const provider = typeof raw.provider === "string" ? raw.provider.trim() : "";
		const model = typeof raw.model === "string" ? raw.model.trim() : "";
		if (!provider || !model) return { mode: "inherit" };
		return {
			mode: "custom",
			provider,
			model,
			reasoningEffort: typeof raw.reasoningEffort === "string" && raw.reasoningEffort.trim() ? raw.reasoningEffort.trim() : void 0
		};
	}
	return { mode };
}
function normalizeSkillsConfig(raw) {
	if (!raw || typeof raw !== "object") return {
		mode: "default",
		disabledSkills: [],
		disabledModelSkills: [],
		disabledUserSkills: []
	};
	const mode = raw.mode === "custom" ? "custom" : "default";
	let disabledModelSkills = [];
	if (Array.isArray(raw.disabledModelSkills)) disabledModelSkills = raw.disabledModelSkills.filter((s) => typeof s === "string" && s.trim().length > 0);
	else if (Array.isArray(raw.disabledSkills)) disabledModelSkills = raw.disabledSkills.filter((s) => typeof s === "string" && s.trim().length > 0);
	const disabledUserSkills = Array.isArray(raw.disabledUserSkills) ? raw.disabledUserSkills.filter((s) => typeof s === "string" && s.trim().length > 0) : [];
	return {
		mode,
		disabledSkills: disabledModelSkills,
		disabledModelSkills,
		disabledUserSkills
	};
}
function normalizeSessionSettings(raw) {
	if (!raw || typeof raw !== "object") return { ...DEFAULT_SESSION_SETTINGS };
	const subagentModel = normalizeSubagentModelConfig(raw.subagentModel);
	const rawMcp = raw.mcp;
	const mcpMode = rawMcp?.mode === "custom" ? "custom" : "default";
	const enabledServerIds = Array.isArray(rawMcp?.enabledServerIds) ? rawMcp.enabledServerIds.filter((id) => typeof id === "string") : [];
	const toolsMode = {};
	if (rawMcp?.toolsMode && typeof rawMcp.toolsMode === "object") {
		for (const [k, v] of Object.entries(rawMcp.toolsMode)) if (typeof k === "string" && (v === "custom" || v === "default")) toolsMode[k] = v;
	}
	const disabledTools = {};
	if (rawMcp?.disabledTools && typeof rawMcp.disabledTools === "object") {
		for (const [k, v] of Object.entries(rawMcp.disabledTools)) if (typeof k === "string" && Array.isArray(v)) disabledTools[k] = v.filter((name) => typeof name === "string");
	}
	const skills = normalizeSkillsConfig(raw.skills);
	return {
		subagentModel,
		mcp: {
			mode: mcpMode,
			enabledServerIds,
			toolsMode,
			disabledTools
		},
		skills
	};
}
function loadSessionSettingsStore() {
	try {
		const file = getSessionSettingsStoragePath();
		if (fs.existsSync(file)) {
			const data = JSON.parse(fs.readFileSync(file, "utf8"));
			if (data && typeof data === "object") {
				const def = normalizeSessionSettings(data.default);
				const sessions = {};
				if (data.sessions && typeof data.sessions === "object") {
					for (const [id, s] of Object.entries(data.sessions)) if (s && typeof s === "object") sessions[id] = normalizeSessionSettings(s);
				}
				return {
					default: def,
					sessions
				};
			}
		}
	} catch {}
	return {
		default: { ...DEFAULT_SESSION_SETTINGS },
		sessions: {}
	};
}
function saveSessionSettingsStore(store) {
	try {
		const file = getSessionSettingsStoragePath();
		const tmp = `${file}.tmp`;
		fs.writeFileSync(tmp, JSON.stringify(store, null, 2), "utf8");
		fs.renameSync(tmp, file);
	} catch {}
}
function resolveEffectiveSubagentModel(store, sessionId) {
	if (sessionId && store.sessions?.[sessionId]) {
		const entry = store.sessions[sessionId];
		if (entry.subagentModel?.mode !== "default") return entry.subagentModel;
	}
	return store.default?.subagentModel || { mode: "inherit" };
}
function resolveEffectiveMcp(store, mcpStore, sessionId) {
	let mode = "default";
	let enabledServerIds = [];
	let toolsMode = {};
	let disabledTools = {};
	if (sessionId && store.sessions?.[sessionId]) {
		const entry = store.sessions[sessionId];
		if (entry.mcp?.mode === "custom") {
			mode = "custom";
			enabledServerIds = entry.mcp.enabledServerIds || [];
			toolsMode = entry.mcp.toolsMode || {};
			disabledTools = entry.mcp.disabledTools || {};
		} else {
			if (store.default?.mcp?.mode === "custom") enabledServerIds = store.default.mcp.enabledServerIds || [];
			else enabledServerIds = Object.values(mcpStore.servers).filter((s) => s.enabledByDefault).map((s) => s.id);
			toolsMode = store.default?.mcp?.toolsMode || {};
			disabledTools = store.default?.mcp?.disabledTools || {};
		}
	} else {
		if (store.default?.mcp?.mode === "custom") {
			mode = "custom";
			enabledServerIds = store.default.mcp.enabledServerIds || [];
		} else enabledServerIds = Object.values(mcpStore.servers).filter((s) => s.enabledByDefault).map((s) => s.id);
		toolsMode = store.default?.mcp?.toolsMode || {};
		disabledTools = store.default?.mcp?.disabledTools || {};
	}
	const effectiveDisabledTools = {};
	for (const server of Object.values(mcpStore.servers)) if (toolsMode[server.id] === "custom" && disabledTools[server.id]) effectiveDisabledTools[server.id] = disabledTools[server.id];
	else effectiveDisabledTools[server.id] = server.disabledTools || [];
	return {
		mode,
		enabledServerIds,
		toolsMode,
		disabledTools,
		effectiveDisabledTools
	};
}
function resolveEffectiveSkills(store, sessionId) {
	let mode = "default";
	let disabledModelSkills = [];
	let disabledUserSkills = [];
	if (sessionId && store.sessions?.[sessionId]) {
		const entry = store.sessions[sessionId];
		if (entry.skills?.mode === "custom") {
			mode = "custom";
			disabledModelSkills = entry.skills.disabledModelSkills || entry.skills.disabledSkills || [];
			disabledUserSkills = entry.skills.disabledUserSkills || [];
		} else {
			disabledModelSkills = store.default?.skills?.disabledModelSkills || store.default?.skills?.disabledSkills || [];
			disabledUserSkills = store.default?.skills?.disabledUserSkills || [];
		}
	} else {
		if (store.default?.skills?.mode === "custom") mode = "custom";
		disabledModelSkills = store.default?.skills?.disabledModelSkills || store.default?.skills?.disabledSkills || [];
		disabledUserSkills = store.default?.skills?.disabledUserSkills || [];
	}
	return {
		mode,
		disabledSkills: [...disabledModelSkills],
		disabledModelSkills: [...disabledModelSkills],
		disabledUserSkills: [...disabledUserSkills],
		effectiveDisabledSkills: [...disabledModelSkills],
		effectiveDisabledModelSkills: [...disabledModelSkills],
		effectiveDisabledUserSkills: [...disabledUserSkills]
	};
}
function resolveEffectiveSessionSettings(store, mcpStore, sessionId) {
	return {
		subagentModel: resolveEffectiveSubagentModel(store, sessionId),
		mcp: resolveEffectiveMcp(store, mcpStore, sessionId),
		skills: resolveEffectiveSkills(store, sessionId)
	};
}
//#endregion
//#region lib/types/server/mcp/naming.js
const MAX_PUBLIC_NAME_LENGTH = 64;
const INVALID_NAME_CHARS = /[^A-Za-z0-9_-]/g;
const HASH_LENGTH = 12;
/**
* Deterministic public tool name calculation, matching DSH @deepseek-ai/dsh-mcp-client
*/
function publicToolName(serverName, rawName) {
	const joined = `mcp__${serverName}__${rawName}`;
	const normalized = joined.replace(INVALID_NAME_CHARS, "_");
	if (normalized === joined && normalized.length <= MAX_PUBLIC_NAME_LENGTH) return normalized;
	const hash = createHash("sha256").update(`${serverName}\0${rawName}`).digest("hex").slice(0, HASH_LENGTH);
	return `${normalized.slice(0, 51)}_${hash}`;
}
//#endregion
//#region lib/types/server/mcp/tester/protocol.js
/**
* Protocol utilities for MCP JSON-RPC parsing, version extraction, and error formatting.
*/
/** Helper to parse line-delimited and Content-Length framed JSON-RPC messages from MCP streams */
function createJsonRpcParser(onMessage) {
	let buffer = "";
	return (chunk) => {
		buffer += chunk.toString("utf8");
		let keepScanning = true;
		while (keepScanning) {
			keepScanning = false;
			buffer = buffer.trimStart();
			if (!buffer) break;
			if (buffer.startsWith("Content-Length:")) {
				const headerEnd = buffer.indexOf("\r\n\r\n");
				const altHeaderEnd = buffer.indexOf("\n\n");
				const actualEnd = headerEnd !== -1 ? headerEnd : altHeaderEnd;
				const sepLen = headerEnd !== -1 ? 4 : 2;
				if (actualEnd !== -1) {
					const match = buffer.slice(0, actualEnd).match(/Content-Length:\s*(\d+)/i);
					if (match) {
						const contentLength = parseInt(match[1], 10);
						const bodyStart = actualEnd + sepLen;
						if (buffer.length >= bodyStart + contentLength) {
							const body = buffer.slice(bodyStart, bodyStart + contentLength);
							buffer = buffer.slice(bodyStart + contentLength);
							try {
								const parsed = JSON.parse(body);
								if (parsed && typeof parsed === "object") onMessage(parsed);
							} catch {}
							keepScanning = true;
							continue;
						}
					}
				}
			}
			const newlineIdx = buffer.indexOf("\n");
			if (newlineIdx !== -1) {
				const line = buffer.slice(0, newlineIdx).trim();
				buffer = buffer.slice(newlineIdx + 1);
				if (line) try {
					const parsed = JSON.parse(line);
					if (parsed && typeof parsed === "object") onMessage(parsed);
				} catch {}
				keepScanning = true;
				continue;
			}
		}
	};
}
/** Helper to extract JSON-RPC response from text, handling both plain JSON and SSE data lines */
function extractJsonRpcFromText(text) {
	const trimmed = text.trim();
	if (!trimmed) return null;
	try {
		const parsed = JSON.parse(trimmed);
		if (parsed && typeof parsed === "object") return parsed;
	} catch {}
	const lines = trimmed.split(/\r?\n/);
	for (const line of lines) {
		const match = line.match(/^data:\s*(.+)$/i);
		if (match) try {
			const parsed = JSON.parse(match[1].trim());
			if (parsed && typeof parsed === "object" && (parsed.result !== void 0 || parsed.error !== void 0 || parsed.id !== void 0)) return parsed;
		} catch {}
	}
	const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
	if (jsonMatch) try {
		const parsed = JSON.parse(jsonMatch[0]);
		if (parsed && typeof parsed === "object") return parsed;
	} catch {}
	return null;
}
/** Helper to format an MCP error object with detailed data */
function formatMcpError(err) {
	if (!err) return "未知错误";
	if (typeof err === "string") return err;
	const msg = err.message || `错误码 ${err.code}`;
	if (err.data !== void 0 && err.data !== null) return `${msg} (服务端返回: ${typeof err.data === "object" ? JSON.stringify(err.data) : String(err.data)})`;
	return msg;
}
/** Helper to extract supported protocol version from an MCP error object or message */
function extractSupportedProtocolVersion(error) {
	if (!error || typeof error !== "object") return null;
	const data = error.data;
	if (data !== void 0 && data !== null) {
		if (typeof data === "string" && data.trim()) return data.trim();
		if (typeof data === "object") {
			const candidates = data.supported ?? data.supportedVersions ?? data.supported_versions ?? data.versions;
			if (Array.isArray(candidates) && candidates.length > 0) {
				const found = candidates.find((v) => typeof v === "string" && v.trim().length > 0);
				if (found) return String(found).trim();
			} else if (typeof candidates === "string" && candidates.trim()) return candidates.trim();
		}
	}
	const message = typeof error.message === "string" ? error.message : "";
	if (error.code === -32022 || /protocol version/i.test(message) || /unsupported version/i.test(message)) {
		const listMatch = message.match(/supported versions?:\s*([^\)\n]+)/i) || message.match(/supported:\s*\[?([^\s\]]+)\]?/i) || message.match(/supported protocol versions?:\s*([^\)\n]+)/i);
		if (listMatch && listMatch[1]) {
			const first = listMatch[1].split(/[,;]/)[0].replace(/['"\[\]]/g, "").trim();
			if (first) return first;
		}
	}
	return null;
}
//#endregion
//#region lib/types/server/mcp/compatibility/index.js
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
/**
* Check MCP server compatibility for official @deepseek-ai/dsh-mcp-client.
* Flow: First test 2026-07-28 stateless protocol feasibility -> Then test downgrade support.
*/
async function checkMcpCompatibility(server, discoveredInfo, signal) {
	if (server.transport === "stdio") {
		const protocolVersion = discoveredInfo?.protocolVersion || server.serverInfo?.protocolVersion;
		if (protocolVersion === "2026-07-28") return {
			status: "incompatible-2026-07-28",
			canEnable: false,
			protocolVersion: "2026-07-28",
			message: "检测到 2026-07-28 无状态协议，官方 MCP 客户端暂不支持",
			warning: "当前官方 @deepseek-ai/dsh-mcp-client 客户端暂未适配 2026-07-28 无状态协议，禁止直接启用。",
			error: "协议版本不受官方客户端支持 (2026-07-28)"
		};
		return {
			status: "compatible",
			canEnable: true,
			protocolVersion: protocolVersion || "2025-11-25",
			message: "协议兼容，可正常使用官方客户端加载"
		};
	}
	if (!server.url) return {
		status: "unknown",
		canEnable: false,
		message: "缺少服务 URL",
		error: "缺少服务 URL"
	};
	const customHeaders = {};
	if (server.headers && typeof server.headers === "object") {
		for (const [k, v] of Object.entries(server.headers)) if (typeof v === "string") customHeaders[k] = v;
	}
	const timeoutSignal = signal || AbortSignal.timeout(6e3);
	try {
		const statelessMeta = {
			"io.modelcontextprotocol/protocolVersion": "2026-07-28",
			"io.modelcontextprotocol/clientCapabilities": {},
			"io.modelcontextprotocol/clientInfo": {
				name: "dsh-compat-probe",
				version: "1.0.0"
			},
			protocolVersion: "2026-07-28",
			clientCapabilities: {},
			clientInfo: {
				name: "dsh-compat-probe",
				version: "1.0.0"
			}
		};
		const statelessRes = await fetch(server.url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json, text/event-stream",
				"MCP-Protocol-Version": "2026-07-28",
				"Mcp-Method": "tools/list",
				...customHeaders
			},
			body: JSON.stringify({
				jsonrpc: "2.0",
				id: 1,
				method: "tools/list",
				params: { _meta: statelessMeta }
			}),
			signal: timeoutSignal
		});
		const statelessJson = extractJsonRpcFromText(await statelessRes.text());
		const isStateless2026Feasible = (statelessRes.ok || statelessRes.status === 202) && (Array.isArray(statelessJson?.result?.tools) || statelessJson?.result !== void 0);
		const legacyRes = await fetch(server.url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json, text/event-stream",
				...customHeaders
			},
			body: JSON.stringify({
				jsonrpc: "2.0",
				id: 10,
				method: "initialize",
				params: {
					protocolVersion: "2025-11-25",
					capabilities: {},
					clientInfo: {
						name: "dsh-compat-probe",
						version: "1.0.0"
					}
				}
			}),
			signal: timeoutSignal
		});
		const legacyJson = extractJsonRpcFromText(await legacyRes.text());
		if ((legacyRes.ok || legacyRes.status === 202) && legacyJson?.result?.protocolVersion) {
			const negotiatedVer = legacyJson.result.protocolVersion;
			if (isStateless2026Feasible) return {
				status: "downgrade-supported",
				canEnable: true,
				protocolVersion: "2026-07-28",
				negotiatedVersion: negotiatedVer,
				message: `检测到 2026-07-28 无状态协议，已成功测试并确认支持向下降级至 ${negotiatedVer}，允许使用官方客户端接入`,
				warning: `服务端支持 2026-07-28 协议，但已自动协商并降级为 ${negotiatedVer} 兼容模式以适配官方客户端。`
			};
			return {
				status: "compatible",
				canEnable: true,
				protocolVersion: negotiatedVer,
				negotiatedVersion: negotiatedVer,
				message: `协议兼容 (${negotiatedVer})，官方客户端可正常加载`
			};
		}
		if (legacyJson?.error) {
			const supportedVer = extractSupportedProtocolVersion(legacyJson.error);
			const dataSupported = legacyJson.error?.data?.supported;
			let supportedList = [];
			if (Array.isArray(dataSupported)) supportedList = dataSupported.map(String);
			else if (supportedVer) supportedList = [supportedVer];
			const legacyCandidate = supportedList.find((v) => v === "2025-11-25" || v === "2024-11-05" || v.startsWith("2024-") || v.startsWith("2025-"));
			if (legacyCandidate) return {
				status: "downgrade-supported",
				canEnable: true,
				protocolVersion: isStateless2026Feasible ? "2026-07-28" : legacyCandidate,
				supportedVersions: supportedList,
				negotiatedVersion: legacyCandidate,
				message: `检测到服务端支持降级到 ${legacyCandidate}，允许使用官方客户端接入`,
				warning: `服务端支持降级至 ${legacyCandidate}，已自动协商为兼容模式。`
			};
		}
		if (isStateless2026Feasible) return {
			status: "incompatible-2026-07-28",
			canEnable: false,
			protocolVersion: "2026-07-28",
			supportedVersions: ["2026-07-28"],
			message: "检测到 2026-07-28 无状态协议，经测试该服务端无法向下降级，官方客户端暂不支持",
			warning: "该 MCP 服务端为纯 2026-07-28 无状态协议（经测试不支持向下降级至 2024-11-05 / 2025-11-25），官方 @deepseek-ai/dsh-mcp-client 暂未支持，禁止启用以防异常。",
			error: "服务端仅支持 2026-07-28 无状态协议，不支持向下降级至旧版握手协议"
		};
		if (legacyJson?.error) return {
			status: "unknown",
			canEnable: false,
			message: `MCP 握手失败: ${formatMcpError(legacyJson.error)}`,
			error: formatMcpError(legacyJson.error)
		};
		return {
			status: "unknown",
			canEnable: false,
			message: `服务端响应异常 (HTTP ${legacyRes.status} ${legacyRes.statusText})`,
			error: `HTTP ${legacyRes.status} ${legacyRes.statusText}`
		};
	} catch (err) {
		return {
			status: "unknown",
			canEnable: false,
			message: `兼容性检测异常: ${err?.message || String(err)}`,
			error: err?.message || String(err)
		};
	}
}
//#endregion
//#region lib/types/server/mcp/manager.js
var __rewriteRelativeImportExtension = function(path, preserveJsx) {
	if (typeof path === "string" && /^\.\.?\//.test(path)) return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(m, tsx, d, ext, cm) {
		return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : d + ext + "." + cm.toLowerCase() + "js";
	});
	return path;
};
let cachedOfficialPlugin = null;
let officialPluginChecked = false;
/**
* Resolve the official @deepseek-ai/dsh-mcp-client Cordis plugin module from DSH.
*/
async function loadOfficialMcpClientPlugin() {
	if (officialPluginChecked) return cachedOfficialPlugin;
	officialPluginChecked = true;
	for (const candidate of ["@deepseek-ai/dsh-mcp-client", "/home/multiply/.bun/install/global/node_modules/@deepseek-ai/dsh-mcp-client/lib/index.js"]) try {
		const mod = await import(__rewriteRelativeImportExtension(candidate));
		if (mod && (typeof mod.apply === "function" || typeof mod.default?.apply === "function")) {
			cachedOfficialPlugin = mod;
			return mod;
		}
	} catch {}
	return null;
}
var McpManager = class {
	ctx;
	getMcpStore;
	setMcpStore;
	getSessionSettingsStore;
	/** Map of serverId -> active Cordis Plugin Fork instance of @deepseek-ai/dsh-mcp-client */
	officialForks = /* @__PURE__ */ new Map();
	/** Map of publicToolName -> { serverId, rawName } metadata */
	toolMeta = /* @__PURE__ */ new Map();
	/** Map of serverId -> Set of publicToolNames registered for that server */
	serverToolMap = /* @__PURE__ */ new Map();
	/** Active sync promises to prevent race conditions */
	activeSyncs = /* @__PURE__ */ new Map();
	constructor(ctx, getMcpStore, setMcpStore, getSessionSettingsStore) {
		this.ctx = ctx;
		this.getMcpStore = getMcpStore;
		this.setMcpStore = setMcpStore;
		this.getSessionSettingsStore = getSessionSettingsStore;
	}
	/**
	* Check if an MCP server is currently needed (enabled by default or enabled in any active session).
	*/
	isServerNeeded(serverId) {
		const server = this.getMcpStore().servers[serverId];
		if (!server) return false;
		if (server.enabledByDefault) return true;
		const sessionSettingsStore = this.getSessionSettingsStore?.();
		if (sessionSettingsStore) {
			if (sessionSettingsStore.default?.mcp?.mode === "custom" && sessionSettingsStore.default.mcp.enabledServerIds?.includes(serverId)) return true;
			if (sessionSettingsStore.sessions) {
				for (const sessionConfig of Object.values(sessionSettingsStore.sessions)) if (sessionConfig.mcp?.mode === "custom" && sessionConfig.mcp.enabledServerIds?.includes(serverId)) return true;
			}
		}
		return false;
	}
	/**
	* Get metadata for a public tool name.
	*/
	getToolMeta(publicName) {
		return this.toolMeta.get(publicName);
	}
	/**
	* Check if a tool is an MCP tool managed by this plugin.
	*/
	isMcpTool(publicName) {
		return this.toolMeta.has(publicName) || publicName.startsWith("mcp__");
	}
	/**
	* Check compatibility for an MCP server against the official client.
	*/
	async checkCompatibility(server) {
		return checkMcpCompatibility(server);
	}
	/**
	* Mount official @deepseek-ai/dsh-mcp-client plugin instance dynamically in memory.
	*/
	async mountOfficialClient(server, officialPlugin) {
		this.unmountOfficialClient(server.id);
		const officialConfig = {
			serverName: server.id,
			transport: server.transport === "stdio" ? "stdio" : "streamable-http",
			command: server.command || "",
			args: server.args || [],
			env: server.env || {},
			cwd: server.cwd || "",
			url: server.url || "",
			headers: server.headers || {},
			toolCallTimeoutMs: server.toolCallTimeoutMs || 6e4,
			failOnStartupError: Boolean(server.failOnStartupError),
			reconnect: {
				enabled: server.reconnect?.enabled ?? true,
				initialDelayMs: server.reconnect?.initialDelayMs ?? 500,
				maxDelayMs: server.reconnect?.maxDelayMs ?? 3e4,
				maxAttempts: server.reconnect?.maxAttempts ?? 10
			}
		};
		try {
			const fork = this.ctx.plugin(officialPlugin, officialConfig);
			this.officialForks.set(server.id, fork);
			if (Array.isArray(server.toolDetails)) {
				const names = /* @__PURE__ */ new Set();
				for (const t of server.toolDetails) {
					const pub = publicToolName(server.id, t.name);
					this.toolMeta.set(pub, {
						serverId: server.id,
						rawName: t.name
					});
					names.add(pub);
				}
				this.serverToolMap.set(server.id, names);
			}
			return true;
		} catch (err) {
			console.warn(`[session-settings] Failed to mount official mcp-client for "${server.id}":`, err);
			return false;
		}
	}
	/**
	* Unmount official mcp-client fork for a server.
	*/
	unmountOfficialClient(serverId) {
		const fork = this.officialForks.get(serverId);
		if (fork) {
			try {
				fork.dispose();
			} catch {}
			this.officialForks.delete(serverId);
		}
		const existingNames = this.serverToolMap.get(serverId);
		if (existingNames) {
			for (const pubName of existingNames) this.toolMeta.delete(pubName);
			this.serverToolMap.delete(serverId);
		}
	}
	/**
	* Unregister / unmount a specific server.
	*/
	unregisterServer(serverId) {
		this.unmountOfficialClient(serverId);
	}
	/**
	* Synchronize tool registrations for a single server:
	* 1. Checks protocol compatibility with 2-stage probe.
	* 2. If compatible (or downgrade supported), mounts official client.
	* 3. If incompatible (e.g. 2026-07-28 without downgrade), prohibits enabling and issues warning.
	*/
	async syncServer(server) {
		if (!server || !server.id) return;
		if (!this.isServerNeeded(server.id)) {
			this.unmountOfficialClient(server.id);
			return;
		}
		if (this.activeSyncs.has(server.id)) return this.activeSyncs.get(server.id);
		const syncPromise = (async () => {
			try {
				const compat = await checkMcpCompatibility(server);
				const store = this.getMcpStore();
				const liveServer = store.servers[server.id] || server;
				liveServer.compatibility = compat;
				if (!compat.canEnable) {
					console.warn(`[session-settings] MCP server "${server.name || server.id}" is incompatible with official client: ${compat.warning || compat.message}`);
					this.unmountOfficialClient(server.id);
					store.servers[server.id] = liveServer;
					saveMcpStore(store);
					this.setMcpStore(store);
					return;
				}
				const officialPlugin = await loadOfficialMcpClientPlugin();
				if (officialPlugin) await this.mountOfficialClient(liveServer, officialPlugin);
				else console.error("[session-settings] Official @deepseek-ai/dsh-mcp-client plugin not found in DSH environment.");
			} catch (err) {
				console.warn(`[session-settings] Sync failed for MCP server "${server.name || server.id}":`, err);
			} finally {
				this.activeSyncs.delete(server.id);
			}
		})();
		this.activeSyncs.set(server.id, syncPromise);
		return syncPromise;
	}
	/**
	* Synchronize all servers in the store.
	*/
	syncAll() {
		const store = this.getMcpStore();
		const allServers = Object.values(store.servers);
		for (const serverId of Array.from(this.officialForks.keys())) if (!store.servers[serverId] || !this.isServerNeeded(serverId)) this.unmountOfficialClient(serverId);
		for (const server of allServers) if (this.isServerNeeded(server.id)) this.syncServer(server).catch(() => {});
		else this.unmountOfficialClient(server.id);
	}
	/**
	* Teardown and unmount all official client forks on plugin unload.
	*/
	dispose() {
		for (const fork of this.officialForks.values()) try {
			fork.dispose();
		} catch {}
		this.officialForks.clear();
		this.toolMeta.clear();
		this.serverToolMap.clear();
	}
};
//#endregion
//#region lib/types/server/mcp/tester/sse.js
/**
* SSE endpoint discovery and message streaming utilities for MCP SSE transport.
*/
/** Helper to discover the actual POST endpoint from an SSE GET stream */
async function discoverSseEndpoint(url, customHeaders) {
	try {
		const res = await fetch(url.toString(), {
			method: "GET",
			headers: {
				Accept: "text/event-stream",
				...customHeaders
			},
			signal: AbortSignal.timeout(4e3)
		});
		if (!res.ok || !res.body) return null;
		const reader = res.body.getReader();
		const decoder = new TextDecoder("utf8");
		let buffer = "";
		const readTimer = setTimeout(() => {
			try {
				reader.cancel();
			} catch {}
		}, 3e3);
		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				buffer += decoder.decode(value, { stream: true });
				const endpointMatch = buffer.match(/event:\s*endpoint[\r\n]+data:\s*([^\r\n]+)/i) || buffer.match(/data:\s*([^\r\n]*\/messages[^\r\n]*)/i);
				if (endpointMatch) {
					const relOrAbs = endpointMatch[1].trim();
					clearTimeout(readTimer);
					try {
						reader.cancel();
					} catch {}
					return new URL(relOrAbs, url).toString();
				}
				if (buffer.length > 4e3) break;
			}
		} finally {
			clearTimeout(readTimer);
			try {
				reader.cancel();
			} catch {}
		}
	} catch {}
	return null;
}
/** Helper to start listening to an SSE stream and buffer/dispatch JSON-RPC messages */
function startSseStream(parsedUrl, customHeaders, abortSignal) {
	const sseMessages = [];
	const messageListeners = [];
	let resolveEndpoint = () => {};
	const endpointPromise = new Promise((resolve) => {
		resolveEndpoint = resolve;
	});
	(async () => {
		try {
			const sseRes = await fetch(parsedUrl.toString(), {
				method: "GET",
				headers: {
					Accept: "text/event-stream",
					...customHeaders
				},
				signal: abortSignal
			});
			if (!sseRes.ok || !sseRes.body) {
				resolveEndpoint(parsedUrl.toString());
				return;
			}
			const reader = sseRes.body.getReader();
			const decoder = new TextDecoder("utf8");
			let sseBuffer = "";
			while (!abortSignal.aborted) {
				const { done, value } = await reader.read();
				if (done) break;
				sseBuffer += decoder.decode(value, { stream: true });
				let keepScanning = true;
				while (keepScanning) {
					keepScanning = false;
					const sepIdx = sseBuffer.indexOf("\n\n");
					const crlfIdx = sseBuffer.indexOf("\r\n\r\n");
					const actualEnd = sepIdx !== -1 ? crlfIdx !== -1 ? Math.min(sepIdx, crlfIdx) : sepIdx : crlfIdx;
					const sepLen = actualEnd === sepIdx ? 2 : 4;
					if (actualEnd !== -1) {
						const eventBlock = sseBuffer.slice(0, actualEnd).trim();
						sseBuffer = sseBuffer.slice(actualEnd + sepLen);
						const endpointMatch = eventBlock.match(/event:\s*endpoint[\r\n]+data:\s*([^\r\n]+)/i) || eventBlock.match(/^data:\s*([^\r\n]*\/messages[^\r\n]*)$/m);
						if (endpointMatch) {
							const relOrAbs = endpointMatch[1].trim();
							const resolvedEndpoint = new URL(relOrAbs, parsedUrl).toString();
							resolveEndpoint(resolvedEndpoint);
						}
						const dataMatch = eventBlock.match(/data:\s*(\{[\s\S]*\})/s);
						if (dataMatch) try {
							const parsedMsg = JSON.parse(dataMatch[1].trim());
							if (parsedMsg && typeof parsedMsg === "object") {
								let handled = false;
								for (let i = 0; i < messageListeners.length; i++) if (messageListeners[i](parsedMsg)) {
									messageListeners.splice(i, 1);
									handled = true;
									break;
								}
								if (!handled) sseMessages.push(parsedMsg);
							}
						} catch {}
						keepScanning = true;
					}
				}
			}
		} catch {
			resolveEndpoint(parsedUrl.toString());
		}
	})();
	const timeoutEndpoint = new Promise((res) => setTimeout(() => res(parsedUrl.toString()), 2500));
	const postEndpointPromise = Promise.race([endpointPromise, timeoutEndpoint]);
	const waitForMessageWithId = (targetId, timeoutMs = 6e3) => {
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
					if (timer) clearTimeout(timer);
					resolve(msg);
					return true;
				}
				return false;
			};
			timer = setTimeout(() => {
				const idx = messageListeners.indexOf(listener);
				if (idx !== -1) messageListeners.splice(idx, 1);
				resolve(null);
			}, timeoutMs);
			messageListeners.push(listener);
		});
	};
	return {
		postEndpointPromise,
		waitForMessageWithId
	};
}
//#endregion
//#region lib/types/server/mcp/tester/stdio-runner.js
/**
* STDIO transport tester.
* Minimal reference implementation managing local subprocesses without bulky dependencies.
*/
/** Test an MCP server over STDIO transport */
async function testStdioConnection(server) {
	const command = server.command?.trim();
	if (!command) return {
		ok: false,
		message: "stdio 模式需要填写启动命令 (command)"
	};
	return new Promise((resolve) => {
		let settled = false;
		let stderrBuffer = "";
		const cleanExit = (res) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			try {
				proc.kill("SIGTERM");
				setTimeout(() => {
					try {
						proc.kill("SIGKILL");
					} catch {}
				}, 600);
			} catch {}
			resolve(res);
		};
		const timer = setTimeout(() => {
			const errDetail = stderrBuffer.trim() ? ` (stderr: ${stderrBuffer.trim().slice(-200)})` : "";
			cleanExit({
				ok: false,
				message: `连接超时 (10s)：未能通过 MCP 协议成功获取工具列表${errDetail}`
			});
		}, 1e4);
		let proc;
		try {
			proc = spawn(command, server.args || [], {
				cwd: server.cwd || process.cwd(),
				env: {
					...process.env,
					...server.env || {}
				},
				stdio: [
					"pipe",
					"pipe",
					"pipe"
				]
			});
		} catch (err) {
			cleanExit({
				ok: false,
				message: `无法启动子进程: ${err?.message || String(err)}`
			});
			return;
		}
		proc.on("error", (err) => {
			cleanExit({
				ok: false,
				message: `子进程启动失败: ${err?.message || String(err)}`
			});
		});
		proc.stderr?.on("data", (chunk) => {
			stderrBuffer += chunk.toString("utf8");
			if (stderrBuffer.length > 2e3) stderrBuffer = stderrBuffer.slice(-2e3);
		});
		proc.on("close", (code, signal) => {
			if (!settled) {
				const errDetail = stderrBuffer.trim() ? `\n输出: ${stderrBuffer.trim().slice(-300)}` : "";
				cleanExit({
					ok: false,
					message: `MCP 子进程退出 (退出码: ${code ?? signal ?? "未知"})${errDetail}`
				});
			}
		});
		const sendRpc = (msg) => {
			if (proc.stdin && !proc.stdin.destroyed) proc.stdin.write(JSON.stringify(msg) + "\n");
		};
		let activeProtocolVersion = "2025-11-25";
		let hasRetriedNegotiation = false;
		let serverInfo = void 0;
		const parser = createJsonRpcParser((msg) => {
			if (settled) return;
			if (msg.id === 1) {
				if (msg.error) {
					const supportedVersion = extractSupportedProtocolVersion(msg.error) || (activeProtocolVersion === "2025-11-25" ? "2024-11-05" : null);
					if (supportedVersion && supportedVersion !== activeProtocolVersion && !hasRetriedNegotiation) {
						hasRetriedNegotiation = true;
						activeProtocolVersion = supportedVersion;
						if (supportedVersion === "2026-07-28") {
							sendRpc({
								jsonrpc: "2.0",
								id: 2,
								method: "tools/list",
								params: { _meta: {
									"io.modelcontextprotocol/protocolVersion": "2026-07-28",
									"io.modelcontextprotocol/clientCapabilities": {},
									"io.modelcontextprotocol/clientInfo": {
										name: "dsh-mcp-tester",
										version: "1.0.0"
									},
									protocolVersion: "2026-07-28",
									clientCapabilities: {},
									clientInfo: {
										name: "dsh-mcp-tester",
										version: "1.0.0"
									}
								} }
							});
							return;
						}
						sendRpc({
							jsonrpc: "2.0",
							id: 1,
							method: "initialize",
							params: {
								protocolVersion: activeProtocolVersion,
								capabilities: {},
								clientInfo: {
									name: "dsh-mcp-tester",
									version: "1.0.0"
								}
							}
						});
						return;
					}
					cleanExit({
						ok: false,
						message: `MCP 初始化失败: ${formatMcpError(msg.error)}`
					});
					return;
				}
				if (msg.result && typeof msg.result === "object") {
					if (typeof msg.result.protocolVersion === "string") activeProtocolVersion = msg.result.protocolVersion;
					serverInfo = {
						name: typeof msg.result.serverInfo?.name === "string" ? msg.result.serverInfo.name : void 0,
						version: typeof msg.result.serverInfo?.version === "string" ? msg.result.serverInfo.version : void 0,
						protocolVersion: activeProtocolVersion
					};
				}
				sendRpc({
					jsonrpc: "2.0",
					method: "notifications/initialized"
				});
				sendRpc({
					jsonrpc: "2.0",
					id: 2,
					method: "tools/list",
					params: {}
				});
				return;
			}
			if (msg.id === 2) {
				if (msg.error) {
					cleanExit({
						ok: false,
						message: `获取工具列表失败: ${formatMcpError(msg.error)}`
					});
					return;
				}
				const rawTools = msg.result?.tools;
				if (Array.isArray(rawTools)) {
					const toolDetails = rawTools.map((t) => ({
						name: typeof t === "string" ? t : t?.name || t?.id || "",
						description: typeof t === "object" ? t?.description || "" : void 0,
						inputSchema: typeof t === "object" ? t?.inputSchema : void 0
					})).filter((t) => Boolean(t.name));
					const toolNames = toolDetails.map((t) => t.name);
					const count = toolNames.length;
					const summary = count > 0 ? `成功获取到 ${count} 个工具` : "成功连接并完成 MCP 握手 (未声明可用工具)";
					cleanExit({
						ok: true,
						message: summary,
						tools: toolNames,
						toolDetails,
						serverInfo,
						detectedTransport: "stdio",
						count
					});
					return;
				} else {
					cleanExit({
						ok: false,
						message: `MCP tools/list 返回格式不正确 (未找到 tools 数组): ${JSON.stringify(msg.result).slice(0, 150)}`
					});
					return;
				}
			}
		});
		proc.stdout?.on("data", parser);
		sendRpc({
			jsonrpc: "2.0",
			id: 1,
			method: "initialize",
			params: {
				protocolVersion: "2025-11-25",
				capabilities: {},
				clientInfo: {
					name: "dsh-mcp-tester",
					version: "1.0.0"
				}
			}
		});
	});
}
//#endregion
//#region lib/types/server/mcp/tester/http-runner.js
/**
* Streamable HTTP & SSE transport tester.
* Minimal reference implementation supporting both Stateful (Legacy Handshake)
* and Stateless (MCP 2026-07-28 / SEP-2575) specifications.
*/
/** Test an MCP server over Streamable HTTP or SSE transport */
async function testHttpConnection(server) {
	const urlStr = server.url?.trim();
	if (!urlStr) return {
		ok: false,
		message: "HTTP/SSE 模式需要填写服务器地址 (url)"
	};
	let parsedUrl;
	try {
		parsedUrl = new URL(urlStr);
	} catch (err) {
		return {
			ok: false,
			message: `URL 格式不正确: ${err?.message || String(err)}`
		};
	}
	const abortCtrl = new AbortController();
	const timeoutTimer = setTimeout(() => {
		try {
			abortCtrl.abort();
		} catch {}
	}, 12e3);
	try {
		const isSseMode = parsedUrl.pathname.endsWith("/sse") || parsedUrl.pathname.includes("/sse");
		const customHeaders = server.headers || {};
		let postEndpointUrl = parsedUrl.toString();
		let waitForSseMessageWithId = () => Promise.resolve(null);
		if (isSseMode) {
			const sseHandler = startSseStream(parsedUrl, customHeaders, abortCtrl.signal);
			postEndpointUrl = await sseHandler.postEndpointPromise;
			waitForSseMessageWithId = sseHandler.waitForMessageWithId;
		}
		let activeProtocolVersion = "2025-11-25";
		const baseHeaders = {
			"Content-Type": "application/json",
			Accept: "application/json, text/event-stream",
			...customHeaders
		};
		let sessionId = void 0;
		const sendJsonRpc = async (msg, customReqHeaders, targetUrl = postEndpointUrl) => {
			const headers = {
				...baseHeaders,
				...sessionId ? { "mcp-session-id": sessionId } : {},
				...customReqHeaders || {}
			};
			const res = await fetch(targetUrl, {
				method: "POST",
				headers,
				body: JSON.stringify(msg),
				signal: abortCtrl.signal
			});
			const headerSessionId = res.headers.get("mcp-session-id") || res.headers.get("Mcp-Session-Id") || res.headers.get("x-session-id");
			if (headerSessionId) sessionId = headerSessionId.trim();
			const rawText = await res.text().catch(() => "");
			let json = extractJsonRpcFromText(rawText);
			if ((res.status === 202 || !json || rawText.trim().toLowerCase() === "accepted") && isSseMode && msg.id !== void 0) {
				const sseJson = await waitForSseMessageWithId(msg.id, 5e3);
				if (sseJson) json = sseJson;
			}
			if (json?.result?.sessionId && typeof json.result.sessionId === "string") sessionId = json.result.sessionId;
			return {
				res,
				json,
				rawText
			};
		};
		let initResult = await sendJsonRpc({
			jsonrpc: "2.0",
			id: 1,
			method: "initialize",
			params: {
				protocolVersion: activeProtocolVersion,
				capabilities: {},
				clientInfo: {
					name: "dsh-mcp-tester",
					version: "1.0.0"
				}
			}
		});
		if (initResult.json?.error && (initResult.json.error.code === -32022 || /protocol version/i.test(initResult.json.error.message || "") || initResult.json.error.data?.supported || initResult.json.error.data?.supportedVersions)) {
			const supportedVersion = extractSupportedProtocolVersion(initResult.json.error) || (activeProtocolVersion === "2025-11-25" ? "2024-11-05" : null);
			if (supportedVersion && supportedVersion !== activeProtocolVersion) {
				activeProtocolVersion = supportedVersion;
				if (supportedVersion !== "2026-07-28") initResult = await sendJsonRpc({
					jsonrpc: "2.0",
					id: 1,
					method: "initialize",
					params: {
						protocolVersion: activeProtocolVersion,
						capabilities: {},
						clientInfo: {
							name: "dsh-mcp-tester",
							version: "1.0.0"
						}
					}
				});
			}
		}
		let serverInfo = void 0;
		if (initResult.json?.result && typeof initResult.json.result === "object") {
			if (typeof initResult.json.result.protocolVersion === "string") activeProtocolVersion = initResult.json.result.protocolVersion;
			baseHeaders["MCP-Protocol-Version"] = activeProtocolVersion;
			serverInfo = {
				name: typeof initResult.json.result.serverInfo?.name === "string" ? initResult.json.result.serverInfo.name : void 0,
				version: typeof initResult.json.result.serverInfo?.version === "string" ? initResult.json.result.serverInfo.version : void 0,
				protocolVersion: activeProtocolVersion
			};
		}
		if ((initResult.json?.error || !initResult.res.ok) && (activeProtocolVersion === "2026-07-28" || /2026-07-28/i.test(initResult.json?.error?.message || "") || /2026-07-28/i.test(JSON.stringify(initResult.json?.error?.data || "")) || /legacy handshake/i.test(initResult.json?.error?.message || "") || /stateless/i.test(initResult.json?.error?.message || "") || initResult.json?.error?.code === -32601 || initResult.json?.error?.code === -32022)) {
			const statelessVersion = activeProtocolVersion === "2026-07-28" || /2026-07-28/i.test(initResult.json?.error?.message || "") || /2026-07-28/i.test(JSON.stringify(initResult.json?.error?.data || "")) ? "2026-07-28" : activeProtocolVersion;
			const statelessMeta = {
				"io.modelcontextprotocol/protocolVersion": statelessVersion,
				"io.modelcontextprotocol/clientCapabilities": {},
				"io.modelcontextprotocol/clientInfo": {
					name: "dsh-mcp-tester",
					version: "1.0.0"
				},
				protocolVersion: statelessVersion,
				clientCapabilities: {},
				clientInfo: {
					name: "dsh-mcp-tester",
					version: "1.0.0"
				}
			};
			const statelessHeaders = {
				"MCP-Protocol-Version": statelessVersion,
				"Mcp-Method": "tools/list"
			};
			try {
				let statelessResult = await sendJsonRpc({
					jsonrpc: "2.0",
					id: 2,
					method: "tools/list",
					params: { _meta: statelessMeta }
				}, statelessHeaders);
				let statelessTools = statelessResult.json?.result?.tools;
				if (!Array.isArray(statelessTools) && postEndpointUrl !== parsedUrl.toString()) {
					const directResult = await sendJsonRpc({
						jsonrpc: "2.0",
						id: 2,
						method: "tools/list",
						params: { _meta: statelessMeta }
					}, statelessHeaders, parsedUrl.toString());
					if (Array.isArray(directResult.json?.result?.tools)) {
						statelessResult = directResult;
						statelessTools = directResult.json.result.tools;
					}
				}
				if (Array.isArray(statelessTools)) {
					const toolDetails = statelessTools.map((t) => ({
						name: typeof t === "string" ? t : t?.name || t?.id || "",
						description: typeof t === "object" ? t?.description || "" : void 0,
						inputSchema: typeof t === "object" ? t?.inputSchema : void 0
					})).filter((t) => Boolean(t.name));
					const toolNames = toolDetails.map((t) => t.name);
					const count = toolNames.length;
					return {
						ok: true,
						count,
						tools: toolNames,
						toolDetails,
						serverInfo: { protocolVersion: statelessVersion },
						detectedTransport: isSseMode ? "sse" : "streamable-http",
						message: count > 0 ? `成功获取到 ${count} 个工具` : "成功连接并完成 MCP 握手 (未声明可用工具)"
					};
				}
				if (statelessResult.json?.error) return {
					ok: false,
					message: `MCP tools/list 返回错误: ${formatMcpError(statelessResult.json.error)}`
				};
				if (!statelessResult.res.ok && statelessResult.res.status !== 202) {
					const errDetail = statelessResult.rawText ? `: ${statelessResult.rawText.slice(0, 200)}` : "";
					return {
						ok: false,
						message: `HTTP tools/list 请求失败 (HTTP ${statelessResult.res.status} ${statelessResult.res.statusText})${errDetail}`
					};
				}
			} catch (statelessErr) {
				return {
					ok: false,
					message: `Stateless tools/list 请求失败: ${statelessErr?.message || String(statelessErr)}`
				};
			}
		}
		if (initResult.json?.error) return {
			ok: false,
			message: `MCP 初始化返回错误: ${formatMcpError(initResult.json.error)}`
		};
		if (!initResult.res.ok && initResult.res.status !== 202) {
			const errDetail = initResult.rawText ? `: ${initResult.rawText.slice(0, 200)}` : "";
			return {
				ok: false,
				message: `HTTP initialize 请求失败 (HTTP ${initResult.res.status} ${initResult.res.statusText})${errDetail}`
			};
		}
		try {
			await sendJsonRpc({
				jsonrpc: "2.0",
				method: "notifications/initialized"
			}, { "Mcp-Method": "notifications/initialized" }, void 0);
		} catch {}
		const toolsResult = await sendJsonRpc({
			jsonrpc: "2.0",
			id: 2,
			method: "tools/list",
			params: {}
		}, { "Mcp-Method": "tools/list" });
		if (toolsResult.json?.error) return {
			ok: false,
			message: `MCP tools/list 返回错误: ${formatMcpError(toolsResult.json.error)}`
		};
		if (!toolsResult.res.ok && toolsResult.res.status !== 202) {
			const errDetail = toolsResult.rawText ? `: ${toolsResult.rawText.slice(0, 200)}` : "";
			return {
				ok: false,
				message: `HTTP tools/list 请求失败 (HTTP ${toolsResult.res.status} ${toolsResult.res.statusText})${errDetail}`
			};
		}
		const rawTools = toolsResult.json?.result?.tools;
		if (Array.isArray(rawTools)) {
			const toolDetails = rawTools.map((t) => ({
				name: typeof t === "string" ? t : t?.name || t?.id || "",
				description: typeof t === "object" ? t?.description || "" : void 0,
				inputSchema: typeof t === "object" ? t?.inputSchema : void 0
			})).filter((t) => Boolean(t.name));
			const toolNames = toolDetails.map((t) => t.name);
			const count = toolNames.length;
			return {
				ok: true,
				count,
				tools: toolNames,
				toolDetails,
				serverInfo,
				detectedTransport: isSseMode ? "sse" : "streamable-http",
				message: count > 0 ? `成功获取到 ${count} 个工具` : "成功连接并完成 MCP 握手 (未声明可用工具)"
			};
		}
		return {
			ok: false,
			message: `HTTP 响应格式异常 (未包含有效的 tools 列表): ${toolsResult.rawText.slice(0, 150)}`
		};
	} catch (err) {
		return {
			ok: false,
			message: `HTTP 连接测试失败: ${err?.message || String(err)}`
		};
	} finally {
		clearTimeout(timeoutTimer);
		try {
			abortCtrl.abort();
		} catch {}
	}
}
//#endregion
//#region lib/types/server/mcp/tester/index.js
/** Test if an MCP server can be connected to and successfully list its tools via MCP JSON-RPC protocol */
async function testMcpConnection(server) {
	if (!server.transport) return {
		ok: false,
		message: "缺少传输协议类型 (transport)"
	};
	let result;
	if (server.transport === "stdio") result = await testStdioConnection(server);
	else if (server.transport === "streamable-http-or-sse") result = await testHttpConnection(server);
	else return {
		ok: false,
		message: `不支持的传输协议: ${server.transport}`
	};
	try {
		const compat = await checkMcpCompatibility(server, result.serverInfo);
		result.compatibility = compat;
		if (!compat.canEnable && compat.warning) result.message = `${result.message} [警告: ${compat.warning}]`;
	} catch {}
	return result;
}
//#endregion
//#region lib/types/server/common/http.js
async function readRequestBody(req) {
	return new Promise((resolve, reject) => {
		const chunks = [];
		req.on("data", (chunk) => chunks.push(chunk));
		req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
		req.on("error", reject);
	});
}
//#endregion
//#region lib/types/server/mcp/routes.js
function registerMcpRoutes(webServer, getMcpStore, setMcpStore, mcpManager) {
	return webServer.register({
		kind: "exact",
		path: "/api/mcp-servers",
		handler: async (req, res) => {
			res.setHeader("Content-Type", "application/json; charset=utf-8");
			const url = new URL(req.url ?? "/", "http://localhost");
			if (req.method === "GET") {
				const currentStore = loadMcpStore();
				setMcpStore(currentStore);
				res.writeHead(200);
				res.end(JSON.stringify({
					ok: true,
					servers: Object.values(currentStore.servers)
				}));
				return;
			}
			if (req.method === "POST") {
				try {
					const bodyStr = await readRequestBody(req);
					const parsed = JSON.parse(bodyStr || "{}");
					if (parsed.action === "test" || parsed.action === "tools" || url.searchParams.get("action") === "test" || url.searchParams.get("action") === "tools") {
						const testResult = await testMcpConnection(parsed.server || parsed);
						const mcpStore = getMcpStore();
						const targetId = (parsed.server?.id || parsed.id || "").trim();
						if (targetId && mcpStore.servers[targetId]) {
							const s = mcpStore.servers[targetId];
							if (testResult.ok) {
								if (testResult.tools) s.tools = testResult.tools;
								if (testResult.toolDetails) s.toolDetails = testResult.toolDetails;
								if (testResult.detectedTransport) s.detectedTransport = testResult.detectedTransport;
								if (testResult.serverInfo) s.serverInfo = testResult.serverInfo;
								if (testResult.compatibility) s.compatibility = testResult.compatibility;
								s.lastTestedAt = Date.now();
								saveMcpStore(mcpStore);
								setMcpStore(mcpStore);
								mcpManager?.syncServer(s);
							}
						}
						res.writeHead(200);
						res.end(JSON.stringify({
							...testResult,
							servers: Object.values(mcpStore.servers)
						}));
						return;
					}
					const incoming = parsed.server || parsed;
					const id = (incoming.id || "").trim().replace(/[^a-zA-Z0-9_-]/g, "_");
					const name = (incoming.name || "").trim();
					const rawTransport = incoming.transport;
					const transport = rawTransport === "stdio" ? "stdio" : rawTransport === "streamable-http-or-sse" || rawTransport === "streamable-http" || rawTransport === "sse" ? "streamable-http-or-sse" : "";
					if (!transport) {
						res.writeHead(400);
						res.end(JSON.stringify({
							ok: false,
							error: "Valid transport (stdio, streamable-http-or-sse) is required"
						}));
						return;
					}
					if (transport === "stdio" && !incoming.command?.trim()) {
						res.writeHead(400);
						res.end(JSON.stringify({
							ok: false,
							error: "Command is required for stdio transport"
						}));
						return;
					}
					if (transport !== "stdio" && !incoming.url?.trim()) {
						res.writeHead(400);
						res.end(JSON.stringify({
							ok: false,
							error: "URL is required for HTTP/SSE transport"
						}));
						return;
					}
					const mcpStore = getMcpStore();
					const existing = mcpStore.servers[id];
					const now = Date.now();
					const toolCallTimeoutMs = typeof incoming.toolCallTimeoutMs === "number" && incoming.toolCallTimeoutMs > 0 ? Math.floor(incoming.toolCallTimeoutMs) : void 0;
					const failOnStartupError = typeof incoming.failOnStartupError === "boolean" ? incoming.failOnStartupError : void 0;
					let reconnect = void 0;
					if (incoming.reconnect && typeof incoming.reconnect === "object") reconnect = {
						enabled: typeof incoming.reconnect.enabled === "boolean" ? incoming.reconnect.enabled : void 0,
						initialDelayMs: typeof incoming.reconnect.initialDelayMs === "number" && incoming.reconnect.initialDelayMs >= 0 ? Math.floor(incoming.reconnect.initialDelayMs) : void 0,
						maxDelayMs: typeof incoming.reconnect.maxDelayMs === "number" && incoming.reconnect.maxDelayMs >= 0 ? Math.floor(incoming.reconnect.maxDelayMs) : void 0,
						maxAttempts: typeof incoming.reconnect.maxAttempts === "number" && incoming.reconnect.maxAttempts >= 0 ? Math.floor(incoming.reconnect.maxAttempts) : void 0
					};
					const disabledTools = Array.isArray(incoming.disabledTools) ? Array.from(new Set(incoming.disabledTools.filter((t) => typeof t === "string").map((t) => t.trim()).filter(Boolean))) : existing?.disabledTools;
					const serverConfig = {
						id,
						name,
						description: incoming.description?.trim() || void 0,
						transport,
						command: incoming.command?.trim() || void 0,
						args: Array.isArray(incoming.args) ? incoming.args.filter((a) => typeof a === "string") : [],
						env: incoming.env && typeof incoming.env === "object" ? incoming.env : void 0,
						cwd: incoming.cwd?.trim() || void 0,
						url: incoming.url?.trim() || void 0,
						headers: incoming.headers && typeof incoming.headers === "object" ? incoming.headers : void 0,
						enabledByDefault: Boolean(incoming.enabledByDefault),
						toolCallTimeoutMs,
						failOnStartupError,
						reconnect,
						disabledTools: disabledTools && disabledTools.length > 0 ? disabledTools : void 0,
						tools: incoming.tools || existing?.tools,
						toolDetails: incoming.toolDetails || existing?.toolDetails,
						detectedTransport: incoming.detectedTransport || existing?.detectedTransport,
						serverInfo: incoming.serverInfo || existing?.serverInfo,
						compatibility: incoming.compatibility || existing?.compatibility,
						lastTestedAt: incoming.lastTestedAt || existing?.lastTestedAt,
						createdAt: existing?.createdAt || now,
						updatedAt: now
					};
					mcpStore.servers[id] = serverConfig;
					saveMcpStore(mcpStore);
					setMcpStore(mcpStore);
					mcpManager?.syncServer(serverConfig);
					res.writeHead(200);
					res.end(JSON.stringify({
						ok: true,
						server: serverConfig,
						servers: Object.values(mcpStore.servers)
					}));
				} catch (err) {
					res.writeHead(400);
					res.end(JSON.stringify({
						ok: false,
						error: err?.message || String(err)
					}));
				}
				return;
			}
			if (req.method === "DELETE") {
				try {
					const bodyStr = await readRequestBody(req);
					const parsed = bodyStr ? JSON.parse(bodyStr) : {};
					const targetId = url.searchParams.get("id") || parsed.id;
					const mcpStore = getMcpStore();
					if (targetId && mcpStore.servers[targetId]) {
						delete mcpStore.servers[targetId];
						saveMcpStore(mcpStore);
						setMcpStore(mcpStore);
						mcpManager?.unregisterServer(targetId);
					}
					res.writeHead(200);
					res.end(JSON.stringify({
						ok: true,
						servers: Object.values(mcpStore.servers)
					}));
				} catch (err) {
					res.writeHead(400);
					res.end(JSON.stringify({
						ok: false,
						error: err?.message || String(err)
					}));
				}
				return;
			}
			res.writeHead(405);
			res.end(JSON.stringify({
				ok: false,
				error: "Method Not Allowed"
			}));
		}
	});
}
//#endregion
//#region lib/types/server/skills/discovery.js
function classifySkillSource(skill) {
	if (!skill) return {
		isRuntime: false,
		source: "user-dsh"
	};
	const metaType = typeof skill.metadata?.type === "string" ? skill.metadata.type.toLowerCase() : typeof skill.metadata?.scope === "string" ? skill.metadata.scope.toLowerCase() : void 0;
	if (metaType === "user" || metaType === "user-dsh" || metaType === "user-agents") return {
		isRuntime: false,
		source: "user-dsh"
	};
	if (metaType === "project" || metaType === "project-dsh" || metaType === "project-agents") return {
		isRuntime: false,
		source: "project-dsh"
	};
	if (metaType === "preset" || metaType === "runtime" || metaType === "bundled") return {
		isRuntime: true,
		source: "runtime"
	};
	const src = (skill.source || "").toLowerCase();
	const provider = (skill.provider || "").toLowerCase();
	switch (src) {
		case "user-dsh":
		case "user-agents": return {
			isRuntime: false,
			source: src
		};
		case "project-dsh":
		case "project-agents": return {
			isRuntime: false,
			source: src
		};
		case "custom":
		case "custom-preset":
		case "bundled-preset":
		case "preset":
		case "runtime":
		case "bundled": return {
			isRuntime: true,
			source: src
		};
		default:
			if (src.includes("user")) return {
				isRuntime: false,
				source: "user-dsh"
			};
			if (src.includes("project")) return {
				isRuntime: false,
				source: "project-dsh"
			};
			if (provider && provider !== "filesystem" && provider !== "project-dsh" && provider !== "user-dsh" && provider !== "project-agents" && provider !== "user-agents") return {
				isRuntime: true,
				source: src || "runtime"
			};
			return {
				isRuntime: true,
				source: src || "runtime"
			};
	}
}
function isRuntimeSkill(skill) {
	return classifySkillSource(skill).isRuntime;
}
function compareSkills(a, b) {
	const aRuntime = Boolean(a.isRuntime);
	if (aRuntime !== Boolean(b.isRuntime)) return aRuntime ? 1 : -1;
	return a.name.localeCompare(b.name);
}
function resolveSessionPreset(session) {
	if (!session) return void 0;
	if (Array.isArray(session.events)) for (let index = session.events.length - 1; index >= 0; index -= 1) {
		const event = session.events[index];
		if (event?.type === "agent-preset/selected") return event.data?.agentPreset;
	}
	return session.header?.agentPreset;
}
async function resolveScopes(ctx, sessionId) {
	const sessionsService = ctx.get("sessions");
	const agentsService = ctx.get("agents");
	const presets = ctx.get("agentPresets");
	if (sessionId) {
		const session = sessionsService?.get?.(sessionId);
		const liveAgent = agentsService?.get?.(sessionId);
		if (liveAgent) return [liveAgent];
		if (presets && typeof presets.standingKeyFor === "function") try {
			let presetId = resolveSessionPreset(session);
			if (!presetId) {
				const persistence = ctx.get("sessionPersistence");
				if (persistence && typeof persistence.inspect === "function") try {
					const inspected = await persistence.inspect(sessionId);
					presetId = resolveSessionPreset({
						header: inspected?.meta,
						events: inspected?.events
					});
				} catch {}
			}
			const standingKey = await presets.standingKeyFor(presetId);
			if (standingKey) return [standingKey];
		} catch {}
		return [void 0];
	}
	if (presets && typeof presets.standingKeyFor === "function") try {
		const defaultKey = await presets.standingKeyFor();
		if (defaultKey) return [defaultKey];
	} catch {}
	return [void 0];
}
async function getAvailableSkills(ctx, sessionId) {
	const map = /* @__PURE__ */ new Map();
	let targetCwd = void 0;
	if (sessionId) try {
		const session = ctx.get("sessions")?.get?.(sessionId);
		if (session?.header?.cwd) targetCwd = session.header.cwd;
		else {
			const persistence = ctx.get("sessionPersistence");
			if (persistence && typeof persistence.inspect === "function") {
				const inspected = await persistence.inspect(sessionId);
				if (inspected?.meta?.cwd) targetCwd = inspected.meta.cwd;
			}
		}
	} catch {}
	const presets = ctx.get("agentPresets");
	const scopes = await resolveScopes(ctx, sessionId);
	for (const scope of scopes) {
		let skillsService = void 0;
		if (scope && scope.ctx && presets && typeof presets.serviceFor === "function") try {
			skillsService = presets.serviceFor(scope, "skills");
		} catch {}
		if (!skillsService) skillsService = ctx.get("skills");
		if (skillsService && typeof skillsService.list === "function") try {
			const list = await skillsService.list({
				cwd: targetCwd,
				scope
			});
			if (Array.isArray(list)) {
				for (const s of list) if (!map.has(s.name)) {
					const { isRuntime, source } = classifySkillSource(s);
					const resolvedPath = s.path || (s.resourceBase?.kind === "directory" ? s.resourceBase.path : void 0);
					map.set(s.name, {
						name: s.name,
						description: s.description || "",
						whenToUse: s.whenToUse,
						provider: s.provider || "skills-registry",
						source,
						path: resolvedPath,
						modelInvocable: s.invocation?.modelInvocable ?? true,
						userInvocable: s.invocation?.userInvocable ?? true,
						isRuntime
					});
				}
			}
		} catch {}
	}
	return Array.from(map.values()).sort(compareSkills);
}
async function getSkillDetail(ctx, name, sessionId) {
	let targetCwd = void 0;
	if (sessionId) try {
		const session = ctx.get("sessions")?.get?.(sessionId);
		if (session?.header?.cwd) targetCwd = session.header.cwd;
		else {
			const persistence = ctx.get("sessionPersistence");
			if (persistence && typeof persistence.inspect === "function") {
				const inspected = await persistence.inspect(sessionId);
				if (inspected?.meta?.cwd) targetCwd = inspected.meta.cwd;
			}
		}
	} catch {}
	const presets = ctx.get("agentPresets");
	const scopes = await resolveScopes(ctx, sessionId);
	for (const scope of scopes) {
		let skillsService = void 0;
		if (scope && scope.ctx && presets && typeof presets.serviceFor === "function") try {
			skillsService = presets.serviceFor(scope, "skills");
		} catch {}
		if (!skillsService) skillsService = ctx.get("skills");
		if (skillsService && typeof skillsService.get === "function") try {
			const s = await skillsService.get(name, {
				cwd: targetCwd,
				scope
			});
			if (s) {
				const { isRuntime, source } = classifySkillSource(s);
				const resolvedPath = s.path || (s.resourceBase?.kind === "directory" ? s.resourceBase.path : void 0);
				return {
					name: s.name,
					description: s.description || "",
					whenToUse: s.whenToUse,
					provider: s.provider || "skills-registry",
					source,
					path: resolvedPath,
					content: s.content,
					modelInvocable: s.invocation?.modelInvocable ?? true,
					userInvocable: s.invocation?.userInvocable ?? true,
					isRuntime
				};
			}
		} catch {}
	}
	return null;
}
//#endregion
//#region lib/types/server/session/routes.js
function registerSessionSettingsRoutes(ctx, webServer, getSessionSettingsStore, setSessionSettingsStore, getMcpStore, mcpManager) {
	return webServer.register({
		kind: "exact",
		path: "/api/session-settings",
		handler: async (req, res) => {
			res.setHeader("Content-Type", "application/json; charset=utf-8");
			const querySessionId = new URL(req.url ?? "/", "http://localhost").searchParams.get("sessionId") || void 0;
			if (req.method === "GET") {
				try {
					const sessionSettingsStore = getSessionSettingsStore();
					const mcpStore = getMcpStore();
					const availableSkills = await getAvailableSkills(ctx, querySessionId);
					const rawConfig = querySessionId && sessionSettingsStore.sessions[querySessionId] ? sessionSettingsStore.sessions[querySessionId] : {
						subagentModel: { mode: "default" },
						mcp: {
							mode: "default",
							enabledServerIds: []
						},
						skills: {
							mode: "default",
							disabledSkills: []
						}
					};
					const effective = resolveEffectiveSessionSettings(sessionSettingsStore, mcpStore, querySessionId);
					res.writeHead(200);
					res.end(JSON.stringify({
						ok: true,
						sessionId: querySessionId,
						config: rawConfig,
						effectiveConfig: effective,
						defaultConfig: sessionSettingsStore.default,
						availableSkills,
						hasSessionOverride: Boolean(querySessionId && sessionSettingsStore.sessions[querySessionId] && (sessionSettingsStore.sessions[querySessionId].subagentModel?.mode !== "default" || sessionSettingsStore.sessions[querySessionId].mcp?.mode !== "default" || sessionSettingsStore.sessions[querySessionId].skills?.mode !== "default"))
					}));
				} catch (err) {
					res.writeHead(500);
					res.end(JSON.stringify({
						ok: false,
						error: err?.message || String(err)
					}));
				}
				return;
			}
			if (req.method === "POST") {
				try {
					const bodyStr = await readRequestBody(req);
					const parsed = JSON.parse(bodyStr || "{}");
					const targetSessionId = parsed.sessionId || querySessionId;
					const isSaveDefault = Boolean(parsed.isDefault || !targetSessionId || parsed.saveAsDefault);
					const sessionSettingsStore = getSessionSettingsStore();
					const mcpStore = getMcpStore();
					const incomingConfig = normalizeSessionSettings(parsed.config ?? parsed);
					if (incomingConfig.subagentModel.mode === "custom" && (!incomingConfig.subagentModel.provider || !incomingConfig.subagentModel.model)) {
						res.writeHead(400);
						res.end(JSON.stringify({
							ok: false,
							error: "Subagent model custom mode requires provider and model"
						}));
						return;
					}
					if (isSaveDefault) {
						try {
							const allSkills = await getAvailableSkills(ctx, void 0);
							const runtimeSkillNames = new Set(allSkills.filter((s) => s.isRuntime).map((s) => s.name));
							incomingConfig.skills.disabledSkills = (incomingConfig.skills.disabledSkills || []).filter((name) => !runtimeSkillNames.has(name));
							incomingConfig.skills.disabledModelSkills = (incomingConfig.skills.disabledModelSkills || []).filter((name) => !runtimeSkillNames.has(name));
							incomingConfig.skills.disabledUserSkills = (incomingConfig.skills.disabledUserSkills || []).filter((name) => !runtimeSkillNames.has(name));
						} catch {}
						sessionSettingsStore.default = incomingConfig;
					}
					if (targetSessionId && !parsed.onlyDefault) {
						if (isSaveDefault) delete sessionSettingsStore.sessions[targetSessionId];
						else if (incomingConfig.subagentModel.mode === "default" && incomingConfig.mcp.mode === "default" && incomingConfig.skills.mode === "default") delete sessionSettingsStore.sessions[targetSessionId];
						else sessionSettingsStore.sessions[targetSessionId] = incomingConfig;
					}
					saveSessionSettingsStore(sessionSettingsStore);
					setSessionSettingsStore(sessionSettingsStore);
					mcpManager?.syncAll();
					const effective = resolveEffectiveSessionSettings(sessionSettingsStore, mcpStore, targetSessionId);
					const availableSkills = await getAvailableSkills(ctx, targetSessionId);
					res.writeHead(200);
					res.end(JSON.stringify({
						ok: true,
						sessionId: targetSessionId,
						config: incomingConfig,
						effectiveConfig: effective,
						defaultConfig: sessionSettingsStore.default,
						availableSkills,
						hasSessionOverride: Boolean(targetSessionId && sessionSettingsStore.sessions[targetSessionId] && (sessionSettingsStore.sessions[targetSessionId].subagentModel?.mode !== "default" || sessionSettingsStore.sessions[targetSessionId].mcp?.mode !== "default" || sessionSettingsStore.sessions[targetSessionId].skills?.mode !== "default"))
					}));
				} catch (err) {
					res.writeHead(400);
					res.end(JSON.stringify({
						ok: false,
						error: err?.message || String(err)
					}));
				}
				return;
			}
			if (req.method === "DELETE") {
				const sessionSettingsStore = getSessionSettingsStore();
				const mcpStore = getMcpStore();
				if (querySessionId && sessionSettingsStore.sessions[querySessionId]) {
					delete sessionSettingsStore.sessions[querySessionId];
					saveSessionSettingsStore(sessionSettingsStore);
					setSessionSettingsStore(sessionSettingsStore);
					mcpManager?.syncAll();
				}
				const effective = resolveEffectiveSessionSettings(sessionSettingsStore, mcpStore, querySessionId);
				const availableSkills = await getAvailableSkills(ctx, querySessionId);
				res.writeHead(200);
				res.end(JSON.stringify({
					ok: true,
					sessionId: querySessionId,
					config: {
						subagentModel: { mode: "default" },
						mcp: {
							mode: "default",
							enabledServerIds: []
						},
						skills: {
							mode: "default",
							disabledSkills: []
						}
					},
					effectiveConfig: effective,
					defaultConfig: sessionSettingsStore.default,
					availableSkills,
					hasSessionOverride: false
				}));
				return;
			}
			res.writeHead(405);
			res.end(JSON.stringify({
				ok: false,
				error: "Method Not Allowed"
			}));
		}
	});
}
//#endregion
//#region lib/types/server/skills/routes.js
function registerSkillsRoutes(ctx, webServer) {
	return webServer.register({
		kind: "exact",
		path: "/api/session-settings/skills/content",
		handler: async (req, res) => {
			res.setHeader("Content-Type", "application/json; charset=utf-8");
			const url = new URL(req.url ?? "/", "http://localhost");
			const skillName = (url.searchParams.get("name") || "").trim();
			const reqSessionId = (url.searchParams.get("sessionId") || "").trim() || void 0;
			if (!skillName) {
				res.writeHead(400);
				res.end(JSON.stringify({
					ok: false,
					error: "Skill name is required"
				}));
				return;
			}
			const skill = await getSkillDetail(ctx, skillName, reqSessionId);
			if (!skill) {
				res.writeHead(404);
				res.end(JSON.stringify({
					ok: false,
					error: `Skill "${skillName}" not found`
				}));
				return;
			}
			res.writeHead(200);
			res.end(JSON.stringify({
				ok: true,
				skill
			}));
		}
	});
}
//#endregion
//#region lib/types/server/subagent-model/routes.js
function registerLegacySubagentModelRoutes(webServer, getSessionSettingsStore, setSessionSettingsStore) {
	return webServer.register({
		kind: "exact",
		path: "/api/subagent-model",
		handler: async (req, res) => {
			res.setHeader("Content-Type", "application/json; charset=utf-8");
			const querySessionId = new URL(req.url ?? "/", "http://localhost").searchParams.get("sessionId") || void 0;
			const sessionSettingsStore = getSessionSettingsStore();
			if (req.method === "GET") {
				const rawConfig = querySessionId && sessionSettingsStore.sessions[querySessionId] ? sessionSettingsStore.sessions[querySessionId].subagentModel : { mode: "default" };
				res.writeHead(200);
				res.end(JSON.stringify({
					ok: true,
					sessionId: querySessionId,
					config: rawConfig,
					effectiveConfig: resolveEffectiveSubagentModel(sessionSettingsStore, querySessionId),
					defaultConfig: sessionSettingsStore.default?.subagentModel,
					hasSessionOverride: Boolean(querySessionId && sessionSettingsStore.sessions[querySessionId] && sessionSettingsStore.sessions[querySessionId].subagentModel?.mode !== "default")
				}));
				return;
			}
			if (req.method === "POST") {
				try {
					const body = await readRequestBody(req);
					const parsed = JSON.parse(body || "{}");
					const targetSessionId = parsed.sessionId || querySessionId;
					const isSaveDefault = Boolean(parsed.isDefault || !targetSessionId || parsed.saveAsDefault);
					const incomingConfig = normalizeSubagentModelConfig(parsed.config || parsed);
					if (incomingConfig.mode === "custom" && (!incomingConfig.provider || !incomingConfig.model)) {
						res.writeHead(400);
						res.end(JSON.stringify({
							ok: false,
							error: "custom mode requires provider and model"
						}));
						return;
					}
					if (isSaveDefault) sessionSettingsStore.default.subagentModel = incomingConfig;
					if (targetSessionId && !parsed.onlyDefault) {
						if (isSaveDefault) {
							if (sessionSettingsStore.sessions[targetSessionId]) sessionSettingsStore.sessions[targetSessionId].subagentModel = { mode: "default" };
						} else if (!sessionSettingsStore.sessions[targetSessionId]) sessionSettingsStore.sessions[targetSessionId] = {
							subagentModel: incomingConfig,
							mcp: {
								mode: "default",
								enabledServerIds: []
							},
							skills: {
								mode: "default",
								disabledSkills: []
							}
						};
						else sessionSettingsStore.sessions[targetSessionId].subagentModel = incomingConfig;
					}
					saveSessionSettingsStore(sessionSettingsStore);
					setSessionSettingsStore(sessionSettingsStore);
					res.writeHead(200);
					res.end(JSON.stringify({
						ok: true,
						sessionId: targetSessionId,
						config: incomingConfig,
						effectiveConfig: resolveEffectiveSubagentModel(sessionSettingsStore, targetSessionId),
						defaultConfig: sessionSettingsStore.default?.subagentModel,
						hasSessionOverride: Boolean(targetSessionId && sessionSettingsStore.sessions[targetSessionId] && sessionSettingsStore.sessions[targetSessionId].subagentModel?.mode !== "default")
					}));
				} catch (err) {
					res.writeHead(400);
					res.end(JSON.stringify({
						ok: false,
						error: err?.message || String(err)
					}));
				}
				return;
			}
			if (req.method === "DELETE") {
				if (querySessionId && sessionSettingsStore.sessions[querySessionId]) {
					sessionSettingsStore.sessions[querySessionId].subagentModel = { mode: "default" };
					saveSessionSettingsStore(sessionSettingsStore);
					setSessionSettingsStore(sessionSettingsStore);
				}
				res.writeHead(200);
				res.end(JSON.stringify({
					ok: true,
					sessionId: querySessionId,
					config: { mode: "default" },
					effectiveConfig: resolveEffectiveSubagentModel(sessionSettingsStore, querySessionId),
					defaultConfig: sessionSettingsStore.default?.subagentModel,
					hasSessionOverride: false
				}));
				return;
			}
			res.writeHead(405);
			res.end(JSON.stringify({
				ok: false,
				error: "Method Not Allowed"
			}));
		}
	});
}
//#endregion
//#region lib/types/server/subagent-model/interceptor.js
function registerSubagentModelInterceptor(ctx, getSessionSettingsStore) {
	ctx.on("agent/request", async (payload, next) => {
		const proposal = await next();
		const session = payload?.agent?.session;
		if (!session?.header || session.header.origin !== "subagent") return proposal;
		const effectiveCfg = resolveEffectiveSubagentModel(getSessionSettingsStore(), session.header.parentSession);
		if (effectiveCfg.mode !== "custom" || !effectiveCfg.provider || !effectiveCfg.model) return proposal;
		return {
			...proposal,
			provider: effectiveCfg.provider,
			model: effectiveCfg.model,
			...effectiveCfg.reasoningEffort ? { reasoningEffort: effectiveCfg.reasoningEffort } : {}
		};
	});
}
//#endregion
//#region lib/types/server/mcp/interceptor.js
function registerMcpInterceptors(ctx, getSessionSettingsStore, getMcpStore, mcpManager) {
	ctx.on("system-prompt/assemble", async (_assembly, context, next) => {
		const transformed = await next();
		if (!transformed || !Array.isArray(transformed.tools) || transformed.tools.length === 0) return transformed;
		const sessionId = context?.agent?.session?.id || context?.agent?.session?.header?.parentSession || context?.agent?.id;
		const sessionSettingsStore = getSessionSettingsStore();
		const mcpStore = getMcpStore();
		const effectiveMcp = resolveEffectiveMcp(sessionSettingsStore, mcpStore, sessionId);
		const enabledServerIds = new Set(effectiveMcp.enabledServerIds);
		const allServers = Object.values(mcpStore.servers);
		const disabledPublicNamesByServer = /* @__PURE__ */ new Map();
		for (const server of allServers) {
			const disabledList = effectiveMcp.effectiveDisabledTools[server.id] ?? server.disabledTools ?? [];
			if (disabledList.length > 0) {
				const disabledSet = /* @__PURE__ */ new Set();
				for (const rawName of disabledList) {
					disabledSet.add(publicToolName(server.id, rawName));
					disabledSet.add(`mcp__${server.id}__${rawName}`);
				}
				disabledPublicNamesByServer.set(server.id, disabledSet);
			}
		}
		const filteredTools = transformed.tools.filter((tool) => {
			if (!tool || typeof tool.name !== "string") return true;
			const meta = mcpManager?.getToolMeta(tool.name);
			if (meta) {
				if (!enabledServerIds.has(meta.serverId)) return false;
				if ((effectiveMcp.effectiveDisabledTools[meta.serverId] ?? mcpStore.servers[meta.serverId]?.disabledTools ?? []).includes(meta.rawName)) return false;
				return true;
			}
			if (tool.name.startsWith("mcp__")) for (const server of allServers) {
				const prefix = `mcp__${server.id}__`;
				if (tool.name.startsWith(prefix)) {
					if (!enabledServerIds.has(server.id)) return false;
					const disabledSet = disabledPublicNamesByServer.get(server.id);
					if (disabledSet && disabledSet.has(tool.name)) return false;
				}
			}
			return true;
		});
		return {
			...transformed,
			tools: filteredTools
		};
	});
	ctx.on("tools/pre-execute", async (exec, next) => {
		const toolName = exec?.name;
		if (typeof toolName === "string" && (toolName.startsWith("mcp__") || mcpManager?.isMcpTool(toolName))) {
			const sessionId = exec?.agent?.session?.id || exec?.agent?.session?.header?.parentSession || exec?.agent?.id;
			const sessionSettingsStore = getSessionSettingsStore();
			const mcpStore = getMcpStore();
			const effectiveMcp = resolveEffectiveMcp(sessionSettingsStore, mcpStore, sessionId);
			const enabledServerIds = new Set(effectiveMcp.enabledServerIds);
			const meta = mcpManager?.getToolMeta(toolName);
			if (meta) {
				if (!enabledServerIds.has(meta.serverId)) return {
					kind: "deny",
					reason: `unknown tool "${toolName}"`
				};
				if ((effectiveMcp.effectiveDisabledTools[meta.serverId] ?? mcpStore.servers[meta.serverId]?.disabledTools ?? []).includes(meta.rawName)) return {
					kind: "deny",
					reason: `unknown tool "${toolName}"`
				};
				return next();
			}
			for (const server of Object.values(mcpStore.servers)) {
				const prefix = `mcp__${server.id}__`;
				if (toolName.startsWith(prefix)) {
					if (!enabledServerIds.has(server.id)) return {
						kind: "deny",
						reason: `unknown tool "${toolName}"`
					};
					const disabledList = effectiveMcp.effectiveDisabledTools[server.id] ?? server.disabledTools ?? [];
					if (disabledList.length > 0) {
						if (new Set(disabledList.flatMap((raw) => [publicToolName(server.id, raw), `mcp__${server.id}__${raw}`])).has(toolName)) return {
							kind: "deny",
							reason: `unknown tool "${toolName}"`
						};
					}
				}
			}
		}
		return next();
	});
}
//#endregion
//#region lib/types/server/skills/interceptor.js
function registerSkillsInterceptors(ctx, getSessionSettingsStore) {
	const decorateSkillRegistry = () => {
		const skillsService = ctx.get("skills");
		if (skillsService && !skillsService.__sessionSettingsDecorated) {
			skillsService.__sessionSettingsDecorated = true;
			const origSnapshot = skillsService.snapshot.bind(skillsService);
			skillsService.snapshot = async function(options = {}) {
				const snapshot = await origSnapshot(options);
				if (!snapshot || !Array.isArray(snapshot.skills)) return snapshot;
				const sessionId = options?.scope?.session?.id || options?.scope?.session?.header?.parentSession || options?.scope?.id;
				const effectiveSkills = resolveEffectiveSkills(getSessionSettingsStore(), sessionId);
				const disabledModelSet = new Set(effectiveSkills.effectiveDisabledModelSkills || effectiveSkills.effectiveDisabledSkills || []);
				const disabledUserSet = new Set(effectiveSkills.effectiveDisabledUserSkills || []);
				if (disabledModelSet.size === 0 && disabledUserSet.size === 0) return snapshot;
				return {
					...snapshot,
					skills: snapshot.skills.map((skill) => {
						const isModelDis = disabledModelSet.has(skill.name);
						const isUserDis = disabledUserSet.has(skill.name);
						if (!isModelDis && !isUserDis) return skill;
						return {
							...skill,
							invocation: {
								modelInvocable: isModelDis ? false : skill.invocation?.modelInvocable ?? true,
								userInvocable: isUserDis ? false : skill.invocation?.userInvocable ?? true
							}
						};
					})
				};
			};
			const origGet = skillsService.get.bind(skillsService);
			skillsService.get = async function(name, options = {}) {
				const definition = await origGet(name, options);
				if (!definition) return definition;
				const sessionId = options?.scope?.session?.id || options?.scope?.session?.header?.parentSession || options?.scope?.id;
				const effectiveSkills = resolveEffectiveSkills(getSessionSettingsStore(), sessionId);
				const disabledModelSet = new Set(effectiveSkills.effectiveDisabledModelSkills || effectiveSkills.effectiveDisabledSkills || []);
				const disabledUserSet = new Set(effectiveSkills.effectiveDisabledUserSkills || []);
				if (disabledModelSet.has(definition.name) || disabledUserSet.has(definition.name)) return {
					...definition,
					invocation: {
						modelInvocable: disabledModelSet.has(definition.name) ? false : definition.invocation?.modelInvocable ?? true,
						userInvocable: disabledUserSet.has(definition.name) ? false : definition.invocation?.userInvocable ?? true
					}
				};
				return definition;
			};
		}
	};
	decorateSkillRegistry();
	ctx.on("skills/change", () => {
		decorateSkillRegistry();
	});
	ctx.on("tools/pre-execute", async (exec, next) => {
		if (exec?.name === "skill" && exec?.args && typeof exec.args.name === "string") {
			const targetSkillName = exec.args.name.trim();
			const sessionId = exec?.agent?.session?.id || exec?.agent?.session?.header?.parentSession || exec?.agent?.id;
			const effectiveSkills = resolveEffectiveSkills(getSessionSettingsStore(), sessionId);
			if ((effectiveSkills.effectiveDisabledModelSkills || effectiveSkills.effectiveDisabledSkills || []).includes(targetSkillName)) return {
				kind: "deny",
				reason: `skill "${targetSkillName}" is disabled for model invocation in this session`
			};
		}
		return next();
	});
}
//#endregion
//#region lib/types/server/index.js
const name = "session-settings";
const inject = ["webServer"];
function apply(ctx) {
	let mcpStore = loadMcpStore();
	let sessionSettingsStore = loadSessionSettingsStore();
	const mcpManager = new McpManager(ctx, () => mcpStore, (s) => {
		mcpStore = s;
	}, () => sessionSettingsStore);
	const webServer = ctx.get("webServer");
	if (webServer) {
		const unregisterMcp = registerMcpRoutes(webServer, () => mcpStore, (s) => {
			mcpStore = s;
		}, mcpManager);
		const unregisterSessionSettings = registerSessionSettingsRoutes(ctx, webServer, () => sessionSettingsStore, (s) => {
			sessionSettingsStore = s;
		}, () => mcpStore, mcpManager);
		const unregisterSkills = registerSkillsRoutes(ctx, webServer);
		const unregisterLegacySubagent = registerLegacySubagentModelRoutes(webServer, () => sessionSettingsStore, (s) => {
			sessionSettingsStore = s;
		});
		ctx.effect(() => {
			return () => {
				unregisterMcp();
				unregisterSessionSettings();
				unregisterSkills();
				unregisterLegacySubagent();
			};
		}, "session-settings: webServer routes");
	}
	mcpManager.syncAll();
	ctx.effect(() => {
		return () => {
			mcpManager.dispose();
		};
	}, "session-settings: mcpManager");
	registerSubagentModelInterceptor(ctx, () => sessionSettingsStore);
	registerMcpInterceptors(ctx, () => sessionSettingsStore, () => mcpStore, mcpManager);
	registerSkillsInterceptors(ctx, () => sessionSettingsStore);
}
//#endregion
export { DEFAULT_SESSION_SETTINGS, McpManager, apply, checkMcpCompatibility, classifySkillSource, compareSkills, createJsonRpcParser, discoverSseEndpoint, extractJsonRpcFromText, extractSupportedProtocolVersion, formatMcpError, getAvailableSkills, getMcpStoragePath, getSessionSettingsStoragePath, getSkillDetail, getStorageDir, inject, isRuntimeSkill, loadMcpStore, loadOfficialMcpClientPlugin, loadSessionSettingsStore, name, normalizeSessionSettings, normalizeSkillsConfig, normalizeSubagentModelConfig, publicToolName, readRequestBody, registerLegacySubagentModelRoutes, registerMcpInterceptors, registerMcpRoutes, registerSessionSettingsRoutes, registerSkillsInterceptors, registerSkillsRoutes, registerSubagentModelInterceptor, resolveEffectiveMcp, resolveEffectiveSessionSettings, resolveEffectiveSkills, resolveEffectiveSubagentModel, saveMcpStore, saveSessionSettingsStore, startSseStream, testHttpConnection, testMcpConnection, testStdioConnection };
