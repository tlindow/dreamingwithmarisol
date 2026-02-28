import { createClient } from '@sanity/client';
import imageUrlBuilder, { type SanityImageSource } from '@sanity/image-url';

const isDev = import.meta.env.DEV;

function isInPresentationTool(): boolean {
    try {
        return typeof window !== 'undefined' && window.self !== window.top;
    } catch {
        return true;
    }
}

const stegaEnabled = isDev || isInPresentationTool();

export const client = createClient({
    projectId: 't8kqnnav',
    dataset: 'production',
    useCdn: !stegaEnabled,
    apiVersion: '2025-02-24',
    stega: {
        enabled: stegaEnabled,
        studioUrl: isDev
            ? 'http://localhost:3333'
            : 'https://dreaming-with-marisol.sanity.studio',
    },
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: SanityImageSource) => {
    return builder.image(source);
};
