import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
    projectId: 't8kqnnav',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2025-02-24',
    stega: {
        enabled: true,
        studioUrl:
            import.meta.env.VITE_SANITY_STUDIO_URL ??
            (import.meta.env.PROD
                ? 'https://dreaming-with-marisol.sanity.studio'
                : 'http://localhost:3333'),
    },
});

const builder = imageUrlBuilder(client);

// Helper to generate image URLs from Sanity image assets
export const urlFor = (source: any) => {
    return builder.image(source);
};
