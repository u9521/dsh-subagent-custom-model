const STORAGE_KEY = 'dsh.session_settings_store';
const MCP_STORAGE_KEY = 'dsh.mcp_servers_store';
const DEFAULT_SESSION_SETTINGS = {
    subagentModel: { mode: 'inherit' },
    mcp: {
        mode: 'default',
        enabledServerIds: [],
        toolsMode: {},
        disabledTools: {},
    },
    skills: {
        mode: 'default',
        disabledSkills: [],
    },
};
export function getLocalSessionSettingsStore() {
    try {
        if (typeof localStorage !== 'undefined') {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object') {
                    return {
                        default: parsed.default || { ...DEFAULT_SESSION_SETTINGS },
                        sessions: parsed.sessions || {},
                    };
                }
            }
        }
    }
    catch { }
    return { default: { ...DEFAULT_SESSION_SETTINGS }, sessions: {} };
}
export function saveLocalSessionSettingsStore(store) {
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        }
    }
    catch { }
}
export function getLocalMcpServers() {
    try {
        if (typeof localStorage !== 'undefined') {
            const raw = localStorage.getItem(MCP_STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed))
                    return parsed;
            }
        }
    }
    catch { }
    return [];
}
export function saveLocalMcpServers(servers) {
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(MCP_STORAGE_KEY, JSON.stringify(servers));
        }
    }
    catch { }
}
export function getSessionRawSettings(store, sessionId) {
    if (sessionId && store.sessions && store.sessions[sessionId]) {
        const s = store.sessions[sessionId];
        const hasOverride = s.subagentModel?.mode !== 'default' ||
            s.mcp?.mode !== 'default' ||
            s.skills?.mode !== 'default';
        return {
            config: {
                subagentModel: s.subagentModel || { mode: 'default' },
                mcp: {
                    mode: s.mcp?.mode === 'custom' ? 'custom' : 'default',
                    enabledServerIds: s.mcp?.enabledServerIds || [],
                    toolsMode: s.mcp?.toolsMode || {},
                    disabledTools: s.mcp?.disabledTools || {},
                },
                skills: {
                    mode: s.skills?.mode === 'custom' ? 'custom' : 'default',
                    disabledSkills: s.skills?.disabledSkills || [],
                },
            },
            hasOverride,
        };
    }
    return {
        config: {
            subagentModel: { mode: 'default' },
            mcp: {
                mode: 'default',
                enabledServerIds: [],
                toolsMode: {},
                disabledTools: {},
            },
            skills: {
                mode: 'default',
                disabledSkills: [],
            },
        },
        hasOverride: false,
    };
}
export function getSessionEffectiveSettings(store, availableMcpServers, sessionId) {
    const defaultSubagent = store.default?.subagentModel || { mode: 'inherit' };
    const defaultMcpIds = availableMcpServers
        .filter((s) => s.enabledByDefault)
        .map((s) => s.id);
    const defaultDisabledSkills = store.default?.skills?.disabledSkills || [];
    if (sessionId && store.sessions && store.sessions[sessionId]) {
        const s = store.sessions[sessionId];
        const subagent = s.subagentModel?.mode !== 'default' ? s.subagentModel : defaultSubagent;
        const mcpMode = s.mcp?.mode === 'custom' ? 'custom' : 'default';
        const enabledServerIds = mcpMode === 'custom'
            ? s.mcp?.enabledServerIds || []
            : (store.default?.mcp?.mode === 'custom'
                ? store.default.mcp.enabledServerIds
                : defaultMcpIds) || defaultMcpIds;
        const toolsMode = mcpMode === 'custom'
            ? s.mcp?.toolsMode || {}
            : store.default?.mcp?.toolsMode || {};
        const disabledTools = mcpMode === 'custom'
            ? s.mcp?.disabledTools || {}
            : store.default?.mcp?.disabledTools || {};
        const effectiveDisabledTools = {};
        for (const srv of availableMcpServers) {
            if (toolsMode[srv.id] === 'custom' && disabledTools[srv.id]) {
                effectiveDisabledTools[srv.id] = disabledTools[srv.id];
            }
            else {
                effectiveDisabledTools[srv.id] = srv.disabledTools || [];
            }
        }
        const skillsMode = s.skills?.mode === 'custom' ? 'custom' : 'default';
        const disabledSkills = skillsMode === 'custom'
            ? s.skills?.disabledSkills || []
            : defaultDisabledSkills;
        return {
            subagentModel: subagent,
            mcp: {
                mode: mcpMode,
                enabledServerIds,
                toolsMode,
                disabledTools,
                effectiveDisabledTools,
            },
            skills: {
                mode: skillsMode,
                disabledSkills,
                effectiveDisabledSkills: [...disabledSkills],
            },
        };
    }
    const defaultToolsMode = store.default?.mcp?.toolsMode || {};
    const defaultDisabledTools = store.default?.mcp?.disabledTools || {};
    const effectiveDisabledTools = {};
    for (const srv of availableMcpServers) {
        if (defaultToolsMode[srv.id] === 'custom' && defaultDisabledTools[srv.id]) {
            effectiveDisabledTools[srv.id] = defaultDisabledTools[srv.id];
        }
        else {
            effectiveDisabledTools[srv.id] = srv.disabledTools || [];
        }
    }
    return {
        subagentModel: defaultSubagent,
        mcp: {
            mode: 'default',
            enabledServerIds: defaultMcpIds,
            toolsMode: defaultToolsMode,
            disabledTools: defaultDisabledTools,
            effectiveDisabledTools,
        },
        skills: {
            mode: 'default',
            disabledSkills: defaultDisabledSkills,
            effectiveDisabledSkills: [...defaultDisabledSkills],
        },
    };
}
