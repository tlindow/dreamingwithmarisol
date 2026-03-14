import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { SiteContent } from '../lib/types';
import {
    importSiteContent,
    loadSiteContent,
    resetSiteContent,
    saveSiteContent,
} from './contentStore';

interface ContentContextValue {
    content: SiteContent;
    setContent: Dispatch<SetStateAction<SiteContent>>;
    resetContent: () => void;
    importContent: (raw: string) => void;
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
    const [content, setContent] = useState<SiteContent>(() => loadSiteContent());

    useEffect(() => {
        saveSiteContent(content);
    }, [content]);

    const value = useMemo<ContentContextValue>(
        () => ({
            content,
            setContent,
            resetContent: () => {
                setContent(resetSiteContent());
            },
            importContent: (raw: string) => {
                setContent(importSiteContent(raw));
            },
        }),
        [content],
    );

    return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useContent() {
    const ctx = useContext(ContentContext);
    if (!ctx) {
        throw new Error('useContent must be used inside ContentProvider');
    }
    return ctx;
}
