export function parseToolParameters(schema) {
    if (!schema || typeof schema !== 'object')
        return [];
    const properties = schema.properties;
    if (!properties || typeof properties !== 'object')
        return [];
    const requiredSet = new Set(Array.isArray(schema.required) ? schema.required : []);
    const items = [];
    for (const [name, rawProp] of Object.entries(properties)) {
        if (!rawProp || typeof rawProp !== 'object') {
            items.push({
                name,
                type: 'any',
                required: requiredSet.has(name),
            });
            continue;
        }
        const prop = rawProp;
        let typeStr = prop.type || 'any';
        if (prop.type === 'array') {
            const itemType = prop.items?.type || 'any';
            typeStr = `array<${itemType}>`;
        }
        else if (Array.isArray(prop.type)) {
            typeStr = prop.type.join(' | ');
        }
        items.push({
            name,
            type: typeStr,
            required: requiredSet.has(name),
            description: typeof prop.description === 'string' ? prop.description : undefined,
            default: prop.default,
            enum: Array.isArray(prop.enum) ? prop.enum : undefined,
        });
    }
    items.sort((a, b) => {
        if (a.required !== b.required)
            return a.required ? -1 : 1;
        return a.name.localeCompare(b.name);
    });
    return items;
}
export const LOCALE_NS = 'settings.sessionSettings';
export const MCP_LOCALE_NS = 'settings.mcpServers';
export const SKILLS_LOCALE_NS = 'settings.skillsSettings';
