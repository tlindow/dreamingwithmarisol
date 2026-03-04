import type { Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

const CALENDLY_API = 'https://api.calendly.com';
const CALENDLY_BOOKING = 'https://calendly.com/api/booking';
const CACHE_TTL = 5 * 60 * 1000;

interface CacheEntry {
  data: { available: boolean | null; slots?: number; error?: string };
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function apiFetch(path: string, token: string): Promise<any> {
  const resp = await fetch(`${CALENDLY_API}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    throw new Error(`Calendly ${resp.status}: ${body}`);
  }
  return resp.json() as Promise<unknown>;
}

function parseCalendlyUrl(raw: string): { username: string; slug: string } | null {
  try {
    const url = new URL(raw);
    const parts = url.pathname.replace(/^\//, '').split('/').filter(Boolean);
    if (parts.length >= 2) return { username: parts[0], slug: parts[1] };
    if (parts.length === 1) return { username: parts[0], slug: '' };
  } catch { /* invalid URL */ }
  return null;
}

async function resolveUserUri(username: string): Promise<string | null> {
  const resp = await fetch(`${CALENDLY_BOOKING}/profiles/${encodeURIComponent(username)}`, {
    headers: { Accept: 'application/json' },
  });
  if (!resp.ok) return null;
  const data = await resp.json() as { owning_user?: { uuid?: string } };
  const uuid = data.owning_user?.uuid;
  return uuid ? `${CALENDLY_API}/users/${uuid}` : null;
}

async function checkAvailability(
  calendlyUrl: string,
  token: string,
): Promise<{ available: boolean; slots: number }> {
  const cached = cache.get(calendlyUrl);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as { available: boolean; slots: number };
  }

  const parsed = parseCalendlyUrl(calendlyUrl);
  if (!parsed) throw new Error('Invalid Calendly URL');

  let userUri: string | null = null;

  try {
    const me = await apiFetch('/users/me', token);
    userUri = me.resource?.uri ?? null;
  } catch {
    userUri = await resolveUserUri(parsed.username);
  }

  if (!userUri) throw new Error('Could not resolve Calendly user');

  const eventTypes = await apiFetch(
    `/event_types?user=${encodeURIComponent(userUri)}&active=true&count=100`,
    token,
  );

  const normalized = calendlyUrl.replace(/\/$/, '').split('?')[0].toLowerCase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let eventType = eventTypes.collection?.find((et: any) =>
    et.scheduling_url?.replace(/\/$/, '').split('?')[0].toLowerCase() === normalized,
  );

  if (!eventType && parsed.slug) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    eventType = eventTypes.collection?.find((et: any) =>
      et.slug?.toLowerCase() === parsed.slug.toLowerCase(),
    );
  }

  if (!eventType && eventTypes.collection?.length > 0) {
    eventType = eventTypes.collection[0];
  }

  if (!eventType) {
    return { available: false, slots: 0 };
  }

  const now = new Date();
  const startTime = new Date(now);
  startTime.setMinutes(0, 0, 0);
  startTime.setHours(startTime.getHours() + 1);

  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const daysLeft = (endOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  const checkEnd = daysLeft < 7
    ? new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59)
    : endOfMonth;

  const windows: Array<{ start: string; end: string }> = [];
  let wStart = new Date(startTime);
  while (wStart < checkEnd) {
    const wEnd = new Date(wStart);
    wEnd.setDate(wEnd.getDate() + 7);
    if (wEnd > checkEnd) wEnd.setTime(checkEnd.getTime());
    if (wEnd.getTime() <= wStart.getTime()) break;
    windows.push({ start: wStart.toISOString(), end: wEnd.toISOString() });
    wStart = new Date(wEnd);
  }

  const eventTypeUri = encodeURIComponent(eventType.uri);
  const results = await Promise.allSettled(
    windows.map((w) =>
      apiFetch(
        `/event_type_available_times?event_type=${eventTypeUri}&start_time=${w.start}&end_time=${w.end}`,
        token,
      ),
    ),
  );

  let totalSlots = 0;
  for (const r of results) {
    if (r.status === 'fulfilled') {
      totalSlots += r.value.collection?.length || 0;
    }
  }

  const result = { available: totalSlots > 0, slots: totalSlots };
  cache.set(calendlyUrl, { data: result, timestamp: Date.now() });
  return result;
}

export function calendlyAvailabilityPlugin(): Plugin {
  return {
    name: 'calendly-availability',
    configureServer(server) {
      server.middlewares.use(
        async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          if (!req.url?.startsWith('/api/check-availability')) {
            next();
            return;
          }

          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'public, max-age=300');

          const token = process.env.CALENDLY_API_TOKEN;
          if (!token) {
            res.writeHead(200);
            res.end(JSON.stringify({ available: null, error: 'no_token' }));
            return;
          }

          try {
            const url = new URL(req.url, `http://${req.headers.host}`);
            const calendlyUrl = url.searchParams.get('calendlyUrl');

            if (!calendlyUrl) {
              res.writeHead(400);
              res.end(JSON.stringify({ available: null, error: 'missing_url' }));
              return;
            }

            const result = await checkAvailability(calendlyUrl, token);
            res.writeHead(200);
            res.end(JSON.stringify(result));
          } catch (err) {
            const message = err instanceof Error ? err.message : 'unknown';
            console.error('[calendly-plugin] Error:', message);
            res.writeHead(200);
            res.end(JSON.stringify({ available: null, error: 'api_error' }));
          }
        },
      );
    },
  };
}
