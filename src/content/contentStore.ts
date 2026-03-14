import { DEFAULT_SITE_CONTENT } from './defaults';
import type { SiteContent } from '../lib/types';

const STORAGE_KEY = 'dwm_homegrown_cms_content_v1';

function cloneDefaults(): SiteContent {
    return JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT)) as SiteContent;
}

function mergeWithDefaults(source: unknown): SiteContent {
    if (!source || typeof source !== 'object') {
        return cloneDefaults();
    }

    const base = cloneDefaults();
    const partial = source as Partial<SiteContent>;

    return {
        ...base,
        ...partial,
        siteSettings: { ...base.siteSettings, ...(partial.siteSettings ?? {}) },
        homePage: { ...base.homePage, ...(partial.homePage ?? {}) },
        aboutPage: { ...base.aboutPage, ...(partial.aboutPage ?? {}) },
        inPersonService: { ...base.inPersonService, ...(partial.inPersonService ?? {}) },
        onlineService: { ...base.onlineService, ...(partial.onlineService ?? {}) },
        valuesPage: { ...base.valuesPage, ...(partial.valuesPage ?? {}) },
        pricingPage: { ...base.pricingPage, ...(partial.pricingPage ?? {}) },
        eventsPage: { ...base.eventsPage, ...(partial.eventsPage ?? {}) },
        events: Array.isArray(partial.events) ? partial.events : base.events,
        learningModules: Array.isArray(partial.learningModules) ? partial.learningModules : base.learningModules,
        products: Array.isArray(partial.products) ? partial.products : base.products,
    };
}

export function loadSiteContent(): SiteContent {
    if (typeof window === 'undefined') {
        return cloneDefaults();
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return cloneDefaults();
    }

    try {
        const parsed = JSON.parse(raw);
        return mergeWithDefaults(parsed);
    } catch {
        return cloneDefaults();
    }
}

export function saveSiteContent(content: SiteContent): void {
    if (typeof window === 'undefined') {
        return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

export function resetSiteContent(): SiteContent {
    const defaults = cloneDefaults();
    saveSiteContent(defaults);
    return defaults;
}

export function exportSiteContent(content: SiteContent): string {
    return JSON.stringify(content, null, 2);
}

export function importSiteContent(raw: string): SiteContent {
    const parsed = JSON.parse(raw);
    const merged = mergeWithDefaults(parsed);
    saveSiteContent(merged);
    return merged;
}
