import type { SessionSettingsStore } from '../../types.ts';
export declare function registerLegacySubagentModelRoutes(webServer: any, getSessionSettingsStore: () => SessionSettingsStore, setSessionSettingsStore: (s: SessionSettingsStore) => void): () => void;
