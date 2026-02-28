import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { client } from '../sanityClient';
import { loadFonts } from '../utils/fontLoader';

interface TypographySettings {
    primaryFont?: string;
    primaryFontUrl?: string;
    secondaryFont?: string;
    secondaryFontUrl?: string;
}

interface EmojiSettings {
    heroEmoji?: string;
    brandEmoji?: string;
    decorativeEmojis?: string[];
    sectionEmojis?: {
        about?: string;
        services?: string;
        store?: string;
        learning?: string;
    };
}

interface TextContentSettings {
    heroTitle?: string;
    heroSubtitle?: string;
    siteDescription?: string;
}

interface SiteSettings {
    title?: string;
    typography?: TypographySettings;
    emojis?: EmojiSettings;
    textContent?: TextContentSettings;
    heroImage?: any;
    portraitImage?: any;
}

interface SiteSettingsContextType {
    settings: SiteSettings | null;
    loading: boolean;
    error: Error | null;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
    settings: null,
    loading: true,
    error: null,
});

export const useSiteSettings = () => useContext(SiteSettingsContext);

interface SiteSettingsProviderProps {
    children: ReactNode;
}

export const SiteSettingsProvider = ({ children }: SiteSettingsProviderProps) => {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await client.fetch(`
                    *[_type == "siteSettings"][0] {
                        title,
                        heroImage,
                        portraitImage,
                        typography {
                            primaryFont,
                            primaryFontUrl,
                            secondaryFont,
                            secondaryFontUrl
                        },
                        emojis {
                            heroEmoji,
                            brandEmoji,
                            decorativeEmojis,
                            sectionEmojis {
                                about,
                                services,
                                store,
                                learning
                            }
                        },
                        textContent {
                            heroTitle,
                            heroSubtitle,
                            siteDescription
                        }
                    }
                `);

                    if (data) {
                        setSettings(data);

                        // Update document title if available
                        if (data.title) {
                            document.title = data.title;
                        }

                        // Load fonts dynamically
                        const fontUrls: string[] = [];
                        if (data.typography?.primaryFontUrl) {
                            fontUrls.push(data.typography.primaryFontUrl);
                        }
                        if (data.typography?.secondaryFontUrl && data.typography.secondaryFontUrl !== data.typography.primaryFontUrl) {
                            fontUrls.push(data.typography.secondaryFontUrl);
                        }

                        if (fontUrls.length > 0) {
                            try {
                                await loadFonts(fontUrls);
                            } catch (error) {
                                console.warn('Some fonts failed to load:', error);
                            }
                        }

                        // Apply font families to CSS variables with fallbacks
                        const root = document.documentElement;
                        if (data.typography?.primaryFont) {
                            root.style.setProperty('--font-primary', `'${data.typography.primaryFont}', 'Inter', sans-serif`);
                        }
                        if (data.typography?.secondaryFont) {
                            root.style.setProperty('--font-secondary', `'${data.typography.secondaryFont}', serif`);
                        }
                    }
            } catch (err) {
                console.error('Error fetching site settings:', err);
                setError(err instanceof Error ? err : new Error('Failed to fetch site settings'));
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return (
        <SiteSettingsContext.Provider value={{ settings, loading, error }}>
            {children}
        </SiteSettingsContext.Provider>
    );
};
