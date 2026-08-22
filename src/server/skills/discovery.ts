import type { Context } from '@deepseek-ai/cordis'
import type { SkillItem } from '../../types.ts'

export function classifySkillSource(skill: {
  provider?: string
  source?: string
  path?: string
  metadata?: Readonly<Record<string, unknown>>
}): { isRuntime: boolean; source: string } {
  if (!skill) return { isRuntime: false, source: 'user-dsh' }

  // 1. Explicit metadata override (if declared in YAML frontmatter)
  const metaType =
    typeof skill.metadata?.type === 'string'
      ? (skill.metadata.type as string).toLowerCase()
      : typeof skill.metadata?.scope === 'string'
        ? (skill.metadata.scope as string).toLowerCase()
        : undefined

  if (
    metaType === 'user' ||
    metaType === 'user-dsh' ||
    metaType === 'user-agents'
  ) {
    return { isRuntime: false, source: 'user-dsh' }
  }
  if (
    metaType === 'project' ||
    metaType === 'project-dsh' ||
    metaType === 'project-agents'
  ) {
    return { isRuntime: false, source: 'project-dsh' }
  }
  if (
    metaType === 'preset' ||
    metaType === 'runtime' ||
    metaType === 'bundled'
  ) {
    return { isRuntime: true, source: 'runtime' }
  }

  // 2. Official SkillSource enumeration contract from DSH (@deepseek-ai/dsh-skill)
  const src = (skill.source || '').toLowerCase()
  const provider = (skill.provider || '').toLowerCase()

  switch (src) {
    case 'user-dsh':
    case 'user-agents':
      return { isRuntime: false, source: src }

    case 'project-dsh':
    case 'project-agents':
      return { isRuntime: false, source: src }

    case 'custom':
    case 'custom-preset':
    case 'bundled-preset':
    case 'preset':
    case 'runtime':
    case 'bundled':
      return { isRuntime: true, source: src }

    default:
      if (src.includes('user')) {
        return { isRuntime: false, source: 'user-dsh' }
      }
      if (src.includes('project')) {
        return { isRuntime: false, source: 'project-dsh' }
      }
      if (
        provider &&
        provider !== 'filesystem' &&
        provider !== 'project-dsh' &&
        provider !== 'user-dsh' &&
        provider !== 'project-agents' &&
        provider !== 'user-agents'
      ) {
        return { isRuntime: true, source: src || 'runtime' }
      }
      return { isRuntime: true, source: src || 'runtime' }
  }
}

export function isRuntimeSkill(skill: {
  provider?: string
  source?: string
  path?: string
  metadata?: Readonly<Record<string, unknown>>
}): boolean {
  return classifySkillSource(skill).isRuntime
}

export function compareSkills(a: SkillItem, b: SkillItem): number {
  const aRuntime = Boolean(a.isRuntime)
  const bRuntime = Boolean(b.isRuntime)
  // Non-runtime skills first, runtime skills last (置底)
  if (aRuntime !== bRuntime) {
    return aRuntime ? 1 : -1
  }
  return a.name.localeCompare(b.name)
}

function resolveSessionPreset(session: any): string | undefined {
  if (!session) return undefined
  if (Array.isArray(session.events)) {
    for (let index = session.events.length - 1; index >= 0; index -= 1) {
      const event = session.events[index]
      if (event?.type === 'agent-preset/selected')
        return event.data?.agentPreset
    }
  }
  return session.header?.agentPreset
}

async function resolveScopes(ctx: Context, sessionId?: string): Promise<any[]> {
  const sessionsService = ctx.get('sessions' as any) as any
  const agentsService = ctx.get('agents' as any) as any
  const presets = ctx.get('agentPresets' as any) as any

  if (sessionId) {
    const session = sessionsService?.get?.(sessionId)
    const liveAgent = agentsService?.get?.(sessionId)
    if (liveAgent) {
      return [liveAgent]
    }
    if (presets && typeof presets.standingKeyFor === 'function') {
      try {
        let presetId = resolveSessionPreset(session)
        if (!presetId) {
          const persistence = ctx.get('sessionPersistence' as any) as any
          if (persistence && typeof persistence.inspect === 'function') {
            try {
              const inspected = await persistence.inspect(sessionId)
              presetId = resolveSessionPreset({
                header: inspected?.meta,
                events: inspected?.events,
              })
            } catch {}
          }
        }
        const standingKey = await presets.standingKeyFor(presetId)
        if (standingKey) return [standingKey]
      } catch {}
    }
    return [undefined]
  }

  // Global context (no sessionId specified, e.g. Settings modal)
  if (presets && typeof presets.standingKeyFor === 'function') {
    try {
      const defaultKey = await presets.standingKeyFor()
      if (defaultKey) return [defaultKey]
    } catch {}
  }

  return [undefined]
}

