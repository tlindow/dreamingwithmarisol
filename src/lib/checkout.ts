/**
 * Creates a Stripe Checkout session and returns the redirect URL.
 * Used for products and events with a price.
 */
export async function createCheckoutSession(params: {
    type: 'product' | 'event';
    id: string;
    successUrl?: string;
    cancelUrl?: string;
}): Promise<{ url: string }> {
    const base = import.meta.env.VITE_API_BASE || '';
    const res = await fetch(`${base}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || 'Checkout failed');
    }

    if (!data.url) {
        throw new Error('No checkout URL returned');
    }

    return { url: data.url };
}
