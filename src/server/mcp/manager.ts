import type { Context } from '@deepseek-ai/cordis'
import type {
  GlobalMcpServerConfig,
  McpServerStore,
  SessionSettingsStore,
} from '../../types.ts'
import { publicToolName } from './naming.ts'
import { saveMcpStore } from './storage.ts'
import {
  checkMcpCompatibility,
  type McpCompatibilityResult,
} from './compatibility/index.ts'

export interface ToolMeta {
  serverId: string
  rawName: string
}

let cachedOfficialPlugin: any = null
let officialPluginChecked = false

/**
 * Resolve the official @deepseek-ai/dsh-mcp-client Cordis plugin module from DSH.
 */
export async function loadOfficialMcpClientPlugin(): Promise<any> {
  if (officialPluginChecked) return cachedOfficialPlugin
  officialPluginChecked = true

  const candidates = [
    '@deepseek-ai/dsh-mcp-client',
    '/home/multiply/.bun/install/global/node_modules/@deepseek-ai/dsh-mcp-client/lib/index.js',
  ]

  for (const candidate of candidates) {
    try {
      const mod = await import(candidate)
      if (
        mod &&
        (typeof mod.apply === 'function' ||
          typeof mod.default?.apply === 'function')
      ) {
        cachedOfficialPlugin = mod
        return mod
      }
    } catch {}
  }

  return null
}

export class McpManager {
  private ctx: Context
  private getMcpStore: () => McpServerStore
  private setMcpStore: (store: McpServerStore) => void
  private getSessionSettingsStore?: () => SessionSettingsStore

  /** Map of serverId -> active Cordis Plugin Fork instance of @deepseek-ai/dsh-mcp-client */
  private officialForks = new Map<string, any>()

  /** Map of publicToolName -> { serverId, rawName } metadata */
  private toolMeta = new Map<string, ToolMeta>()

  /** Map of serverId -> Set of publicToolNames registered for that server */
  private serverToolMap = new Map<string, Set<string>>()

  /** Active sync promises to prevent race conditions */
  private activeSyncs = new Map<string, Promise<void>>()

  constructor(
    ctx: Context,
    getMcpStore: () => McpServerStore,
    setMcpStore: (store: McpServerStore) => void,
    getSessionSettingsStore?: () => SessionSettingsStore,
  ) {
    this.ctx = ctx
    this.getMcpStore = getMcpStore
    this.setMcpStore = setMcpStore
    this.getSessionSettingsStore = getSessionSettingsStore
  }

  /**
   * Check if an MCP server is currently needed (enabled by default or enabled in any active session).
   */
  public isServerNeeded(serverId: string): boolean {
    const store = this.getMcpStore()
    const server = store.servers[serverId]
    if (!server) return false

    // 1. Is it enabled by default in global server settings?
    if (server.enabledByDefault) return true

    // 2. Is it enabled in session settings?
    const sessionSettingsStore = this.getSessionSettingsStore?.()
    if (sessionSettingsStore) {
      if (
        sessionSettingsStore.default?.mcp?.mode === 'custom' &&
        sessionSettingsStore.default.mcp.enabledServerIds?.includes(serverId)
      ) {
        return true
      }

      if (sessionSettingsStore.sessions) {
        for (const sessionConfig of Object.values(
          sessionSettingsStore.sessions,
        )) {
          if (
            sessionConfig.mcp?.mode === 'custom' &&
            sessionConfig.mcp.enabledServerIds?.includes(serverId)
          ) {
            return true
          }
        }
      }
    }

    return false
  }

  /**
   * Get metadata for a public tool name.
   */
  public getToolMeta(publicName: string): ToolMeta | undefined {
    return this.toolMeta.get(publicName)
  }

  /**
   * Check if a tool is an MCP tool managed by this plugin.
   */
  public isMcpTool(publicName: string): boolean {
    return this.toolMeta.has(publicName) || publicName.startsWith('mcp__')
  }

  /**
   * Check compatibility for an MCP server against the official client.
   */
  public async checkCompatibility(
    server: Partial<GlobalMcpServerConfig>,
  ): Promise<McpCompatibilityResult> {
    return checkMcpCompatibility(server)
  }

