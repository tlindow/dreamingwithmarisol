import { createClient } from '@sanity/client';
import imageUrlBuilder, { type SanityImageSource } from '@sanity/image-url';

const resolvedStudioUrl =
    import.meta.env.VITE_SANITY_STUDIO_URL ??
    (import.meta.env.PROD
        ? 'https://dreaming-with-marisol.sanity.studio'
        : 'http://localhost:3333');

export const client = createClient({
    projectId: 't8kqnnav',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2025-02-24',
    stega: {
        enabled: true,
        studioUrl: resolvedStudioUrl,
    },
});

const builder = imageUrlBuilder(client);

// Helper to generate image URLs from Sanity image assets
export const urlFor = (source: SanityImageSource) => {
    return builder.image(source);
};
