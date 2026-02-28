/**
 * Utility to dynamically load fonts from URLs
 */
export const loadFont = (url: string, id?: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        // Check if font is already loaded
        const linkId = id || `font-${url.replace(/[^a-zA-Z0-9]/g, '-')}`;
        const existingLink = document.getElementById(linkId);
        
        if (existingLink) {
            resolve();
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.id = linkId;
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to load font from ${url}`));
        
        document.head.appendChild(link);
    });
};

/**
 * Load multiple fonts
 */
export const loadFonts = async (urls: string[]): Promise<void> => {
    await Promise.all(urls.map((url, index) => loadFont(url, `font-${index}`)));
};
