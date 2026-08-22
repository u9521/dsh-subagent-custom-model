import type { SessionSettingsConfig, SessionSettingsStore, GlobalMcpServerConfig } from '../types.ts';
export declare function getLocalSessionSettingsStore(): SessionSettingsStore;
export declare function saveLocalSessionSettingsStore(store: SessionSettingsStore): void;
export declare function getLocalMcpServers(): GlobalMcpServerConfig[];
export declare function saveLocalMcpServers(servers: GlobalMcpServerConfig[]): void;
export declare function getSessionRawSettings(store: SessionSettingsStore, sessionId?: string): {
    config: SessionSettingsConfig;
    hasOverride: boolean;
};
export declare function getSessionEffectiveSettings(store: SessionSettingsStore, availableMcpServers: GlobalMcpServerConfig[], sessionId?: string): SessionSettingsConfig;
