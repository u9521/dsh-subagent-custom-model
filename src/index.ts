import type { Context } from '@deepseek-ai/cordis'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import type { SubagentModelConfig, SubagentModelStore } from './types.ts'

export const name = 'subagent-custom-model'
export const inject = ['webServer']

function getStoragePath(): string {
  const dshHome = process.env.DSH_HOME || path.join(os.homedir(), '.dsh')
  const storageDir = path.join(dshHome, 'storages')
  try {
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true })
    }
  } catch {}
  return path.join(storageDir, 'subagent_model.json')
}

function loadStore(): SubagentModelStore {
  try {
    const file = getStoragePath()
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'))
      if (data && typeof data === 'object') {
        const def: SubagentModelConfig =
          data.default && typeof data.default === 'object'
            ? {
                mode: data.default.mode === 'custom' ? 'custom' : 'inherit',
                provider:
                  typeof data.default.provider === 'string'
                    ? data.default.provider
                    : undefined,
                model:
                  typeof data.default.model === 'string'
                    ? data.default.model
                    : undefined,
                reasoningEffort:
                  typeof data.default.reasoningEffort === 'string'
                    ? data.default.reasoningEffort
                    : undefined,
              }
            : { mode: 'inherit' }

        const sessions: Record<string, SubagentModelConfig> = {}
        if (data.sessions && typeof data.sessions === 'object') {
          for (const [id, s] of Object.entries(data.sessions)) {
            if (s && typeof s === 'object') {
              const item = s as any
              const m =
                item.mode === 'custom'
                  ? 'custom'
                  : item.mode === 'inherit'
                    ? 'inherit'
                    : 'default'
              sessions[id] = {
                mode: m,
                provider:
                  typeof item.provider === 'string' ? item.provider : undefined,
                model: typeof item.model === 'string' ? item.model : undefined,
                reasoningEffort:
                  typeof item.reasoningEffort === 'string'
                    ? item.reasoningEffort
                    : undefined,
              }
            }
          }
        }
        return { default: def, sessions }
      }
    }
  } catch {}
  return { default: { mode: 'inherit' }, sessions: {} }
}

function saveStore(store: SubagentModelStore): void {
  try {
    const file = getStoragePath()
    // Write to a temp file and rename, so a crash mid-write cannot corrupt the store.
    const tmp = `${file}.tmp`
    fs.writeFileSync(tmp, JSON.stringify(store, null, 2), 'utf8')
    fs.renameSync(tmp, file)
  } catch {}
}

/**
 * Non-custom configs never carry model fields, so the store stays consistent
 * no matter which client wrote it.
 */
function normalizeConfig(config: SubagentModelConfig): SubagentModelConfig {
  if (config.mode === 'custom') return config
  return { mode: config.mode }
}

/**
 * Resolve the effective config for a session — deliberately simple:
 * has the session been configured? Use its choice (custom / inherit).
 * Otherwise the global default applies.
 */
function resolveEffectiveConfig(
  store: SubagentModelStore,
  sessionId?: string,
): SubagentModelConfig {
  if (sessionId && store.sessions?.[sessionId]) {
    const entry = store.sessions[sessionId]
    if (entry.mode !== 'default') return entry
  }
  return store.default || { mode: 'inherit' }
}

