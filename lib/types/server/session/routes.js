import { normalizeSessionSettings, resolveEffectiveSessionSettings, saveSessionSettingsStore, } from './storage.js';
import { getAvailableSkills } from '../skills/discovery.js';
import { readRequestBody } from '../common/http.js';
export function registerSessionSettingsRoutes(ctx, webServer, getSessionSettingsStore, setSessionSettingsStore, getMcpStore, mcpManager) {
    const unregisterSessionSettingsRoute = webServer.register({
        kind: 'exact',
        path: '/api/session-settings',
        handler: async (req, res) => {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            const url = new URL(req.url ?? '/', 'http://localhost');
            const querySessionId = url.searchParams.get('sessionId') || undefined;
            if (req.method === 'GET') {
                try {
                    const sessionSettingsStore = getSessionSettingsStore();
                    const mcpStore = getMcpStore();
                    const availableSkills = await getAvailableSkills(ctx, querySessionId);
                    const rawConfig = querySessionId && sessionSettingsStore.sessions[querySessionId]
                        ? sessionSettingsStore.sessions[querySessionId]
                        : {
                            subagentModel: { mode: 'default' },
                            mcp: { mode: 'default', enabledServerIds: [] },
                            skills: { mode: 'default', disabledSkills: [] },
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
                        hasSessionOverride: Boolean(querySessionId &&
                            sessionSettingsStore.sessions[querySessionId] &&
                            (sessionSettingsStore.sessions[querySessionId].subagentModel
                                ?.mode !== 'default' ||
                                sessionSettingsStore.sessions[querySessionId].mcp?.mode !==
                                    'default' ||
                                sessionSettingsStore.sessions[querySessionId].skills?.mode !==
                                    'default')),
                    }));
                }
                catch (err) {
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        ok: false,
                        error: err?.message || String(err),
                    }));
                }
                return;
            }
            if (req.method === 'POST') {
                try {
                    const bodyStr = await readRequestBody(req);
                    const parsed = JSON.parse(bodyStr || '{}');
                    const targetSessionId = parsed.sessionId || querySessionId;
                    const isSaveDefault = Boolean(parsed.isDefault || !targetSessionId || parsed.saveAsDefault);
                    const sessionSettingsStore = getSessionSettingsStore();
                    const mcpStore = getMcpStore();
                    const incomingConfig = normalizeSessionSettings(parsed.config ?? parsed);
                    if (incomingConfig.subagentModel.mode === 'custom' &&
                        (!incomingConfig.subagentModel.provider ||
                            !incomingConfig.subagentModel.model)) {
                        res.writeHead(400);
                        res.end(JSON.stringify({
                            ok: false,
                            error: 'Subagent model custom mode requires provider and model',
                        }));
                        return;
                    }
                    if (isSaveDefault) {
                        // Runtime skills cannot be set as global defaults
                        try {
                            const allSkills = await getAvailableSkills(ctx, undefined);
                            const runtimeSkillNames = new Set(allSkills.filter((s) => s.isRuntime).map((s) => s.name));
                            incomingConfig.skills.disabledSkills = (incomingConfig.skills.disabledSkills || []).filter((name) => !runtimeSkillNames.has(name));
                            incomingConfig.skills.disabledModelSkills = (incomingConfig.skills.disabledModelSkills || []).filter((name) => !runtimeSkillNames.has(name));
                            incomingConfig.skills.disabledUserSkills = (incomingConfig.skills.disabledUserSkills || []).filter((name) => !runtimeSkillNames.has(name));
                        }
                        catch { }
                        sessionSettingsStore.default = incomingConfig;
                    }
                    if (targetSessionId && !parsed.onlyDefault) {
                        if (isSaveDefault) {
                            delete sessionSettingsStore.sessions[targetSessionId];
                        }
                        else if (incomingConfig.subagentModel.mode === 'default' &&
                            incomingConfig.mcp.mode === 'default' &&
                            incomingConfig.skills.mode === 'default') {
                            delete sessionSettingsStore.sessions[targetSessionId];
                        }
                        else {
                            sessionSettingsStore.sessions[targetSessionId] = incomingConfig;
                        }
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
                        hasSessionOverride: Boolean(targetSessionId &&
                            sessionSettingsStore.sessions[targetSessionId] &&
                            (sessionSettingsStore.sessions[targetSessionId].subagentModel
                                ?.mode !== 'default' ||
                                sessionSettingsStore.sessions[targetSessionId].mcp?.mode !==
                                    'default' ||
                                sessionSettingsStore.sessions[targetSessionId].skills
                                    ?.mode !== 'default')),
                    }));
                }
                catch (err) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ ok: false, error: err?.message || String(err) }));
                }
                return;
            }
            if (req.method === 'DELETE') {
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
                        subagentModel: { mode: 'default' },
                        mcp: { mode: 'default', enabledServerIds: [] },
                        skills: { mode: 'default', disabledSkills: [] },
                    },
                    effectiveConfig: effective,
                    defaultConfig: sessionSettingsStore.default,
                    availableSkills,
                    hasSessionOverride: false,
                }));
                return;
            }
            res.writeHead(405);
            res.end(JSON.stringify({ ok: false, error: 'Method Not Allowed' }));
        },
    });
    return unregisterSessionSettingsRoute;
}
