import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const SANITY_PROJECT_ID = 't8kqnnav';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2025-02-24';

interface ProductDoc {
    _id: string;
    title: string;
    price?: number;
    description?: string;
    image?: { asset?: { _ref?: string } };
}

interface EventDoc {
    _id: string;
    title: string;
    price?: number;
    description?: string;
    image?: { asset?: { _ref?: string } };
}

async function fetchFromSanity<T>(query: string, params: Record<string, string>): Promise<T> {
    const paramString = Object.entries(params)
        .map(([k, v]) => `$${k}=${encodeURIComponent(JSON.stringify(v))}`)
        .join('&');
    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}&${paramString}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Sanity fetch failed: ${res.status}`);
    const json = await res.json();
    return json.result as T;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
        console.error('STRIPE_SECRET_KEY is not set');
        return res.status(500).json({ error: 'Stripe is not configured' });
    }

    const stripe = new Stripe(stripeSecretKey);

    const body = req.body as { type?: string; id?: string; successUrl?: string; cancelUrl?: string };
    const { type, id, successUrl, cancelUrl } = body;

    if (!type || !id) {
        return res.status(400).json({ error: 'Missing type or id' });
    }

    if (type !== 'product' && type !== 'event') {
        return res.status(400).json({ error: 'Invalid type. Use "product" or "event"' });
    }

    const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || 'https://dreamingwithmarisol.com';
    const success = successUrl || `${origin}/checkout/success`;
    const cancel = cancelUrl || `${origin}/checkout/cancel`;

    try {
        let doc: ProductDoc | EventDoc | null;
        let itemType: string;

        if (type === 'product') {
            doc = await fetchFromSanity<ProductDoc | null>(
                `*[_type == "product" && _id == $id][0]{ _id, title, price, description, "image": image.asset._ref }`,
                { id }
            );
            itemType = 'product';
        } else {
            doc = await fetchFromSanity<EventDoc | null>(
                `*[_type == "event" && _id == $id][0]{ _id, title, price, description, "image": image.asset._ref }`,
                { id }
            );
            itemType = 'event';
        }

        if (!doc) {
            return res.status(404).json({ error: `${type} not found` });
        }

        const price = doc.price;
        if (price == null || price < 0) {
            return res.status(400).json({ error: 'This item has no price or is free' });
        }

        const unitAmount = Math.round(price * 100);
        if (unitAmount < 50) {
            return res.status(400).json({ error: 'Minimum charge is $0.50' });
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: unitAmount,
                        product_data: {
                            name: doc.title,
                            description: doc.description || undefined,
                            metadata: {
                                sanityId: doc._id,
                                itemType,
                            },
                        },
                    },
                    quantity: 1,
                },
            ],
            success_url: `${success}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancel,
            metadata: {
                sanityId: doc._id,
                itemType,
            },
        });

        if (!session.url) {
            return res.status(500).json({ error: 'Failed to create checkout session' });
        }

        return res.status(200).json({ url: session.url });
    } catch (err) {
        console.error('Checkout session error:', err);
        const message = err instanceof Error ? err.message : 'Unknown error';
        return res.status(500).json({ error: message });
    }
}
