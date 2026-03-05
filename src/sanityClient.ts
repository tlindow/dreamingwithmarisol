import { createClient } from '@sanity/client';
import imageUrlBuilder, { type SanityImageSource } from '@sanity/image-url';

const resolvedStudioUrl =
    import.meta.env.VITE_SANITY_STUDIO_URL ??
    (import.meta.env.PROD
        ? 'https://dreaming-with-marisol.sanity.studio'
        : 'http://localhost:3333');

// Stega encodes invisible source-map characters into strings so the Presentation
// tool can render click-to-edit overlays. Only needed in preview/dev contexts —
// enabling it on the public production site would pollute copy-pasted text.
// Set VITE_SANITY_STEGA_ENABLED=true on Vercel preview environments to opt in.
const stegaEnabled =
    !import.meta.env.PROD ||
    import.meta.env.VITE_SANITY_STEGA_ENABLED === 'true';

export const client = createClient({
    projectId: 't8kqnnav',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2025-02-24',
    stega: {
        enabled: stegaEnabled,
        studioUrl: resolvedStudioUrl,
    },
});

// Token-authenticated client used for fetching draft content in the Presentation
// tool iframe. VITE_SANITY_VIEWER_TOKEN must be a read-only viewer token.
// Without a token this client falls back to published content only.
const viewerToken = import.meta.env.VITE_SANITY_VIEWER_TOKEN as string | undefined;

export const previewClient = createClient({
    projectId: 't8kqnnav',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2025-02-24',
    perspective: 'previewDrafts',
    ...(viewerToken ? { token: viewerToken } : {}),
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
