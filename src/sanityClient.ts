import { createClient } from '@sanity/client';
import imageUrlBuilder, { type SanityImageSource } from '@sanity/image-url';

const studioUrl = import.meta.env.DEV
    ? 'http://localhost:3333'
    : 'https://dreaming-with-marisol.sanity.studio';

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

export const urlFor = (source: SanityImageSource) => {
    return builder.image(source);
};