export function apply(ctx: Context): void {
  let store: SubagentModelStore = loadStore()

  // 1. Register WebServer HTTP route for reading & writing subagent model configuration
  const webServer = ctx.get('webServer' as any) as any
  if (webServer) {
    const unregisterRoute = webServer.register({
      kind: 'exact',
      path: '/api/subagent-model',
      handler: async (req: any, res: any) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')

        const url = new URL(req.url ?? '/', 'http://localhost')
        const querySessionId = url.searchParams.get('sessionId') || undefined

        if (req.method === 'GET') {
          const rawConfig =
            querySessionId && store.sessions[querySessionId]
              ? store.sessions[querySessionId]
              : { mode: 'default' }
          res.writeHead(200)
          res.end(
            JSON.stringify({
              ok: true,
              sessionId: querySessionId,
              config: rawConfig,
              effectiveConfig: resolveEffectiveConfig(store, querySessionId),
              defaultConfig: store.default,
              hasSessionOverride: Boolean(
                querySessionId &&
                store.sessions[querySessionId] &&
                store.sessions[querySessionId].mode !== 'default',
              ),
            }),
          )
          return
        }

        if (req.method === 'POST') {
          try {
            const body = await new Promise<string>((resolve, reject) => {
              const chunks: Buffer[] = []
              req.on('data', (chunk: Buffer) => chunks.push(chunk))
              req.on('end', () =>
                resolve(Buffer.concat(chunks).toString('utf8')),
              )
              req.on('error', reject)
            })
            const parsed = JSON.parse(body || '{}')
            const targetSessionId = parsed.sessionId || querySessionId
            const isSaveDefault = Boolean(
              parsed.isDefault || !targetSessionId || parsed.saveAsDefault,
            )

            const rawMode = parsed.config?.mode ?? parsed.mode
            const mode =
              rawMode === 'custom'
                ? 'custom'
                : rawMode === 'inherit'
                  ? 'inherit'
                  : 'default'

            const incomingConfig: SubagentModelConfig = {
              mode,
              provider:
                typeof (parsed.config?.provider ?? parsed.provider) === 'string'
                  ? (parsed.config?.provider ?? parsed.provider).trim()
                  : undefined,
              model:
                typeof (parsed.config?.model ?? parsed.model) === 'string'
                  ? (parsed.config?.model ?? parsed.model).trim()
                  : undefined,
              reasoningEffort:
                typeof (
                  parsed.config?.reasoningEffort ?? parsed.reasoningEffort
                ) === 'string' &&
                (
                  parsed.config?.reasoningEffort ?? parsed.reasoningEffort
                ).trim()
                  ? (
                      parsed.config?.reasoningEffort ?? parsed.reasoningEffort
                    ).trim()
                  : undefined,
            }

            // A custom config without a concrete model would break every
            // subagent request (the interceptor injects provider/model), so
            // reject it here instead of storing a poisoned state.
            if (
              mode === 'custom' &&
              (!incomingConfig.provider || !incomingConfig.model)
            ) {
              res.writeHead(400)
              res.end(
                JSON.stringify({
                  ok: false,
                  error: 'custom mode requires provider and model',
                }),
              )
              return
            }

            if (isSaveDefault) {
              store.default = normalizeConfig(incomingConfig)
            }

            if (targetSessionId && !parsed.onlyDefault) {
              if (isSaveDefault) {
                // "Set as global default" also clears this session's own
                // override: setting default means clearing the session setting.
                delete store.sessions[targetSessionId]
              } else if (mode === 'default') {
                delete store.sessions[targetSessionId]
              } else {
                store.sessions[targetSessionId] =
                  normalizeConfig(incomingConfig)
              }
            }

            saveStore(store)
            res.writeHead(200)
            res.end(
              JSON.stringify({
                ok: true,
                sessionId: targetSessionId,
                config: incomingConfig,
                effectiveConfig: resolveEffectiveConfig(store, targetSessionId),
                defaultConfig: store.default,
                hasSessionOverride: Boolean(
                  targetSessionId &&
                  store.sessions[targetSessionId] &&
                  store.sessions[targetSessionId].mode !== 'default',
                ),
              }),
            )
          } catch (err) {
            res.writeHead(400)
            res.end(JSON.stringify({ ok: false, error: String(err) }))
          }
          return
        }

        if (req.method === 'DELETE') {
          if (querySessionId && store.sessions[querySessionId]) {
            delete store.sessions[querySessionId]
            saveStore(store)
          }
          res.writeHead(200)
          res.end(
            JSON.stringify({
              ok: true,
              sessionId: querySessionId,
              config: { mode: 'default' },
              effectiveConfig: resolveEffectiveConfig(store, querySessionId),
              defaultConfig: store.default,
              hasSessionOverride: false,
            }),
          )
          return
        }

        res.writeHead(405)
        res.end(JSON.stringify({ ok: false, error: 'Method Not Allowed' }))
      },
    })
    ctx.effect(
      () => () => unregisterRoute(),
      'subagent-custom-model: webServer route',
    )
  }

  // 2. Single interception point: the `agent/request` waterfall.
  //    It fires for every LLM request of every agent, so it subsumes both the
  //    old `subagents.start`/`startContinuable` monkey-patches (provider/model
  //    on the first request) and the reasoning-effort injection — without
  //    mutating shared service methods.
  //    `header.origin === 'subagent'` is the discriminator: forked top-level
  //    sessions also carry `header.parentSession`, so that field alone must
  //    never be used to detect a subagent.
  ;(ctx as any).on('agent/request', async (payload: any, next: any) => {
    const proposal = await next()
    const session = payload?.agent?.session
    if (!session?.header || session.header.origin !== 'subagent')
      return proposal
    const effectiveCfg = resolveEffectiveConfig(
      store,
      session.header.parentSession,
    )
    if (
      effectiveCfg.mode !== 'custom' ||
      !effectiveCfg.provider ||
      !effectiveCfg.model
    )
      return proposal
    return {
      ...proposal,
      provider: effectiveCfg.provider,
      model: effectiveCfg.model,
      ...(effectiveCfg.reasoningEffort
        ? { reasoningEffort: effectiveCfg.reasoningEffort }
        : {}),
    }
  })
}
