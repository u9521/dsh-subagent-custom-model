import { normalizeSubagentModelConfig, resolveEffectiveSubagentModel, saveSessionSettingsStore as saveSessionSettingsStoreToDisk, } from '../session/storage.js';
import { readRequestBody } from '../common/http.js';
export function registerLegacySubagentModelRoutes(webServer, getSessionSettingsStore, setSessionSettingsStore) {
    const unregisterLegacySubagentModelRoute = webServer.register({
        kind: 'exact',
        path: '/api/subagent-model',
        handler: async (req, res) => {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            const url = new URL(req.url ?? '/', 'http://localhost');
            const querySessionId = url.searchParams.get('sessionId') || undefined;
            const sessionSettingsStore = getSessionSettingsStore();
            if (req.method === 'GET') {
                const rawConfig = querySessionId && sessionSettingsStore.sessions[querySessionId]
                    ? sessionSettingsStore.sessions[querySessionId].subagentModel
                    : { mode: 'default' };
                res.writeHead(200);
                res.end(JSON.stringify({
                    ok: true,
                    sessionId: querySessionId,
                    config: rawConfig,
                    effectiveConfig: resolveEffectiveSubagentModel(sessionSettingsStore, querySessionId),
                    defaultConfig: sessionSettingsStore.default?.subagentModel,
                    hasSessionOverride: Boolean(querySessionId &&
                        sessionSettingsStore.sessions[querySessionId] &&
                        sessionSettingsStore.sessions[querySessionId].subagentModel
                            ?.mode !== 'default'),
                }));
                return;
            }
            if (req.method === 'POST') {
                try {
                    const body = await readRequestBody(req);
                    const parsed = JSON.parse(body || '{}');
                    const targetSessionId = parsed.sessionId || querySessionId;
                    const isSaveDefault = Boolean(parsed.isDefault || !targetSessionId || parsed.saveAsDefault);
                    const incomingConfig = normalizeSubagentModelConfig(parsed.config || parsed);
                    if (incomingConfig.mode === 'custom' &&
                        (!incomingConfig.provider || !incomingConfig.model)) {
                        res.writeHead(400);
                        res.end(JSON.stringify({
                            ok: false,
                            error: 'custom mode requires provider and model',
                        }));
                        return;
                    }
                    if (isSaveDefault) {
                        sessionSettingsStore.default.subagentModel = incomingConfig;
                    }
                    if (targetSessionId && !parsed.onlyDefault) {
                        if (isSaveDefault) {
                            if (sessionSettingsStore.sessions[targetSessionId]) {
                                sessionSettingsStore.sessions[targetSessionId].subagentModel = {
                                    mode: 'default',
                                };
                            }
                        }
                        else {
                            if (!sessionSettingsStore.sessions[targetSessionId]) {
                                sessionSettingsStore.sessions[targetSessionId] = {
                                    subagentModel: incomingConfig,
                                    mcp: { mode: 'default', enabledServerIds: [] },
                                    skills: { mode: 'default', disabledSkills: [] },
                                };
                            }
                            else {
                                sessionSettingsStore.sessions[targetSessionId].subagentModel =
                                    incomingConfig;
                            }
                        }
                    }
                    saveSessionSettingsStoreToDisk(sessionSettingsStore);
                    setSessionSettingsStore(sessionSettingsStore);
                    res.writeHead(200);
                    res.end(JSON.stringify({
                        ok: true,
                        sessionId: targetSessionId,
                        config: incomingConfig,
                        effectiveConfig: resolveEffectiveSubagentModel(sessionSettingsStore, targetSessionId),
                        defaultConfig: sessionSettingsStore.default?.subagentModel,
                        hasSessionOverride: Boolean(targetSessionId &&
                            sessionSettingsStore.sessions[targetSessionId] &&
                            sessionSettingsStore.sessions[targetSessionId].subagentModel
                                ?.mode !== 'default'),
                    }));
                }
                catch (err) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ ok: false, error: err?.message || String(err) }));
                }
                return;
            }
            if (req.method === 'DELETE') {
                if (querySessionId && sessionSettingsStore.sessions[querySessionId]) {
                    sessionSettingsStore.sessions[querySessionId].subagentModel = {
                        mode: 'default',
                    };
                    saveSessionSettingsStoreToDisk(sessionSettingsStore);
                    setSessionSettingsStore(sessionSettingsStore);
                }
                res.writeHead(200);
                res.end(JSON.stringify({
                    ok: true,
                    sessionId: querySessionId,
                    config: { mode: 'default' },
                    effectiveConfig: resolveEffectiveSubagentModel(sessionSettingsStore, querySessionId),
                    defaultConfig: sessionSettingsStore.default?.subagentModel,
                    hasSessionOverride: false,
                }));
                return;
            }
            res.writeHead(405);
            res.end(JSON.stringify({ ok: false, error: 'Method Not Allowed' }));
        },
    });
    return unregisterLegacySubagentModelRoute;
}
