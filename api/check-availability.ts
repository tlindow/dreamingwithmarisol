import type { VercelRequest, VercelResponse } from '@vercel/node';

const SANITY_PROJECT_ID = 't8kqnnav';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2025-02-24';

interface CalendlyAvailableTime {
    status: string;
    start_time: string;
}

interface CalendlyAvailableTimesResponse {
    collection: CalendlyAvailableTime[];
}

interface CalendlyEventType {
    uri: string;
    slug: string;
    scheduling_url: string;
}

interface CalendlyEventTypesResponse {
    collection: CalendlyEventType[];
}

interface CalendlyCurrentUser {
    resource: { uri: string };
}

async function calendlyGet<T>(path: string, token: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`https://api.calendly.com${path}`);
    if (params) {
        for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    }
    const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Calendly API ${res.status}: ${body}`);
    }
    return res.json() as Promise<T>;
}

function getMonthDateRange(): { start: string; end: string } {
    const now = new Date();
    const start = new Date(Math.max(now.getTime(), now.getTime()));
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    return {
        start: start.toISOString(),
        end: endOfMonth.toISOString(),
    };
}

async function checkCalendlyAvailability(
    calendlyToken: string,
    calendlyUrl: string,
): Promise<boolean> {
    const currentUser = await calendlyGet<CalendlyCurrentUser>('/users/me', calendlyToken);
    const userUri = currentUser.resource.uri;

    const eventTypes = await calendlyGet<CalendlyEventTypesResponse>('/event_types', calendlyToken, {
        user: userUri,
        active: 'true',
    });

    const normalizedTarget = calendlyUrl.replace(/\/$/, '').toLowerCase();
    const matchedEventType = eventTypes.collection.find(
        (et) => et.scheduling_url.replace(/\/$/, '').toLowerCase() === normalizedTarget,
    );

    if (!matchedEventType) {
        console.warn(`No Calendly event type matched URL: ${calendlyUrl}`);
        return false;
    }

    const { start, end } = getMonthDateRange();
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    let hasAvailability = false;
    let windowStart = new Date(start);

    const maxDaysPerRequest = 7;
    const totalWindows = Math.ceil(diffDays / maxDaysPerRequest);

    for (let i = 0; i < totalWindows; i++) {
        const windowEnd = new Date(
            Math.min(windowStart.getTime() + maxDaysPerRequest * 24 * 60 * 60 * 1000, new Date(end).getTime()),
        );

        const available = await calendlyGet<CalendlyAvailableTimesResponse>(
            '/event_type_available_times',
            calendlyToken,
            {
                event_type: matchedEventType.uri,
                start_time: windowStart.toISOString(),
                end_time: windowEnd.toISOString(),
            },
        );

        if (available.collection.length > 0) {
            hasAvailability = true;
            break;
        }

        windowStart = windowEnd;
    }

    return !hasAvailability;
}

async function updateSanity(fullyBooked: boolean, sanityToken: string): Promise<boolean> {
    const currentValue = await fetch(
        `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(
            '*[_type == "siteSettings"][0].sessionsFullyBooked',
        )}`,
        { headers: { Authorization: `Bearer ${sanityToken}` } },
    );
    const { result } = (await currentValue.json()) as { result: boolean | null };

    if (result === fullyBooked) {
        return false;
    }

    const mutations = [
        {
            patch: {
                query: '*[_type == "siteSettings"]',
                set: { sessionsFullyBooked: fullyBooked },
            },
        },
    ];

    const mutateRes = await fetch(
        `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${sanityToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mutations }),
        },
    );

    if (!mutateRes.ok) {
        const body = await mutateRes.text();
        throw new Error(`Sanity mutation failed ${mutateRes.status}: ${body}`);
    }

    return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const calendlyToken = process.env.CALENDLY_API_TOKEN;
    const sanityToken = process.env.SANITY_API_TOKEN;

    if (!calendlyToken) {
        return res.status(200).json({
            skipped: true,
            reason: 'CALENDLY_API_TOKEN not configured — using manual toggle',
        });
    }
    if (!sanityToken) {
        return res.status(500).json({ error: 'SANITY_API_TOKEN not configured' });
    }

    const calendlyUrlRes = await fetch(
        `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(
            '*[_type == "siteSettings"][0].calendlyUrl',
        )}`,
        { headers: { Authorization: `Bearer ${sanityToken}` } },
    );
    const { result: calendlyUrl } = (await calendlyUrlRes.json()) as { result: string | null };

    if (!calendlyUrl) {
        return res.status(200).json({
            skipped: true,
            reason: 'No calendlyUrl set in siteSettings — nothing to check',
        });
    }

    try {
        const fullyBooked = await checkCalendlyAvailability(calendlyToken, calendlyUrl);
        const changed = await updateSanity(fullyBooked, sanityToken);

        return res.status(200).json({
            fullyBooked,
            changed,
            checkedAt: new Date().toISOString(),
        });
    } catch (err) {
        console.error('Availability check failed:', err);
        return res.status(500).json({
            error: 'Availability check failed',
            message: err instanceof Error ? err.message : String(err),
        });
    }
}
