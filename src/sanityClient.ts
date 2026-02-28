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

// Helper to get file URL from Sanity file asset
export const urlForFile = (fileAsset: any): string | null => {
    if (!fileAsset?.asset?._ref) return null;
    // Sanity file URLs follow this pattern: https://cdn.sanity.io/files/{projectId}/{dataset}/{path}
    // The asset reference contains the path information
    const ref = fileAsset.asset._ref;
    // Extract the file path from the reference (format: file-{hash}-{extension})
    const match = ref.match(/file-([^-]+)-([^.]+)/);
    if (!match) return null;
    const [, hash, extension] = match;
    return `https://cdn.sanity.io/files/t8kqnnav/production/${hash}.${extension}`;
};
