import { createClient } from '@sanity/client';
import imageUrlBuilder, { type SanityImageSource } from '@sanity/image-url';

const isDev = import.meta.env.DEV;

export const client = createClient({
    projectId: 't8kqnnav',
    dataset: 'production',
    useCdn: !isDev,
    apiVersion: '2025-02-24',
    stega: {
        enabled: isDev,
        studioUrl: 'http://localhost:3333',
    },
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: SanityImageSource) => {
    return builder.image(source);
};