export async function getAvailableSkills(
  ctx: Context,
  sessionId?: string,
): Promise<SkillItem[]> {
  const map = new Map<string, SkillItem>()

  // 1. Try resolving session cwd if session exists. For global scope, keep cwd undefined so project scanning is skipped.
  let targetCwd: string | undefined = undefined
  if (sessionId) {
    try {
      const sessionsService = ctx.get('sessions' as any) as any
      const session = sessionsService?.get?.(sessionId)
      if (session?.header?.cwd) {
        targetCwd = session.header.cwd
      } else {
        const persistence = ctx.get('sessionPersistence' as any) as any
        if (persistence && typeof persistence.inspect === 'function') {
          const inspected = await persistence.inspect(sessionId)
          if (inspected?.meta?.cwd) {
            targetCwd = inspected.meta.cwd
          }
        }
      }
    } catch {}
  }

  // 2. Query official Cordis Skill Registry across resolved scopes
  const presets = ctx.get('agentPresets' as any) as any
  const scopes = await resolveScopes(ctx, sessionId)

  for (const scope of scopes) {
    let skillsService: any = undefined
    if (
      scope &&
      scope.ctx &&
      presets &&
      typeof presets.serviceFor === 'function'
    ) {
      try {
        skillsService = presets.serviceFor(scope, 'skills')
      } catch {}
    }
    if (!skillsService) {
      skillsService = ctx.get('skills' as any) as any
    }

    if (skillsService && typeof skillsService.list === 'function') {
      try {
        const list = await skillsService.list({
          cwd: targetCwd,
          scope,
        })
        if (Array.isArray(list)) {
          for (const s of list) {
            if (!map.has(s.name)) {
              const { isRuntime, source } = classifySkillSource(s)
              const resolvedPath =
                s.path ||
                (s.resourceBase?.kind === 'directory'
                  ? s.resourceBase.path
                  : undefined)
              map.set(s.name, {
                name: s.name,
                description: s.description || '',
                whenToUse: s.whenToUse,
                provider: s.provider || 'skills-registry',
                source,
                path: resolvedPath,
                modelInvocable: s.invocation?.modelInvocable ?? true,
                userInvocable: s.invocation?.userInvocable ?? true,
                isRuntime,
              })
            }
          }
        }
      } catch {}
    }
  }

  return Array.from(map.values()).sort(compareSkills)
}

export async function getSkillDetail(
  ctx: Context,
  name: string,
  sessionId?: string,
): Promise<SkillItem | null> {
  let targetCwd: string | undefined = undefined
  if (sessionId) {
    try {
      const sessionsService = ctx.get('sessions' as any) as any
      const session = sessionsService?.get?.(sessionId)
      if (session?.header?.cwd) {
        targetCwd = session.header.cwd
      } else {
        const persistence = ctx.get('sessionPersistence' as any) as any
        if (persistence && typeof persistence.inspect === 'function') {
          const inspected = await persistence.inspect(sessionId)
          if (inspected?.meta?.cwd) {
            targetCwd = inspected.meta.cwd
          }
        }
      }
    } catch {}
  }

  // Query official Cordis Skill Registry across resolved scopes
  const presets = ctx.get('agentPresets' as any) as any
  const scopes = await resolveScopes(ctx, sessionId)

  for (const scope of scopes) {
    let skillsService: any = undefined
    if (
      scope &&
      scope.ctx &&
      presets &&
      typeof presets.serviceFor === 'function'
    ) {
      try {
        skillsService = presets.serviceFor(scope, 'skills')
      } catch {}
    }
    if (!skillsService) {
      skillsService = ctx.get('skills' as any) as any
    }

    if (skillsService && typeof skillsService.get === 'function') {
      try {
        const s = await skillsService.get(name, {
          cwd: targetCwd,
          scope,
        })
        if (s) {
          const { isRuntime, source } = classifySkillSource(s)
          const resolvedPath =
            s.path ||
            (s.resourceBase?.kind === 'directory'
              ? s.resourceBase.path
              : undefined)
          return {
            name: s.name,
            description: s.description || '',
            whenToUse: s.whenToUse,
            provider: s.provider || 'skills-registry',
            source,
            path: resolvedPath,
            content: s.content,
            modelInvocable: s.invocation?.modelInvocable ?? true,
            userInvocable: s.invocation?.userInvocable ?? true,
            isRuntime,
          }
        }
      } catch {}
    }
  }

  return null
}
