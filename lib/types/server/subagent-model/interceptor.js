import { resolveEffectiveSubagentModel } from '../session/storage.js';
export function registerSubagentModelInterceptor(ctx, getSessionSettingsStore) {
    ;
    ctx.on('agent/request', async (payload, next) => {
        const proposal = await next();
        const session = payload?.agent?.session;
        if (!session?.header || session.header.origin !== 'subagent') {
            return proposal;
        }
        const sessionSettingsStore = getSessionSettingsStore();
        const effectiveCfg = resolveEffectiveSubagentModel(sessionSettingsStore, session.header.parentSession);
        if (effectiveCfg.mode !== 'custom' ||
            !effectiveCfg.provider ||
            !effectiveCfg.model) {
            return proposal;
        }
        return {
            ...proposal,
            provider: effectiveCfg.provider,
            model: effectiveCfg.model,
            ...(effectiveCfg.reasoningEffort
                ? { reasoningEffort: effectiveCfg.reasoningEffort }
                : {}),
        };
    });
}