  /**
   * Mount official @deepseek-ai/dsh-mcp-client plugin instance dynamically in memory.
   */
  public async mountOfficialClient(
    server: GlobalMcpServerConfig,
    officialPlugin: any,
  ): Promise<boolean> {
    this.unmountOfficialClient(server.id)

    const officialConfig = {
      serverName: server.id,
      transport: server.transport === 'stdio' ? 'stdio' : 'streamable-http',
      command: server.command || '',
      args: server.args || [],
      env: server.env || {},
      cwd: server.cwd || '',
      url: server.url || '',
      headers: server.headers || {},
      toolCallTimeoutMs: server.toolCallTimeoutMs || 60000,
      failOnStartupError: Boolean(server.failOnStartupError),
      reconnect: {
        enabled: server.reconnect?.enabled ?? true,
        initialDelayMs: server.reconnect?.initialDelayMs ?? 500,
        maxDelayMs: server.reconnect?.maxDelayMs ?? 30000,
        maxAttempts: server.reconnect?.maxAttempts ?? 10,
      },
    }

    try {
      const fork = this.ctx.plugin(officialPlugin, officialConfig)
      this.officialForks.set(server.id, fork)

      // Index tool names for fast session interception
      if (Array.isArray(server.toolDetails)) {
        const names = new Set<string>()
        for (const t of server.toolDetails) {
          const pub = publicToolName(server.id, t.name)
          this.toolMeta.set(pub, { serverId: server.id, rawName: t.name })
          names.add(pub)
        }
        this.serverToolMap.set(server.id, names)
      }

      return true
    } catch (err) {
      console.warn(
        `[session-settings] Failed to mount official mcp-client for "${server.id}":`,
        err,
      )
      return false
    }
  }

  /**
   * Unmount official mcp-client fork for a server.
   */
  public unmountOfficialClient(serverId: string): void {
    const fork = this.officialForks.get(serverId)
    if (fork) {
      try {
        fork.dispose()
      } catch {}
      this.officialForks.delete(serverId)
    }

    const existingNames = this.serverToolMap.get(serverId)
    if (existingNames) {
      for (const pubName of existingNames) {
        this.toolMeta.delete(pubName)
      }
      this.serverToolMap.delete(serverId)
    }
  }

  /**
   * Unregister / unmount a specific server.
   */
  public unregisterServer(serverId: string): void {
    this.unmountOfficialClient(serverId)
  }

  /**
   * Synchronize tool registrations for a single server:
   * 1. Checks protocol compatibility with 2-stage probe.
   * 2. If compatible (or downgrade supported), mounts official client.
   * 3. If incompatible (e.g. 2026-07-28 without downgrade), prohibits enabling and issues warning.
   */
  public async syncServer(server: GlobalMcpServerConfig): Promise<void> {
    if (!server || !server.id) return

    // If server is not needed (neither enabled by default nor in any active session), ensure it is unmounted
    if (!this.isServerNeeded(server.id)) {
      this.unmountOfficialClient(server.id)
      return
    }

    if (this.activeSyncs.has(server.id)) {
      return this.activeSyncs.get(server.id)
    }

    const syncPromise = (async () => {
      try {
        // Step 1: Compatibility check
        const compat = await checkMcpCompatibility(server)
        const store = this.getMcpStore()
        const liveServer = store.servers[server.id] || server

        liveServer.compatibility = compat
        if (!compat.canEnable) {
          console.warn(
            `[session-settings] MCP server "${server.name || server.id}" is incompatible with official client: ${compat.warning || compat.message}`,
          )
          this.unmountOfficialClient(server.id)
          store.servers[server.id] = liveServer
          saveMcpStore(store)
          this.setMcpStore(store)
          return
        }

        // Step 2: Mount official @deepseek-ai/dsh-mcp-client dynamically
        const officialPlugin = await loadOfficialMcpClientPlugin()
        if (officialPlugin) {
          await this.mountOfficialClient(liveServer, officialPlugin)
        } else {
          console.error(
            '[session-settings] Official @deepseek-ai/dsh-mcp-client plugin not found in DSH environment.',
          )
        }
      } catch (err) {
        console.warn(
          `[session-settings] Sync failed for MCP server "${server.name || server.id}":`,
          err,
        )
      } finally {
        this.activeSyncs.delete(server.id)
      }
    })()

    this.activeSyncs.set(server.id, syncPromise)
    return syncPromise
  }

  /**
   * Synchronize all servers in the store.
   */
  public syncAll(): void {
    const store = this.getMcpStore()
    const allServers = Object.values(store.servers)

    // Unmount any servers that were deleted from store or are no longer needed
    for (const serverId of Array.from(this.officialForks.keys())) {
      if (!store.servers[serverId] || !this.isServerNeeded(serverId)) {
        this.unmountOfficialClient(serverId)
      }
    }

    // Sync needed servers
    for (const server of allServers) {
      if (this.isServerNeeded(server.id)) {
        this.syncServer(server).catch(() => {})
      } else {
        this.unmountOfficialClient(server.id)
      }
    }
  }

  /**
   * Teardown and unmount all official client forks on plugin unload.
   */
  public dispose(): void {
    for (const fork of this.officialForks.values()) {
      try {
        fork.dispose()
      } catch {}
    }
    this.officialForks.clear()
    this.toolMeta.clear()
    this.serverToolMap.clear()
  }
}
