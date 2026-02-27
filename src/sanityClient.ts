import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
    projectId: 't8kqnnav', // replace with your actual Sanity projectId
    dataset: 'production',
    useCdn: true, // set to `false` to bypass the edge cache
    apiVersion: '2025-02-24', // use current date (YYYY-MM-DD) to target the latest API version
    stega: {
        enabled: true,
        studioUrl: 'http://localhost:3333',
    },
});

const builder = imageUrlBuilder(client);

// Helper to generate image URLs from Sanity image assets
export const urlFor = (source: any) => {
    return builder.image(source);
};
