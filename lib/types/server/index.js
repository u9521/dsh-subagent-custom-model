import { loadMcpStore } from './mcp/storage.js';
import { loadSessionSettingsStore } from './session/storage.js';
import { McpManager } from './mcp/manager.js';
import { registerMcpRoutes } from './mcp/routes.js';
import { registerSessionSettingsRoutes } from './session/routes.js';
import { registerSkillsRoutes } from './skills/routes.js';
import { registerLegacySubagentModelRoutes } from './subagent-model/routes.js';
import { registerSubagentModelInterceptor } from './subagent-model/interceptor.js';
import { registerMcpInterceptors } from './mcp/interceptor.js';
import { registerSkillsInterceptors } from './skills/interceptor.js';
export const name = 'session-settings';
export const inject = ['webServer'];
export function apply(ctx) {
    let mcpStore = loadMcpStore();
    let sessionSettingsStore = loadSessionSettingsStore();
    // MCP Manager to handle tool discovery, registration on ctx.tools, and execution
    const mcpManager = new McpManager(ctx, () => mcpStore, (s) => {
        mcpStore = s;
    }, () => sessionSettingsStore);
    const webServer = ctx.get('webServer');
    if (webServer) {
        const unregisterMcp = registerMcpRoutes(webServer, () => mcpStore, (s) => {
            mcpStore = s;
        }, mcpManager);
        const unregisterSessionSettings = registerSessionSettingsRoutes(ctx, webServer, () => sessionSettingsStore, (s) => {
            sessionSettingsStore = s;
        }, () => mcpStore, mcpManager);
        const unregisterSkills = registerSkillsRoutes(ctx, webServer);
        const unregisterLegacySubagent = registerLegacySubagentModelRoutes(webServer, () => sessionSettingsStore, (s) => {
            sessionSettingsStore = s;
        });
        ctx.effect(() => {
            return () => {
                unregisterMcp();
                unregisterSessionSettings();
                unregisterSkills();
                unregisterLegacySubagent();
            };
        }, 'session-settings: webServer routes');
    }
    // Sync tools on startup
    mcpManager.syncAll();
    ctx.effect(() => {
        return () => {
            mcpManager.dispose();
        };
    }, 'session-settings: mcpManager');
    // Register domain interceptors
    registerSubagentModelInterceptor(ctx, () => sessionSettingsStore);
    registerMcpInterceptors(ctx, () => sessionSettingsStore, () => mcpStore, mcpManager);
    registerSkillsInterceptors(ctx, () => sessionSettingsStore);
}
// Domain Exports
export * from './common/paths.js';
export * from './common/http.js';
export * from './mcp/storage.js';
export * from './mcp/naming.js';
export * from './mcp/manager.js';
export * from './mcp/routes.js';
export * from './mcp/interceptor.js';
export * from './mcp/compatibility/index.js';
export * from './mcp/tester/index.js';
export * from './session/storage.js';
export * from './session/routes.js';
export * from './skills/discovery.js';
export * from './skills/interceptor.js';
export * from './skills/routes.js';
export * from './subagent-model/interceptor.js';
export * from './subagent-model/routes.js';
