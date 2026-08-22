import type { Context } from '@deepseek-ai/cordis'
import type { SessionSettingsStore } from '../../types.ts'
import { resolveEffectiveSubagentModel } from '../session/storage.ts'

export function registerSubagentModelInterceptor(
  ctx: Context,
  getSessionSettingsStore: () => SessionSettingsStore,
): void {
  ;(ctx as any).on('agent/request', async (payload: any, next: any) => {
    const proposal = await next()
    const session = payload?.agent?.session
    if (!session?.header || session.header.origin !== 'subagent') {
      return proposal
    }

    const sessionSettingsStore = getSessionSettingsStore()
    const effectiveCfg = resolveEffectiveSubagentModel(
      sessionSettingsStore,
      session.header.parentSession,
    )

    if (
      effectiveCfg.mode !== 'custom' ||
      !effectiveCfg.provider ||
      !effectiveCfg.model
    ) {
      return proposal
    }

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
