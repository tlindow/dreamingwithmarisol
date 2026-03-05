import { useEffect, useRef, useState } from 'react';
import { client, previewClient } from '../sanityClient';
import { subscribeToPreviewRefresh } from '../lib/previewRefresh';

interface UseSanityQueryResult<T> {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
}

/**
 * Returns true when the app is running inside the Sanity Presentation tool
 * iframe, which means we should show draft content and react to live refreshes.
 */
function isInsidePresentationIframe(): boolean {
    try {
        return (
            window.self !== window.top &&
            Boolean(document.referrer) &&
            new URL(document.referrer).hostname.endsWith('.sanity.studio')
        );
    } catch {
        return false;
    }
}

export function useSanityQuery<T>(
    query: string,
    params?: Record<string, string | undefined>,
): UseSanityQueryResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Use the preview (draft-aware) client when inside the Presentation iframe.
    const inPreview = isInsidePresentationIframe();
    const activeClient = inPreview ? previewClient : client;

    const paramsKey = params ? JSON.stringify(params) : '';

    // Stable ref so the refresh callback always closes over the current query/params.
    const fetchRef = useRef<() => void>(() => undefined);

    useEffect(() => {
        let cancelled = false;

        const doFetch = () => {
            if (cancelled) return;
            const fetchPromise = params
                ? activeClient.fetch<T>(query, params)
                : activeClient.fetch<T>(query);

            fetchPromise
                .then((result) => {
                    if (!cancelled) {
                        setData(result);
                        setIsLoading(false);
                    }
                })
                .catch((err: unknown) => {
                    if (!cancelled) {
                        setError(err instanceof Error ? err : new Error(String(err)));
                        setIsLoading(false);
                    }
                });
        };

        fetchRef.current = doFetch;
        doFetch();

        return () => {
            cancelled = true;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, paramsKey, inPreview]);

    // Subscribe to Presentation-tool refresh signals (mutation or manual refresh).
    useEffect(() => {
        return subscribeToPreviewRefresh(() => fetchRef.current());
    }, []);

    // Subscribe to real-time published-content mutations so the preview updates
    // automatically when documents are published, even without a full page reload.
    useEffect(() => {
        if (!inPreview) return;

        const subscription = activeClient
            .listen(query, params ?? {}, { visibility: 'query' })
            .subscribe(() => {
                fetchRef.current();
            });

        return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, paramsKey, inPreview]);

    return { data, isLoading, error };
}
