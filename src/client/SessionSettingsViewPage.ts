import * as React from 'react'
import {
  IconCloseOutline16,
  IconCodeOutline16,
  IconLinkOutline16,
  IconCheckOutline16,
  IconCopyOutline16,
  IconBranchOutline16,
  IconLoadingOutline16,
  IconAgentPresetOutline16,
  IconRefreshOutline16,
  IconSearchOutline16,
  IconChecklistOutline14,
  IconSkillOutline16,
} from '@deepseek-ai/dsh-client-ui-primitives'
import {
  type ModelProviderGroup,
  type ClientPageProps,
  type GlobalMcpServerConfig,
  type SessionSettingsConfig,
  type SubagentModelConfig,
  type SessionSkillsConfig,
  type SkillItem,
  type McpDiscoveredTool,
  parseToolParameters,
} from './types.ts'
import {
  getLocalSessionSettingsStore,
  saveLocalSessionSettingsStore,
  getLocalMcpServers,
  saveLocalMcpServers,
  getSessionRawSettings,
  getSessionEffectiveSettings,
} from './storage.ts'
import { getSkillSourceMeta } from './SkillsSettingsTab.ts'

const e = React.createElement

function capitalize(s: string): string {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

function effortLabel(t: (key: string) => string, effortId: string): string {
  const key = `sessionSettings.field.reasoning${capitalize(effortId)}`
  const translated = t(key)
  return translated && !translated.startsWith('sessionSettings.field.')
    ? translated
    : effortId
}

type NavSection = 'model' | 'mcp' | 'skills'

export function SessionSettingsViewPage({
  api,
  t,
  sessionId,
  sessionTitle: _sessionTitle,
  useSessions,
  onSave,
}: ClientPageProps) {
  const localStore = getLocalSessionSettingsStore()
  const localServers = getLocalMcpServers()
  const initialRaw = getSessionRawSettings(localStore, sessionId)
  const initialEffective = getSessionEffectiveSettings(
    localStore,
    localServers,
    sessionId,
  )

  const [activeNav, setActiveNav] = React.useState<NavSection>('model')
  const [saving, setSaving] = React.useState<boolean>(false)
  const [savingDefault, setSavingDefault] = React.useState<boolean>(false)
  const [saveSuccessMsg, setSaveSuccessMsg] = React.useState<string>('')
  const [error, setError] = React.useState<string>('')
  const [copiedId, setCopiedId] = React.useState<boolean>(false)

  // Clone Preset toolbar state
  const [cloneSourceId, setCloneSourceId] = React.useState<string>('')
  const [cloning, setCloning] = React.useState<boolean>(false)
  const [cloneError, setCloneError] = React.useState<string>('')

  const [providers, setProviders] = React.useState<ModelProviderGroup[]>([])
  const [availableMcpServers, setAvailableMcpServers] =
    React.useState<GlobalMcpServerConfig[]>(localServers)
  const [availableSkills, setAvailableSkills] = React.useState<SkillItem[]>([])

  // Form state
  const [modelConfig, setModelConfig] = React.useState<SubagentModelConfig>(
    sessionId
      ? initialRaw.config.subagentModel
      : initialEffective.subagentModel,
  )
  const [mcpConfig, setMcpConfig] = React.useState<
    SessionSettingsConfig['mcp']
  >(sessionId ? initialRaw.config.mcp : initialEffective.mcp)
  const [skillsConfig, setSkillsConfig] = React.useState<SessionSkillsConfig>(
    sessionId ? initialRaw.config.skills : initialEffective.skills,
  )

  // Skills UI state
  const [skillsSearch, setSkillsSearch] = React.useState<string>('')
  const [sessionSkillModalTarget, setSessionSkillModalTarget] =
    React.useState<SkillItem | null>(null)
  const [skillsContentMap, setSkillsContentMap] = React.useState<
    Record<string, SkillItem>
  >({})
  const [skillsLoadingMap, setSkillsLoadingMap] = React.useState<
    Record<string, boolean>
  >({})
  const [refreshingSkills, setRefreshingSkills] = React.useState<boolean>(false)

  // Session Tools Modal State
  const [sessionToolsModalServer, setSessionToolsModalServer] =
    React.useState<GlobalMcpServerConfig | null>(null)
  const [sessionToolsMode, setSessionToolsMode] = React.useState<
    'default' | 'custom'
  >('default')
  const [sessionDisabledToolsSet, setSessionDisabledToolsSet] = React.useState<
    Set<string>
  >(new Set())
  const [sessionToolsSearch, setSessionToolsSearch] = React.useState<string>('')
  const [sessionToolsExpandedSchemas, setSessionToolsExpandedSchemas] =
    React.useState<Set<string>>(new Set())
  const [sessionToolSchemaModes, setSessionToolSchemaModes] = React.useState<
    Record<string, 'list' | 'raw'>
  >({})
  const [sessionToolsFetching, setSessionToolsFetching] =
    React.useState<boolean>(false)
  const [sessionToolsList, setSessionToolsList] = React.useState<
    McpDiscoveredTool[]
  >([])

  const [defaultSettings, setDefaultSettings] =
    React.useState<SessionSettingsConfig>(
      localStore.default || {
        subagentModel: { mode: 'inherit' },
        mcp: { mode: 'default', enabledServerIds: [] },
        skills: { mode: 'default', disabledSkills: [] },
      },
    )
  const [hasSessionOverride, setHasSessionOverride] = React.useState<boolean>(
    initialRaw.hasOverride,
  )

  const apiRef = React.useRef(api)
  apiRef.current = api

  const sessionsMap =
    typeof useSessions === 'function'
      ? useSessions((s: any) => s?.byId || {})
      : {}

  // Fetch models, mcp servers, and server-side config on mount or sessionId change
  React.useEffect(() => {
    let mounted = true
    const curStore = getLocalSessionSettingsStore()
    const curServers = getLocalMcpServers()
    const curRaw = getSessionRawSettings(curStore, sessionId)
    const curEffective = getSessionEffectiveSettings(
      curStore,
      curServers,
      sessionId,
    )

    setModelConfig(
      sessionId ? curRaw.config.subagentModel : curEffective.subagentModel,
    )
    setMcpConfig(sessionId ? curRaw.config.mcp : curEffective.mcp)
    setSkillsConfig(sessionId ? curRaw.config.skills : curEffective.skills)
    setDefaultSettings(curStore.default)
    setHasSessionOverride(curRaw.hasOverride)
    setSaveSuccessMsg('')
    setError('')
    setCloneError('')

    async function loadData() {
      try {
        // 1. Fetch available LLM models from DSH API
        try {
          const clientApi = apiRef.current
          if (clientApi?.llm?.models) {
            const modelsRes = await clientApi.llm.models({})
            if (
              mounted &&
              modelsRes?.result?.ok &&
              modelsRes.result.value?.groups
            ) {
              setProviders(modelsRes.result.value.groups)
            }
          }
        } catch {}

        // 2. Fetch session settings & MCP list from backend
        try {
          const url = sessionId
            ? `/api/session-settings?sessionId=${encodeURIComponent(sessionId)}`
            : '/api/session-settings'
          const res = await fetch(url)
          if (res.ok) {
            const data = await res.json()
            if (mounted && data?.ok) {
              const freshStore = getLocalSessionSettingsStore()
              if (data.defaultConfig) {
                freshStore.default = data.defaultConfig
                setDefaultSettings(data.defaultConfig)
                if (!sessionId) {
                  setModelConfig(data.defaultConfig.subagentModel)
                  setMcpConfig(data.defaultConfig.mcp)
                  setSkillsConfig(data.defaultConfig.skills)
                }
              }

              if (Array.isArray(data.availableMcpServers)) {
                setAvailableMcpServers(data.availableMcpServers)
                saveLocalMcpServers(data.availableMcpServers)
              }

              if (Array.isArray(data.availableSkills)) {
                setAvailableSkills(data.availableSkills)
              }

              if (sessionId && data.config) {
                freshStore.sessions[sessionId] = data.config
                setModelConfig(data.config.subagentModel || { mode: 'default' })
                setMcpConfig(
                  data.config.mcp || { mode: 'default', enabledServerIds: [] },
                )
                setSkillsConfig(
                  data.config.skills || { mode: 'default', disabledSkills: [] },
                )
                setHasSessionOverride(Boolean(data.hasSessionOverride))
              }

              saveLocalSessionSettingsStore(freshStore)
            }
          }
        } catch {}
      } catch (err: any) {
        if (mounted) setError(err?.message || String(err))
      }
    }

    loadData()
    return () => {
      mounted = false
    }
  }, [sessionId])

  // --- Copy Session ID ---
  const handleCopySessionId = async () => {
    if (!sessionId) return
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(sessionId)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = sessionId
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        textarea.remove()
      }
      setCopiedId(true)
      setTimeout(() => setCopiedId(false), 2000)
    } catch {}
  }

  // --- Clone Preset by ID ---
  const handleClonePreset = async () => {
    const targetSourceId = cloneSourceId.trim()
    if (!targetSourceId) return

    setCloning(true)
    setCloneError('')
    setSaveSuccessMsg('')
    try {
      const res = await fetch(
        `/api/session-settings?sessionId=${encodeURIComponent(targetSourceId)}`,
      )
      if (!res.ok) {
        setCloneError(t('sessionSettings.clone.error'))
        return
      }
      const data = await res.json()
      if (data && data.ok) {
        const sourceConfig: SessionSettingsConfig =
          data.config?.subagentModel?.mode !== 'default' ||
          data.config?.mcp?.mode !== 'default' ||
          data.config?.skills?.mode !== 'default'
            ? data.config
            : data.effectiveConfig

        if (sourceConfig.subagentModel) {
          setModelConfig(sourceConfig.subagentModel)
        }
        if (sourceConfig.mcp) {
          setMcpConfig(sourceConfig.mcp)
        }
        if (sourceConfig.skills) {
          setSkillsConfig(sourceConfig.skills)
        }

        const sourceTitle =
          sessionsMap[targetSourceId]?.title ||
          sessionsMap[targetSourceId]?.header?.title ||
          targetSourceId

        setCloneSourceId('')
        setSaveSuccessMsg(
          t('sessionSettings.clone.success', { name: sourceTitle }),
        )
      } else {
        setCloneError(t('sessionSettings.clone.error'))
      }
    } catch (err: any) {
      setCloneError(
        t('sessionSettings.clone.error') + ': ' + (err?.message || String(err)),
      )
    } finally {
      setCloning(false)
    }
  }

  // --- Subagent Model Handlers ---
  const handleModelModeChange = (mode: 'default' | 'inherit' | 'custom') => {
    setSaveSuccessMsg('')
    setError('')
    if (mode === 'custom' && !modelConfig.provider && providers.length > 0) {
      const firstGroup = providers[0]
      const firstModel = firstGroup.models?.[0]?.id || ''
      setModelConfig({
        mode: 'custom',
        provider: firstGroup.id,
        model: firstModel,
        reasoningEffort: undefined,
      })
    } else {
      setModelConfig({
        ...modelConfig,
        mode,
      })
    }
  }

  const handleProviderChange = (providerId: string) => {
    setSaveSuccessMsg('')
    setError('')
    const group = providers.find((g) => g.id === providerId)
    const firstModel = group?.models?.[0]?.id || ''
    setModelConfig({
      ...modelConfig,
      provider: providerId,
      model: firstModel,
      reasoningEffort: undefined,
    })
  }

  const handleModelSelectChange = (modelId: string) => {
    setSaveSuccessMsg('')
    setError('')
    const currentGroup = providers.find((g) => g.id === modelConfig.provider)
    const selectedModel = currentGroup?.models?.find((m) => m.id === modelId)
    const supportedEfforts = selectedModel?.reasoning?.efforts || []
    const isEffortValid =
      modelConfig.reasoningEffort &&
      supportedEfforts.some((e) => e.id === modelConfig.reasoningEffort)

    setModelConfig({
      ...modelConfig,
      model: modelId,
      reasoningEffort: isEffortValid ? modelConfig.reasoningEffort : undefined,
    })
  }

  const handleReasoningEffortChange = (effortId: string) => {
    setSaveSuccessMsg('')
    setError('')
    setModelConfig({
      ...modelConfig,
      reasoningEffort: effortId.trim() ? effortId.trim() : undefined,
    })
  }

  // --- MCP Handlers ---
  const handleMcpModeChange = (mode: 'default' | 'custom') => {
    setSaveSuccessMsg('')
    setError('')
    if (
      mode === 'custom' &&
      (!mcpConfig.enabledServerIds || mcpConfig.enabledServerIds.length === 0)
    ) {
      const initialIds = availableMcpServers
        .filter((s) => s.enabledByDefault)
        .map((s) => s.id)
      setMcpConfig({
        mode: 'custom',
        enabledServerIds: initialIds,
      })
    } else {
      setMcpConfig({
        ...mcpConfig,
        mode,
      })
    }
  }

  const handleToggleMcpServer = (serverId: string) => {
    setSaveSuccessMsg('')
    setError('')
    const currentIds = mcpConfig.enabledServerIds || []
    const nextIds = currentIds.includes(serverId)
      ? currentIds.filter((id) => id !== serverId)
      : [...currentIds, serverId]

    setMcpConfig({
      ...mcpConfig,
      mode: 'custom',
      enabledServerIds: nextIds,
    })
  }

  const handleSelectAllMcp = () => {
    setMcpConfig({
      mode: 'custom',
      enabledServerIds: availableMcpServers.map((s) => s.id),
    })
  }

  const handleDeselectAllMcp = () => {
    setMcpConfig({
      mode: 'custom',
      enabledServerIds: [],
    })
  }

  const isAllMcpSelected =
    availableMcpServers.length > 0 &&
    (mcpConfig.mode === 'custom' || !sessionId
      ? availableMcpServers.every((s) =>
          (mcpConfig.enabledServerIds || []).includes(s.id),
        )
      : availableMcpServers.every((s) => s.enabledByDefault))

  const handleToggleSelectAllMcp = () => {
    if (isAllMcpSelected) {
      handleDeselectAllMcp()
    } else {
      handleSelectAllMcp()
    }
  }

  // --- Session Tools Handlers ---
  const handleOpenSessionToolsModal = async (server: GlobalMcpServerConfig) => {
    setSessionToolsModalServer(server)
    const currentToolsMode = mcpConfig.toolsMode?.[server.id] || 'default'
    setSessionToolsMode(currentToolsMode)

    if (currentToolsMode === 'custom') {
      setSessionDisabledToolsSet(
        new Set(mcpConfig.disabledTools?.[server.id] || []),
      )
    } else {
      setSessionDisabledToolsSet(new Set(server.disabledTools || []))
    }

    setSessionToolsSearch('')
    setSessionToolsExpandedSchemas(new Set())
    setSessionToolSchemaModes({})

    let tools: McpDiscoveredTool[] = []
    if (server.toolDetails && server.toolDetails.length > 0) {
      tools = server.toolDetails
    } else if (server.tools && server.tools.length > 0) {
      tools = server.tools.map((name) => ({ name }))
    }
    setSessionToolsList(tools)

    if (tools.length === 0) {
      setSessionToolsFetching(true)
      try {
        const res = await fetch(
          `/api/mcp-servers?action=tools&id=${encodeURIComponent(server.id)}`,
          { method: 'POST' },
        )
        const data = await res.json()
        if (data.ok && (data.toolDetails || data.tools)) {
          const fetchedTools: McpDiscoveredTool[] =
            data.toolDetails ||
            (data.tools || []).map((name: string) => ({ name }))
          setSessionToolsList(fetchedTools)
          setAvailableMcpServers((prev) =>
            prev.map((s) =>
              s.id === server.id
                ? { ...s, tools: data.tools, toolDetails: data.toolDetails }
                : s,
            ),
          )
        }
      } catch {}
      setSessionToolsFetching(false)
    }
  }

  const handleFetchSessionTools = async () => {
    if (!sessionToolsModalServer) return
    setSessionToolsFetching(true)
    try {
      const res = await fetch(
        `/api/mcp-servers?action=tools&id=${encodeURIComponent(sessionToolsModalServer.id)}`,
        { method: 'POST' },
      )
      const data = await res.json()
      if (data.ok && (data.toolDetails || data.tools)) {
        const fetchedTools: McpDiscoveredTool[] =
          data.toolDetails ||
          (data.tools || []).map((name: string) => ({ name }))
        setSessionToolsList(fetchedTools)
        setAvailableMcpServers((prev) =>
          prev.map((s) =>
            s.id === sessionToolsModalServer.id
              ? { ...s, tools: data.tools, toolDetails: data.toolDetails }
              : s,
          ),
        )
      }
    } catch {}
    setSessionToolsFetching(false)
  }

  const handleToggleSessionTool = (toolName: string) => {
    setSessionDisabledToolsSet((prev) => {
      const next = new Set(prev)
      if (next.has(toolName)) {
        next.delete(toolName)
      } else {
        next.add(toolName)
      }
      return next
    })
  }

  const handleToggleAllSessionTools = (enableAll: boolean) => {
    if (enableAll) {
      setSessionDisabledToolsSet(new Set())
    } else {
      setSessionDisabledToolsSet(new Set(sessionToolsList.map((t) => t.name)))
    }
  }

  const handleResetSessionToolsToDefault = () => {
    if (!sessionToolsModalServer) return
    setSessionDisabledToolsSet(
      new Set(sessionToolsModalServer.disabledTools || []),
    )
  }

  const handleToggleSessionSchema = (toolName: string) => {
    setSessionToolsExpandedSchemas((prev) => {
      const next = new Set(prev)
      if (next.has(toolName)) {
        next.delete(toolName)
      } else {
        next.add(toolName)
      }
      return next
    })
  }

  const handleApplySessionTools = () => {
    if (!sessionToolsModalServer) return
    const serverId = sessionToolsModalServer.id
    const nextToolsMode = { ...(mcpConfig.toolsMode || {}) }
    const nextDisabledTools = { ...(mcpConfig.disabledTools || {}) }

    if (sessionToolsMode === 'custom') {
      nextToolsMode[serverId] = 'custom'
      nextDisabledTools[serverId] = Array.from(sessionDisabledToolsSet)
    } else {
      nextToolsMode[serverId] = 'default'
      delete nextDisabledTools[serverId]
    }

    const currentEnabled = mcpConfig.enabledServerIds || []
    const nextEnabled = currentEnabled.includes(serverId)
      ? currentEnabled
      : [...currentEnabled, serverId]

    setMcpConfig({
      ...mcpConfig,
      mode: sessionId ? 'custom' : mcpConfig.mode,
      enabledServerIds: nextEnabled,
      toolsMode: nextToolsMode,
      disabledTools: nextDisabledTools,
    })

    setSessionToolsModalServer(null)
  }

  // --- Skills Handlers ---
  const defaultDisabledModelSkills =
    defaultSettings.skills?.disabledModelSkills ||
    defaultSettings.skills?.disabledSkills ||
    []
  const defaultDisabledUserSkills =
    defaultSettings.skills?.disabledUserSkills || []

  const effectiveDisabledModelList =
    skillsConfig.mode === 'custom'
      ? skillsConfig.disabledModelSkills || skillsConfig.disabledSkills || []
      : defaultDisabledModelSkills

  const effectiveDisabledUserList =
    skillsConfig.mode === 'custom'
      ? skillsConfig.disabledUserSkills || []
      : defaultDisabledUserSkills

  const effectiveDisabledModelSet = new Set(effectiveDisabledModelList)
  const effectiveDisabledUserSet = new Set(effectiveDisabledUserList)

  const effectiveActiveSkillsCount = availableSkills.filter(
    (s) => !effectiveDisabledModelSet.has(s.name),
  ).length

  const handleSkillsModeChange = (mode: 'default' | 'custom') => {
    setSaveSuccessMsg('')
    setError('')
    if (mode === 'custom') {
      setSkillsConfig({
        mode: 'custom',
        disabledSkills: [...effectiveDisabledModelList],
        disabledModelSkills: [...effectiveDisabledModelList],
        disabledUserSkills: [...effectiveDisabledUserList],
      })
    } else {
      setSkillsConfig({
        ...skillsConfig,
        mode,
      })
    }
  }

  const handleToggleModelInvocable = (skillName: string) => {
    setSaveSuccessMsg('')
    setError('')
    const curModel =
      skillsConfig.mode === 'custom'
        ? skillsConfig.disabledModelSkills || skillsConfig.disabledSkills || []
        : defaultDisabledModelSkills
    const curUser =
      skillsConfig.mode === 'custom'
        ? skillsConfig.disabledUserSkills || []
        : defaultDisabledUserSkills

    const nextModel = curModel.includes(skillName)
      ? curModel.filter((n) => n !== skillName)
      : [...curModel, skillName]

    setSkillsConfig({
      mode: 'custom',
      disabledSkills: nextModel,
      disabledModelSkills: nextModel,
      disabledUserSkills: curUser,
    })
  }

  const handleToggleUserInvocable = (skillName: string) => {
    setSaveSuccessMsg('')
    setError('')
    const curModel =
      skillsConfig.mode === 'custom'
        ? skillsConfig.disabledModelSkills || skillsConfig.disabledSkills || []
        : defaultDisabledModelSkills
    const curUser =
      skillsConfig.mode === 'custom'
        ? skillsConfig.disabledUserSkills || []
        : defaultDisabledUserSkills

    const nextUser = curUser.includes(skillName)
      ? curUser.filter((n) => n !== skillName)
      : [...curUser, skillName]

    setSkillsConfig({
      mode: 'custom',
      disabledSkills: curModel,
      disabledModelSkills: curModel,
      disabledUserSkills: nextUser,
    })
  }

  const handleOpenSessionSkillModal = async (skill: SkillItem) => {
    setSessionSkillModalTarget(skill)
    const skillName = skill.name
    if (!skillsContentMap[skillName] && !skill.content) {
      setSkillsLoadingMap((prev) => ({ ...prev, [skillName]: true }))
      try {
        const url = sessionId
          ? `/api/session-settings/skills/content?name=${encodeURIComponent(skillName)}&sessionId=${encodeURIComponent(sessionId)}`
          : `/api/session-settings/skills/content?name=${encodeURIComponent(skillName)}`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          if (data?.ok && data.skill) {
            setSkillsContentMap((prev) => ({
              ...prev,
              [skillName]: data.skill,
            }))
          } else {
            setSkillsContentMap((prev) => ({
              ...prev,
              [skillName]: {
                ...skill,
                content: '（暂未获取到该技能的详细指令内容）',
              },
            }))
          }
        } else {
          setSkillsContentMap((prev) => ({
            ...prev,
            [skillName]: {
              ...skill,
              content: '（加载技能详细指令失败）',
            },
          }))
        }
      } catch (err: any) {
        setSkillsContentMap((prev) => ({
          ...prev,
          [skillName]: {
            ...skill,
            content: `（加载出错: ${err?.message || String(err)}）`,
          },
        }))
      } finally {
        setSkillsLoadingMap((prev) => ({ ...prev, [skillName]: false }))
      }
    }
  }

  const handleRefreshSkills = async () => {
    setRefreshingSkills(true)
    try {
      const url = sessionId
        ? `/api/session-settings?sessionId=${encodeURIComponent(sessionId)}`
        : '/api/session-settings'
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        if (data?.ok && Array.isArray(data.availableSkills)) {
          setAvailableSkills(data.availableSkills)
        }
      }
    } catch {}
    setRefreshingSkills(false)
  }

  // --- Save Handlers ---
  const handleSave = async (isSaveDefault: boolean = false) => {
    if (isSaveDefault) {
      setSavingDefault(true)
    } else {
      setSaving(true)
    }
    setSaveSuccessMsg('')
    setError('')

    const payloadConfig: SessionSettingsConfig = {
      subagentModel: modelConfig,
      mcp: mcpConfig,
      skills: skillsConfig,
    }

    try {
      const res = await fetch('/api/session-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          config: payloadConfig,
          isDefault: isSaveDefault,
        }),
      })

      const data = await res.json()
      if (res.ok && data?.ok) {
        const freshStore = getLocalSessionSettingsStore()
        if (isSaveDefault) {
          freshStore.default = payloadConfig
          if (sessionId) delete freshStore.sessions[sessionId]
          setDefaultSettings(payloadConfig)
          setHasSessionOverride(false)
          setSaveSuccessMsg(t('sessionSettings.notice.savedDefault'))
        } else if (sessionId) {
          freshStore.sessions[sessionId] = payloadConfig
          setHasSessionOverride(
            payloadConfig.subagentModel.mode !== 'default' ||
              payloadConfig.mcp.mode !== 'default' ||
              payloadConfig.skills.mode !== 'default',
          )
          setSaveSuccessMsg(t('sessionSettings.notice.saved'))
        }
        saveLocalSessionSettingsStore(freshStore)

        if (onSave) {
          onSave(payloadConfig)
        }
        setTimeout(() => setSaveSuccessMsg(''), 3000)
      } else {
        setError(
          t('sessionSettings.notice.error') + (data?.error || 'Unknown error'),
        )
      }
    } catch (err: any) {
      setError(
        t('sessionSettings.notice.error') + (err?.message || String(err)),
      )
    } finally {
      setSaving(false)
      setSavingDefault(false)
    }
  }

  const handleResetSession = async () => {
    if (!sessionId) return
    setSaving(true)
    setSaveSuccessMsg('')
    setError('')

    try {
      const res = await fetch(
        `/api/session-settings?sessionId=${encodeURIComponent(sessionId)}`,
        { method: 'DELETE' },
      )
      const data = await res.json()
      if (res.ok && data?.ok) {
        const freshStore = getLocalSessionSettingsStore()
        delete freshStore.sessions[sessionId]
        saveLocalSessionSettingsStore(freshStore)

        setModelConfig({ mode: 'default' })
        setMcpConfig({ mode: 'default', enabledServerIds: [] })
        setSkillsConfig({ mode: 'default', disabledSkills: [] })
        setHasSessionOverride(false)
        setSaveSuccessMsg(t('sessionSettings.notice.saved'))
        if (onSave) {
          onSave(freshStore.default)
        }
        setTimeout(() => setSaveSuccessMsg(''), 3000)
      }
    } catch (err: any) {
      setError(err?.message || String(err))
    } finally {
      setSaving(false)
    }
  }

  const currentProviderGroup = providers.find(
    (g) => g.id === modelConfig.provider,
  )
  const currentModelItem = currentProviderGroup?.models?.find(
    (m) => m.id === modelConfig.model,
  )
  const availableEfforts = currentModelItem?.reasoning?.efforts || []

  const effectiveActiveMcpCount =
    mcpConfig.mode === 'custom'
      ? (mcpConfig.enabledServerIds || []).length
      : availableMcpServers.filter((s) => s.enabledByDefault).length

  return e(
    'div',
    {
      className: 'dsh-session-view-root',
      'data-session-settings-view': '',
      'data-conversation-composer-overlay': '',
    },
    // Top Header & Clone Toolbar
    e(
      'div',
      { className: 'dsh-session-view-header' },
      e(
        'div',
        { className: 'dsh-session-view-header-left' },
        e(
          'h2',
          { className: 'dsh-session-view-title' },
          t('sessionSettings.title'),
        ),
        sessionId
          ? e(
              'button',
              {
                type: 'button',
                className: `dsh-session-id-chip ${copiedId ? 'copied' : ''}`,
                onClick: handleCopySessionId,
                title: t('sessionSettings.action.copyId'),
              },
              copiedId
                ? e(IconCheckOutline16, { size: 13 })
                : e(IconCopyOutline16, { size: 13 }),
              e(
                'span',
                null,
                copiedId ? t('sessionSettings.idCopied') : sessionId,
              ),
            )
          : null,
        sessionId
          ? e(
              'span',
              {
                className: `dsh-sam-status-badge badge-${hasSessionOverride ? 'custom' : 'default'}`,
              },
              hasSessionOverride
                ? t('sessionSettings.scope.sessionCustom')
                : t('sessionSettings.scope.sessionDefault'),
            )
          : null,
      ),
      // Clone Preset Input Bar
      sessionId
        ? e(
            'div',
            { className: 'dsh-clone-toolbar' },
            e(
              'span',
              { className: 'dsh-clone-label' },
              t('sessionSettings.clone.toolbarTitle'),
            ),
            e('input', {
              type: 'text',
              className: 'dsh-clone-input',
              placeholder: t('sessionSettings.clone.inputPlaceholder'),
              value: cloneSourceId,
              onChange: (evt: any) => setCloneSourceId(evt.target.value),
              onKeyDown: (evt: any) => {
                if (evt.key === 'Enter') handleClonePreset()
              },
            }),
            e(
              'button',
              {
                type: 'button',
                className: 'dsh-sam-btn secondary dsh-clone-btn',
                disabled: cloning || !cloneSourceId.trim(),
                onClick: handleClonePreset,
              },
              cloning
                ? e(IconLoadingOutline16, { size: 13, className: 'dsh-spin' })
                : e(IconBranchOutline16, {
                    size: 13,
                    className: 'dsh-btn-icon-left',
                  }),
              cloning
                ? t('sessionSettings.clone.loading')
                : t('sessionSettings.clone.applyBtn'),
            ),
          )
        : null,
    ),

    // Notifications
    saveSuccessMsg
      ? e(
          'div',
          { className: 'dsh-sam-notice success dsh-view-notice' },
          saveSuccessMsg,
        )
      : null,
    error || cloneError
      ? e(
          'div',
          { className: 'dsh-sam-notice error dsh-view-notice' },
          error || cloneError,
        )
      : null,

    // Main Split Body: Sub-sidebar + Content
    e(
      'div',
      { className: 'dsh-session-view-body' },
      // Left Sub-sidebar (Clean: Icon + Title + Badge, no subtitle description)
      e(
        'div',
        { className: 'dsh-session-view-sidebar' },
        e(
          'button',
          {
            type: 'button',
            className: `dsh-view-sidebar-item ${activeNav === 'model' ? 'active' : ''}`,
            onClick: () => setActiveNav('model'),
          },
          e(
            'div',
            { className: 'dsh-view-item-icon' },
            e(IconAgentPresetOutline16, { size: 16 }),
          ),
          e(
            'span',
            { className: 'dsh-view-item-title' },
            t('sessionSettings.nav.modelTitle'),
          ),
          e(
            'span',
            { className: 'dsh-view-item-badge' },
            modelConfig.mode === 'custom' && modelConfig.model
              ? modelConfig.model
              : modelConfig.mode === 'inherit'
                ? t('sessionSettings.status.inherit')
                : t('sessionSettings.status.default'),
          ),
        ),
        e(
          'button',
          {
            type: 'button',
            className: `dsh-view-sidebar-item ${activeNav === 'mcp' ? 'active' : ''}`,
            onClick: () => setActiveNav('mcp'),
          },
          e(
            'div',
            { className: 'dsh-view-item-icon' },
            e(IconCodeOutline16, { size: 16 }),
          ),
          e(
            'span',
            { className: 'dsh-view-item-title' },
            t('sessionSettings.nav.mcpTitle'),
          ),
          e(
            'span',
            {
              className: `dsh-view-item-badge ${effectiveActiveMcpCount > 0 ? 'highlight' : ''}`,
            },
            effectiveActiveMcpCount > 0
              ? `${effectiveActiveMcpCount} MCP`
              : t('sessionSettings.status.none'),
          ),
        ),
        e(
          'button',
          {
            type: 'button',
            className: `dsh-view-sidebar-item ${activeNav === 'skills' ? 'active' : ''}`,
            onClick: () => setActiveNav('skills'),
          },
          e(
            'div',
            { className: 'dsh-view-item-icon' },
            e(IconSkillOutline16, { size: 16 }),
          ),
          e(
            'span',
            { className: 'dsh-view-item-title' },
            t('sessionSettings.nav.skillsTitle'),
          ),
          e(
            'span',
            {
              className: `dsh-view-item-badge ${effectiveActiveSkillsCount > 0 ? 'highlight' : ''}`,
            },
            availableSkills.length > 0
              ? `${effectiveActiveSkillsCount}/${availableSkills.length}`
              : t('sessionSettings.status.none'),
          ),
        ),
      ),

      // Right Main Content Panel (Includes Section Title and Section Description)
      e(
        'div',
        { className: 'dsh-session-view-content' },
        // Tab 1: Subagent Model
        activeNav === 'model'
          ? e(
              'div',
              { className: 'dsh-view-content-inner' },
              // Section Header: Title + Description
              e(
                'div',
                { className: 'dsh-section-header' },
                e(
                  'h3',
                  { className: 'dsh-section-title' },
                  t('sessionSettings.section.modelTitle'),
                ),
                e(
                  'p',
                  { className: 'dsh-section-desc' },
                  t('sessionSettings.section.modelDesc'),
                ),
              ),

              e(
                'div',
                { className: 'dsh-sam-mode-list' },
                sessionId
                  ? e(
                      'label',
                      {
                        className: `dsh-sam-mode-item ${modelConfig.mode === 'default' ? 'selected' : ''}`,
                      },
                      e('input', {
                        type: 'radio',
                        name: 'subagentModelMode',
                        checked: modelConfig.mode === 'default',
                        onChange: () => handleModelModeChange('default'),
                      }),
                      e(
                        'div',
                        { className: 'dsh-sam-mode-text' },
                        e(
                          'div',
                          { className: 'dsh-sam-mode-title' },
                          t('sessionSettings.mode.default.title'),
                        ),
                        e(
                          'div',
                          { className: 'dsh-sam-mode-desc' },
                          t('sessionSettings.mode.default.desc'),
                        ),
                      ),
                    )
                  : null,

                e(
                  'label',
                  {
                    className: `dsh-sam-mode-item ${modelConfig.mode === 'inherit' ? 'selected' : ''}`,
                  },
                  e('input', {
                    type: 'radio',
                    name: 'subagentModelMode',
                    checked: modelConfig.mode === 'inherit',
                    onChange: () => handleModelModeChange('inherit'),
                  }),
                  e(
                    'div',
                    { className: 'dsh-sam-mode-text' },
                    e(
                      'div',
                      { className: 'dsh-sam-mode-title' },
                      t('sessionSettings.mode.inherit.title'),
                    ),
                    e(
                      'div',
                      { className: 'dsh-sam-mode-desc' },
                      t('sessionSettings.mode.inherit.desc'),
                    ),
                  ),
                ),

                e(
                  'label',
                  {
                    className: `dsh-sam-mode-item ${modelConfig.mode === 'custom' ? 'selected' : ''}`,
                  },
                  e('input', {
                    type: 'radio',
                    name: 'subagentModelMode',
                    checked: modelConfig.mode === 'custom',
                    onChange: () => handleModelModeChange('custom'),
                  }),
                  e(
                    'div',
                    { className: 'dsh-sam-mode-text' },
                    e(
                      'div',
                      { className: 'dsh-sam-mode-title' },
                      t('sessionSettings.mode.custom.title'),
                    ),
                    e(
                      'div',
                      { className: 'dsh-sam-mode-desc' },
                      t('sessionSettings.mode.custom.desc'),
                    ),
                  ),
                ),
              ),

              modelConfig.mode === 'custom'
                ? e(
                    'div',
                    { className: 'dsh-sam-fields-panel' },
                    e(
                      'div',
                      { className: 'dsh-sam-field-group' },
                      e(
                        'label',
                        { className: 'dsh-sam-field-label' },
                        t('sessionSettings.field.provider'),
                      ),
                      e(
                        'select',
                        {
                          className: 'dsh-sam-select',
                          value: modelConfig.provider || '',
                          onChange: (evt: any) =>
                            handleProviderChange(evt.target.value),
                        },
                        !modelConfig.provider
                          ? e(
                              'option',
                              { value: '', disabled: true },
                              t('sessionSettings.field.providerPlaceholder'),
                            )
                          : null,
                        providers.map((p) =>
                          e(
                            'option',
                            { key: p.id, value: p.id },
                            p.name && p.name !== p.id
                              ? `${p.name} (${p.id})`
                              : p.name || p.id,
                          ),
                        ),
                      ),
                    ),

                    e(
                      'div',
                      { className: 'dsh-sam-field-group' },
                      e(
                        'label',
                        { className: 'dsh-sam-field-label' },
                        t('sessionSettings.field.model'),
                      ),
                      e(
                        'select',
                        {
                          className: 'dsh-sam-select',
                          value: modelConfig.model || '',
                          disabled:
                            !modelConfig.provider ||
                            !currentProviderGroup?.models?.length,
                          onChange: (evt: any) =>
                            handleModelSelectChange(evt.target.value),
                        },
                        !modelConfig.model
                          ? e(
                              'option',
                              { value: '', disabled: true },
                              t('sessionSettings.field.modelPlaceholder'),
                            )
                          : null,
                        (currentProviderGroup?.models || []).map((m) =>
                          e(
                            'option',
                            { key: m.id, value: m.id },
                            m.name || m.id,
                          ),
                        ),
                      ),
                    ),

                    availableEfforts.length > 0
                      ? e(
                          'div',
                          { className: 'dsh-sam-field-group' },
                          e(
                            'label',
                            { className: 'dsh-sam-field-label' },
                            t('sessionSettings.field.reasoningEffort'),
                          ),
                          e(
                            'select',
                            {
                              className: 'dsh-sam-select',
                              value: modelConfig.reasoningEffort || '',
                              onChange: (evt: any) =>
                                handleReasoningEffortChange(evt.target.value),
                            },
                            e(
                              'option',
                              { value: '' },
                              t('sessionSettings.field.reasoningEffortDefault'),
                            ),
                            availableEfforts.map((eff) =>
                              e(
                                'option',
                                { key: eff.id, value: eff.id },
                                effortLabel(t, eff.id),
                              ),
                            ),
                          ),
                        )
                      : null,
                  )
                : null,
            )
          : null,

        // Tab 2: MCP Servers
        activeNav === 'mcp'
          ? e(
              'div',
              { className: 'dsh-view-content-inner' },
              // Section Header: Title + Description
              e(
                'div',
                { className: 'dsh-section-header' },
                e(
                  'h3',
                  { className: 'dsh-section-title' },
                  t('sessionSettings.section.mcpTitle'),
                ),
                e(
                  'p',
                  { className: 'dsh-section-desc' },
                  t('sessionSettings.section.mcpDesc'),
                ),
              ),

              sessionId
                ? e(
                    'div',
                    { className: 'dsh-sam-mode-list' },
                    e(
                      'label',
                      {
                        className: `dsh-sam-mode-item ${mcpConfig.mode === 'default' ? 'selected' : ''}`,
                      },
                      e('input', {
                        type: 'radio',
                        name: 'sessionMcpMode',
                        checked: mcpConfig.mode === 'default',
                        onChange: () => handleMcpModeChange('default'),
                      }),
                      e(
                        'div',
                        { className: 'dsh-sam-mode-text' },
                        e(
                          'div',
                          { className: 'dsh-sam-mode-title' },
                          t('sessionSettings.mcpMode.default.title'),
                        ),
                        e(
                          'div',
                          { className: 'dsh-sam-mode-desc' },
                          t('sessionSettings.mcpMode.default.desc'),
                        ),
                      ),
                    ),
                    e(
                      'label',
                      {
                        className: `dsh-sam-mode-item ${mcpConfig.mode === 'custom' ? 'selected' : ''}`,
                      },
                      e('input', {
                        type: 'radio',
                        name: 'sessionMcpMode',
                        checked: mcpConfig.mode === 'custom',
                        onChange: () => handleMcpModeChange('custom'),
                      }),
                      e(
                        'div',
                        { className: 'dsh-sam-mode-text' },
                        e(
                          'div',
                          { className: 'dsh-sam-mode-title' },
                          t('sessionSettings.mcpMode.custom.title'),
                        ),
                        e(
                          'div',
                          { className: 'dsh-sam-mode-desc' },
                          t('sessionSettings.mcpMode.custom.desc'),
                        ),
                      ),
                    ),
                  )
                : null,

              availableMcpServers.length === 0
                ? e(
                    'div',
                    { className: 'dsh-mcp-empty-card' },
                    e(
                      'p',
                      { className: 'dsh-mcp-empty-text' },
                      t('sessionSettings.mcp.empty'),
                    ),
                  )
                : e(
                    'div',
                    { className: 'dsh-session-mcp-box' },
                    mcpConfig.mode === 'custom' || !sessionId
                      ? e(
                          'div',
                          { className: 'dsh-mcp-quick-bar' },
                          e(
                            'button',
                            {
                              type: 'button',
                              className: `dsh-mcp-select-btn ${isAllMcpSelected ? 'active' : ''}`,
                              onClick: handleToggleSelectAllMcp,
                            },
                            isAllMcpSelected
                              ? t('sessionSettings.mcp.deselectAll')
                              : t('sessionSettings.mcp.selectAll'),
                          ),
                        )
                      : null,

                    e(
                      'div',
                      { className: 'dsh-session-mcp-list' },
                      availableMcpServers.map((server) => {
                        const isChecked =
                          mcpConfig.mode === 'custom' || !sessionId
                            ? (mcpConfig.enabledServerIds || []).includes(
                                server.id,
                              )
                            : Boolean(server.enabledByDefault)

                        const isReadonly =
                          sessionId && mcpConfig.mode === 'default'
                        const protoLabel =
                          server.transport === 'stdio'
                            ? 'STDIO'
                            : server.detectedTransport === 'sse'
                              ? 'SSE'
                              : server.detectedTransport === 'streamable-http'
                                ? 'Streamable HTTP'
                                : 'HTTP / SSE'
                        const protoClass =
                          server.transport === 'stdio'
                            ? 'stdio'
                            : server.detectedTransport === 'sse'
                              ? 'sse'
                              : server.detectedTransport === 'streamable-http'
                                ? 'streamable-http'
                                : 'streamable-http-or-sse'

                        return e(
                          'div',
                          {
                            key: server.id,
                            role: 'button',
                            tabIndex: isReadonly ? undefined : 0,
                            className: `dsh-session-mcp-item ${isChecked ? 'active' : ''} ${isReadonly ? 'readonly' : ''}`,
                            onClick: isReadonly
                              ? undefined
                              : () => handleToggleMcpServer(server.id),
                            onKeyDown: isReadonly
                              ? undefined
                              : (evt: any) => {
                                  if (evt.key === ' ' || evt.key === 'Enter') {
                                    evt.preventDefault()
                                    handleToggleMcpServer(server.id)
                                  }
                                },
                          },
                          e(
                            'div',
                            { className: 'dsh-session-mcp-info' },
                            e(
                              'div',
                              { className: 'dsh-session-mcp-row1' },
                              e(
                                'div',
                                { className: 'dsh-session-mcp-title-wrap' },
                                server.transport === 'stdio'
                                  ? e(IconCodeOutline16, { size: 14 })
                                  : e(IconLinkOutline16, { size: 14 }),
                                e(
                                  'span',
                                  { className: 'dsh-session-mcp-name' },
                                  server.name,
                                ),
                                e(
                                  'span',
                                  {
                                    className: `dsh-mcp-proto-badge ${protoClass}`,
                                  },
                                  protoLabel,
                                ),
                                server.compatibility?.status ===
                                  'incompatible-2026-07-28' ||
                                  server.compatibility?.canEnable === false
                                  ? e(
                                      'span',
                                      {
                                        className:
                                          'dsh-mcp-proto-badge incompatible',
                                        title:
                                          server.compatibility.warning ||
                                          t('compatibility.incompatibleDesc'),
                                      },
                                      t('compatibility.incompatibleBadge'),
                                    )
                                  : server.compatibility?.status ===
                                      'downgrade-supported'
                                    ? e(
                                        'span',
                                        {
                                          className:
                                            'dsh-mcp-proto-badge downgrade',
                                          title:
                                            server.compatibility.warning ||
                                            t('compatibility.downgradedDesc'),
                                        },
                                        t('compatibility.downgradedBadge', {
                                          version:
                                            server.compatibility
                                              .negotiatedVersion ||
                                            '2025-11-25',
                                        }),
                                      )
                                    : null,
                              ),
                            ),
                            server.description
                              ? e(
                                  'p',
                                  { className: 'dsh-session-mcp-desc' },
                                  server.description,
                                )
                              : null,
                            e(
                              'code',
                              { className: 'dsh-session-mcp-target' },
                              server.transport === 'stdio'
                                ? `${server.command || ''} ${(server.args || []).join(' ')}`
                                : server.url || '',
                            ),
                            isChecked
                              ? (() => {
                                  const isCustomTools =
                                    mcpConfig.toolsMode?.[server.id] ===
                                    'custom'
                                  const customDisabledCount = (
                                    mcpConfig.disabledTools?.[server.id] || []
                                  ).length
                                  return e(
                                    'div',
                                    {
                                      className: 'dsh-session-mcp-tools-row',
                                    },
                                    isCustomTools
                                      ? e(
                                          'span',
                                          {
                                            className: `dsh-session-tools-mode-badge ${customDisabledCount > 0 ? 'custom' : 'all-active'}`,
                                          },
                                          customDisabledCount > 0
                                            ? t(
                                                'sessionSettings.mcp.toolsModeCustomBadge',
                                                {
                                                  count: customDisabledCount,
                                                },
                                              )
                                            : t(
                                                'sessionSettings.mcp.toolsAllActiveBadge',
                                              ),
                                        )
                                      : e(
                                          'span',
                                          {
                                            className:
                                              'dsh-session-tools-mode-badge default',
                                          },
                                          t(
                                            'sessionSettings.mcp.toolsModeDefaultBadge',
                                          ),
                                        ),
                                    e(
                                      'button',
                                      {
                                        type: 'button',
                                        className: 'dsh-session-tools-btn',
                                        onClick: (evt: any) => {
                                          evt.stopPropagation()
                                          handleOpenSessionToolsModal(server)
                                        },
                                      },
                                      e(IconChecklistOutline14, { size: 12 }),
                                      t('sessionSettings.mcp.toolsBtn'),
                                    ),
                                  )
                                })()
                              : null,
                          ),
                          isChecked
                            ? e(
                                'div',
                                { className: 'dsh-session-mcp-check' },
                                e(IconCheckOutline16, { size: 16 }),
                              )
                            : null,
                        )
                      }),
                    ),
                  ),
            )
          : null,

        // Tab 3: Skills Management
        activeNav === 'skills'
          ? e(
              'div',
              { className: 'dsh-view-content-inner' },
              // Section Header: Title + Description
              e(
                'div',
                { className: 'dsh-section-header' },
                e(
                  'h3',
                  { className: 'dsh-section-title' },
                  t('sessionSettings.section.skillsTitle'),
                ),
                e(
                  'p',
                  { className: 'dsh-section-desc' },
                  t('sessionSettings.section.skillsDesc'),
                ),
              ),

              sessionId
                ? e(
                    'div',
                    { className: 'dsh-sam-mode-list' },
                    e(
                      'label',
                      {
                        className: `dsh-sam-mode-item ${skillsConfig.mode === 'default' ? 'selected' : ''}`,
                      },
                      e('input', {
                        type: 'radio',
                        name: 'sessionSkillsMode',
                        checked: skillsConfig.mode === 'default',
                        onChange: () => handleSkillsModeChange('default'),
                      }),
                      e(
                        'div',
                        { className: 'dsh-sam-mode-text' },
                        e(
                          'div',
                          { className: 'dsh-sam-mode-title' },
                          t('sessionSettings.skillsMode.default.title'),
                        ),
                        e(
                          'div',
                          { className: 'dsh-sam-mode-desc' },
                          t('sessionSettings.skillsMode.default.desc'),
                        ),
                      ),
                    ),
                    e(
                      'label',
                      {
                        className: `dsh-sam-mode-item ${skillsConfig.mode === 'custom' ? 'selected' : ''}`,
                      },
                      e('input', {
                        type: 'radio',
                        name: 'sessionSkillsMode',
                        checked: skillsConfig.mode === 'custom',
                        onChange: () => handleSkillsModeChange('custom'),
                      }),
                      e(
                        'div',
                        { className: 'dsh-sam-mode-text' },
                        e(
                          'div',
                          { className: 'dsh-sam-mode-title' },
                          t('sessionSettings.skillsMode.custom.title'),
                        ),
                        e(
                          'div',
                          { className: 'dsh-sam-mode-desc' },
                          t('sessionSettings.skillsMode.custom.desc'),
                        ),
                      ),
                    ),
                  )
                : null,

              availableSkills.length === 0
                ? e(
                    'div',
                    { className: 'dsh-mcp-empty-card' },
                    e(
                      'p',
                      { className: 'dsh-mcp-empty-text' },
                      t('sessionSettings.skills.empty'),
                    ),
                  )
                : e(
                    'div',
                    { className: 'dsh-session-skills-box' },
                    // Toolbar with search and quick actions
                    e(
                      'div',
                      { className: 'dsh-skills-toolbar' },
                      e(
                        'div',
                        { className: 'dsh-skills-search-wrap' },
                        e(IconSearchOutline16, {
                          size: 14,
                          className: 'dsh-skills-search-icon',
                        }),
                        e('input', {
                          type: 'text',
                          className: 'dsh-skills-search-input',
                          placeholder: t(
                            'sessionSettings.skills.searchPlaceholder',
                          ),
                          value: skillsSearch,
                          onChange: (evt: any) =>
                            setSkillsSearch(evt.target.value),
                        }),
                      ),
                      e(
                        'div',
                        { className: 'dsh-skills-btn-group' },
                        e(
                          'button',
                          {
                            type: 'button',
                            className: 'dsh-mcp-text-btn',
                            disabled: refreshingSkills,
                            onClick: handleRefreshSkills,
                          },
                          refreshingSkills
                            ? e(IconLoadingOutline16, {
                                size: 12,
                                className: 'dsh-spin',
                              })
                            : e(IconRefreshOutline16, { size: 12 }),
                          t('sessionSettings.skills.refresh'),
                        ),
                      ),
                    ),

                    // Skill list
                    (() => {
                      const filteredSkills = availableSkills.filter((s) => {
                        if (!skillsSearch.trim()) return true
                        const q = skillsSearch.trim().toLowerCase()
                        return (
                          s.name.toLowerCase().includes(q) ||
                          (s.description || '').toLowerCase().includes(q)
                        )
                      })

                      if (filteredSkills.length === 0) {
                        return e(
                          'div',
                          { className: 'dsh-mcp-empty-card' },
                          e(
                            'p',
                            { className: 'dsh-mcp-empty-text' },
                            t('sessionSettings.skills.noMatch'),
                          ),
                        )
                      }

                      return e(
                        'div',
                        { className: 'dsh-session-skills-list' },
                        filteredSkills.map((skill) => {
                          const isModelDisabled = effectiveDisabledModelSet.has(
                            skill.name,
                          )
                          const isUserDisabled = effectiveDisabledUserSet.has(
                            skill.name,
                          )
                          const isRuntime = Boolean(skill.isRuntime)

                          const { sourceClass, sourceLabel } =
                            getSkillSourceMeta(skill, t)

                          return e(
                            'div',
                            {
                              key: skill.name,
                              className: `dsh-session-skill-item ${!isModelDisabled ? 'active' : 'disabled'}`,
                              onClick: () => handleOpenSessionSkillModal(skill),
                              style: { cursor: 'pointer' },
                            },
                            e(
                              'div',
                              { className: 'dsh-session-skill-main' },
                              e(
                                'div',
                                { className: 'dsh-session-skill-info' },
                                e(
                                  'div',
                                  { className: 'dsh-session-skill-row1' },
                                  e(
                                    'div',
                                    {
                                      className: 'dsh-session-skill-title-wrap',
                                    },
                                    e(IconSkillOutline16, { size: 14 }),
                                    e(
                                      'span',
                                      { className: 'dsh-session-skill-name' },
                                      skill.name,
                                    ),
                                    e(
                                      'span',
                                      {
                                        className: `dsh-skill-badge ${sourceClass}`,
                                      },
                                      sourceLabel,
                                    ),
                                    isRuntime
                                      ? null
                                      : e(
                                          'span',
                                          {
                                            className: `dsh-skill-badge ${!isModelDisabled ? 'status-enabled' : 'status-disabled'}`,
                                          },
                                          !isModelDisabled
                                            ? t(
                                                'sessionSettings.skills.modelInvocableEnabled',
                                              ) || '模型调用: 开启'
                                            : t(
                                                'sessionSettings.skills.modelInvocableDisabled',
                                              ) || '模型调用: 禁用',
                                        ),
                                    isRuntime
                                      ? null
                                      : e(
                                          'span',
                                          {
                                            className: `dsh-skill-badge ${!isUserDisabled ? 'status-enabled' : 'status-disabled'}`,
                                          },
                                          !isUserDisabled
                                            ? t(
                                                'sessionSettings.skills.userInvocableEnabled',
                                              ) || '快捷指令: 开启'
                                            : t(
                                                'sessionSettings.skills.userInvocableDisabled',
                                              ) || '快捷指令: 禁用',
                                        ),
                                  ),
                                ),
                                skill.description
                                  ? e(
                                      'p',
                                      { className: 'dsh-session-skill-desc' },
                                      skill.description,
                                    )
                                  : null,
                              ),
                              e(
                                'div',
                                { className: 'dsh-skill-actions' },
                                e(
                                  'button',
                                  {
                                    type: 'button',
                                    className: 'dsh-skill-config-btn',
                                    onClick: (evt: any) => {
                                      evt.stopPropagation()
                                      handleOpenSessionSkillModal(skill)
                                    },
                                  },
                                  t('sessionSettings.skills.openModalBtn') ||
                                    '配置 / 详情',
                                ),
                              ),
                            ),
                          )
                        }),
                      )
                    })(),
                  ),
            )
          : null,
      ),
    ),

    // Session Skill Configuration & Details Modal
    sessionSkillModalTarget
      ? (() => {
          const modalSkill = sessionSkillModalTarget
          const modalDetail = skillsContentMap[modalSkill.name] || modalSkill
          const modalIsRuntime = Boolean(modalSkill.isRuntime)
          const modalIsModelDisabled = effectiveDisabledModelSet.has(
            modalSkill.name,
          )
          const modalIsUserDisabled = effectiveDisabledUserSet.has(
            modalSkill.name,
          )
          const modalIsLoadingContent = Boolean(
            skillsLoadingMap[modalSkill.name],
          )

          const {
            sourceClass: modalSourceClass,
            sourceLabel: modalSourceLabel,
          } = getSkillSourceMeta(modalSkill, t)

          const handleModalToggleModel = () => {
            if (skillsConfig.mode !== 'custom') {
              handleSkillsModeChange('custom')
            }
            handleToggleModelInvocable(modalSkill.name)
          }

          const handleModalToggleUser = () => {
            if (skillsConfig.mode !== 'custom') {
              handleSkillsModeChange('custom')
            }
            handleToggleUserInvocable(modalSkill.name)
          }

          return e(
            'div',
            {
              className: 'dsh-sam-modal-overlay',
              onClick: (evt: any) => {
                if (evt.target === evt.currentTarget) {
                  setSessionSkillModalTarget(null)
                }
              },
            },
            e(
              'div',
              { className: 'dsh-sam-modal-panel dsh-skill-modal' },
              // Modal Header
              e(
                'div',
                { className: 'dsh-sam-header-row' },
                e(
                  'div',
                  { className: 'dsh-mcp-tools-header-info' },
                  e(
                    'h3',
                    {
                      className: 'dsh-sam-title',
                      style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      },
                    },
                    e(IconSkillOutline16, { size: 18 }),
                    modalSkill.name,
                  ),
                  e(
                    'div',
                    { className: 'dsh-skill-modal-header-meta' },
                    e(
                      'span',
                      { className: `dsh-skill-badge ${modalSourceClass}` },
                      modalSourceLabel,
                    ),
                    !modalIsRuntime
                      ? e(
                          'span',
                          {
                            className: `dsh-skill-badge ${!modalIsModelDisabled ? 'status-enabled' : 'status-disabled'}`,
                          },
                          !modalIsModelDisabled
                            ? t(
                                'sessionSettings.skills.modelInvocableEnabled',
                              ) || '模型调用: 开启'
                            : t(
                                'sessionSettings.skills.modelInvocableDisabled',
                              ) || '模型调用: 禁用',
                        )
                      : null,
                    !modalIsRuntime
                      ? e(
                          'span',
                          {
                            className: `dsh-skill-badge ${!modalIsUserDisabled ? 'status-enabled' : 'status-disabled'}`,
                          },
                          !modalIsUserDisabled
                            ? t(
                                'sessionSettings.skills.userInvocableEnabled',
                              ) || '快捷指令: 开启'
                            : t(
                                'sessionSettings.skills.userInvocableDisabled',
                              ) || '快捷指令: 禁用',
                        )
                      : null,
                  ),
                ),
                e(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-sam-close-btn',
                    onClick: () => setSessionSkillModalTarget(null),
                  },
                  e(IconCloseOutline16, { size: 16 }),
                ),
              ),

              // Modal Body
              e(
                'div',
                { className: 'dsh-skill-modal-body' },

                // Description
                modalSkill.description
                  ? e(
                      'p',
                      { className: 'dsh-skill-modal-desc' },
                      modalSkill.description,
                    )
                  : null,

                // Runtime Note
                modalIsRuntime
                  ? e(
                      'div',
                      { className: 'dsh-skill-runtime-note' },
                      t('sessionSettings.skills.runtimeNotice'),
                    )
                  : null,

                // Path & When to use
                modalDetail.path
                  ? e(
                      'div',
                      { className: 'dsh-skill-detail-meta' },
                      e(
                        'span',
                        null,
                        t('sessionSettings.skills.pathLabel'),
                        e(
                          'code',
                          { className: 'dsh-skill-detail-path' },
                          modalDetail.path,
                        ),
                      ),
                    )
                  : null,
                modalDetail.whenToUse
                  ? e(
                      'div',
                      { className: 'dsh-skill-detail-meta' },
                      e(
                        'span',
                        null,
                        t('sessionSettings.skills.whenToUseLabel'),
                        modalDetail.whenToUse,
                      ),
                    )
                  : null,

                // Section 1: Invocation Permissions
                e(
                  'div',
                  { className: 'dsh-skill-modal-section' },
                  e(
                    'h4',
                    { className: 'dsh-skill-modal-section-title' },
                    t('sessionSettings.skills.rulesSectionTitle') ||
                      '调用权限管控',
                  ),
                  e(
                    'div',
                    {
                      style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      },
                    },
                    // Switch 1: Model Invocable
                    e(
                      'div',
                      {
                        className: `dsh-mcp-switch-card mini ${!modalIsModelDisabled ? 'active' : ''}`,
                        onClick: handleModalToggleModel,
                        style: { cursor: 'pointer' },
                      },
                      e(
                        'div',
                        { className: 'dsh-mcp-switch-text' },
                        e(
                          'span',
                          { className: 'dsh-mcp-switch-title' },
                          t('sessionSettings.skills.modelInvocableTitle'),
                        ),
                        e(
                          'span',
                          { className: 'dsh-mcp-switch-desc' },
                          t('sessionSettings.skills.modelInvocableDesc'),
                        ),
                      ),
                      e(
                        'div',
                        {
                          className: `dsh-mcp-switch-btn ${!modalIsModelDisabled ? 'active' : ''}`,
                        },
                        e('span', { className: 'dsh-mcp-switch-thumb' }),
                      ),
                    ),
                    // Switch 2: User Invocable
                    e(
                      'div',
                      {
                        className: `dsh-mcp-switch-card mini ${!modalIsUserDisabled ? 'active' : ''}`,
                        onClick: handleModalToggleUser,
                        style: { cursor: 'pointer' },
                      },
                      e(
                        'div',
                        { className: 'dsh-mcp-switch-text' },
                        e(
                          'span',
                          { className: 'dsh-mcp-switch-title' },
                          t('sessionSettings.skills.userInvocableTitle'),
                        ),
                        e(
                          'span',
                          { className: 'dsh-mcp-switch-desc' },
                          t('sessionSettings.skills.userInvocableDesc'),
                        ),
                      ),
                      e(
                        'div',
                        {
                          className: `dsh-mcp-switch-btn ${!modalIsUserDisabled ? 'active' : ''}`,
                        },
                        e('span', { className: 'dsh-mcp-switch-thumb' }),
                      ),
                    ),
                  ),
                ),

                // Section 2: Instructions & Rules
                e(
                  'div',
                  { className: 'dsh-skill-modal-section' },
                  e(
                    'h4',
                    { className: 'dsh-skill-modal-section-title' },
                    t('sessionSettings.skills.instructionsSectionTitle') ||
                      '指令与规则',
                  ),
                  modalIsLoadingContent
                    ? e(
                        'div',
                        { className: 'dsh-sam-notice info' },
                        t('sessionSettings.skills.loadingContent'),
                      )
                    : e(
                        'pre',
                        { className: 'dsh-skill-content-block' },
                        modalDetail.content ||
                          t('sessionSettings.skills.noInstructions'),
                      ),
                ),
              ),

              // Modal Footer
              e(
                'div',
                { className: 'dsh-sam-actions dsh-mcp-modal-footer' },
                e('div', { className: 'dsh-mcp-modal-footer-left' }),
                e(
                  'div',
                  { className: 'dsh-mcp-modal-footer-right' },
                  e(
                    'button',
                    {
                      type: 'button',
                      className: 'dsh-sam-btn primary',
                      onClick: () => setSessionSkillModalTarget(null),
                    },
                    t('sessionSettings.skills.modalDoneBtn') || '完成',
                  ),
                ),
              ),
            ),
          )
        })()
      : null,

    // Session Tools Configuration Modal
    sessionToolsModalServer
      ? e(
          'div',
          {
            className: 'dsh-sam-modal-overlay',
            onClick: (evt: any) => {
              if (evt.target === evt.currentTarget) {
                setSessionToolsModalServer(null)
              }
            },
          },
          e(
            'div',
            { className: 'dsh-sam-modal-panel dsh-mcp-tools-modal' },
            // Modal Header
            e(
              'div',
              { className: 'dsh-sam-header-row' },
              e(
                'div',
                { className: 'dsh-mcp-tools-header-info' },
                e(
                  'h3',
                  { className: 'dsh-sam-title' },
                  `${sessionToolsModalServer.name} - ${t('sessionSettings.toolsModal.title')}`,
                ),
                e(
                  'div',
                  { className: 'dsh-mcp-tools-header-meta' },
                  e(
                    'span',
                    {
                      className: `dsh-mcp-proto-badge ${sessionToolsModalServer.transport}`,
                    },
                    sessionToolsModalServer.transport === 'stdio'
                      ? 'STDIO'
                      : sessionToolsModalServer.detectedTransport === 'sse'
                        ? 'SSE'
                        : sessionToolsModalServer.detectedTransport ===
                            'streamable-http'
                          ? 'Streamable HTTP'
                          : 'HTTP / SSE',
                  ),
                  sessionToolsList.length > 0
                    ? e(
                        'span',
                        { className: 'dsh-mcp-count-badge' },
                        `${sessionToolsList.length} 工具`,
                      )
                    : null,
                ),
              ),
              e(
                'button',
                {
                  type: 'button',
                  className: 'dsh-sam-close-btn',
                  onClick: () => setSessionToolsModalServer(null),
                },
                e(IconCloseOutline16, { size: 16 }),
              ),
            ),
            e(
              'p',
              { className: 'dsh-sam-desc', style: { marginBottom: 12 } },
              t('sessionSettings.toolsModal.desc'),
            ),

            // Mode Selector: Follow Global Default vs Customize for Session
            e(
              'div',
              { className: 'dsh-session-tools-modes' },
              e(
                'label',
                {
                  className: `dsh-sam-mode-item ${sessionToolsMode === 'default' ? 'selected' : ''}`,
                  onClick: () => {
                    setSessionToolsMode('default')
                    setSessionDisabledToolsSet(
                      new Set(sessionToolsModalServer.disabledTools || []),
                    )
                  },
                },
                e('input', {
                  type: 'radio',
                  name: 'sessionToolsMode',
                  value: 'default',
                  checked: sessionToolsMode === 'default',
                  onChange: () => {
                    setSessionToolsMode('default')
                    setSessionDisabledToolsSet(
                      new Set(sessionToolsModalServer.disabledTools || []),
                    )
                  },
                  className: 'dsh-sam-radio',
                }),
                e(
                  'div',
                  { className: 'dsh-sam-mode-text' },
                  e(
                    'div',
                    { className: 'dsh-sam-mode-title' },
                    t('sessionSettings.toolsModal.modeDefaultTitle'),
                  ),
                  e(
                    'div',
                    { className: 'dsh-sam-mode-desc' },
                    t('sessionSettings.toolsModal.modeDefaultDesc', {
                      count: (sessionToolsModalServer.disabledTools || [])
                        .length,
                    }),
                  ),
                ),
              ),
              e(
                'label',
                {
                  className: `dsh-sam-mode-item ${sessionToolsMode === 'custom' ? 'selected' : ''}`,
                  onClick: () => setSessionToolsMode('custom'),
                },
                e('input', {
                  type: 'radio',
                  name: 'sessionToolsMode',
                  value: 'custom',
                  checked: sessionToolsMode === 'custom',
                  onChange: () => setSessionToolsMode('custom'),
                  className: 'dsh-sam-radio',
                }),
                e(
                  'div',
                  { className: 'dsh-sam-mode-text' },
                  e(
                    'div',
                    { className: 'dsh-sam-mode-title' },
                    t('sessionSettings.toolsModal.modeCustomTitle'),
                  ),
                  e(
                    'div',
                    { className: 'dsh-sam-mode-desc' },
                    t('sessionSettings.toolsModal.modeCustomDesc'),
                  ),
                ),
              ),
            ),

            // Toolbar: Search + Quick Enable/Disable buttons
            e(
              'div',
              { className: 'dsh-mcp-tools-toolbar' },
              e(
                'div',
                { className: 'dsh-mcp-search-wrap dsh-mcp-tools-search-box' },
                e(IconSearchOutline16, {
                  size: 14,
                  className: 'dsh-mcp-search-icon',
                }),
                e('input', {
                  type: 'text',
                  className: 'dsh-sam-input dsh-mcp-search-input',
                  placeholder: t(
                    'sessionSettings.toolsModal.searchPlaceholder',
                  ),
                  value: sessionToolsSearch,
                  onChange: (evt: any) =>
                    setSessionToolsSearch(evt.target.value),
                }),
              ),
              sessionToolsMode === 'custom'
                ? e(
                    'div',
                    { className: 'dsh-mcp-tools-toolbar-actions' },
                    e(
                      'button',
                      {
                        type: 'button',
                        className: 'dsh-sam-btn secondary',
                        onClick: () => handleToggleAllSessionTools(true),
                      },
                      t('sessionSettings.toolsModal.enableAll'),
                    ),
                    e(
                      'button',
                      {
                        type: 'button',
                        className: 'dsh-sam-btn secondary',
                        onClick: () => handleToggleAllSessionTools(false),
                      },
                      t('sessionSettings.toolsModal.disableAll'),
                    ),
                    e(
                      'button',
                      {
                        type: 'button',
                        className: 'dsh-sam-btn secondary',
                        onClick: handleResetSessionToolsToDefault,
                      },
                      t('sessionSettings.toolsModal.resetToDefault'),
                    ),
                  )
                : null,
            ),

            // Tools List / Loading / Empty
            sessionToolsFetching
              ? e(
                  'div',
                  { className: 'dsh-sam-loading', style: { padding: 24 } },
                  t('sessionSettings.toolsModal.fetchingTools'),
                )
              : sessionToolsList.length === 0
                ? e(
                    'div',
                    {
                      className: 'dsh-mcp-empty-card',
                      style: { padding: '24px 16px' },
                    },
                    e(
                      'p',
                      { className: 'dsh-mcp-empty-text' },
                      t('sessionSettings.toolsModal.noToolsAvailable'),
                    ),
                    e(
                      'button',
                      {
                        type: 'button',
                        className: 'dsh-sam-btn secondary',
                        onClick: handleFetchSessionTools,
                      },
                      e(IconRefreshOutline16, { size: 14 }),
                      t('sessionSettings.toolsModal.fetchToolsBtn'),
                    ),
                  )
                : e(
                    'div',
                    { className: 'dsh-mcp-tools-list' },
                    sessionToolsList
                      .filter((tool) => {
                        const term = sessionToolsSearch.trim().toLowerCase()
                        if (!term) return true
                        return (
                          tool.name.toLowerCase().includes(term) ||
                          (tool.description || '').toLowerCase().includes(term)
                        )
                      })
                      .map((tool) => {
                        const isGloballyDisabled = Boolean(
                          sessionToolsModalServer.disabledTools?.includes(
                            tool.name,
                          ),
                        )
                        const isCustomDisabled = sessionDisabledToolsSet.has(
                          tool.name,
                        )
                        const isDisabled =
                          sessionToolsMode === 'custom'
                            ? isCustomDisabled
                            : isGloballyDisabled

                        const isSchemaExpanded =
                          sessionToolsExpandedSchemas.has(tool.name)
                        const hasSchema = Boolean(
                          tool.inputSchema &&
                          typeof tool.inputSchema === 'object' &&
                          tool.inputSchema.properties &&
                          Object.keys(tool.inputSchema.properties).length > 0,
                        )

                        return e(
                          'div',
                          {
                            key: tool.name,
                            className: `dsh-mcp-tool-card ${isDisabled ? 'disabled' : ''}`,
                          },
                          e(
                            'div',
                            { className: 'dsh-mcp-tool-card-main' },
                            e(
                              'div',
                              { className: 'dsh-mcp-tool-card-left' },
                              sessionToolsMode === 'custom'
                                ? e(
                                    'button',
                                    {
                                      type: 'button',
                                      role: 'switch',
                                      'aria-checked': !isDisabled,
                                      className: `dsh-mcp-switch-btn ${!isDisabled ? 'active' : ''}`,
                                      onClick: () =>
                                        handleToggleSessionTool(tool.name),
                                    },
                                    e('span', {
                                      className: 'dsh-mcp-switch-thumb',
                                    }),
                                  )
                                : e(
                                    'div',
                                    {
                                      className: `dsh-mcp-switch-btn ${!isDisabled ? 'active' : ''}`,
                                      style: {
                                        opacity: 0.6,
                                        cursor: 'default',
                                      },
                                    },
                                    e('span', {
                                      className: 'dsh-mcp-switch-thumb',
                                    }),
                                  ),
                              e(
                                'div',
                                { className: 'dsh-mcp-tool-info' },
                                e(
                                  'div',
                                  { className: 'dsh-mcp-tool-title-row' },
                                  e(
                                    'span',
                                    { className: 'dsh-mcp-tool-name' },
                                    tool.name,
                                  ),
                                  sessionToolsMode === 'custom'
                                    ? isCustomDisabled
                                      ? e(
                                          'span',
                                          {
                                            className:
                                              'dsh-mcp-tool-status-pill disabled',
                                          },
                                          t(
                                            'sessionSettings.toolsModal.toolCustomDisabledBadge',
                                          ),
                                        )
                                      : e(
                                          'span',
                                          {
                                            className:
                                              'dsh-mcp-tool-status-pill active',
                                          },
                                          t(
                                            'sessionSettings.toolsModal.toolEnabled',
                                          ),
                                        )
                                    : isGloballyDisabled
                                      ? e(
                                          'span',
                                          {
                                            className:
                                              'dsh-mcp-tool-status-pill disabled',
                                          },
                                          t(
                                            'sessionSettings.toolsModal.toolGlobalDisabledBadge',
                                          ),
                                        )
                                      : e(
                                          'span',
                                          {
                                            className:
                                              'dsh-mcp-tool-status-pill active',
                                          },
                                          t(
                                            'sessionSettings.toolsModal.toolEnabled',
                                          ),
                                        ),
                                ),
                                e(
                                  'p',
                                  { className: 'dsh-mcp-tool-desc' },
                                  tool.description ||
                                    t('sessionSettings.toolsModal.noDesc'),
                                ),
                              ),
                            ),
                            e(
                              'div',
                              { className: 'dsh-mcp-tool-card-right' },
                              hasSchema
                                ? e(
                                    'button',
                                    {
                                      type: 'button',
                                      className: `dsh-mcp-tool-schema-btn ${isSchemaExpanded ? 'active' : ''}`,
                                      onClick: () =>
                                        handleToggleSessionSchema(tool.name),
                                    },
                                    e(IconCodeOutline16, { size: 12 }),
                                    isSchemaExpanded
                                      ? t(
                                          'sessionSettings.toolsModal.hideParameters',
                                        )
                                      : t(
                                          'sessionSettings.toolsModal.parameters',
                                        ),
                                  )
                                : null,
                            ),
                          ),
                          // Collapsible Schema
                          isSchemaExpanded && hasSchema
                            ? (() => {
                                const params = parseToolParameters(
                                  tool.inputSchema,
                                )
                                const mode =
                                  sessionToolSchemaModes[tool.name] || 'list'
                                const requiredCount = params.filter(
                                  (p) => p.required,
                                ).length

                                return e(
                                  'div',
                                  {
                                    className: 'dsh-mcp-tool-expanded-box',
                                  },
                                  e(
                                    'div',
                                    {
                                      className: 'dsh-mcp-tool-expanded-header',
                                    },
                                    e(
                                      'span',
                                      {
                                        className: 'dsh-mcp-tool-param-stats',
                                      },
                                      params.length > 0
                                        ? t(
                                            'sessionSettings.toolsModal.paramsCount',
                                            {
                                              total: params.length,
                                              required: requiredCount,
                                            },
                                          )
                                        : t(
                                            'sessionSettings.toolsModal.noParams',
                                          ),
                                    ),
                                    e(
                                      'div',
                                      {
                                        className: 'dsh-mcp-tool-view-switch',
                                      },
                                      e(
                                        'button',
                                        {
                                          type: 'button',
                                          className: `dsh-mcp-seg-btn ${mode === 'list' ? 'active' : ''}`,
                                          onClick: (evt: any) => {
                                            evt.stopPropagation()
                                            setSessionToolSchemaModes(
                                              (prev) => ({
                                                ...prev,
                                                [tool.name]: 'list',
                                              }),
                                            )
                                          },
                                        },
                                        t(
                                          'sessionSettings.toolsModal.viewList',
                                        ),
                                      ),
                                      e(
                                        'button',
                                        {
                                          type: 'button',
                                          className: `dsh-mcp-seg-btn ${mode === 'raw' ? 'active' : ''}`,
                                          onClick: (evt: any) => {
                                            evt.stopPropagation()
                                            setSessionToolSchemaModes(
                                              (prev) => ({
                                                ...prev,
                                                [tool.name]: 'raw',
                                              }),
                                            )
                                          },
                                        },
                                        t('sessionSettings.toolsModal.viewRaw'),
                                      ),
                                    ),
                                  ),
                                  mode === 'list'
                                    ? params.length > 0
                                      ? e(
                                          'div',
                                          {
                                            className:
                                              'dsh-mcp-tool-params-list',
                                          },
                                          params.map((param) =>
                                            e(
                                              'div',
                                              {
                                                key: param.name,
                                                className: 'dsh-mcp-param-row',
                                              },
                                              e(
                                                'div',
                                                {
                                                  className:
                                                    'dsh-mcp-param-top',
                                                },
                                                e(
                                                  'span',
                                                  {
                                                    className:
                                                      'dsh-mcp-param-name',
                                                  },
                                                  param.name,
                                                ),
                                                e(
                                                  'span',
                                                  {
                                                    className:
                                                      'dsh-mcp-param-type',
                                                  },
                                                  param.type,
                                                ),
                                                e(
                                                  'span',
                                                  {
                                                    className: `dsh-mcp-param-badge ${param.required ? 'required' : 'optional'}`,
                                                  },
                                                  param.required
                                                    ? t(
                                                        'sessionSettings.toolsModal.required',
                                                      )
                                                    : t(
                                                        'sessionSettings.toolsModal.optional',
                                                      ),
                                                ),
                                                param.default !== undefined
                                                  ? e(
                                                      'span',
                                                      {
                                                        className:
                                                          'dsh-mcp-param-default',
                                                      },
                                                      `${t('sessionSettings.toolsModal.defaultVal')}${JSON.stringify(param.default)}`,
                                                    )
                                                  : null,
                                              ),
                                              param.description
                                                ? e(
                                                    'p',
                                                    {
                                                      className:
                                                        'dsh-mcp-param-desc',
                                                    },
                                                    param.description,
                                                  )
                                                : null,
                                            ),
                                          ),
                                        )
                                      : null
                                    : e(
                                        'pre',
                                        {
                                          className:
                                            'dsh-mcp-tool-schema-preview',
                                        },
                                        JSON.stringify(
                                          tool.inputSchema,
                                          null,
                                          2,
                                        ),
                                      ),
                                )
                              })()
                            : null,
                        )
                      }),
                  ),

            // Modal Footer Actions
            e(
              'div',
              {
                className: 'dsh-sam-actions dsh-mcp-modal-footer',
                style: { marginTop: 14 },
              },
              e(
                'div',
                { className: 'dsh-mcp-modal-footer-left' },
                sessionToolsMode === 'custom'
                  ? sessionDisabledToolsSet.size > 0
                    ? e(
                        'span',
                        { className: 'dsh-mcp-proto-badge disabled-tools' },
                        t('sessionSettings.toolsModal.disabledCount', {
                          count: sessionDisabledToolsSet.size,
                        }),
                      )
                    : e(
                        'span',
                        { className: 'dsh-mcp-proto-badge stdio' },
                        t('sessionSettings.toolsModal.allEnabledCount', {
                          total: sessionToolsList.length,
                        }),
                      )
                  : e(
                      'span',
                      { className: 'dsh-mcp-proto-badge stdio' },
                      t('sessionSettings.toolsModal.modeDefaultTitle'),
                    ),
              ),
              e(
                'div',
                { className: 'dsh-mcp-modal-footer-right' },
                e(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-sam-btn secondary',
                    onClick: () => setSessionToolsModalServer(null),
                  },
                  t('sessionSettings.toolsModal.cancel'),
                ),
                e(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-sam-btn primary',
                    onClick: handleApplySessionTools,
                  },
                  t('sessionSettings.toolsModal.save'),
                ),
              ),
            ),
          ),
        )
      : null,

    // Bottom Action Footer
    e(
      'div',
      { className: 'dsh-session-view-footer' },
      e(
        'div',
        { className: 'dsh-view-footer-left' },
        sessionId && hasSessionOverride
          ? e(
              'button',
              {
                type: 'button',
                className: 'dsh-sam-btn tertiary',
                disabled: saving || savingDefault,
                onClick: handleResetSession,
              },
              t('sessionSettings.action.reset'),
            )
          : null,
      ),
      e(
        'div',
        { className: 'dsh-view-footer-right' },
        sessionId
          ? e(
              'button',
              {
                type: 'button',
                className: 'dsh-sam-btn default-btn',
                disabled: saving || savingDefault,
                onClick: () => handleSave(true),
              },
              savingDefault
                ? t('sessionSettings.action.savingDefault')
                : t('sessionSettings.action.saveDefault'),
            )
          : null,

        e(
          'button',
          {
            type: 'button',
            className: 'dsh-sam-btn primary',
            disabled: saving || savingDefault,
            onClick: () => handleSave(false),
          },
          saving
            ? t('sessionSettings.action.saving')
            : sessionId
              ? t('sessionSettings.action.saveSession')
              : t('sessionSettings.action.save'),
        ),
      ),
    ),
  )
}
