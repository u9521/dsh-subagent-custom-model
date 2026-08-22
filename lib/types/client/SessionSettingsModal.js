import * as React from 'react';
import { IconCloseOutline16, IconCodeOutline16, IconLinkOutline16, IconCheckOutline16, IconCopyOutline16, IconBranchOutline16, IconLoadingOutline16, IconRefreshOutline16, IconSearchOutline16, IconChecklistOutline14, IconSkillOutline16, } from '@deepseek-ai/dsh-client-ui-primitives';
import { parseToolParameters, } from './types.js';
import { getLocalSessionSettingsStore, saveLocalSessionSettingsStore, getLocalMcpServers, saveLocalMcpServers, getSessionRawSettings, getSessionEffectiveSettings, } from './storage.js';
import { getSkillSourceMeta } from './SkillsSettingsTab.js';
const e = React.createElement;
function capitalize(s) {
    if (!s)
        return '';
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
function effortLabel(t, effortId) {
    const key = `sessionSettings.field.reasoning${capitalize(effortId)}`;
    const translated = t(key);
    return translated && !translated.startsWith('sessionSettings.field.')
        ? translated
        : effortId;
}
export function SessionSettingsModal({ api, t, sessionId, sessionTitle, useSessions, onClose, onSave, }) {
    const localStore = getLocalSessionSettingsStore();
    const localServers = getLocalMcpServers();
    const initialRaw = getSessionRawSettings(localStore, sessionId);
    const initialEffective = getSessionEffectiveSettings(localStore, localServers, sessionId);
    const [activeTab, setActiveTab] = React.useState('model');
    const [saving, setSaving] = React.useState(false);
    const [savingDefault, setSavingDefault] = React.useState(false);
    const [saveSuccessMsg, setSaveSuccessMsg] = React.useState('');
    const [error, setError] = React.useState('');
    const [copiedId, setCopiedId] = React.useState(false);
    // Clone Preset panel state
    const [cloneOpen, setCloneOpen] = React.useState(false);
    const [selectedSourceSessionId, setSelectedSourceSessionId] = React.useState('');
    const [manualSourceSessionId, setManualSourceSessionId] = React.useState('');
    const [cloning, setCloning] = React.useState(false);
    const [cloneError, setCloneError] = React.useState('');
    const [providers, setProviders] = React.useState([]);
    const [availableMcpServers, setAvailableMcpServers] = React.useState(localServers);
    const [availableSkills, setAvailableSkills] = React.useState([]);
    // Current session form state
    const [modelConfig, setModelConfig] = React.useState(sessionId
        ? initialRaw.config.subagentModel
        : initialEffective.subagentModel);
    const [mcpConfig, setMcpConfig] = React.useState(sessionId ? initialRaw.config.mcp : initialEffective.mcp);
    const [skillsConfig, setSkillsConfig] = React.useState(sessionId ? initialRaw.config.skills : initialEffective.skills);
    // Skills Tab UI State
    const [skillsSearch, setSkillsSearch] = React.useState('');
    const [sessionSkillModalTarget, setSessionSkillModalTarget] = React.useState(null);
    const [skillsContentMap, setSkillsContentMap] = React.useState({});
    const [skillsLoadingMap, setSkillsLoadingMap] = React.useState({});
    const [refreshingSkills, setRefreshingSkills] = React.useState(false);
    // Session Tools Modal State
    const [sessionToolsModalServer, setSessionToolsModalServer] = React.useState(null);
    const [sessionToolsMode, setSessionToolsMode] = React.useState('default');
    const [sessionDisabledToolsSet, setSessionDisabledToolsSet] = React.useState(new Set());
    const [sessionToolsSearch, setSessionToolsSearch] = React.useState('');
    const [sessionToolsExpandedSchemas, setSessionToolsExpandedSchemas] = React.useState(new Set());
    const [sessionToolSchemaModes, setSessionToolSchemaModes] = React.useState({});
    const [sessionToolsFetching, setSessionToolsFetching] = React.useState(false);
    const [sessionToolsList, setSessionToolsList] = React.useState([]);
    const [defaultSettings, setDefaultSettings] = React.useState(localStore.default || {
        subagentModel: { mode: 'inherit' },
        mcp: { mode: 'default', enabledServerIds: [] },
        skills: { mode: 'default', disabledSkills: [] },
    });
    const [hasSessionOverride, setHasSessionOverride] = React.useState(initialRaw.hasOverride);
    const apiRef = React.useRef(api);
    apiRef.current = api;
    // Read all available sessions from useSessions hook if provided
    const sessionsMap = typeof useSessions === 'function'
        ? useSessions((s) => s?.byId || {})
        : {};
    const otherSessionList = React.useMemo(() => {
        return Object.entries(sessionsMap)
            .filter(([id]) => id !== sessionId)
            .map(([id, s]) => ({
            id,
            title: s?.title || s?.header?.title || id,
        }));
    }, [sessionsMap, sessionId]);
    // Fetch models, mcp servers, and server-side config on mount or sessionId change
    React.useEffect(() => {
        let mounted = true;
        const curStore = getLocalSessionSettingsStore();
        const curServers = getLocalMcpServers();
        const curRaw = getSessionRawSettings(curStore, sessionId);
        const curEffective = getSessionEffectiveSettings(curStore, curServers, sessionId);
        setModelConfig(sessionId ? curRaw.config.subagentModel : curEffective.subagentModel);
        setMcpConfig(sessionId ? curRaw.config.mcp : curEffective.mcp);
        setSkillsConfig(sessionId ? curRaw.config.skills : curEffective.skills);
        setDefaultSettings(curStore.default);
        setHasSessionOverride(curRaw.hasOverride);
        setSaveSuccessMsg('');
        setError('');
        async function loadData() {
            try {
                // 1. Fetch available LLM models from DSH API
                try {
                    const clientApi = apiRef.current;
                    if (clientApi?.llm?.models) {
                        const modelsRes = await clientApi.llm.models({});
                        if (mounted &&
                            modelsRes?.result?.ok &&
                            modelsRes.result.value?.groups) {
                            setProviders(modelsRes.result.value.groups);
                        }
                    }
                }
                catch { }
                // 2. Fetch session settings & MCP list from backend
                try {
                    const url = sessionId
                        ? `/api/session-settings?sessionId=${encodeURIComponent(sessionId)}`
                        : '/api/session-settings';
                    const res = await fetch(url);
                    if (res.ok) {
                        const data = await res.json();
                        if (mounted && data?.ok) {
                            const freshStore = getLocalSessionSettingsStore();
                            if (data.defaultConfig) {
                                freshStore.default = data.defaultConfig;
                                setDefaultSettings(data.defaultConfig);
                                if (!sessionId) {
                                    setModelConfig(data.defaultConfig.subagentModel);
                                    setMcpConfig(data.defaultConfig.mcp);
                                    setSkillsConfig(data.defaultConfig.skills);
                                }
                            }
                            if (Array.isArray(data.availableMcpServers)) {
                                setAvailableMcpServers(data.availableMcpServers);
                                saveLocalMcpServers(data.availableMcpServers);
                            }
                            if (Array.isArray(data.availableSkills)) {
                                setAvailableSkills(data.availableSkills);
                            }
                            if (sessionId && data.config) {
                                freshStore.sessions[sessionId] = data.config;
                                setModelConfig(data.config.subagentModel || { mode: 'default' });
                                setMcpConfig(data.config.mcp || { mode: 'default', enabledServerIds: [] });
                                setSkillsConfig(data.config.skills || { mode: 'default', disabledSkills: [] });
                                setHasSessionOverride(Boolean(data.hasSessionOverride));
                            }
                            saveLocalSessionSettingsStore(freshStore);
                        }
                    }
                }
                catch { }
            }
            catch (err) {
                if (mounted)
                    setError(err?.message || String(err));
            }
        }
        loadData();
        return () => {
            mounted = false;
        };
    }, [sessionId]);
    // --- Copy Session ID ---
    const handleCopySessionId = async () => {
        if (!sessionId)
            return;
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(sessionId);
            }
            else {
                const textarea = document.createElement('textarea');
                textarea.value = sessionId;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                textarea.remove();
            }
            setCopiedId(true);
            setTimeout(() => setCopiedId(false), 2000);
        }
        catch { }
    };
    // --- Clone Preset Handlers ---
    const handleClonePreset = async () => {
        const targetSourceId = (manualSourceSessionId.trim() || selectedSourceSessionId).trim();
        if (!targetSourceId) {
            setCloneError(t('sessionSettings.clone.error'));
            return;
        }
        setCloning(true);
        setCloneError('');
        try {
            const res = await fetch(`/api/session-settings?sessionId=${encodeURIComponent(targetSourceId)}`);
            if (!res.ok) {
                setCloneError(t('sessionSettings.clone.error'));
                return;
            }
            const data = await res.json();
            if (data && data.ok) {
                const sourceConfig = data.config?.subagentModel?.mode !== 'default' ||
                    data.config?.mcp?.mode !== 'default' ||
                    data.config?.skills?.mode !== 'default'
                    ? data.config
                    : data.effectiveConfig;
                if (sourceConfig.subagentModel) {
                    setModelConfig(sourceConfig.subagentModel);
                }
                if (sourceConfig.mcp) {
                    setMcpConfig(sourceConfig.mcp);
                }
                if (sourceConfig.skills) {
                    setSkillsConfig(sourceConfig.skills);
                }
                const sourceTitle = sessionsMap[targetSourceId]?.title ||
                    sessionsMap[targetSourceId]?.header?.title ||
                    targetSourceId;
                setCloneOpen(false);
                setSaveSuccessMsg(t('sessionSettings.clone.success', { name: sourceTitle }));
            }
            else {
                setCloneError(t('sessionSettings.clone.error'));
            }
        }
        catch (err) {
            setCloneError(t('sessionSettings.clone.error') + ': ' + (err?.message || String(err)));
        }
        finally {
            setCloning(false);
        }
    };
    // --- Subagent Model Handlers ---
    const handleModelModeChange = (mode) => {
        setSaveSuccessMsg('');
        setError('');
        if (mode === 'custom' && !modelConfig.provider && providers.length > 0) {
            const firstGroup = providers[0];
            const firstModel = firstGroup.models?.[0]?.id || '';
            setModelConfig({
                mode: 'custom',
                provider: firstGroup.id,
                model: firstModel,
                reasoningEffort: undefined,
            });
        }
        else {
            setModelConfig({
                ...modelConfig,
                mode,
            });
        }
    };
    const handleProviderChange = (providerId) => {
        setSaveSuccessMsg('');
        setError('');
        const group = providers.find((g) => g.id === providerId);
        const firstModel = group?.models?.[0]?.id || '';
        setModelConfig({
            ...modelConfig,
            provider: providerId,
            model: firstModel,
            reasoningEffort: undefined,
        });
    };
    const handleModelSelectChange = (modelId) => {
        setSaveSuccessMsg('');
        setError('');
        const currentGroup = providers.find((g) => g.id === modelConfig.provider);
        const selectedModel = currentGroup?.models?.find((m) => m.id === modelId);
        const supportedEfforts = selectedModel?.reasoning?.efforts || [];
        const isEffortValid = modelConfig.reasoningEffort &&
            supportedEfforts.some((e) => e.id === modelConfig.reasoningEffort);
        setModelConfig({
            ...modelConfig,
            model: modelId,
            reasoningEffort: isEffortValid ? modelConfig.reasoningEffort : undefined,
        });
    };
    const handleReasoningEffortChange = (effortId) => {
        setSaveSuccessMsg('');
        setError('');
        setModelConfig({
            ...modelConfig,
            reasoningEffort: effortId.trim() ? effortId.trim() : undefined,
        });
    };
    // --- MCP Handlers ---
    const handleMcpModeChange = (mode) => {
        setSaveSuccessMsg('');
        setError('');
        if (mode === 'custom' &&
            (!mcpConfig.enabledServerIds || mcpConfig.enabledServerIds.length === 0)) {
            const initialIds = availableMcpServers
                .filter((s) => s.enabledByDefault)
                .map((s) => s.id);
            setMcpConfig({
                mode: 'custom',
                enabledServerIds: initialIds,
            });
        }
        else {
            setMcpConfig({
                ...mcpConfig,
                mode,
            });
        }
    };
    const handleToggleMcpServer = (serverId) => {
        setSaveSuccessMsg('');
        setError('');
        const currentIds = mcpConfig.enabledServerIds || [];
        const nextIds = currentIds.includes(serverId)
            ? currentIds.filter((id) => id !== serverId)
            : [...currentIds, serverId];
        setMcpConfig({
            ...mcpConfig,
            mode: 'custom',
            enabledServerIds: nextIds,
        });
    };
    const handleSelectAllMcp = () => {
        setMcpConfig({
            mode: 'custom',
            enabledServerIds: availableMcpServers.map((s) => s.id),
        });
    };
    const handleDeselectAllMcp = () => {
        setMcpConfig({
            mode: 'custom',
            enabledServerIds: [],
        });
    };
    const isAllMcpSelected = availableMcpServers.length > 0 &&
        (mcpConfig.mode === 'custom' || !sessionId
            ? availableMcpServers.every((s) => (mcpConfig.enabledServerIds || []).includes(s.id))
            : availableMcpServers.every((s) => s.enabledByDefault));
    const handleToggleSelectAllMcp = () => {
        if (isAllMcpSelected) {
            handleDeselectAllMcp();
        }
        else {
            handleSelectAllMcp();
        }
    };
    // --- Session Tools Handlers ---
    const handleOpenSessionToolsModal = async (server) => {
        setSessionToolsModalServer(server);
        const currentToolsMode = mcpConfig.toolsMode?.[server.id] || 'default';
        setSessionToolsMode(currentToolsMode);
        if (currentToolsMode === 'custom') {
            setSessionDisabledToolsSet(new Set(mcpConfig.disabledTools?.[server.id] || []));
        }
        else {
            setSessionDisabledToolsSet(new Set(server.disabledTools || []));
        }
        setSessionToolsSearch('');
        setSessionToolsExpandedSchemas(new Set());
        setSessionToolSchemaModes({});
        let tools = [];
        if (server.toolDetails && server.toolDetails.length > 0) {
            tools = server.toolDetails;
        }
        else if (server.tools && server.tools.length > 0) {
            tools = server.tools.map((name) => ({ name }));
        }
        setSessionToolsList(tools);
        if (tools.length === 0) {
            setSessionToolsFetching(true);
            try {
                const res = await fetch(`/api/mcp-servers?action=tools&id=${encodeURIComponent(server.id)}`, { method: 'POST' });
                const data = await res.json();
                if (data.ok && (data.toolDetails || data.tools)) {
                    const fetchedTools = data.toolDetails ||
                        (data.tools || []).map((name) => ({ name }));
                    setSessionToolsList(fetchedTools);
                    setAvailableMcpServers((prev) => prev.map((s) => s.id === server.id
                        ? { ...s, tools: data.tools, toolDetails: data.toolDetails }
                        : s));
                }
            }
            catch { }
            setSessionToolsFetching(false);
        }
    };
    const handleFetchSessionTools = async () => {
        if (!sessionToolsModalServer)
            return;
        setSessionToolsFetching(true);
        try {
            const res = await fetch(`/api/mcp-servers?action=tools&id=${encodeURIComponent(sessionToolsModalServer.id)}`, { method: 'POST' });
            const data = await res.json();
            if (data.ok && (data.toolDetails || data.tools)) {
                const fetchedTools = data.toolDetails ||
                    (data.tools || []).map((name) => ({ name }));
                setSessionToolsList(fetchedTools);
                setAvailableMcpServers((prev) => prev.map((s) => s.id === sessionToolsModalServer.id
                    ? { ...s, tools: data.tools, toolDetails: data.toolDetails }
                    : s));
            }
        }
        catch { }
        setSessionToolsFetching(false);
    };
    const handleToggleSessionTool = (toolName) => {
        setSessionDisabledToolsSet((prev) => {
            const next = new Set(prev);
            if (next.has(toolName)) {
                next.delete(toolName);
            }
            else {
                next.add(toolName);
            }
            return next;
        });
    };
    const handleToggleAllSessionTools = (enableAll) => {
        if (enableAll) {
            setSessionDisabledToolsSet(new Set());
        }
        else {
            setSessionDisabledToolsSet(new Set(sessionToolsList.map((t) => t.name)));
        }
    };
    const handleResetSessionToolsToDefault = () => {
        if (!sessionToolsModalServer)
            return;
        setSessionDisabledToolsSet(new Set(sessionToolsModalServer.disabledTools || []));
    };
    const handleToggleSessionSchema = (toolName) => {
        setSessionToolsExpandedSchemas((prev) => {
            const next = new Set(prev);
            if (next.has(toolName)) {
                next.delete(toolName);
            }
            else {
                next.add(toolName);
            }
            return next;
        });
    };
    const handleApplySessionTools = () => {
        if (!sessionToolsModalServer)
            return;
        const serverId = sessionToolsModalServer.id;
        const nextToolsMode = { ...(mcpConfig.toolsMode || {}) };
        const nextDisabledTools = { ...(mcpConfig.disabledTools || {}) };
        if (sessionToolsMode === 'custom') {
            nextToolsMode[serverId] = 'custom';
            nextDisabledTools[serverId] = Array.from(sessionDisabledToolsSet);
        }
        else {
            nextToolsMode[serverId] = 'default';
            delete nextDisabledTools[serverId];
        }
        const currentEnabled = mcpConfig.enabledServerIds || [];
        const nextEnabled = currentEnabled.includes(serverId)
            ? currentEnabled
            : [...currentEnabled, serverId];
        setMcpConfig({
            ...mcpConfig,
            mode: sessionId ? 'custom' : mcpConfig.mode,
            enabledServerIds: nextEnabled,
            toolsMode: nextToolsMode,
            disabledTools: nextDisabledTools,
        });
        setSessionToolsModalServer(null);
    };
    // --- Skills Handlers ---
    const defaultDisabledModelSkills = defaultSettings.skills?.disabledModelSkills ||
        defaultSettings.skills?.disabledSkills ||
        [];
    const defaultDisabledUserSkills = defaultSettings.skills?.disabledUserSkills || [];
    const effectiveDisabledModelList = skillsConfig.mode === 'custom'
        ? skillsConfig.disabledModelSkills || skillsConfig.disabledSkills || []
        : defaultDisabledModelSkills;
    const effectiveDisabledUserList = skillsConfig.mode === 'custom'
        ? skillsConfig.disabledUserSkills || []
        : defaultDisabledUserSkills;
    const effectiveDisabledModelSet = new Set(effectiveDisabledModelList);
    const effectiveDisabledUserSet = new Set(effectiveDisabledUserList);
    const effectiveActiveSkillsCount = availableSkills.filter((s) => !effectiveDisabledModelSet.has(s.name)).length;
    const handleSkillsModeChange = (mode) => {
        setSaveSuccessMsg('');
        setError('');
        if (mode === 'custom') {
            setSkillsConfig({
                mode: 'custom',
                disabledSkills: [...effectiveDisabledModelList],
                disabledModelSkills: [...effectiveDisabledModelList],
                disabledUserSkills: [...effectiveDisabledUserList],
            });
        }
        else {
            setSkillsConfig({
                ...skillsConfig,
                mode,
            });
        }
    };
    const handleToggleModelInvocable = (skillName) => {
        setSaveSuccessMsg('');
        setError('');
        const curModel = skillsConfig.mode === 'custom'
            ? skillsConfig.disabledModelSkills || skillsConfig.disabledSkills || []
            : defaultDisabledModelSkills;
        const curUser = skillsConfig.mode === 'custom'
            ? skillsConfig.disabledUserSkills || []
            : defaultDisabledUserSkills;
        const nextModel = curModel.includes(skillName)
            ? curModel.filter((n) => n !== skillName)
            : [...curModel, skillName];
        setSkillsConfig({
            mode: 'custom',
            disabledSkills: nextModel,
            disabledModelSkills: nextModel,
            disabledUserSkills: curUser,
        });
    };
    const handleToggleUserInvocable = (skillName) => {
        setSaveSuccessMsg('');
        setError('');
        const curModel = skillsConfig.mode === 'custom'
            ? skillsConfig.disabledModelSkills || skillsConfig.disabledSkills || []
            : defaultDisabledModelSkills;
        const curUser = skillsConfig.mode === 'custom'
            ? skillsConfig.disabledUserSkills || []
            : defaultDisabledUserSkills;
        const nextUser = curUser.includes(skillName)
            ? curUser.filter((n) => n !== skillName)
            : [...curUser, skillName];
        setSkillsConfig({
            mode: 'custom',
            disabledSkills: curModel,
            disabledModelSkills: curModel,
            disabledUserSkills: nextUser,
        });
    };
    const handleOpenSessionSkillModal = async (skill) => {
        setSessionSkillModalTarget(skill);
        const skillName = skill.name;
        if (!skillsContentMap[skillName] && !skill.content) {
            setSkillsLoadingMap((prev) => ({ ...prev, [skillName]: true }));
            try {
                const url = sessionId
                    ? `/api/session-settings/skills/content?name=${encodeURIComponent(skillName)}&sessionId=${encodeURIComponent(sessionId)}`
                    : `/api/session-settings/skills/content?name=${encodeURIComponent(skillName)}`;
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    if (data?.ok && data.skill) {
                        setSkillsContentMap((prev) => ({
                            ...prev,
                            [skillName]: data.skill,
                        }));
                    }
                    else {
                        setSkillsContentMap((prev) => ({
                            ...prev,
                            [skillName]: {
                                ...skill,
                                content: '（暂未获取到该技能的详细指令内容）',
                            },
                        }));
                    }
                }
                else {
                    setSkillsContentMap((prev) => ({
                        ...prev,
                        [skillName]: {
                            ...skill,
                            content: '（加载技能详细指令失败）',
                        },
                    }));
                }
            }
            catch (err) {
                setSkillsContentMap((prev) => ({
                    ...prev,
                    [skillName]: {
                        ...skill,
                        content: `（加载出错: ${err?.message || String(err)}）`,
                    },
                }));
            }
            finally {
                setSkillsLoadingMap((prev) => ({ ...prev, [skillName]: false }));
            }
        }
    };
    const handleRefreshSkills = async () => {
        setRefreshingSkills(true);
        try {
            const url = sessionId
                ? `/api/session-settings?sessionId=${encodeURIComponent(sessionId)}`
                : '/api/session-settings';
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                if (data?.ok && Array.isArray(data.availableSkills)) {
                    setAvailableSkills(data.availableSkills);
                }
            }
        }
        catch { }
        setRefreshingSkills(false);
    };
    // --- Save Handlers ---
    const handleSave = async (isSaveDefault = false) => {
        if (isSaveDefault) {
            setSavingDefault(true);
        }
        else {
            setSaving(true);
        }
        setSaveSuccessMsg('');
        setError('');
        const payloadConfig = {
            subagentModel: modelConfig,
            mcp: mcpConfig,
            skills: skillsConfig,
        };
        try {
            const res = await fetch('/api/session-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    config: payloadConfig,
                    isDefault: isSaveDefault,
                }),
            });
            const data = await res.json();
            if (res.ok && data?.ok) {
                const freshStore = getLocalSessionSettingsStore();
                if (isSaveDefault) {
                    freshStore.default = payloadConfig;
                    if (sessionId)
                        delete freshStore.sessions[sessionId];
                    setDefaultSettings(payloadConfig);
                    setHasSessionOverride(false);
                    setSaveSuccessMsg(t('sessionSettings.notice.savedDefault'));
                }
                else if (sessionId) {
                    freshStore.sessions[sessionId] = payloadConfig;
                    setHasSessionOverride(payloadConfig.subagentModel.mode !== 'default' ||
                        payloadConfig.mcp.mode !== 'default' ||
                        payloadConfig.skills.mode !== 'default');
                    setSaveSuccessMsg(t('sessionSettings.notice.saved'));
                }
                saveLocalSessionSettingsStore(freshStore);
                if (onSave) {
                    onSave(payloadConfig);
                }
                setTimeout(() => setSaveSuccessMsg(''), 3000);
            }
            else {
                setError(t('sessionSettings.notice.error') + (data?.error || 'Unknown error'));
            }
        }
        catch (err) {
            setError(t('sessionSettings.notice.error') + (err?.message || String(err)));
        }
        finally {
            setSaving(false);
            setSavingDefault(false);
        }
    };
    const handleResetSession = async () => {
        if (!sessionId)
            return;
        setSaving(true);
        setSaveSuccessMsg('');
        setError('');
        try {
            const res = await fetch(`/api/session-settings?sessionId=${encodeURIComponent(sessionId)}`, { method: 'DELETE' });
            const data = await res.json();
            if (res.ok && data?.ok) {
                const freshStore = getLocalSessionSettingsStore();
                delete freshStore.sessions[sessionId];
                saveLocalSessionSettingsStore(freshStore);
                setModelConfig({ mode: 'default' });
                setMcpConfig({ mode: 'default', enabledServerIds: [] });
                setSkillsConfig({ mode: 'default', disabledSkills: [] });
                setHasSessionOverride(false);
                setSaveSuccessMsg(t('sessionSettings.notice.saved'));
                if (onSave) {
                    onSave(freshStore.default);
                }
                setTimeout(() => setSaveSuccessMsg(''), 3000);
            }
        }
        catch (err) {
            setError(err?.message || String(err));
        }
        finally {
            setSaving(false);
        }
    };
    const currentProviderGroup = providers.find((g) => g.id === modelConfig.provider);
    const currentModelItem = currentProviderGroup?.models?.find((m) => m.id === modelConfig.model);
    const availableEfforts = currentModelItem?.reasoning?.efforts || [];
    const effectiveActiveMcpCount = mcpConfig.mode === 'custom'
        ? (mcpConfig.enabledServerIds || []).length
        : availableMcpServers.filter((s) => s.enabledByDefault).length;
    return e('div', { className: 'dsh-sam-page' }, 
    // Header Row
    e('div', { className: 'dsh-sam-header' }, e('div', { className: 'dsh-sam-header-row' }, e('div', { className: 'dsh-sam-header-left' }, e('h2', { className: 'dsh-sam-title' }, t('sessionSettings.title'), sessionTitle ? ` (${sessionTitle})` : ''), sessionId
        ? e('button', {
            type: 'button',
            className: `dsh-session-id-chip ${copiedId ? 'copied' : ''}`,
            onClick: handleCopySessionId,
            title: t('sessionSettings.action.copyId'),
        }, copiedId
            ? e(IconCheckOutline16, { size: 12 })
            : e(IconCopyOutline16, { size: 12 }), e('span', null, copiedId ? t('sessionSettings.idCopied') : sessionId))
        : null), e('div', { className: 'dsh-sam-header-right' }, 
    // Clone Preset Button
    sessionId
        ? e('button', {
            type: 'button',
            className: `dsh-sam-btn secondary dsh-clone-trigger ${cloneOpen ? 'active' : ''}`,
            onClick: () => setCloneOpen(!cloneOpen),
            title: t('sessionSettings.clone.title'),
        }, e(IconBranchOutline16, {
            size: 13,
            className: 'dsh-btn-icon-left',
        }), t('sessionSettings.clone.btn'))
        : null, onClose
        ? e('button', {
            type: 'button',
            className: 'dsh-sam-close-btn',
            onClick: onClose,
            title: t('sessionSettings.action.close'),
        }, e(IconCloseOutline16, { size: 16 }))
        : null)), e('p', { className: 'dsh-sam-desc' }, t('sessionSettings.desc'))), 
    // Clone Preset Collapsible Panel
    cloneOpen
        ? e('div', { className: 'dsh-clone-panel' }, e('div', { className: 'dsh-clone-panel-header' }, e('div', { className: 'dsh-clone-title-row' }, e(IconBranchOutline16, { size: 15 }), e('span', { className: 'dsh-clone-title' }, t('sessionSettings.clone.title'))), e('button', {
            type: 'button',
            className: 'dsh-mcp-text-btn',
            onClick: () => setCloneOpen(false),
        }, t('sessionSettings.clone.cancel'))), e('p', { className: 'dsh-clone-desc' }, t('sessionSettings.clone.desc')), cloneError
            ? e('div', { className: 'dsh-sam-notice error' }, cloneError)
            : null, e('div', { className: 'dsh-clone-form' }, otherSessionList.length > 0
            ? e('div', { className: 'dsh-sam-field-group flex-1' }, e('label', { className: 'dsh-sam-field-label' }, t('sessionSettings.clone.selectLabel')), e('select', {
                className: 'dsh-sam-select',
                value: selectedSourceSessionId,
                onChange: (evt) => {
                    setSelectedSourceSessionId(evt.target.value);
                    setManualSourceSessionId('');
                },
            }, e('option', { value: '' }, t('sessionSettings.clone.selectPlaceholder')), otherSessionList.map((s) => e('option', { key: s.id, value: s.id }, `${s.title} (${s.id})`))))
            : null, e('div', { className: 'dsh-sam-field-group flex-1' }, e('label', { className: 'dsh-sam-field-label' }, t('sessionSettings.clone.manualLabel')), e('input', {
            type: 'text',
            className: 'dsh-sam-select',
            placeholder: t('sessionSettings.clone.manualPlaceholder'),
            value: manualSourceSessionId,
            onChange: (evt) => {
                setManualSourceSessionId(evt.target.value);
                setSelectedSourceSessionId('');
            },
        })), e('button', {
            type: 'button',
            className: 'dsh-sam-btn primary dsh-clone-submit-btn',
            disabled: cloning ||
                (!selectedSourceSessionId && !manualSourceSessionId.trim()),
            onClick: handleClonePreset,
        }, cloning
            ? e(IconLoadingOutline16, { size: 14, className: 'dsh-spin' })
            : null, cloning
            ? t('sessionSettings.clone.loading')
            : t('sessionSettings.clone.loadBtn'))))
        : null, 
    // Status Card
    e('div', { className: 'dsh-sam-status-card' }, e('div', { className: 'dsh-sam-status-left' }, e('span', { className: 'dsh-sam-scope-badge' }, sessionId
        ? t('sessionSettings.scope.currentSession')
        : t('sessionSettings.scope.globalDefault')), sessionId
        ? e('span', {
            className: `dsh-sam-status-badge badge-${hasSessionOverride ? 'custom' : 'default'}`,
        }, hasSessionOverride
            ? t('sessionSettings.scope.sessionCustom')
            : t('sessionSettings.scope.sessionDefault'))
        : null), e('div', { className: 'dsh-sam-status-detail' }, `模型: ${modelConfig.mode === 'custom' && modelConfig.model
        ? modelConfig.model
        : modelConfig.mode === 'inherit'
            ? t('sessionSettings.status.inherit')
            : t('sessionSettings.status.default')}  |  MCP: ${effectiveActiveMcpCount > 0
        ? t('sessionSettings.status.activeCount', {
            count: effectiveActiveMcpCount,
        })
        : t('sessionSettings.status.none')}  |  技能: ${availableSkills.length > 0
        ? t('sessionSettings.skills.activeCountBadge', {
            enabled: effectiveActiveSkillsCount,
            total: availableSkills.length,
        })
        : t('sessionSettings.status.none')}`)), 
    // Tab Navigation
    e('div', { className: 'dsh-session-tabs' }, e('button', {
        type: 'button',
        className: `dsh-session-tab ${activeTab === 'model' ? 'active' : ''}`,
        onClick: () => setActiveTab('model'),
    }, t('sessionSettings.tab.model')), e('button', {
        type: 'button',
        className: `dsh-session-tab ${activeTab === 'mcp' ? 'active' : ''}`,
        onClick: () => setActiveTab('mcp'),
    }, t('sessionSettings.tab.mcp'), effectiveActiveMcpCount > 0
        ? e('span', { className: 'dsh-tab-badge' }, effectiveActiveMcpCount)
        : null), e('button', {
        type: 'button',
        className: `dsh-session-tab ${activeTab === 'skills' ? 'active' : ''}`,
        onClick: () => setActiveTab('skills'),
    }, e(IconSkillOutline16, { size: 14, className: 'dsh-tab-icon' }), t('sessionSettings.tab.skills'), availableSkills.length > 0
        ? e('span', { className: 'dsh-tab-badge' }, `${effectiveActiveSkillsCount}/${availableSkills.length}`)
        : null)), 
    // Notice Banners
    saveSuccessMsg
        ? e('div', { className: 'dsh-sam-notice success' }, saveSuccessMsg)
        : null, error ? e('div', { className: 'dsh-sam-notice error' }, error) : null, 
    // Tab 1: Subagent Model
    activeTab === 'model'
        ? e('div', { className: 'dsh-sam-content' }, e('div', { className: 'dsh-sam-mode-list' }, sessionId
            ? e('label', {
                className: `dsh-sam-mode-item ${modelConfig.mode === 'default' ? 'selected' : ''}`,
            }, e('input', {
                type: 'radio',
                name: 'subagentModelMode',
                checked: modelConfig.mode === 'default',
                onChange: () => handleModelModeChange('default'),
            }), e('div', { className: 'dsh-sam-mode-text' }, e('div', { className: 'dsh-sam-mode-title' }, t('sessionSettings.mode.default.title')), e('div', { className: 'dsh-sam-mode-desc' }, t('sessionSettings.mode.default.desc'))))
            : null, e('label', {
            className: `dsh-sam-mode-item ${modelConfig.mode === 'inherit' ? 'selected' : ''}`,
        }, e('input', {
            type: 'radio',
            name: 'subagentModelMode',
            checked: modelConfig.mode === 'inherit',
            onChange: () => handleModelModeChange('inherit'),
        }), e('div', { className: 'dsh-sam-mode-text' }, e('div', { className: 'dsh-sam-mode-title' }, t('sessionSettings.mode.inherit.title')), e('div', { className: 'dsh-sam-mode-desc' }, t('sessionSettings.mode.inherit.desc')))), e('label', {
            className: `dsh-sam-mode-item ${modelConfig.mode === 'custom' ? 'selected' : ''}`,
        }, e('input', {
            type: 'radio',
            name: 'subagentModelMode',
            checked: modelConfig.mode === 'custom',
            onChange: () => handleModelModeChange('custom'),
        }), e('div', { className: 'dsh-sam-mode-text' }, e('div', { className: 'dsh-sam-mode-title' }, t('sessionSettings.mode.custom.title')), e('div', { className: 'dsh-sam-mode-desc' }, t('sessionSettings.mode.custom.desc'))))), modelConfig.mode === 'custom'
            ? e('div', { className: 'dsh-sam-fields-panel' }, e('div', { className: 'dsh-sam-field-group' }, e('label', { className: 'dsh-sam-field-label' }, t('sessionSettings.field.provider')), e('select', {
                className: 'dsh-sam-select',
                value: modelConfig.provider || '',
                onChange: (evt) => handleProviderChange(evt.target.value),
            }, !modelConfig.provider
                ? e('option', { value: '', disabled: true }, t('sessionSettings.field.providerPlaceholder'))
                : null, providers.map((p) => e('option', { key: p.id, value: p.id }, p.name && p.name !== p.id
                ? `${p.name} (${p.id})`
                : p.name || p.id)))), e('div', { className: 'dsh-sam-field-group' }, e('label', { className: 'dsh-sam-field-label' }, t('sessionSettings.field.model')), e('select', {
                className: 'dsh-sam-select',
                value: modelConfig.model || '',
                disabled: !modelConfig.provider ||
                    !currentProviderGroup?.models?.length,
                onChange: (evt) => handleModelSelectChange(evt.target.value),
            }, !modelConfig.model
                ? e('option', { value: '', disabled: true }, t('sessionSettings.field.modelPlaceholder'))
                : null, (currentProviderGroup?.models || []).map((m) => e('option', { key: m.id, value: m.id }, m.name || m.id)))), availableEfforts.length > 0
                ? e('div', { className: 'dsh-sam-field-group' }, e('label', { className: 'dsh-sam-field-label' }, t('sessionSettings.field.reasoningEffort')), e('select', {
                    className: 'dsh-sam-select',
                    value: modelConfig.reasoningEffort || '',
                    onChange: (evt) => handleReasoningEffortChange(evt.target.value),
                }, e('option', { value: '' }, t('sessionSettings.field.reasoningEffortDefault')), availableEfforts.map((eff) => e('option', { key: eff.id, value: eff.id }, effortLabel(t, eff.id)))))
                : null)
            : null)
        : null, 
    // Tab 2: MCP Servers
    activeTab === 'mcp'
        ? e('div', { className: 'dsh-sam-content' }, sessionId
            ? e('div', { className: 'dsh-sam-mode-list' }, e('label', {
                className: `dsh-sam-mode-item ${mcpConfig.mode === 'default' ? 'selected' : ''}`,
            }, e('input', {
                type: 'radio',
                name: 'sessionMcpMode',
                checked: mcpConfig.mode === 'default',
                onChange: () => handleMcpModeChange('default'),
            }), e('div', { className: 'dsh-sam-mode-text' }, e('div', { className: 'dsh-sam-mode-title' }, t('sessionSettings.mcpMode.default.title')), e('div', { className: 'dsh-sam-mode-desc' }, t('sessionSettings.mcpMode.default.desc')))), e('label', {
                className: `dsh-sam-mode-item ${mcpConfig.mode === 'custom' ? 'selected' : ''}`,
            }, e('input', {
                type: 'radio',
                name: 'sessionMcpMode',
                checked: mcpConfig.mode === 'custom',
                onChange: () => handleMcpModeChange('custom'),
            }), e('div', { className: 'dsh-sam-mode-text' }, e('div', { className: 'dsh-sam-mode-title' }, t('sessionSettings.mcpMode.custom.title')), e('div', { className: 'dsh-sam-mode-desc' }, t('sessionSettings.mcpMode.custom.desc')))))
            : null, availableMcpServers.length === 0
            ? e('div', { className: 'dsh-mcp-empty-card' }, e('p', { className: 'dsh-mcp-empty-text' }, t('sessionSettings.mcp.empty')))
            : e('div', { className: 'dsh-session-mcp-box' }, mcpConfig.mode === 'custom' || !sessionId
                ? e('div', { className: 'dsh-mcp-quick-bar' }, e('button', {
                    type: 'button',
                    className: `dsh-mcp-select-btn ${isAllMcpSelected ? 'active' : ''}`,
                    onClick: handleToggleSelectAllMcp,
                }, isAllMcpSelected
                    ? t('sessionSettings.mcp.deselectAll')
                    : t('sessionSettings.mcp.selectAll')))
                : null, e('div', { className: 'dsh-session-mcp-list' }, availableMcpServers.map((server) => {
                const isChecked = mcpConfig.mode === 'custom' || !sessionId
                    ? (mcpConfig.enabledServerIds || []).includes(server.id)
                    : Boolean(server.enabledByDefault);
                const isReadonly = sessionId && mcpConfig.mode === 'default';
                const protoLabel = server.transport === 'stdio'
                    ? 'STDIO'
                    : server.detectedTransport === 'sse'
                        ? 'SSE'
                        : server.detectedTransport === 'streamable-http'
                            ? 'Streamable HTTP'
                            : 'HTTP / SSE';
                const protoClass = server.transport === 'stdio'
                    ? 'stdio'
                    : server.detectedTransport === 'sse'
                        ? 'sse'
                        : server.detectedTransport === 'streamable-http'
                            ? 'streamable-http'
                            : 'streamable-http-or-sse';
                return e('div', {
                    key: server.id,
                    role: 'button',
                    tabIndex: isReadonly ? undefined : 0,
                    className: `dsh-session-mcp-item ${isChecked ? 'active' : ''} ${isReadonly ? 'readonly' : ''}`,
                    onClick: isReadonly
                        ? undefined
                        : () => handleToggleMcpServer(server.id),
                    onKeyDown: isReadonly
                        ? undefined
                        : (evt) => {
                            if (evt.key === ' ' || evt.key === 'Enter') {
                                evt.preventDefault();
                                handleToggleMcpServer(server.id);
                            }
                        },
                }, e('div', { className: 'dsh-session-mcp-info' }, e('div', { className: 'dsh-session-mcp-row1' }, e('div', { className: 'dsh-session-mcp-title-wrap' }, server.transport === 'stdio'
                    ? e(IconCodeOutline16, { size: 14 })
                    : e(IconLinkOutline16, { size: 14 }), e('span', { className: 'dsh-session-mcp-name' }, server.name), e('span', {
                    className: `dsh-mcp-proto-badge ${protoClass}`,
                }, protoLabel), server.compatibility?.status ===
                    'incompatible-2026-07-28' ||
                    server.compatibility?.canEnable === false
                    ? e('span', {
                        className: 'dsh-mcp-proto-badge incompatible',
                        title: server.compatibility.warning ||
                            t('compatibility.incompatibleDesc'),
                    }, t('compatibility.incompatibleBadge'))
                    : server.compatibility?.status ===
                        'downgrade-supported'
                        ? e('span', {
                            className: 'dsh-mcp-proto-badge downgrade',
                            title: server.compatibility.warning ||
                                t('compatibility.downgradedDesc'),
                        }, t('compatibility.downgradedBadge', {
                            version: server.compatibility
                                .negotiatedVersion || '2025-11-25',
                        }))
                        : null)), server.description
                    ? e('p', { className: 'dsh-session-mcp-desc' }, server.description)
                    : null, e('code', { className: 'dsh-session-mcp-target' }, server.transport === 'stdio'
                    ? `${server.command || ''} ${(server.args || []).join(' ')}`
                    : server.url || ''), isChecked
                    ? (() => {
                        const isCustomTools = mcpConfig.toolsMode?.[server.id] === 'custom';
                        const customDisabledCount = (mcpConfig.disabledTools?.[server.id] || []).length;
                        return e('div', { className: 'dsh-session-mcp-tools-row' }, isCustomTools
                            ? e('span', {
                                className: `dsh-session-tools-mode-badge ${customDisabledCount > 0 ? 'custom' : 'all-active'}`,
                            }, customDisabledCount > 0
                                ? t('sessionSettings.mcp.toolsModeCustomBadge', { count: customDisabledCount })
                                : t('sessionSettings.mcp.toolsAllActiveBadge'))
                            : e('span', {
                                className: 'dsh-session-tools-mode-badge default',
                            }, t('sessionSettings.mcp.toolsModeDefaultBadge')), e('button', {
                            type: 'button',
                            className: 'dsh-session-tools-btn',
                            onClick: (evt) => {
                                evt.stopPropagation();
                                handleOpenSessionToolsModal(server);
                            },
                        }, e(IconChecklistOutline14, { size: 12 }), t('sessionSettings.mcp.toolsBtn')));
                    })()
                    : null), isChecked
                    ? e('div', { className: 'dsh-session-mcp-check' }, e(IconCheckOutline16, { size: 16 }))
                    : null);
            }))))
        : null, 
    // Tab 3: Skills Management
    activeTab === 'skills'
        ? e('div', { className: 'dsh-sam-content' }, sessionId
            ? e('div', { className: 'dsh-sam-mode-list' }, e('label', {
                className: `dsh-sam-mode-item ${skillsConfig.mode === 'default' ? 'selected' : ''}`,
            }, e('input', {
                type: 'radio',
                name: 'sessionSkillsMode',
                checked: skillsConfig.mode === 'default',
                onChange: () => handleSkillsModeChange('default'),
            }), e('div', { className: 'dsh-sam-mode-text' }, e('div', { className: 'dsh-sam-mode-title' }, t('sessionSettings.skillsMode.default.title')), e('div', { className: 'dsh-sam-mode-desc' }, t('sessionSettings.skillsMode.default.desc')))), e('label', {
                className: `dsh-sam-mode-item ${skillsConfig.mode === 'custom' ? 'selected' : ''}`,
            }, e('input', {
                type: 'radio',
                name: 'sessionSkillsMode',
                checked: skillsConfig.mode === 'custom',
                onChange: () => handleSkillsModeChange('custom'),
            }), e('div', { className: 'dsh-sam-mode-text' }, e('div', { className: 'dsh-sam-mode-title' }, t('sessionSettings.skillsMode.custom.title')), e('div', { className: 'dsh-sam-mode-desc' }, t('sessionSettings.skillsMode.custom.desc')))))
            : null, availableSkills.length === 0
            ? e('div', { className: 'dsh-mcp-empty-card' }, e('p', { className: 'dsh-mcp-empty-text' }, t('sessionSettings.skills.empty')))
            : e('div', { className: 'dsh-session-skills-box' }, 
            // Toolbar with search and quick actions
            e('div', { className: 'dsh-skills-toolbar' }, e('div', { className: 'dsh-skills-search-wrap' }, e(IconSearchOutline16, {
                size: 14,
                className: 'dsh-skills-search-icon',
            }), e('input', {
                type: 'text',
                className: 'dsh-skills-search-input',
                placeholder: t('sessionSettings.skills.searchPlaceholder'),
                value: skillsSearch,
                onChange: (evt) => setSkillsSearch(evt.target.value),
            })), e('div', { className: 'dsh-skills-btn-group' }, e('button', {
                type: 'button',
                className: 'dsh-mcp-text-btn',
                disabled: refreshingSkills,
                onClick: handleRefreshSkills,
            }, refreshingSkills
                ? e(IconLoadingOutline16, {
                    size: 12,
                    className: 'dsh-spin',
                })
                : e(IconRefreshOutline16, { size: 12 }), t('sessionSettings.skills.refresh')))), 
            // Skill list
            (() => {
                const filteredSkills = availableSkills.filter((s) => {
                    if (!skillsSearch.trim())
                        return true;
                    const q = skillsSearch.trim().toLowerCase();
                    return (s.name.toLowerCase().includes(q) ||
                        (s.description || '').toLowerCase().includes(q));
                });
                if (filteredSkills.length === 0) {
                    return e('div', { className: 'dsh-mcp-empty-card' }, e('p', { className: 'dsh-mcp-empty-text' }, t('sessionSettings.skills.noMatch')));
                }
                return e('div', { className: 'dsh-session-skills-list' }, filteredSkills.map((skill) => {
                    const isModelDisabled = effectiveDisabledModelSet.has(skill.name);
                    const isUserDisabled = effectiveDisabledUserSet.has(skill.name);
                    const isRuntime = Boolean(skill.isRuntime);
                    const { sourceClass, sourceLabel } = getSkillSourceMeta(skill, t);
                    return e('div', {
                        key: skill.name,
                        className: `dsh-session-skill-item ${!isModelDisabled ? 'active' : 'disabled'}`,
                        onClick: () => handleOpenSessionSkillModal(skill),
                        style: { cursor: 'pointer' },
                    }, e('div', { className: 'dsh-session-skill-main' }, e('div', { className: 'dsh-session-skill-info' }, e('div', { className: 'dsh-session-skill-row1' }, e('div', { className: 'dsh-session-skill-title-wrap' }, e(IconSkillOutline16, { size: 14 }), e('span', { className: 'dsh-session-skill-name' }, skill.name), e('span', {
                        className: `dsh-skill-badge ${sourceClass}`,
                    }, sourceLabel), isRuntime
                        ? null
                        : e('span', {
                            className: `dsh-skill-badge ${!isModelDisabled ? 'status-enabled' : 'status-disabled'}`,
                        }, !isModelDisabled
                            ? t('sessionSettings.skills.modelInvocableEnabled') || '模型调用: 开启'
                            : t('sessionSettings.skills.modelInvocableDisabled') || '模型调用: 禁用'), isRuntime
                        ? null
                        : e('span', {
                            className: `dsh-skill-badge ${!isUserDisabled ? 'status-enabled' : 'status-disabled'}`,
                        }, !isUserDisabled
                            ? t('sessionSettings.skills.userInvocableEnabled') || '快捷指令: 开启'
                            : t('sessionSettings.skills.userInvocableDisabled') || '快捷指令: 禁用'))), skill.description
                        ? e('p', { className: 'dsh-session-skill-desc' }, skill.description)
                        : null), e('div', { className: 'dsh-skill-actions' }, e('button', {
                        type: 'button',
                        className: 'dsh-skill-config-btn',
                        onClick: (evt) => {
                            evt.stopPropagation();
                            handleOpenSessionSkillModal(skill);
                        },
                    }, t('sessionSettings.skills.openModalBtn') ||
                        '配置 / 详情'))));
                }));
            })()))
        : null, 
    // Session Skill Configuration & Details Modal
    sessionSkillModalTarget
        ? (() => {
            const modalSkill = sessionSkillModalTarget;
            const modalDetail = skillsContentMap[modalSkill.name] || modalSkill;
            const modalIsRuntime = Boolean(modalSkill.isRuntime);
            const modalIsModelDisabled = effectiveDisabledModelSet.has(modalSkill.name);
            const modalIsUserDisabled = effectiveDisabledUserSet.has(modalSkill.name);
            const modalIsLoadingContent = Boolean(skillsLoadingMap[modalSkill.name]);
            const { sourceClass: modalSourceClass, sourceLabel: modalSourceLabel, } = getSkillSourceMeta(modalSkill, t);
            const handleModalToggleModel = () => {
                if (skillsConfig.mode !== 'custom') {
                    handleSkillsModeChange('custom');
                }
                handleToggleModelInvocable(modalSkill.name);
            };
            const handleModalToggleUser = () => {
                if (skillsConfig.mode !== 'custom') {
                    handleSkillsModeChange('custom');
                }
                handleToggleUserInvocable(modalSkill.name);
            };
            return e('div', {
                className: 'dsh-sam-modal-overlay',
                onClick: (evt) => {
                    if (evt.target === evt.currentTarget) {
                        setSessionSkillModalTarget(null);
                    }
                },
            }, e('div', { className: 'dsh-sam-modal-panel dsh-skill-modal' }, 
            // Modal Header
            e('div', { className: 'dsh-sam-header-row' }, e('div', { className: 'dsh-mcp-tools-header-info' }, e('h3', {
                className: 'dsh-sam-title',
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                },
            }, e(IconSkillOutline16, { size: 18 }), modalSkill.name), e('div', { className: 'dsh-skill-modal-header-meta' }, e('span', { className: `dsh-skill-badge ${modalSourceClass}` }, modalSourceLabel), !modalIsRuntime
                ? e('span', {
                    className: `dsh-skill-badge ${!modalIsModelDisabled ? 'status-enabled' : 'status-disabled'}`,
                }, !modalIsModelDisabled
                    ? t('sessionSettings.skills.modelInvocableEnabled') || '模型调用: 开启'
                    : t('sessionSettings.skills.modelInvocableDisabled') || '模型调用: 禁用')
                : null, !modalIsRuntime
                ? e('span', {
                    className: `dsh-skill-badge ${!modalIsUserDisabled ? 'status-enabled' : 'status-disabled'}`,
                }, !modalIsUserDisabled
                    ? t('sessionSettings.skills.userInvocableEnabled') || '快捷指令: 开启'
                    : t('sessionSettings.skills.userInvocableDisabled') || '快捷指令: 禁用')
                : null)), e('button', {
                type: 'button',
                className: 'dsh-sam-close-btn',
                onClick: () => setSessionSkillModalTarget(null),
            }, e(IconCloseOutline16, { size: 16 }))), 
            // Modal Body
            e('div', { className: 'dsh-skill-modal-body' }, 
            // Description
            modalSkill.description
                ? e('p', { className: 'dsh-skill-modal-desc' }, modalSkill.description)
                : null, 
            // Runtime Note
            modalIsRuntime
                ? e('div', { className: 'dsh-skill-runtime-note' }, t('sessionSettings.skills.runtimeNotice'))
                : null, 
            // Path & When to use
            modalDetail.path
                ? e('div', { className: 'dsh-skill-detail-meta' }, e('span', null, t('sessionSettings.skills.pathLabel'), e('code', { className: 'dsh-skill-detail-path' }, modalDetail.path)))
                : null, modalDetail.whenToUse
                ? e('div', { className: 'dsh-skill-detail-meta' }, e('span', null, t('sessionSettings.skills.whenToUseLabel'), modalDetail.whenToUse))
                : null, 
            // Section 1: Invocation Permissions
            e('div', { className: 'dsh-skill-modal-section' }, e('h4', { className: 'dsh-skill-modal-section-title' }, t('sessionSettings.skills.rulesSectionTitle') ||
                '调用权限管控'), e('div', {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                },
            }, 
            // Switch 1: Model Invocable
            e('div', {
                className: `dsh-mcp-switch-card mini ${!modalIsModelDisabled ? 'active' : ''}`,
                onClick: handleModalToggleModel,
                style: { cursor: 'pointer' },
            }, e('div', { className: 'dsh-mcp-switch-text' }, e('span', { className: 'dsh-mcp-switch-title' }, t('sessionSettings.skills.modelInvocableTitle')), e('span', { className: 'dsh-mcp-switch-desc' }, t('sessionSettings.skills.modelInvocableDesc'))), e('div', {
                className: `dsh-mcp-switch-btn ${!modalIsModelDisabled ? 'active' : ''}`,
            }, e('span', { className: 'dsh-mcp-switch-thumb' }))), 
            // Switch 2: User Invocable
            e('div', {
                className: `dsh-mcp-switch-card mini ${!modalIsUserDisabled ? 'active' : ''}`,
                onClick: handleModalToggleUser,
                style: { cursor: 'pointer' },
            }, e('div', { className: 'dsh-mcp-switch-text' }, e('span', { className: 'dsh-mcp-switch-title' }, t('sessionSettings.skills.userInvocableTitle')), e('span', { className: 'dsh-mcp-switch-desc' }, t('sessionSettings.skills.userInvocableDesc'))), e('div', {
                className: `dsh-mcp-switch-btn ${!modalIsUserDisabled ? 'active' : ''}`,
            }, e('span', { className: 'dsh-mcp-switch-thumb' }))))), 
            // Section 2: Instructions & Rules
            e('div', { className: 'dsh-skill-modal-section' }, e('h4', { className: 'dsh-skill-modal-section-title' }, t('sessionSettings.skills.instructionsSectionTitle') ||
                '指令与规则'), modalIsLoadingContent
                ? e('div', { className: 'dsh-sam-notice info' }, t('sessionSettings.skills.loadingContent'))
                : e('pre', { className: 'dsh-skill-content-block' }, modalDetail.content ||
                    t('sessionSettings.skills.noInstructions')))), 
            // Modal Footer
            e('div', { className: 'dsh-sam-actions dsh-mcp-modal-footer' }, e('div', { className: 'dsh-mcp-modal-footer-left' }), e('div', { className: 'dsh-mcp-modal-footer-right' }, e('button', {
                type: 'button',
                className: 'dsh-sam-btn primary',
                onClick: () => setSessionSkillModalTarget(null),
            }, t('sessionSettings.skills.modalDoneBtn') || '完成')))));
        })()
        : null, 
    // Session Tools Configuration Modal
    sessionToolsModalServer
        ? e('div', {
            className: 'dsh-sam-modal-overlay',
            onClick: (evt) => {
                if (evt.target === evt.currentTarget) {
                    setSessionToolsModalServer(null);
                }
            },
        }, e('div', { className: 'dsh-sam-modal-panel dsh-mcp-tools-modal' }, 
        // Modal Header
        e('div', { className: 'dsh-sam-header-row' }, e('div', { className: 'dsh-mcp-tools-header-info' }, e('h3', { className: 'dsh-sam-title' }, `${sessionToolsModalServer.name} - ${t('sessionSettings.toolsModal.title')}`), e('div', { className: 'dsh-mcp-tools-header-meta' }, e('span', {
            className: `dsh-mcp-proto-badge ${sessionToolsModalServer.transport}`,
        }, sessionToolsModalServer.transport === 'stdio'
            ? 'STDIO'
            : sessionToolsModalServer.detectedTransport === 'sse'
                ? 'SSE'
                : sessionToolsModalServer.detectedTransport ===
                    'streamable-http'
                    ? 'Streamable HTTP'
                    : 'HTTP / SSE'), sessionToolsList.length > 0
            ? e('span', { className: 'dsh-mcp-count-badge' }, `${sessionToolsList.length} 工具`)
            : null)), e('button', {
            type: 'button',
            className: 'dsh-sam-close-btn',
            onClick: () => setSessionToolsModalServer(null),
        }, e(IconCloseOutline16, { size: 16 }))), e('p', { className: 'dsh-sam-desc', style: { marginBottom: 12 } }, t('sessionSettings.toolsModal.desc')), 
        // Mode Selector: Follow Global Default vs Customize for Session
        e('div', { className: 'dsh-session-tools-modes' }, e('label', {
            className: `dsh-sam-mode-item ${sessionToolsMode === 'default' ? 'selected' : ''}`,
            onClick: () => {
                setSessionToolsMode('default');
                setSessionDisabledToolsSet(new Set(sessionToolsModalServer.disabledTools || []));
            },
        }, e('input', {
            type: 'radio',
            name: 'sessionToolsMode',
            value: 'default',
            checked: sessionToolsMode === 'default',
            onChange: () => {
                setSessionToolsMode('default');
                setSessionDisabledToolsSet(new Set(sessionToolsModalServer.disabledTools || []));
            },
            className: 'dsh-sam-radio',
        }), e('div', { className: 'dsh-sam-mode-text' }, e('div', { className: 'dsh-sam-mode-title' }, t('sessionSettings.toolsModal.modeDefaultTitle')), e('div', { className: 'dsh-sam-mode-desc' }, t('sessionSettings.toolsModal.modeDefaultDesc', {
            count: (sessionToolsModalServer.disabledTools || [])
                .length,
        })))), e('label', {
            className: `dsh-sam-mode-item ${sessionToolsMode === 'custom' ? 'selected' : ''}`,
            onClick: () => setSessionToolsMode('custom'),
        }, e('input', {
            type: 'radio',
            name: 'sessionToolsMode',
            value: 'custom',
            checked: sessionToolsMode === 'custom',
            onChange: () => setSessionToolsMode('custom'),
            className: 'dsh-sam-radio',
        }), e('div', { className: 'dsh-sam-mode-text' }, e('div', { className: 'dsh-sam-mode-title' }, t('sessionSettings.toolsModal.modeCustomTitle')), e('div', { className: 'dsh-sam-mode-desc' }, t('sessionSettings.toolsModal.modeCustomDesc'))))), 
        // Toolbar: Search + Quick Enable/Disable buttons
        e('div', { className: 'dsh-mcp-tools-toolbar' }, e('div', { className: 'dsh-mcp-search-wrap dsh-mcp-tools-search-box' }, e(IconSearchOutline16, {
            size: 14,
            className: 'dsh-mcp-search-icon',
        }), e('input', {
            type: 'text',
            className: 'dsh-sam-input dsh-mcp-search-input',
            placeholder: t('sessionSettings.toolsModal.searchPlaceholder'),
            value: sessionToolsSearch,
            onChange: (evt) => setSessionToolsSearch(evt.target.value),
        })), sessionToolsMode === 'custom'
            ? e('div', { className: 'dsh-mcp-tools-toolbar-actions' }, e('button', {
                type: 'button',
                className: 'dsh-sam-btn secondary',
                onClick: () => handleToggleAllSessionTools(true),
            }, t('sessionSettings.toolsModal.enableAll')), e('button', {
                type: 'button',
                className: 'dsh-sam-btn secondary',
                onClick: () => handleToggleAllSessionTools(false),
            }, t('sessionSettings.toolsModal.disableAll')), e('button', {
                type: 'button',
                className: 'dsh-sam-btn secondary',
                onClick: handleResetSessionToolsToDefault,
            }, t('sessionSettings.toolsModal.resetToDefault')))
            : null), 
        // Tools List / Loading / Empty
        sessionToolsFetching
            ? e('div', { className: 'dsh-sam-loading', style: { padding: 24 } }, t('sessionSettings.toolsModal.fetchingTools'))
            : sessionToolsList.length === 0
                ? e('div', {
                    className: 'dsh-mcp-empty-card',
                    style: { padding: '24px 16px' },
                }, e('p', { className: 'dsh-mcp-empty-text' }, t('sessionSettings.toolsModal.noToolsAvailable')), e('button', {
                    type: 'button',
                    className: 'dsh-sam-btn secondary',
                    onClick: handleFetchSessionTools,
                }, e(IconRefreshOutline16, { size: 14 }), t('sessionSettings.toolsModal.fetchToolsBtn')))
                : e('div', { className: 'dsh-mcp-tools-list' }, sessionToolsList
                    .filter((tool) => {
                    const term = sessionToolsSearch.trim().toLowerCase();
                    if (!term)
                        return true;
                    return (tool.name.toLowerCase().includes(term) ||
                        (tool.description || '').toLowerCase().includes(term));
                })
                    .map((tool) => {
                    const isGloballyDisabled = Boolean(sessionToolsModalServer.disabledTools?.includes(tool.name));
                    const isCustomDisabled = sessionDisabledToolsSet.has(tool.name);
                    const isDisabled = sessionToolsMode === 'custom'
                        ? isCustomDisabled
                        : isGloballyDisabled;
                    const isSchemaExpanded = sessionToolsExpandedSchemas.has(tool.name);
                    const hasSchema = Boolean(tool.inputSchema &&
                        typeof tool.inputSchema === 'object' &&
                        tool.inputSchema.properties &&
                        Object.keys(tool.inputSchema.properties).length > 0);
                    return e('div', {
                        key: tool.name,
                        className: `dsh-mcp-tool-card ${isDisabled ? 'disabled' : ''}`,
                    }, e('div', { className: 'dsh-mcp-tool-card-main' }, e('div', { className: 'dsh-mcp-tool-card-left' }, sessionToolsMode === 'custom'
                        ? e('button', {
                            type: 'button',
                            role: 'switch',
                            'aria-checked': !isDisabled,
                            className: `dsh-mcp-switch-btn ${!isDisabled ? 'active' : ''}`,
                            onClick: () => handleToggleSessionTool(tool.name),
                        }, e('span', {
                            className: 'dsh-mcp-switch-thumb',
                        }))
                        : e('div', {
                            className: `dsh-mcp-switch-btn ${!isDisabled ? 'active' : ''}`,
                            style: {
                                opacity: 0.6,
                                cursor: 'default',
                            },
                        }, e('span', {
                            className: 'dsh-mcp-switch-thumb',
                        })), e('div', { className: 'dsh-mcp-tool-info' }, e('div', { className: 'dsh-mcp-tool-title-row' }, e('span', { className: 'dsh-mcp-tool-name' }, tool.name), sessionToolsMode === 'custom'
                        ? isCustomDisabled
                            ? e('span', {
                                className: 'dsh-mcp-tool-status-pill disabled',
                            }, t('sessionSettings.toolsModal.toolCustomDisabledBadge'))
                            : e('span', {
                                className: 'dsh-mcp-tool-status-pill active',
                            }, t('sessionSettings.toolsModal.toolEnabled'))
                        : isGloballyDisabled
                            ? e('span', {
                                className: 'dsh-mcp-tool-status-pill disabled',
                            }, t('sessionSettings.toolsModal.toolGlobalDisabledBadge'))
                            : e('span', {
                                className: 'dsh-mcp-tool-status-pill active',
                            }, t('sessionSettings.toolsModal.toolEnabled'))), e('p', { className: 'dsh-mcp-tool-desc' }, tool.description ||
                        t('sessionSettings.toolsModal.noDesc')))), e('div', { className: 'dsh-mcp-tool-card-right' }, hasSchema
                        ? e('button', {
                            type: 'button',
                            className: `dsh-mcp-tool-schema-btn ${isSchemaExpanded ? 'active' : ''}`,
                            onClick: () => handleToggleSessionSchema(tool.name),
                        }, e(IconCodeOutline16, { size: 12 }), isSchemaExpanded
                            ? t('sessionSettings.toolsModal.hideParameters')
                            : t('sessionSettings.toolsModal.parameters'))
                        : null)), 
                    // Collapsible Schema
                    isSchemaExpanded && hasSchema
                        ? (() => {
                            const params = parseToolParameters(tool.inputSchema);
                            const mode = sessionToolSchemaModes[tool.name] || 'list';
                            const requiredCount = params.filter((p) => p.required).length;
                            return e('div', { className: 'dsh-mcp-tool-expanded-box' }, e('div', {
                                className: 'dsh-mcp-tool-expanded-header',
                            }, e('span', {
                                className: 'dsh-mcp-tool-param-stats',
                            }, params.length > 0
                                ? t('sessionSettings.toolsModal.paramsCount', {
                                    total: params.length,
                                    required: requiredCount,
                                })
                                : t('sessionSettings.toolsModal.noParams')), e('div', {
                                className: 'dsh-mcp-tool-view-switch',
                            }, e('button', {
                                type: 'button',
                                className: `dsh-mcp-seg-btn ${mode === 'list' ? 'active' : ''}`,
                                onClick: (evt) => {
                                    evt.stopPropagation();
                                    setSessionToolSchemaModes((prev) => ({
                                        ...prev,
                                        [tool.name]: 'list',
                                    }));
                                },
                            }, t('sessionSettings.toolsModal.viewList')), e('button', {
                                type: 'button',
                                className: `dsh-mcp-seg-btn ${mode === 'raw' ? 'active' : ''}`,
                                onClick: (evt) => {
                                    evt.stopPropagation();
                                    setSessionToolSchemaModes((prev) => ({
                                        ...prev,
                                        [tool.name]: 'raw',
                                    }));
                                },
                            }, t('sessionSettings.toolsModal.viewRaw')))), mode === 'list'
                                ? params.length > 0
                                    ? e('div', {
                                        className: 'dsh-mcp-tool-params-list',
                                    }, params.map((param) => e('div', {
                                        key: param.name,
                                        className: 'dsh-mcp-param-row',
                                    }, e('div', {
                                        className: 'dsh-mcp-param-top',
                                    }, e('span', {
                                        className: 'dsh-mcp-param-name',
                                    }, param.name), e('span', {
                                        className: 'dsh-mcp-param-type',
                                    }, param.type), e('span', {
                                        className: `dsh-mcp-param-badge ${param.required ? 'required' : 'optional'}`,
                                    }, param.required
                                        ? t('sessionSettings.toolsModal.required')
                                        : t('sessionSettings.toolsModal.optional')), param.default !== undefined
                                        ? e('span', {
                                            className: 'dsh-mcp-param-default',
                                        }, `${t('sessionSettings.toolsModal.defaultVal')}${JSON.stringify(param.default)}`)
                                        : null), param.description
                                        ? e('p', {
                                            className: 'dsh-mcp-param-desc',
                                        }, param.description)
                                        : null)))
                                    : null
                                : e('pre', {
                                    className: 'dsh-mcp-tool-schema-preview',
                                }, JSON.stringify(tool.inputSchema, null, 2)));
                        })()
                        : null);
                })), 
        // Modal Footer Actions
        e('div', {
            className: 'dsh-sam-actions dsh-mcp-modal-footer',
            style: { marginTop: 14 },
        }, e('div', { className: 'dsh-mcp-modal-footer-left' }, sessionToolsMode === 'custom'
            ? sessionDisabledToolsSet.size > 0
                ? e('span', { className: 'dsh-mcp-proto-badge disabled-tools' }, t('sessionSettings.toolsModal.disabledCount', {
                    count: sessionDisabledToolsSet.size,
                }))
                : e('span', { className: 'dsh-mcp-proto-badge stdio' }, t('sessionSettings.toolsModal.allEnabledCount', {
                    total: sessionToolsList.length,
                }))
            : e('span', { className: 'dsh-mcp-proto-badge stdio' }, t('sessionSettings.toolsModal.modeDefaultTitle'))), e('div', { className: 'dsh-mcp-modal-footer-right' }, e('button', {
            type: 'button',
            className: 'dsh-sam-btn secondary',
            onClick: () => setSessionToolsModalServer(null),
        }, t('sessionSettings.toolsModal.cancel')), e('button', {
            type: 'button',
            className: 'dsh-sam-btn primary',
            onClick: handleApplySessionTools,
        }, t('sessionSettings.toolsModal.save'))))))
        : null, 
    // Modal Bottom Actions
    e('div', { className: 'dsh-sam-actions dsh-session-actions' }, sessionId && hasSessionOverride
        ? e('button', {
            type: 'button',
            className: 'dsh-sam-btn tertiary',
            disabled: saving || savingDefault,
            onClick: handleResetSession,
        }, t('sessionSettings.action.reset'))
        : null, sessionId
        ? e('button', {
            type: 'button',
            className: 'dsh-sam-btn default-btn',
            disabled: saving || savingDefault,
            onClick: () => handleSave(true),
        }, savingDefault
            ? t('sessionSettings.action.savingDefault')
            : t('sessionSettings.action.saveDefault'))
        : null, e('button', {
        type: 'button',
        className: 'dsh-sam-btn primary',
        disabled: saving || savingDefault,
        onClick: () => handleSave(false),
    }, saving
        ? t('sessionSettings.action.saving')
        : sessionId
            ? t('sessionSettings.action.saveSession')
            : t('sessionSettings.action.save')), onClose
        ? e('button', {
            type: 'button',
            className: 'dsh-sam-btn secondary',
            onClick: onClose,
        }, t('sessionSettings.action.close'))
        : null));
}
