import type { Context } from '@deepseek-ai/cordis';
import type { SessionSettingsStore } from '../../types.ts';
export declare function registerSubagentModelInterceptor(ctx: Context, getSessionSettingsStore: () => SessionSettingsStore): void;
