import * as React from 'react'
import {
  IconPlusOutline16,
  IconRefreshOutline16,
  IconEditOutline16,
  IconTrashOutline16,
  IconCloseOutline16,
  IconCodeOutline16,
  IconLinkOutline16,
  IconPlayOutline16,
  IconWarningOutline16,
  IconLoadingOutline16,
  IconChecklistOutline14,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type {
  GlobalMcpServerConfig,
  McpDiscoveredTool,
  McpServerInfo,
  McpSettingsProps,
  McpTransportType,
} from './types.ts'
import { saveLocalMcpServers } from './storage.ts'

const e = React.createElement

interface EnvEntry {
  key: string
  value: string
}

interface ToolParamItem {
  name: string
  type: string
  required: boolean
  description?: string
  default?: any
  enum?: any[]
}

function parseToolParameters(schema?: Record<string, any>): ToolParamItem[] {
  if (!schema || typeof schema !== 'object') return []
  const properties = schema.properties
  if (!properties || typeof properties !== 'object') return []

  const requiredSet = new Set(
    Array.isArray(schema.required) ? schema.required : [],
  )

  const items: ToolParamItem[] = []

  for (const [name, rawProp] of Object.entries(properties)) {
    if (!rawProp || typeof rawProp !== 'object') {
      items.push({
        name,
        type: 'any',
        required: requiredSet.has(name),
      })
      continue
    }

    const prop = rawProp as any
    let typeStr = prop.type || 'any'
    if (prop.type === 'array') {
      const itemType = prop.items?.type || 'any'
      typeStr = `array<${itemType}>`
    } else if (Array.isArray(prop.type)) {
      typeStr = prop.type.join(' | ')
    }

    items.push({
      name,
      type: typeStr,
      required: requiredSet.has(name),
      description:
        typeof prop.description === 'string' ? prop.description : undefined,
      default: prop.default,
      enum: Array.isArray(prop.enum) ? prop.enum : undefined,
    })
  }

  items.sort((a, b) => {
    if (a.required !== b.required) return a.required ? -1 : 1
    return a.name.localeCompare(b.name)
  })

  return items
}

export function McpServersSettingsTab({
  api: _api,
  t,
  close: _close,
}: McpSettingsProps) {
  const [servers, setServers] = React.useState<GlobalMcpServerConfig[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string>('')
  const [successMsg, setSuccessMsg] = React.useState<string>('')

  // Form modal state
  const [formOpen, setFormOpen] = React.useState<boolean>(false)
  const [isEditing, setIsEditing] = React.useState<boolean>(false)
  const [formServer, setFormServer] = React.useState<
    Partial<GlobalMcpServerConfig>
  >({
    transport: 'stdio',
    enabledByDefault: false,
  })
  const [envEntries, setEnvEntries] = React.useState<EnvEntry[]>([])
  const [headerEntries, setHeaderEntries] = React.useState<EnvEntry[]>([])
  const [formSaving, setFormSaving] = React.useState<boolean>(false)
  const [formTesting, setFormTesting] = React.useState<boolean>(false)
  const [formError, setFormError] = React.useState<string>('')
  const [showAdvanced, setShowAdvanced] = React.useState<boolean>(false)
  const [formTestResult, setFormTestResult] = React.useState<{
    ok: boolean
    message: string
  } | null>(null)

  // Save confirmation modal state (for pre-save test failures)
  const [saveConfirm, setSaveConfirm] = React.useState<{
    open: boolean
    message: string
    payload: GlobalMcpServerConfig
  } | null>(null)

  // Test state
  const [testingId, setTestingId] = React.useState<string | null>(null)
  const [testResults, setTestResults] = React.useState<
    Record<string, { ok: boolean; message: string }>
  >({})

  // Import modal state
  const [importOpen, setImportOpen] = React.useState<boolean>(false)
  const [importText, setImportText] = React.useState<string>('')
  const [importing, setImporting] = React.useState<boolean>(false)
  const [importError, setImportError] = React.useState<string>('')

  // Tools modal state
  const [toolsModalOpen, setToolsModalOpen] = React.useState<boolean>(false)
  const [toolsTargetServer, setToolsTargetServer] =
    React.useState<Partial<GlobalMcpServerConfig> | null>(null)
  const [toolsSource, setToolsSource] = React.useState<'card' | 'form'>('card')
  const [toolsLoading, setToolsLoading] = React.useState<boolean>(false)
  const [toolsError, setToolsError] = React.useState<string>('')
  const [toolsList, setToolsList] = React.useState<McpDiscoveredTool[]>([])
  const [toolsDisabledSet, setToolsDisabledSet] = React.useState<Set<string>>(
    new Set(),
  )
  const [toolsSearch, setToolsSearch] = React.useState<string>('')
  const [toolsExpandedSchemas, setToolsExpandedSchemas] = React.useState<
    Set<string>
  >(new Set())
  const [toolSchemaModes, setToolSchemaModes] = React.useState<
    Record<string, 'list' | 'raw'>
  >({})
  const [toolsServerInfo, setToolsServerInfo] =
    React.useState<McpServerInfo | null>(null)
  const [toolsDetectedTransport, setToolsDetectedTransport] = React.useState<
    string | null
  >(null)
  const [toolsSaving, setToolsSaving] = React.useState<boolean>(false)

  const loadServers = React.useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/mcp-servers')
      if (res.ok) {
        const data = await res.json()
        if (data.ok && Array.isArray(data.servers)) {
          setServers(data.servers)
          saveLocalMcpServers(data.servers)
        }
      } else {
        setError(`Failed to load MCP servers: ${res.statusText}`)
      }
    } catch (err: any) {
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadServers()
  }, [loadServers])

  // Open add form
  const handleOpenAdd = () => {
    setIsEditing(false)
    setShowAdvanced(false)
    setFormServer({
      id: '',
      name: '',
      description: '',
      transport: 'stdio',
      command: '',
      args: [],
      cwd: '',
      url: '',
      enabledByDefault: false,
      toolCallTimeoutMs: undefined,
      failOnStartupError: false,
      reconnect: {
        enabled: true,
        initialDelayMs: undefined,
        maxDelayMs: undefined,
        maxAttempts: undefined,
      },
      disabledTools: [],
    })
    setEnvEntries([])
    setHeaderEntries([])
    setFormError('')
    setFormTestResult(null)
    setFormOpen(true)
  }

  // Open edit form
  const handleOpenEdit = (server: GlobalMcpServerConfig) => {
    setIsEditing(true)
    setShowAdvanced(
      Boolean(
        server.toolCallTimeoutMs ||
        server.failOnStartupError ||
        (server.reconnect &&
          (server.reconnect.enabled === false ||
            server.reconnect.initialDelayMs !== undefined ||
            server.reconnect.maxDelayMs !== undefined ||
            server.reconnect.maxAttempts !== undefined)),
      ),
    )
    setFormServer({
      ...server,
      reconnect: {
        enabled: server.reconnect?.enabled !== false,
        initialDelayMs: server.reconnect?.initialDelayMs,
        maxDelayMs: server.reconnect?.maxDelayMs,
        maxAttempts: server.reconnect?.maxAttempts,
      },
      disabledTools: server.disabledTools ? [...server.disabledTools] : [],
    })
    setEnvEntries(
      server.env
        ? Object.entries(server.env).map(([key, value]) => ({ key, value }))
        : [],
    )
    setHeaderEntries(
      server.headers
        ? Object.entries(server.headers).map(([key, value]) => ({ key, value }))
        : [],
    )
    setFormError('')
    setFormTestResult(null)
    setFormOpen(true)
  }

  // Delete server
  const handleDelete = async (server: GlobalMcpServerConfig) => {
    const confirmText = t('notices.deleteConfirm', {
      name: server.name || server.id,
    })
    if (!window.confirm(confirmText)) return

    try {
      const res = await fetch(
        `/api/mcp-servers?id=${encodeURIComponent(server.id)}`,
        {
          method: 'DELETE',
        },
      )
      if (res.ok) {
        const data = await res.json()
        if (data.ok) {
          setServers(data.servers || [])
          saveLocalMcpServers(data.servers || [])
          setSuccessMsg(t('notices.deleted'))
          setTimeout(() => setSuccessMsg(''), 3000)
        }
      }
    } catch (err: any) {
      setError(t('notices.error') + (err?.message || String(err)))
    }
  }

  // Test connection from card
  const handleTest = async (server: Partial<GlobalMcpServerConfig>) => {
    const id = server.id || 'form_test'
    setTestingId(id)
    try {
      const res = await fetch('/api/mcp-servers?action=test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test', server }),
      })
      const data = await res.json()
      setTestResults((prev) => ({
        ...prev,
        [id]: {
          ok: Boolean(data.ok),
          message: data.message || (data.ok ? 'Connection OK' : 'Failed'),
        },
      }))
      if (data.servers) {
        setServers(data.servers)
        saveLocalMcpServers(data.servers)
      } else if (data.ok && server.id) {
        setServers((prev) => {
          const next = prev.map((s) =>
            s.id === server.id
              ? {
                  ...s,
                  detectedTransport:
                    data.detectedTransport || s.detectedTransport,
                  serverInfo: data.serverInfo || s.serverInfo,
                  compatibility: data.compatibility || s.compatibility,
                  lastTestedAt: Date.now(),
                }
              : s,
          )
          saveLocalMcpServers(next)
          return next
        })
      }
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        [id]: { ok: false, message: err?.message || String(err) },
      }))
    } finally {
      setTestingId(null)
    }
  }

  // Test connection from inside add/edit modal
  const handleFormTest = async () => {
    setFormError('')
    setFormTestResult(null)
    if (formServer.transport === 'stdio' && !formServer.command?.trim()) {
      setFormError(t('form.command') + ' is required for stdio')
      return
    }
    if (formServer.transport !== 'stdio' && !formServer.url?.trim()) {
      setFormError(t('form.url') + ' is required for HTTP/SSE')
      return
    }

    const envMap: Record<string, string> = {}
    for (const item of envEntries) {
      if (item.key.trim()) envMap[item.key.trim()] = item.value
    }
    const headerMap: Record<string, string> = {}
    for (const item of headerEntries) {
      if (item.key.trim()) headerMap[item.key.trim()] = item.value
    }

    const serverObj: Partial<GlobalMcpServerConfig> = {
      id: formServer.id?.trim() || 'modal_test',
      transport: formServer.transport,
      command: formServer.command?.trim(),
      args: formServer.args || [],
      cwd: formServer.cwd?.trim() || undefined,
      env: Object.keys(envMap).length > 0 ? envMap : undefined,
      url: formServer.url?.trim(),
      headers: Object.keys(headerMap).length > 0 ? headerMap : undefined,
      toolCallTimeoutMs:
        formServer.toolCallTimeoutMs && formServer.toolCallTimeoutMs > 0
          ? Number(formServer.toolCallTimeoutMs)
          : undefined,
      failOnStartupError: Boolean(formServer.failOnStartupError),
      reconnect: formServer.reconnect,
    }

    setFormTesting(true)
    try {
      const res = await fetch('/api/mcp-servers?action=test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test', server: serverObj }),
      })
      const data = await res.json()
      setFormTestResult({
        ok: Boolean(data.ok),
        message: data.message || (data.ok ? 'Connection OK' : 'Failed'),
      })
      if (data.ok) {
        setFormServer((prev) => ({
          ...prev,
          detectedTransport: data.detectedTransport || prev.detectedTransport,
          serverInfo: data.serverInfo || prev.serverInfo,
          compatibility: data.compatibility || prev.compatibility,
          lastTestedAt: Date.now(),
        }))
      }
    } catch (err: any) {
      setFormTestResult({
        ok: false,
        message: err?.message || String(err),
      })
    } finally {
      setFormTesting(false)
    }
  }

  // Fetch tools from MCP server for tools modal
  const fetchToolsForServer = async (
    server: Partial<GlobalMcpServerConfig>,
  ) => {
    setToolsLoading(true)
    setToolsError('')
    try {
      const res = await fetch('/api/mcp-servers?action=tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'tools', server }),
      })
      const data = await res.json()
      if (data.ok) {
        if (data.serverInfo) {
          setToolsServerInfo(data.serverInfo)
        }
        if (data.detectedTransport) {
          setToolsDetectedTransport(data.detectedTransport)
        }
        if (data.servers) {
          setServers(data.servers)
          saveLocalMcpServers(data.servers)
        } else if (server.id) {
          setServers((prev) => {
            const next = prev.map((s) =>
              s.id === server.id
                ? {
                    ...s,
                    detectedTransport:
                      data.detectedTransport || s.detectedTransport,
                    serverInfo: data.serverInfo || s.serverInfo,
                    lastTestedAt: Date.now(),
                  }
                : s,
            )
            saveLocalMcpServers(next)
            return next
          })
        }
        if (Array.isArray(data.toolDetails)) {
          setToolsList(data.toolDetails)
        } else if (Array.isArray(data.tools)) {
          setToolsList(
            data.tools.map((t: any) =>
              typeof t === 'string' ? { name: t } : t,
            ),
          )
        }
      } else {
        setToolsError(data.message || 'Failed to fetch tools from MCP server')
      }
    } catch (err: any) {
      setToolsError(err?.message || String(err))
    } finally {
      setToolsLoading(false)
    }
  }

  // Open Tools modal from card or form
  const handleOpenTools = (
    server: Partial<GlobalMcpServerConfig>,
    source: 'card' | 'form' = 'card',
  ) => {
    setToolsTargetServer(server)
    setToolsSource(source)
    setToolsDisabledSet(new Set(server.disabledTools || []))
    setToolsSearch('')
    setToolsExpandedSchemas(new Set())
    setToolsList([])
    setToolsServerInfo(null)
    setToolsDetectedTransport(null)
    setToolsModalOpen(true)
    fetchToolsForServer(server)
  }

  // Open Tools modal from inside Add/Edit modal
  const handleFormOpenTools = () => {
    if (formServer.transport === 'stdio' && !formServer.command?.trim()) {
      setFormError(t('form.command') + ' is required for stdio')
      return
    }
    if (formServer.transport !== 'stdio' && !formServer.url?.trim()) {
      setFormError(t('form.url') + ' is required for HTTP/SSE')
      return
    }

    const envMap: Record<string, string> = {}
    for (const item of envEntries) {
      if (item.key.trim()) envMap[item.key.trim()] = item.value
    }
    const headerMap: Record<string, string> = {}
    for (const item of headerEntries) {
      if (item.key.trim()) headerMap[item.key.trim()] = item.value
    }

    const serverObj: Partial<GlobalMcpServerConfig> = {
      id: formServer.id?.trim() || 'modal_tools',
      name: formServer.name?.trim() || 'MCP Server',
      description: formServer.description?.trim(),
      transport: formServer.transport,
      command: formServer.command?.trim(),
      args: formServer.args || [],
      cwd: formServer.cwd?.trim() || undefined,
      env: Object.keys(envMap).length > 0 ? envMap : undefined,
      url: formServer.url?.trim(),
      headers: Object.keys(headerMap).length > 0 ? headerMap : undefined,
      toolCallTimeoutMs:
        formServer.toolCallTimeoutMs && formServer.toolCallTimeoutMs > 0
          ? Number(formServer.toolCallTimeoutMs)
          : undefined,
      failOnStartupError: Boolean(formServer.failOnStartupError),
      reconnect: formServer.reconnect,
      disabledTools: formServer.disabledTools || [],
    }

    handleOpenTools(serverObj, 'form')
  }

  // Toggle single tool enabled/disabled
  const handleToggleTool = (toolName: string) => {
    setToolsDisabledSet((prev) => {
      const next = new Set(prev)
      if (next.has(toolName)) {
        next.delete(toolName)
      } else {
        next.add(toolName)
      }
      return next
    })
  }

  // Toggle all tools enabled or disabled
  const handleToggleAllTools = (enableAll: boolean) => {
    if (enableAll) {
      setToolsDisabledSet(new Set())
    } else {
      setToolsDisabledSet(new Set(toolsList.map((t) => t.name)))
    }
  }

  // Toggle schema preview
  const handleToggleSchema = (toolName: string) => {
    setToolsExpandedSchemas((prev) => {
      const next = new Set(prev)
      if (next.has(toolName)) {
        next.delete(toolName)
      } else {
        next.add(toolName)
      }
      return next
    })
  }

  // Save tools configuration from tools modal
  const handleSaveToolsModal = async () => {
    const disabledArray = Array.from(toolsDisabledSet)
    if (toolsSource === 'form') {
      setFormServer((prev) => ({
        ...prev,
        disabledTools: disabledArray,
      }))
      setToolsModalOpen(false)
      setSuccessMsg(t('toolsModal.saveSuccess'))
      setTimeout(() => setSuccessMsg(''), 3000)
      return
    }

    if (!toolsTargetServer?.id) {
      setToolsModalOpen(false)
      return
    }

    setToolsSaving(true)
    try {
      const targetServer =
        servers.find((s) => s.id === toolsTargetServer.id) || toolsTargetServer
      const updatedServer: GlobalMcpServerConfig = {
        ...targetServer,
        disabledTools: disabledArray,
      } as GlobalMcpServerConfig

      const res = await fetch('/api/mcp-servers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ server: updatedServer }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setServers(data.servers || [])
        saveLocalMcpServers(data.servers || [])
        setToolsModalOpen(false)
        setSuccessMsg(t('toolsModal.saveSuccess'))
        setTimeout(() => setSuccessMsg(''), 3000)
      } else {
        setToolsError(data.error || 'Failed to save tool settings')
      }
    } catch (err: any) {
      setToolsError(err?.message || String(err))
    } finally {
      setToolsSaving(false)
    }
  }

  // Filtered tools memo
  const filteredTools = React.useMemo(() => {
    const q = toolsSearch.trim().toLowerCase()
    if (!q) return toolsList
    return toolsList.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)),
    )
  }, [toolsList, toolsSearch])

  // Direct save execution to backend
  const executeSave = async (payload: GlobalMcpServerConfig) => {
    setFormSaving(true)
    setSaveConfirm(null)
    try {
      const res = await fetch('/api/mcp-servers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ server: payload }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setServers(data.servers || [])
        saveLocalMcpServers(data.servers || [])
        setFormOpen(false)
        setSuccessMsg(t('notices.saved'))
        setTimeout(() => setSuccessMsg(''), 3000)
      } else {
        setFormError(data.error || 'Failed to save server')
      }
    } catch (err: any) {
      setFormError(err?.message || String(err))
    } finally {
      setFormSaving(false)
    }
  }

  // Save server from modal with automatic pre-save test
  const handleSaveForm = async () => {
    setFormError('')
    if (!formServer.id?.trim()) {
      setFormError(t('form.id') + ' is required')
      return
    }
    if (!formServer.name?.trim()) {
      setFormError(t('form.name') + ' is required')
      return
    }
    if (formServer.transport === 'stdio' && !formServer.command?.trim()) {
      setFormError(t('form.command') + ' is required for stdio')
      return
    }
    if (formServer.transport !== 'stdio' && !formServer.url?.trim()) {
      setFormError(t('form.url') + ' is required for HTTP/SSE')
      return
    }

    const envMap: Record<string, string> = {}
    for (const item of envEntries) {
      if (item.key.trim()) envMap[item.key.trim()] = item.value
    }

    const headerMap: Record<string, string> = {}
    for (const item of headerEntries) {
      if (item.key.trim()) headerMap[item.key.trim()] = item.value
    }

    const payload: GlobalMcpServerConfig = {
      id: formServer.id.trim(),
      name: formServer.name.trim(),
      description: formServer.description?.trim() || undefined,
      transport: formServer.transport as McpTransportType,
      command: formServer.command?.trim() || undefined,
      args: formServer.args || [],
      cwd: formServer.cwd?.trim() || undefined,
      url: formServer.url?.trim() || undefined,
      env: Object.keys(envMap).length > 0 ? envMap : undefined,
      headers: Object.keys(headerMap).length > 0 ? headerMap : undefined,
      enabledByDefault: Boolean(formServer.enabledByDefault),
      toolCallTimeoutMs:
        formServer.toolCallTimeoutMs && formServer.toolCallTimeoutMs > 0
          ? Number(formServer.toolCallTimeoutMs)
          : undefined,
      failOnStartupError: Boolean(formServer.failOnStartupError),
      disabledTools:
        formServer.disabledTools && formServer.disabledTools.length > 0
          ? formServer.disabledTools
          : undefined,
      detectedTransport: formServer.detectedTransport,
      serverInfo: formServer.serverInfo,
      lastTestedAt: formServer.lastTestedAt,
      reconnect: {
        enabled: formServer.reconnect?.enabled !== false,
        initialDelayMs:
          formServer.reconnect?.initialDelayMs !== undefined &&
          formServer.reconnect.initialDelayMs >= 0
            ? Number(formServer.reconnect.initialDelayMs)
            : undefined,
        maxDelayMs:
          formServer.reconnect?.maxDelayMs !== undefined &&
          formServer.reconnect.maxDelayMs >= 0
            ? Number(formServer.reconnect.maxDelayMs)
            : undefined,
        maxAttempts:
          formServer.reconnect?.maxAttempts !== undefined &&
          formServer.reconnect.maxAttempts >= 0
            ? Number(formServer.reconnect.maxAttempts)
            : undefined,
      },
    }

    // Automatically trigger a connection test before saving
    setFormSaving(true)
    try {
      const testRes = await fetch('/api/mcp-servers?action=test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test', server: payload }),
      })
      const testData = await testRes.json()
      if (testData.ok) {
        payload.detectedTransport =
          testData.detectedTransport || payload.detectedTransport
        payload.serverInfo = testData.serverInfo || payload.serverInfo
        payload.lastTestedAt = Date.now()
        await executeSave(payload)
      } else {
        setFormSaving(false)
        setSaveConfirm({
          open: true,
          message: testData.message || '连接测试未通过',
          payload,
        })
      }
    } catch (err: any) {
      setFormSaving(false)
      setSaveConfirm({
        open: true,
        message: err?.message || String(err),
        payload,
      })
    }
  }

  // Import JSON handler
  const handleImportSubmit = async () => {
    setImportError('')
    if (!importText.trim()) return

    try {
      const parsed = JSON.parse(importText.trim())
      const mcpDict = parsed.mcpServers || parsed
      if (!mcpDict || typeof mcpDict !== 'object') {
        setImportError(t('importModal.error'))
        return
      }

      setImporting(true)
      let importedCount = 0

      for (const [key, val] of Object.entries(mcpDict)) {
        if (!val || typeof val !== 'object') continue
        const item = val as any
        const transport: McpTransportType =
          item.transport === 'stdio' || (item.command && !item.url)
            ? 'stdio'
            : 'streamable-http-or-sse'

        const serverObj: GlobalMcpServerConfig = {
          id: key.replace(/[^a-zA-Z0-9_-]/g, '_'),
          name: item.name || key,
          description: item.description,
          transport,
          command: item.command,
          args: Array.isArray(item.args) ? item.args : [],
          env: item.env && typeof item.env === 'object' ? item.env : undefined,
          cwd: item.cwd,
          url: item.url,
          headers:
            item.headers && typeof item.headers === 'object'
              ? item.headers
              : undefined,
          enabledByDefault: Boolean(item.enabledByDefault),
          toolCallTimeoutMs:
            typeof item.toolCallTimeoutMs === 'number' &&
            item.toolCallTimeoutMs > 0
              ? item.toolCallTimeoutMs
              : undefined,
          failOnStartupError:
            typeof item.failOnStartupError === 'boolean'
              ? item.failOnStartupError
              : undefined,
          reconnect:
            item.reconnect && typeof item.reconnect === 'object'
              ? item.reconnect
              : undefined,
        }

        await fetch('/api/mcp-servers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ server: serverObj }),
        })
        importedCount++
      }

      await loadServers()
      setImportOpen(false)
      setImportText('')
      setSuccessMsg(t('importModal.success', { count: importedCount }))
      setTimeout(() => setSuccessMsg(''), 3500)
    } catch (err: any) {
      setImportError(
        t('importModal.error') + ': ' + (err?.message || String(err)),
      )
    } finally {
      setImporting(false)
    }
  }

  return e(
    'div',
    { className: 'dsh-mcp-settings-page' },
    // Header & Action Bar
    e(
      'div',
      { className: 'dsh-mcp-header-card' },
      e(
        'div',
        { className: 'dsh-mcp-header-title-row' },
        e(
          'div',
          null,
          e('h2', { className: 'dsh-mcp-page-title' }, t('title')),
          e('p', { className: 'dsh-mcp-page-desc' }, t('desc')),
        ),
        e(
          'div',
          { className: 'dsh-mcp-header-actions' },
          e(
            'button',
            {
              type: 'button',
              className: 'dsh-sam-btn secondary',
              onClick: loadServers,
              title: t('actions.refresh'),
            },
            e(IconRefreshOutline16, { size: 14 }),
          ),
          e(
            'button',
            {
              type: 'button',
              className: 'dsh-sam-btn secondary',
              onClick: () => setImportOpen(true),
            },
            t('actions.import'),
          ),
          e(
            'button',
            {
              type: 'button',
              className: 'dsh-sam-btn primary',
              onClick: handleOpenAdd,
            },
            e(IconPlusOutline16, { size: 14, className: 'dsh-btn-icon-left' }),
            t('actions.add'),
          ),
        ),
      ),
    ),

    // Notifications
    successMsg
      ? e('div', { className: 'dsh-sam-notice success' }, successMsg)
      : null,
    error ? e('div', { className: 'dsh-sam-notice error' }, error) : null,

    // Server Cards / List
    loading
      ? e('div', { className: 'dsh-sam-loading' }, 'Loading MCP servers...')
      : servers.length === 0
        ? e(
            'div',
            { className: 'dsh-mcp-empty-card' },
            e(
              'div',
              { className: 'dsh-mcp-empty-icon' },
              e(IconCodeOutline16, { size: 28 }),
            ),
            e('div', { className: 'dsh-mcp-empty-text' }, t('table.empty')),
            e(
              'button',
              {
                type: 'button',
                className: 'dsh-sam-btn primary',
                onClick: handleOpenAdd,
              },
              t('actions.add'),
            ),
          )
        : e(
            'div',
            { className: 'dsh-mcp-server-list' },
            servers.map((server) => {
              const testResult = testResults[server.id]
              const isTesting = testingId === server.id
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
                { key: server.id, className: 'dsh-mcp-server-card' },
                // Card Top Row
                e(
                  'div',
                  { className: 'dsh-mcp-card-top' },
                  e(
                    'div',
                    { className: 'dsh-mcp-card-identity' },
                    e(
                      'div',
                      { className: 'dsh-mcp-transport-icon' },
                      server.transport === 'stdio'
                        ? e(IconCodeOutline16, { size: 16 })
                        : e(IconLinkOutline16, { size: 16 }),
                    ),
                    e(
                      'div',
                      { className: 'dsh-mcp-title-wrap' },
                      e(
                        'span',
                        { className: 'dsh-mcp-card-name' },
                        server.name,
                      ),
                      e('span', { className: 'dsh-mcp-card-id' }, server.id),
                    ),
                  ),
                  e(
                    'div',
                    { className: 'dsh-mcp-badges' },
                    e(
                      'span',
                      { className: `dsh-mcp-proto-badge ${protoClass}` },
                      protoLabel,
                    ),
                    server.serverInfo?.version
                      ? e(
                          'span',
                          {
                            className: 'dsh-mcp-proto-badge server-version',
                            title: server.serverInfo.protocolVersion
                              ? `MCP Protocol: ${server.serverInfo.protocolVersion}`
                              : server.serverInfo.name || undefined,
                          },
                          server.serverInfo.name &&
                            server.serverInfo.name !== server.id &&
                            server.serverInfo.name !== server.name
                            ? `${server.serverInfo.name} ${server.serverInfo.version}`
                            : server.serverInfo.version,
                        )
                      : server.serverInfo?.protocolVersion
                        ? e(
                            'span',
                            {
                              className: 'dsh-mcp-proto-badge server-version',
                              title: server.serverInfo.name || undefined,
                            },
                            `MCP ${server.serverInfo.protocolVersion}`,
                          )
                        : null,
                    server.toolCallTimeoutMs
                      ? e(
                          'span',
                          { className: 'dsh-mcp-proto-badge timeout' },
                          `${server.toolCallTimeoutMs / 1000}s 超时`,
                        )
                      : null,
                    server.disabledTools && server.disabledTools.length > 0
                      ? e(
                          'span',
                          { className: 'dsh-mcp-proto-badge disabled-tools' },
                          t('toolsModal.disabledBadge', {
                            count: server.disabledTools.length,
                          }),
                        )
                      : null,
                    server.compatibility?.status ===
                      'incompatible-2026-07-28' ||
                      server.compatibility?.canEnable === false
                      ? e(
                          'span',
                          {
                            className: 'dsh-mcp-proto-badge incompatible',
                            title:
                              server.compatibility.warning ||
                              t('compatibility.incompatibleDesc'),
                          },
                          t('compatibility.incompatibleBadge'),
                        )
                      : server.compatibility?.status === 'downgrade-supported'
                        ? e(
                            'span',
                            {
                              className: 'dsh-mcp-proto-badge downgrade',
                              title:
                                server.compatibility.warning ||
                                t('compatibility.downgradedDesc'),
                            },
                            t('compatibility.downgradedBadge', {
                              version:
                                server.compatibility.negotiatedVersion ||
                                '2025-11-25',
                            }),
                          )
                        : null,
                    server.enabledByDefault
                      ? e(
                          'span',
                          { className: 'dsh-mcp-default-badge' },
                          t('table.enabledDefault'),
                        )
                      : null,
                  ),
                ),

                // Description
                server.description
                  ? e(
                      'p',
                      { className: 'dsh-mcp-card-desc' },
                      server.description,
                    )
                  : null,

                // Target info (Command + args or URL)
                e(
                  'div',
                  { className: 'dsh-mcp-target-box' },
                  server.transport === 'stdio'
                    ? e(
                        'code',
                        { className: 'dsh-mcp-code-preview' },
                        `${server.command || ''} ${(server.args || []).join(' ')}`,
                      )
                    : e(
                        'code',
                        { className: 'dsh-mcp-code-preview' },
                        server.url || '',
                      ),
                ),

                // Test result inline banner
                testResult
                  ? e(
                      'div',
                      {
                        className: `dsh-mcp-inline-test ${testResult.ok ? 'success' : 'error'}`,
                      },
                      !testResult.ok
                        ? e(IconWarningOutline16, { size: 14 })
                        : null,
                      e('span', null, testResult.message),
                    )
                  : null,

                // Card Footer Actions
                e(
                  'div',
                  { className: 'dsh-mcp-card-footer' },
                  e(
                    'div',
                    {
                      style: {
                        display: 'flex',
                        gap: '6px',
                        alignItems: 'center',
                      },
                    },
                    e(
                      'button',
                      {
                        type: 'button',
                        className: 'dsh-mcp-mini-btn',
                        disabled: isTesting,
                        onClick: () => handleTest(server),
                        title: t('actions.test'),
                      },
                      isTesting
                        ? e(IconLoadingOutline16, {
                            size: 13,
                            className: 'dsh-spin',
                          })
                        : e(IconPlayOutline16, { size: 13 }),
                      isTesting ? t('actions.testing') : t('actions.test'),
                    ),
                    e(
                      'button',
                      {
                        type: 'button',
                        className: 'dsh-mcp-mini-btn',
                        onClick: () => handleOpenTools(server, 'card'),
                        title: t('actions.toolsList'),
                      },
                      e(IconChecklistOutline14, { size: 13 }),
                      t('actions.toolsList'),
                      server.disabledTools && server.disabledTools.length > 0
                        ? e(
                            'span',
                            { className: 'dsh-mcp-mini-badge danger' },
                            String(server.disabledTools.length),
                          )
                        : null,
                    ),
                  ),
                  e(
                    'div',
                    { className: 'dsh-mcp-footer-right' },
                    e(
                      'button',
                      {
                        type: 'button',
                        className: 'dsh-mcp-icon-btn',
                        onClick: () => handleOpenEdit(server),
                        title: t('actions.edit'),
                      },
                      e(IconEditOutline16, { size: 14 }),
                    ),
                    e(
                      'button',
                      {
                        type: 'button',
                        className: 'dsh-mcp-icon-btn danger',
                        onClick: () => handleDelete(server),
                        title: t('actions.delete'),
                      },
                      e(IconTrashOutline16, { size: 14 }),
                    ),
                  ),
                ),
              )
            }),
          ),

    // Add / Edit Modal
    formOpen
      ? e(
          'div',
          {
            className: 'dsh-sam-modal-overlay',
            onClick: (evt: any) => {
              if (evt.target === evt.currentTarget) setFormOpen(false)
            },
          },
          e(
            'div',
            { className: 'dsh-sam-modal-panel dsh-mcp-form-modal' },
            // Header
            e(
              'div',
              { className: 'dsh-sam-header-row' },
              e(
                'h3',
                { className: 'dsh-sam-title' },
                isEditing ? t('form.editTitle') : t('form.addTitle'),
              ),
              e(
                'button',
                {
                  type: 'button',
                  className: 'dsh-sam-close-btn',
                  onClick: () => setFormOpen(false),
                },
                e(IconCloseOutline16, { size: 16 }),
              ),
            ),

            // Form Notices & Test / Compatibility Results
            formError ||
              formTestResult ||
              formServer.compatibility?.canEnable === false ||
              formServer.compatibility?.status === 'incompatible-2026-07-28' ||
              formServer.compatibility?.status === 'downgrade-supported'
              ? e(
                  'div',
                  { className: 'dsh-sam-notices-block' },
                  formError
                    ? e('div', { className: 'dsh-sam-notice error' }, formError)
                    : null,
                  formTestResult
                    ? e(
                        'div',
                        {
                          className: `dsh-sam-notice ${formTestResult.ok ? 'success' : 'error'}`,
                        },
                        formTestResult.message,
                      )
                    : null,
                  formServer.compatibility?.canEnable === false ||
                    formServer.compatibility?.status ===
                      'incompatible-2026-07-28'
                    ? e(
                        'div',
                        { className: 'dsh-sam-notice error' },
                        `⚠️ ${t('compatibility.incompatibleBadge')}: ${formServer.compatibility?.warning || t('compatibility.incompatibleDesc')}`,
                      )
                    : formServer.compatibility?.status === 'downgrade-supported'
                      ? e(
                          'div',
                          { className: 'dsh-sam-notice info' },
                          `ℹ️ ${t('compatibility.downgradedBadge', { version: formServer.compatibility.negotiatedVersion || '2025-11-25' })}: ${formServer.compatibility?.warning || t('compatibility.downgradedDesc')}`,
                        )
                      : null,
                )
              : null,

            // Form Content
            e(
              'div',
              { className: 'dsh-mcp-form-body' },
              // Top Switch: Enabled By Default
              e(
                'div',
                {
                  className: `dsh-mcp-switch-card ${formServer.enabledByDefault ? 'active' : ''}`,
                  role: 'button',
                  tabIndex: 0,
                  onClick: () =>
                    setFormServer({
                      ...formServer,
                      enabledByDefault: !formServer.enabledByDefault,
                    }),
                  onKeyDown: (evt: any) => {
                    if (evt.key === ' ' || evt.key === 'Enter') {
                      evt.preventDefault()
                      setFormServer({
                        ...formServer,
                        enabledByDefault: !formServer.enabledByDefault,
                      })
                    }
                  },
                },
                e(
                  'div',
                  { className: 'dsh-mcp-switch-text' },
                  e(
                    'div',
                    { className: 'dsh-mcp-switch-title' },
                    t('form.enabledByDefault'),
                  ),
                  e(
                    'div',
                    { className: 'dsh-mcp-switch-desc' },
                    t('form.enabledByDefaultDesc'),
                  ),
                ),
                e(
                  'div',
                  {
                    className: `dsh-mcp-switch-btn ${formServer.enabledByDefault ? 'active' : ''}`,
                    'aria-hidden': 'true',
                  },
                  e('span', { className: 'dsh-mcp-switch-thumb' }),
                ),
              ),

              // ID & Name Row
              e(
                'div',
                { className: 'dsh-mcp-form-row' },
                e(
                  'div',
                  { className: 'dsh-sam-field-group flex-1' },
                  e(
                    'label',
                    { className: 'dsh-sam-field-label' },
                    t('form.id'),
                  ),
                  e('input', {
                    type: 'text',
                    className: 'dsh-sam-select',
                    placeholder: t('form.idPlaceholder'),
                    disabled: isEditing,
                    value: formServer.id || '',
                    onChange: (evt: any) =>
                      setFormServer({ ...formServer, id: evt.target.value }),
                  }),
                ),
                e(
                  'div',
                  { className: 'dsh-sam-field-group flex-1' },
                  e(
                    'label',
                    { className: 'dsh-sam-field-label' },
                    t('form.name'),
                  ),
                  e('input', {
                    type: 'text',
                    className: 'dsh-sam-select',
                    placeholder: t('form.namePlaceholder'),
                    value: formServer.name || '',
                    onChange: (evt: any) =>
                      setFormServer({ ...formServer, name: evt.target.value }),
                  }),
                ),
              ),

              // Description
              e(
                'div',
                { className: 'dsh-sam-field-group' },
                e(
                  'label',
                  { className: 'dsh-sam-field-label' },
                  t('form.description'),
                ),
                e('input', {
                  type: 'text',
                  className: 'dsh-sam-select',
                  placeholder: t('form.descriptionPlaceholder'),
                  value: formServer.description || '',
                  onChange: (evt: any) =>
                    setFormServer({
                      ...formServer,
                      description: evt.target.value,
                    }),
                }),
              ),

              // Transport Selector
              e(
                'div',
                { className: 'dsh-sam-field-group' },
                e(
                  'label',
                  { className: 'dsh-sam-field-label' },
                  t('form.transport'),
                ),
                e(
                  'select',
                  {
                    className: 'dsh-sam-select',
                    value: formServer.transport || 'stdio',
                    onChange: (evt: any) =>
                      setFormServer({
                        ...formServer,
                        transport: evt.target.value as McpTransportType,
                      }),
                  },
                  e('option', { value: 'stdio' }, t('form.transportStdio')),
                  e(
                    'option',
                    { value: 'streamable-http-or-sse' },
                    t('form.transportHttp'),
                  ),
                ),
              ),

              // Transport specific fields
              formServer.transport === 'stdio'
                ? e(
                    React.Fragment,
                    null,
                    // Command
                    e(
                      'div',
                      { className: 'dsh-sam-field-group' },
                      e(
                        'label',
                        { className: 'dsh-sam-field-label' },
                        t('form.command'),
                      ),
                      e('input', {
                        type: 'text',
                        className: 'dsh-sam-select',
                        placeholder: t('form.commandPlaceholder'),
                        value: formServer.command || '',
                        onChange: (evt: any) =>
                          setFormServer({
                            ...formServer,
                            command: evt.target.value,
                          }),
                      }),
                    ),
                    // Arguments
                    e(
                      'div',
                      { className: 'dsh-sam-field-group' },
                      e(
                        'label',
                        { className: 'dsh-sam-field-label' },
                        t('form.args'),
                      ),
                      e('textarea', {
                        className: 'dsh-mcp-textarea',
                        placeholder: t('form.argsPlaceholder'),
                        rows: 3,
                        value: (formServer.args || []).join('\n'),
                        onChange: (evt: any) =>
                          setFormServer({
                            ...formServer,
                            args: evt.target.value
                              .split('\n')
                              .map((s: string) => s.trim())
                              .filter(Boolean),
                          }),
                      }),
                    ),
                    // CWD
                    e(
                      'div',
                      { className: 'dsh-sam-field-group' },
                      e(
                        'label',
                        { className: 'dsh-sam-field-label' },
                        t('form.cwd'),
                      ),
                      e('input', {
                        type: 'text',
                        className: 'dsh-sam-select',
                        placeholder: t('form.cwdPlaceholder'),
                        value: formServer.cwd || '',
                        onChange: (evt: any) =>
                          setFormServer({
                            ...formServer,
                            cwd: evt.target.value,
                          }),
                      }),
                    ),
                    // ENV entries
                    e(
                      'div',
                      { className: 'dsh-sam-field-group' },
                      e(
                        'label',
                        { className: 'dsh-sam-field-label' },
                        t('form.env'),
                      ),
                      envEntries.length > 0
                        ? e(
                            'div',
                            { className: 'dsh-mcp-kv-list' },
                            envEntries.map((item, idx) =>
                              e(
                                'div',
                                { key: idx, className: 'dsh-mcp-kv-row' },
                                e('input', {
                                  type: 'text',
                                  className: 'dsh-sam-select',
                                  placeholder: t('form.envKey'),
                                  value: item.key,
                                  onChange: (evt: any) => {
                                    const next = [...envEntries]
                                    next[idx].key = evt.target.value
                                    setEnvEntries(next)
                                  },
                                }),
                                e('input', {
                                  type: 'text',
                                  className: 'dsh-sam-select',
                                  placeholder: t('form.envValue'),
                                  value: item.value,
                                  onChange: (evt: any) => {
                                    const next = [...envEntries]
                                    next[idx].value = evt.target.value
                                    setEnvEntries(next)
                                  },
                                }),
                                e(
                                  'button',
                                  {
                                    type: 'button',
                                    className: 'dsh-mcp-kv-del-btn',
                                    title: t('actions.delete'),
                                    onClick: () => {
                                      setEnvEntries(
                                        envEntries.filter((_, i) => i !== idx),
                                      )
                                    },
                                  },
                                  e(IconCloseOutline16, { size: 15 }),
                                ),
                              ),
                            ),
                          )
                        : null,
                      e(
                        'button',
                        {
                          type: 'button',
                          className: 'dsh-mcp-add-btn',
                          onClick: () =>
                            setEnvEntries([
                              ...envEntries,
                              { key: '', value: '' },
                            ]),
                        },
                        e(IconPlusOutline16, { size: 14 }),
                        t('form.addEnv'),
                      ),
                    ),
                  )
                : e(
                    React.Fragment,
                    null,
                    // URL
                    e(
                      'div',
                      { className: 'dsh-sam-field-group' },
                      e(
                        'label',
                        { className: 'dsh-sam-field-label' },
                        t('form.url'),
                      ),
                      e('input', {
                        type: 'text',
                        className: 'dsh-sam-select',
                        placeholder: t('form.urlPlaceholder'),
                        value: formServer.url || '',
                        onChange: (evt: any) =>
                          setFormServer({
                            ...formServer,
                            url: evt.target.value,
                          }),
                      }),
                    ),
                    // Headers
                    e(
                      'div',
                      { className: 'dsh-sam-field-group' },
                      e(
                        'label',
                        { className: 'dsh-sam-field-label' },
                        t('form.headers'),
                      ),
                      headerEntries.length > 0
                        ? e(
                            'div',
                            { className: 'dsh-mcp-kv-list' },
                            headerEntries.map((item, idx) =>
                              e(
                                'div',
                                { key: idx, className: 'dsh-mcp-kv-row' },
                                e('input', {
                                  type: 'text',
                                  className: 'dsh-sam-select',
                                  placeholder: t('form.headerKey'),
                                  value: item.key,
                                  onChange: (evt: any) => {
                                    const next = [...headerEntries]
                                    next[idx].key = evt.target.value
                                    setHeaderEntries(next)
                                  },
                                }),
                                e('input', {
                                  type: 'text',
                                  className: 'dsh-sam-select',
                                  placeholder: t('form.headerValue'),
                                  value: item.value,
                                  onChange: (evt: any) => {
                                    const next = [...headerEntries]
                                    next[idx].value = evt.target.value
                                    setHeaderEntries(next)
                                  },
                                }),
                                e(
                                  'button',
                                  {
                                    type: 'button',
                                    className: 'dsh-mcp-kv-del-btn',
                                    title: t('actions.delete'),
                                    onClick: () => {
                                      setHeaderEntries(
                                        headerEntries.filter(
                                          (_, i) => i !== idx,
                                        ),
                                      )
                                    },
                                  },
                                  e(IconCloseOutline16, { size: 15 }),
                                ),
                              ),
                            ),
                          )
                        : null,
                      e(
                        'button',
                        {
                          type: 'button',
                          className: 'dsh-mcp-add-btn',
                          onClick: () =>
                            setHeaderEntries([
                              ...headerEntries,
                              { key: '', value: '' },
                            ]),
                        },
                        e(IconPlusOutline16, { size: 14 }),
                        t('form.addHeader'),
                      ),
                    ),
                  ),

              // Advanced & Runtime Settings (Collapsible Box)
              e(
                'div',
                { className: 'dsh-mcp-advanced-box' },
                e(
                  'div',
                  {
                    className: 'dsh-mcp-advanced-header',
                    role: 'button',
                    tabIndex: 0,
                    onClick: () => setShowAdvanced((prev) => !prev),
                  },
                  e(
                    'div',
                    { className: 'dsh-mcp-advanced-title-wrap' },
                    e(
                      'span',
                      { className: 'dsh-mcp-advanced-title' },
                      t('form.advancedTitle'),
                    ),
                    e(
                      'span',
                      { className: 'dsh-mcp-advanced-badge' },
                      showAdvanced ? '收起' : '展开配置',
                    ),
                  ),
                ),

                showAdvanced
                  ? e(
                      'div',
                      { className: 'dsh-mcp-advanced-content' },
                      // 1. Tool Call Timeout (ms)
                      e(
                        'div',
                        { className: 'dsh-sam-field-group' },
                        e(
                          'label',
                          { className: 'dsh-sam-field-label' },
                          t('form.toolCallTimeoutMs'),
                        ),
                        e('input', {
                          type: 'number',
                          min: 1000,
                          step: 1000,
                          className: 'dsh-sam-select',
                          placeholder: t('form.toolCallTimeoutMsPlaceholder'),
                          value:
                            formServer.toolCallTimeoutMs !== undefined
                              ? formServer.toolCallTimeoutMs
                              : '',
                          onChange: (evt: any) =>
                            setFormServer({
                              ...formServer,
                              toolCallTimeoutMs: evt.target.value
                                ? parseInt(evt.target.value, 10)
                                : undefined,
                            }),
                        }),
                        e(
                          'span',
                          { className: 'dsh-mcp-field-hint' },
                          t('form.toolCallTimeoutMsDesc'),
                        ),
                      ),

                      // 2. Fail on startup error Switch Card
                      e(
                        'div',
                        {
                          className: `dsh-mcp-switch-card mini ${formServer.failOnStartupError ? 'active' : ''}`,
                          role: 'button',
                          tabIndex: 0,
                          onClick: () =>
                            setFormServer({
                              ...formServer,
                              failOnStartupError:
                                !formServer.failOnStartupError,
                            }),
                        },
                        e(
                          'div',
                          { className: 'dsh-mcp-switch-text' },
                          e(
                            'div',
                            { className: 'dsh-mcp-switch-title' },
                            t('form.failOnStartupError'),
                          ),
                          e(
                            'div',
                            { className: 'dsh-mcp-switch-desc' },
                            t('form.failOnStartupErrorDesc'),
                          ),
                        ),
                        e(
                          'div',
                          {
                            className: `dsh-mcp-switch-btn ${formServer.failOnStartupError ? 'active' : ''}`,
                            'aria-hidden': 'true',
                          },
                          e('span', { className: 'dsh-mcp-switch-thumb' }),
                        ),
                      ),

                      // 3. Reconnect Policy Group
                      e(
                        'div',
                        {
                          className: `dsh-mcp-switch-card mini ${formServer.reconnect?.enabled !== false ? 'active' : ''}`,
                          role: 'button',
                          tabIndex: 0,
                          onClick: () =>
                            setFormServer({
                              ...formServer,
                              reconnect: {
                                ...formServer.reconnect,
                                enabled:
                                  formServer.reconnect?.enabled === false,
                              },
                            }),
                        },
                        e(
                          'div',
                          { className: 'dsh-mcp-switch-text' },
                          e(
                            'div',
                            { className: 'dsh-mcp-switch-title' },
                            t('form.reconnectEnabled'),
                          ),
                          e(
                            'div',
                            { className: 'dsh-mcp-switch-desc' },
                            t('form.reconnectEnabledDesc'),
                          ),
                        ),
                        e(
                          'div',
                          {
                            className: `dsh-mcp-switch-btn ${formServer.reconnect?.enabled !== false ? 'active' : ''}`,
                            'aria-hidden': 'true',
                          },
                          e('span', { className: 'dsh-mcp-switch-thumb' }),
                        ),
                      ),

                      // 4. Reconnect detailed numbers (3-column grid)
                      formServer.reconnect?.enabled !== false
                        ? e(
                            'div',
                            { className: 'dsh-mcp-form-row-3' },
                            e(
                              'div',
                              { className: 'dsh-sam-field-group' },
                              e(
                                'label',
                                { className: 'dsh-sam-field-label' },
                                t('form.reconnectInitialDelayMs'),
                              ),
                              e('input', {
                                type: 'number',
                                min: 0,
                                step: 100,
                                className: 'dsh-sam-select',
                                placeholder: t(
                                  'form.reconnectInitialDelayMsPlaceholder',
                                ),
                                value:
                                  formServer.reconnect?.initialDelayMs !==
                                  undefined
                                    ? formServer.reconnect.initialDelayMs
                                    : '',
                                onChange: (evt: any) =>
                                  setFormServer({
                                    ...formServer,
                                    reconnect: {
                                      ...formServer.reconnect,
                                      initialDelayMs: evt.target.value
                                        ? parseInt(evt.target.value, 10)
                                        : undefined,
                                    },
                                  }),
                              }),
                            ),
                            e(
                              'div',
                              { className: 'dsh-sam-field-group' },
                              e(
                                'label',
                                { className: 'dsh-sam-field-label' },
                                t('form.reconnectMaxDelayMs'),
                              ),
                              e('input', {
                                type: 'number',
                                min: 0,
                                step: 1000,
                                className: 'dsh-sam-select',
                                placeholder: t(
                                  'form.reconnectMaxDelayMsPlaceholder',
                                ),
                                value:
                                  formServer.reconnect?.maxDelayMs !== undefined
                                    ? formServer.reconnect.maxDelayMs
                                    : '',
                                onChange: (evt: any) =>
                                  setFormServer({
                                    ...formServer,
                                    reconnect: {
                                      ...formServer.reconnect,
                                      maxDelayMs: evt.target.value
                                        ? parseInt(evt.target.value, 10)
                                        : undefined,
                                    },
                                  }),
                              }),
                            ),
                            e(
                              'div',
                              { className: 'dsh-sam-field-group' },
                              e(
                                'label',
                                { className: 'dsh-sam-field-label' },
                                t('form.reconnectMaxAttempts'),
                              ),
                              e('input', {
                                type: 'number',
                                min: 0,
                                step: 1,
                                className: 'dsh-sam-select',
                                placeholder: t(
                                  'form.reconnectMaxAttemptsPlaceholder',
                                ),
                                value:
                                  formServer.reconnect?.maxAttempts !==
                                  undefined
                                    ? formServer.reconnect.maxAttempts
                                    : '',
                                onChange: (evt: any) =>
                                  setFormServer({
                                    ...formServer,
                                    reconnect: {
                                      ...formServer.reconnect,
                                      maxAttempts: evt.target.value
                                        ? parseInt(evt.target.value, 10)
                                        : undefined,
                                    },
                                  }),
                              }),
                            ),
                          )
                        : null,
                    )
                  : null,
              ),
            ),

            // Modal Footer Actions
            e(
              'div',
              { className: 'dsh-sam-actions dsh-mcp-modal-footer' },
              e(
                'div',
                { className: 'dsh-mcp-modal-footer-left' },
                e(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-sam-btn secondary',
                    disabled: formTesting || formSaving,
                    onClick: handleFormTest,
                    title: t('actions.test'),
                  },
                  formTesting
                    ? e(IconLoadingOutline16, {
                        size: 14,
                        className: 'dsh-spin',
                      })
                    : e(IconPlayOutline16, { size: 14 }),
                  formTesting ? t('actions.testing') : t('actions.test'),
                ),
                e(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-sam-btn secondary',
                    disabled: formTesting || formSaving,
                    onClick: handleFormOpenTools,
                    title: t('actions.toolsList'),
                  },
                  e(IconChecklistOutline14, { size: 14 }),
                  t('actions.toolsList'),
                  formServer.disabledTools &&
                    formServer.disabledTools.length > 0
                    ? e(
                        'span',
                        { className: 'dsh-mcp-mini-badge danger' },
                        String(formServer.disabledTools.length),
                      )
                    : null,
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
                    disabled: formSaving || formTesting,
                    onClick: () => setFormOpen(false),
                  },
                  t('actions.cancel'),
                ),
                e(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-sam-btn primary',
                    disabled: formSaving || formTesting,
                    onClick: handleSaveForm,
                  },
                  formSaving ? t('actions.saving') : t('actions.save'),
                ),
              ),
            ),
          ),
        )
      : null,

    // Tools Management Modal
    toolsModalOpen && toolsTargetServer
      ? e(
          'div',
          {
            className: 'dsh-sam-modal-overlay',
            onClick: (evt: any) => {
              if (evt.target === evt.currentTarget) setToolsModalOpen(false)
            },
          },
          e(
            'div',
            { className: 'dsh-sam-modal-panel dsh-mcp-tools-modal' },
            // Header
            e(
              'div',
              { className: 'dsh-sam-header-row' },
              e(
                'div',
                null,
                e('h3', { className: 'dsh-sam-title' }, t('toolsModal.title')),
                e(
                  'div',
                  { className: 'dsh-mcp-tools-header-meta' },
                  e(
                    'span',
                    { className: 'dsh-mcp-card-name' },
                    toolsTargetServer.name || toolsTargetServer.id,
                  ),
                  e(
                    'span',
                    { className: 'dsh-mcp-card-id' },
                    toolsTargetServer.id,
                  ),
                  e(
                    'span',
                    {
                      className: `dsh-mcp-proto-badge ${toolsTargetServer.transport || 'streamable-http-or-sse'}`,
                    },
                    toolsTargetServer.transport === 'stdio'
                      ? 'STDIO'
                      : toolsDetectedTransport === 'sse'
                        ? 'SSE'
                        : toolsDetectedTransport === 'streamable-http'
                          ? 'Streamable HTTP'
                          : 'HTTP / SSE',
                  ),
                  toolsServerInfo?.version
                    ? e(
                        'span',
                        {
                          className: 'dsh-mcp-proto-badge server-version',
                          title: toolsServerInfo.protocolVersion
                            ? `MCP Protocol: ${toolsServerInfo.protocolVersion}${toolsServerInfo.name ? ` (${toolsServerInfo.name})` : ''}`
                            : toolsServerInfo.name || undefined,
                        },
                        toolsServerInfo.name &&
                          toolsServerInfo.name !== toolsTargetServer.id &&
                          toolsServerInfo.name !== toolsTargetServer.name
                          ? `${toolsServerInfo.name} ${toolsServerInfo.version}`
                          : toolsServerInfo.version,
                      )
                    : toolsServerInfo?.protocolVersion
                      ? e(
                          'span',
                          {
                            className: 'dsh-mcp-proto-badge server-version',
                            title: toolsServerInfo.name || undefined,
                          },
                          `MCP ${toolsServerInfo.protocolVersion}`,
                        )
                      : null,
                  toolsTargetServer.compatibility?.status ===
                    'incompatible-2026-07-28' ||
                    toolsTargetServer.compatibility?.canEnable === false
                    ? e(
                        'span',
                        {
                          className: 'dsh-mcp-proto-badge incompatible',
                          title:
                            toolsTargetServer.compatibility.warning ||
                            t('compatibility.incompatibleDesc'),
                        },
                        t('compatibility.incompatibleBadge'),
                      )
                    : toolsTargetServer.compatibility?.status ===
                        'downgrade-supported'
                      ? e(
                          'span',
                          {
                            className: 'dsh-mcp-proto-badge downgrade',
                            title:
                              toolsTargetServer.compatibility.warning ||
                              t('compatibility.downgradedDesc'),
                          },
                          t('compatibility.downgradedBadge', {
                            version:
                              toolsTargetServer.compatibility
                                .negotiatedVersion || '2025-11-25',
                          }),
                        )
                      : null,
                ),
              ),
              e(
                'button',
                {
                  type: 'button',
                  className: 'dsh-sam-close-btn',
                  onClick: () => setToolsModalOpen(false),
                },
                e(IconCloseOutline16, { size: 16 }),
              ),
            ),

            // Toolbar (Search + Batch actions + Refresh)
            e(
              'div',
              { className: 'dsh-mcp-tools-toolbar' },
              // Search box
              e(
                'div',
                { className: 'dsh-mcp-tools-search-box' },
                e('input', {
                  type: 'text',
                  className: 'dsh-sam-select',
                  placeholder: t('toolsModal.searchPlaceholder'),
                  value: toolsSearch,
                  onChange: (evt: any) => setToolsSearch(evt.target.value),
                }),
              ),
              // Batch Actions & Refresh
              e(
                'div',
                { className: 'dsh-mcp-tools-toolbar-actions' },
                e(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-sam-btn secondary',
                    disabled: toolsLoading || toolsList.length === 0,
                    onClick: () => handleToggleAllTools(true),
                  },
                  t('toolsModal.enableAll'),
                ),
                e(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-sam-btn secondary',
                    disabled: toolsLoading || toolsList.length === 0,
                    onClick: () => handleToggleAllTools(false),
                  },
                  t('toolsModal.disableAll'),
                ),
                e(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-sam-btn secondary',
                    disabled: toolsLoading,
                    onClick: () => fetchToolsForServer(toolsTargetServer),
                    title: t('toolsModal.retry'),
                  },
                  toolsLoading
                    ? e(IconLoadingOutline16, {
                        size: 14,
                        className: 'dsh-spin',
                      })
                    : e(IconRefreshOutline16, { size: 14 }),
                  toolsLoading
                    ? t('actions.toolsFetching')
                    : t('toolsModal.retry'),
                ),
              ),
            ),

            // Stats summary bar
            !toolsLoading && toolsList.length > 0
              ? e(
                  'div',
                  { className: 'dsh-mcp-tools-stats-bar' },
                  e(
                    'span',
                    null,
                    t('toolsModal.summary', {
                      total: toolsList.length,
                      enabled: toolsList.length - toolsDisabledSet.size,
                      disabled: toolsDisabledSet.size,
                    }),
                  ),
                  toolsSearch.trim()
                    ? e(
                        'span',
                        null,
                        t('toolsModal.filteredSummary', {
                          count: filteredTools.length,
                        }),
                      )
                    : null,
                )
              : null,

            // Tools list container
            toolsLoading
              ? e(
                  'div',
                  {
                    className: 'dsh-sam-loading',
                    style: { padding: '36px 0' },
                  },
                  e(IconLoadingOutline16, {
                    size: 20,
                    className: 'dsh-spin',
                  }),
                  e(
                    'span',
                    { style: { marginLeft: 8 } },
                    t('toolsModal.fetching'),
                  ),
                )
              : toolsError
                ? e(
                    'div',
                    {
                      className: 'dsh-sam-notice error',
                      style: { margin: '14px 0' },
                    },
                    t('toolsModal.fetchFailed') + toolsError,
                  )
                : toolsList.length === 0
                  ? e(
                      'div',
                      {
                        className: 'dsh-sam-desc',
                        style: { padding: '32px 0', textAlign: 'center' },
                      },
                      t('toolsModal.serverNoTools'),
                    )
                  : filteredTools.length === 0
                    ? e(
                        'div',
                        {
                          className: 'dsh-sam-desc',
                          style: { padding: '32px 0', textAlign: 'center' },
                        },
                        t('toolsModal.empty'),
                      )
                    : e(
                        'div',
                        { className: 'dsh-mcp-tools-list' },
                        filteredTools.map((tool) => {
                          const isDisabled = toolsDisabledSet.has(tool.name)
                          const isSchemaExpanded = toolsExpandedSchemas.has(
                            tool.name,
                          )
                          const hasSchema =
                            tool.inputSchema &&
                            Object.keys(tool.inputSchema).length > 0

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
                                // Switch Toggle Button
                                e(
                                  'div',
                                  {
                                    className: `dsh-mcp-switch-btn ${!isDisabled ? 'active' : ''}`,
                                    role: 'button',
                                    tabIndex: 0,
                                    style: {
                                      marginTop: 2,
                                      cursor: 'pointer',
                                    },
                                    onClick: () => handleToggleTool(tool.name),
                                    onKeyDown: (evt: any) => {
                                      if (
                                        evt.key === 'Enter' ||
                                        evt.key === ' '
                                      ) {
                                        evt.preventDefault()
                                        handleToggleTool(tool.name)
                                      }
                                    },
                                    title: !isDisabled
                                      ? t('toolsModal.statusEnabled')
                                      : t('toolsModal.statusDisabled'),
                                  },
                                  e('span', {
                                    className: 'dsh-mcp-switch-thumb',
                                  }),
                                ),
                                // Tool info
                                e(
                                  'div',
                                  { className: 'dsh-mcp-tool-info' },
                                  e(
                                    'div',
                                    {
                                      className: 'dsh-mcp-tool-title-row',
                                    },
                                    e(
                                      'span',
                                      { className: 'dsh-mcp-tool-name' },
                                      tool.name,
                                    ),
                                    e(
                                      'span',
                                      {
                                        className: `dsh-mcp-tool-status-pill ${!isDisabled ? 'active' : 'disabled'}`,
                                      },
                                      !isDisabled
                                        ? t('toolsModal.statusEnabled')
                                        : t('toolsModal.statusDisabled'),
                                    ),
                                  ),
                                  tool.description
                                    ? e(
                                        'p',
                                        { className: 'dsh-mcp-tool-desc' },
                                        tool.description,
                                      )
                                    : null,
                                ),
                              ),
                              // Expand Schema toggle button
                              hasSchema
                                ? e(
                                    'button',
                                    {
                                      type: 'button',
                                      className: `dsh-mcp-tool-schema-btn ${isSchemaExpanded ? 'active' : ''}`,
                                      onClick: (evt: any) => {
                                        evt.stopPropagation()
                                        handleToggleSchema(tool.name)
                                      },
                                    },
                                    isSchemaExpanded
                                      ? t('toolsModal.hideParameters')
                                      : t('toolsModal.parameters'),
                                  )
                                : null,
                            ),
                            // Collapsible Parameters / Schema Area
                            isSchemaExpanded && hasSchema
                              ? (() => {
                                  const params = parseToolParameters(
                                    tool.inputSchema,
                                  )
                                  const mode =
                                    toolSchemaModes[tool.name] || 'list'
                                  const requiredCount = params.filter(
                                    (p) => p.required,
                                  ).length

                                  return e(
                                    'div',
                                    { className: 'dsh-mcp-tool-expanded-box' },
                                    // Header bar with parameter stats and List/Raw mode switch
                                    e(
                                      'div',
                                      {
                                        className:
                                          'dsh-mcp-tool-expanded-header',
                                      },
                                      e(
                                        'span',
                                        {
                                          className: 'dsh-mcp-tool-param-stats',
                                        },
                                        params.length > 0
                                          ? t('toolsModal.paramsCount', {
                                              total: params.length,
                                              required: requiredCount,
                                            })
                                          : t('toolsModal.noParams'),
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
                                              setToolSchemaModes((prev) => ({
                                                ...prev,
                                                [tool.name]: 'list',
                                              }))
                                            },
                                          },
                                          t('toolsModal.viewList'),
                                        ),
                                        e(
                                          'button',
                                          {
                                            type: 'button',
                                            className: `dsh-mcp-seg-btn ${mode === 'raw' ? 'active' : ''}`,
                                            onClick: (evt: any) => {
                                              evt.stopPropagation()
                                              setToolSchemaModes((prev) => ({
                                                ...prev,
                                                [tool.name]: 'raw',
                                              }))
                                            },
                                          },
                                          t('toolsModal.viewRaw'),
                                        ),
                                      ),
                                    ),

                                    // Body: structured list or raw json
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
                                                  className:
                                                    'dsh-mcp-param-row',
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
                                                      ? t('toolsModal.required')
                                                      : t(
                                                          'toolsModal.optional',
                                                        ),
                                                  ),
                                                  param.default !== undefined
                                                    ? e(
                                                        'span',
                                                        {
                                                          className:
                                                            'dsh-mcp-param-default',
                                                        },
                                                        `${t('toolsModal.defaultVal')}${JSON.stringify(param.default)}`,
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
                                                param.enum &&
                                                  param.enum.length > 0
                                                  ? e(
                                                      'div',
                                                      {
                                                        className:
                                                          'dsh-mcp-param-enum',
                                                      },
                                                      `${t('toolsModal.enumVal')}${param.enum.map((v) => JSON.stringify(v)).join(' | ')}`,
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
                toolsDisabledSet.size > 0
                  ? e(
                      'span',
                      { className: 'dsh-mcp-proto-badge disabled-tools' },
                      t('toolsModal.disabledBadge', {
                        count: toolsDisabledSet.size,
                      }),
                    )
                  : null,
              ),
              e(
                'div',
                { className: 'dsh-mcp-modal-footer-right' },
                e(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-sam-btn secondary',
                    disabled: toolsSaving,
                    onClick: () => setToolsModalOpen(false),
                  },
                  t('actions.cancel'),
                ),
                e(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-sam-btn primary',
                    disabled: toolsSaving || toolsLoading,
                    onClick: handleSaveToolsModal,
                  },
                  toolsSaving ? t('toolsModal.saving') : t('toolsModal.save'),
                ),
              ),
            ),
          ),
        )
      : null,

    // Import Modal
    importOpen
      ? e(
          'div',
          {
            className: 'dsh-sam-modal-overlay',
            onClick: (evt: any) => {
              if (evt.target === evt.currentTarget) setImportOpen(false)
            },
          },
          e(
            'div',
            { className: 'dsh-sam-modal-panel dsh-mcp-import-modal' },
            e(
              'div',
              { className: 'dsh-sam-header-row' },
              e('h3', { className: 'dsh-sam-title' }, t('importModal.title')),
              e(
                'button',
                {
                  type: 'button',
                  className: 'dsh-sam-close-btn',
                  onClick: () => setImportOpen(false),
                },
                e(IconCloseOutline16, { size: 16 }),
              ),
            ),
            e('p', { className: 'dsh-sam-desc' }, t('importModal.desc')),

            importError
              ? e('div', { className: 'dsh-sam-notice error' }, importError)
              : null,

            e('textarea', {
              className: 'dsh-mcp-import-textarea',
              rows: 10,
              placeholder: t('importModal.placeholder'),
              value: importText,
              onChange: (evt: any) => setImportText(evt.target.value),
            }),

            e(
              'div',
              { className: 'dsh-sam-actions' },
              e(
                'button',
                {
                  type: 'button',
                  className: 'dsh-sam-btn primary',
                  disabled: importing || !importText.trim(),
                  onClick: handleImportSubmit,
                },
                importing
                  ? t('importModal.importing')
                  : t('importModal.confirm'),
              ),
              e(
                'button',
                {
                  type: 'button',
                  className: 'dsh-sam-btn secondary',
                  onClick: () => setImportOpen(false),
                },
                t('actions.cancel'),
              ),
            ),
          ),
        )
      : null,

    // Pre-save Connection Test Failure Confirmation Modal
    saveConfirm?.open
      ? e(
          'div',
          {
            className: 'dsh-sam-modal-overlay dsh-mcp-confirm-overlay',
            onClick: (evt: any) => {
              if (evt.target === evt.currentTarget) setSaveConfirm(null)
            },
          },
          e(
            'div',
            { className: 'dsh-sam-modal-panel dsh-mcp-confirm-modal' },
            e(
              'div',
              { className: 'dsh-sam-header-row' },
              e(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  },
                },
                e(IconWarningOutline16, { size: 18 }),
                e(
                  'h3',
                  { className: 'dsh-sam-title' },
                  t('saveConfirmModal.title'),
                ),
              ),
              e(
                'button',
                {
                  type: 'button',
                  className: 'dsh-sam-close-btn',
                  onClick: () => setSaveConfirm(null),
                },
                e(IconCloseOutline16, { size: 16 }),
              ),
            ),
            e(
              'p',
              { className: 'dsh-mcp-confirm-msg' },
              t('saveConfirmModal.message'),
            ),
            e(
              'div',
              { className: 'dsh-mcp-confirm-detail' },
              saveConfirm.message,
            ),
            e(
              'p',
              { className: 'dsh-mcp-confirm-prompt' },
              t('saveConfirmModal.prompt'),
            ),
            e(
              'div',
              { className: 'dsh-sam-actions' },
              e(
                'button',
                {
                  type: 'button',
                  className: 'dsh-sam-btn secondary',
                  onClick: () => setSaveConfirm(null),
                },
                t('saveConfirmModal.cancel'),
              ),
              e(
                'button',
                {
                  type: 'button',
                  className: 'dsh-sam-btn primary',
                  onClick: () => executeSave(saveConfirm.payload),
                },
                t('saveConfirmModal.saveAnyway'),
              ),
            ),
          ),
        )
      : null,
  )
}
