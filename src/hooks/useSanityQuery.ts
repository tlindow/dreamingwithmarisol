import { useEffect, useState } from 'react';
import { client } from '../sanityClient';

interface UseSanityQueryResult<T> {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
}

export function useSanityQuery<T>(
    query: string,
    params?: Record<string, unknown>,
): UseSanityQueryResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const paramsKey = params ? JSON.stringify(params) : '';

    useEffect(() => {
        let cancelled = false;

        const fetchData = params
            ? client.fetch<T>(query, params)
            : client.fetch<T>(query);

        fetchData
            .then((result) => {
                if (!cancelled) setData(result);
            })
            .catch((err: unknown) => {
                if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, paramsKey]);

    return { data, isLoading, error };
}
