import * as React from 'react';
import { type ClientPageProps } from './types.ts';
export declare function SessionSettingsViewPage({ api, t, sessionId, sessionTitle: _sessionTitle, useSessions, onSave, }: ClientPageProps): React.DetailedReactHTMLElement<{
    className: string;
    'data-session-settings-view': string;
    'data-conversation-composer-overlay': string;
}, HTMLElement>;
