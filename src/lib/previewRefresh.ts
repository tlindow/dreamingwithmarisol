/**
 * Lightweight pub/sub bus that bridges the Sanity Presentation tool's refresh
 * signals (received in App.tsx via enableVisualEditing) with the individual
 * useSanityQuery hooks so they can re-fetch without a full page reload.
 */
type RefreshCallback = () => void;

const listeners = new Set<RefreshCallback>();

export function subscribeToPreviewRefresh(cb: RefreshCallback): () => void {
    listeners.add(cb);
    return () => {
        listeners.delete(cb);
    };
}

export function triggerPreviewRefresh(): void {
    listeners.forEach((cb) => cb());
}
