import * as React from 'react';
import type { SkillsSettingsProps } from './types.ts';
export declare function getSkillSourceMeta(skill: {
    source?: string;
    isRuntime?: boolean;
} | null | undefined, t: (key: string, params?: any) => string): {
    sourceClass: string;
    sourceLabel: string;
};
export declare function SkillsSettingsTab({ api: _api, t, close: _close, }: SkillsSettingsProps): React.DetailedReactHTMLElement<{
    className: string;
}, HTMLElement>;
