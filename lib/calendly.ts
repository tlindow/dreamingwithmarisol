const CALENDLY_API = 'https://api.calendly.com'
const CALENDLY_BOOKING = 'https://calendly.com/api/booking'
const CACHE_TTL = 5 * 60 * 1000

type CacheEntry = { available: boolean; slots: number; at: number }
const cache = new Map<string, CacheEntry>()

export type Availability = { available: boolean | null; slots?: number; error?: string }

async function apiFetch(path: string, token: string) {
  const response = await fetch(`${CALENDLY_API}${path}`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  })
  if (!response.ok) throw new Error(`Calendly ${response.status}`)
  return response.json() as Promise<{
    resource?: { uri?: string }
    collection?: Array<{ uri?: string; slug?: string; scheduling_url?: string }>
  }>
}

function parseCalendlyUrl(raw: string) {
  try {
    const url = new URL(raw)
    const parts = url.pathname.replace(/^\//, '').split('/').filter(Boolean)
    if (parts[0] === 'd' && parts.length >= 3) return { username: parts[0], slug: parts[2] }
    if (parts.length >= 2) return { username: parts[0], slug: parts[1] }
    if (parts.length === 1) return { username: parts[0], slug: '' }
  } catch {
    return null
  }
  return null
}

export async function checkAvailability(calendlyUrl: string, token = process.env.CALENDLY_API_TOKEN): Promise<Availability> {
  if (!token) return { available: null, error: 'no_token' }
  try {
    return await lookupAvailability(calendlyUrl, token)
  } catch (error) {
    console.error('[calendly]', error)
    return { available: null, error: 'api_error' }
  }
}

async function lookupAvailability(calendlyUrl: string, token: string): Promise<Availability> {
  const cached = cache.get(calendlyUrl)
  if (cached && Date.now() - cached.at < CACHE_TTL) {
    return { available: cached.available, slots: cached.slots }
  }
  const parsed = parseCalendlyUrl(calendlyUrl)
  if (!parsed) return { available: null, error: 'invalid_url' }

  let userUri: string | null = null
  try {
    const me = await apiFetch('/users/me', token)
    userUri = me.resource?.uri ?? null
  } catch {
    const profile = await fetch(`${CALENDLY_BOOKING}/profiles/${encodeURIComponent(parsed.username)}`, {
      headers: { Accept: 'application/json' },
    })
    if (profile.ok) {
      const data = (await profile.json()) as { owning_user?: { uuid?: string } }
      if (data.owning_user?.uuid) userUri = `${CALENDLY_API}/users/${data.owning_user.uuid}`
    }
  }
  if (!userUri) return { available: null, error: 'no_user' }

  const eventTypes = await apiFetch(
    `/event_types?user=${encodeURIComponent(userUri)}&active=true&count=100`,
    token,
  )
  const normalized = calendlyUrl.replace(/\/$/, '').split('?')[0].toLowerCase()
  const collection = eventTypes.collection || []
  let eventType = collection.find(
    (item) => item.scheduling_url?.replace(/\/$/, '').split('?')[0].toLowerCase() === normalized,
  )
  if (!eventType && parsed.slug) {
    eventType = collection.find((item) => item.slug?.toLowerCase() === parsed.slug.toLowerCase())
  }
  if (!eventType) return { available: null, error: 'event_not_found' }

  const now = new Date()
  const startTime = new Date(now)
  startTime.setMinutes(0, 0, 0)
  startTime.setHours(startTime.getHours() + 1)
  const end = new Date(startTime)
  end.setDate(end.getDate() + 21)

  const windows: Array<{ start: string; end: string }> = []
  let cursor = new Date(startTime)
  while (cursor < end) {
    const windowEnd = new Date(cursor)
    windowEnd.setDate(windowEnd.getDate() + 7)
    if (windowEnd > end) windowEnd.setTime(end.getTime())
    if (windowEnd.getTime() <= cursor.getTime()) break
    windows.push({ start: cursor.toISOString(), end: windowEnd.toISOString() })
    cursor = new Date(windowEnd)
  }

  const eventTypeUri = encodeURIComponent(eventType.uri || '')
  const results = await Promise.allSettled(
    windows.map((window) =>
      apiFetch(
        `/event_type_available_times?event_type=${eventTypeUri}&start_time=${window.start}&end_time=${window.end}`,
        token,
      ),
    ),
  )
  let slots = 0
  for (const result of results) {
    if (result.status === 'fulfilled') slots += result.value.collection?.length || 0
  }
  cache.set(calendlyUrl, { available: slots > 0, slots, at: Date.now() })
  return { available: slots > 0, slots }
}
