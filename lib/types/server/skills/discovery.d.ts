import type { Context } from '@deepseek-ai/cordis';
import type { SkillItem } from '../../types.ts';
export declare function classifySkillSource(skill: {
    provider?: string;
    source?: string;
    path?: string;
    metadata?: Readonly<Record<string, unknown>>;
}): {
    isRuntime: boolean;
    source: string;
};
export declare function isRuntimeSkill(skill: {
    provider?: string;
    source?: string;
    path?: string;
    metadata?: Readonly<Record<string, unknown>>;
}): boolean;
export declare function compareSkills(a: SkillItem, b: SkillItem): number;
export declare function getAvailableSkills(ctx: Context, sessionId?: string): Promise<SkillItem[]>;
export declare function getSkillDetail(ctx: Context, name: string, sessionId?: string): Promise<SkillItem | null>;
