import {
  DOWNLOAD_LIMIT,
  DOWNLOAD_TTL_SECONDS,
  signDownloadToken,
  verifyDownloadToken,
  type DownloadPayload,
} from './download-token'

export type CheckoutSessionLike = {
  id: string
  payment_status: string | null
  customer_email?: string | null
  customer_details?: { email?: string | null } | null
  metadata?: { productSlug?: string | null } | null
}

export type DeliveryRecord = {
  sessionId: string
  productSlug: string
  email: string
  token: string
  remaining: number
  expiresAt: number
  emailed: boolean
  eventIds: string[]
}

export interface DeliveryStore {
  get(sessionId: string): Promise<DeliveryRecord | null>
  /** Returns the existing record when one is already stored. */
  createIfAbsent(record: DeliveryRecord): Promise<{ created: boolean; record: DeliveryRecord }>
  addEvent(sessionId: string, eventId: string): Promise<void>
  markEmailed(sessionId: string): Promise<void>
  consume(sessionId: string): Promise<DeliveryRecord | null>
}

export type FulfillResult = {
  delivered: boolean
  duplicate: boolean
  reason?: 'unpaid' | 'missing-product' | 'missing-email'
  record?: DeliveryRecord
}

export function sessionEmail(session: CheckoutSessionLike) {
  return session.customer_details?.email || session.customer_email || ''
}

export async function fulfillCheckoutSession(
  session: CheckoutSessionLike,
  eventId: string | null,
  deps: {
    secret: string
    store: DeliveryStore
    sendEmail: (record: DeliveryRecord) => Promise<void>
    now?: number
  },
): Promise<FulfillResult> {
  if (session.payment_status !== 'paid') {
    return { delivered: false, duplicate: false, reason: 'unpaid' }
  }
  const productSlug = session.metadata?.productSlug
  if (!productSlug) {
    return { delivered: false, duplicate: false, reason: 'missing-product' }
  }
  const email = sessionEmail(session)
  if (!email) {
    return { delivered: false, duplicate: false, reason: 'missing-email' }
  }

  const existing = await deps.store.get(session.id)
  if (existing) {
    if (eventId) await deps.store.addEvent(session.id, eventId)
    return { delivered: false, duplicate: true, record: existing }
  }

  const now = deps.now ?? Date.now()
  const exp = Math.floor(now / 1000) + DOWNLOAD_TTL_SECONDS
  const token = signDownloadToken({ sessionId: session.id, productSlug, exp }, deps.secret)
  const record: DeliveryRecord = {
    sessionId: session.id,
    productSlug,
    email,
    token,
    remaining: DOWNLOAD_LIMIT,
    expiresAt: exp * 1000,
    emailed: false,
    eventIds: eventId ? [eventId] : [],
  }
  const saved = await deps.store.createIfAbsent(record)
  if (!saved.created) {
    if (eventId) await deps.store.addEvent(session.id, eventId)
    return { delivered: false, duplicate: true, record: saved.record }
  }
  await deps.sendEmail(saved.record)
  await deps.store.markEmailed(session.id)
  return { delivered: true, duplicate: false, record: { ...saved.record, emailed: true } }
}

export type DownloadDecision =
  | { ok: true; payload: DownloadPayload; record: DeliveryRecord }
  | { ok: false; status: 403; reason: string }

export async function authorizeDownload(
  token: string,
  secret: string,
  store: DeliveryStore,
  now = Date.now(),
): Promise<DownloadDecision> {
  const verified = verifyDownloadToken(token, secret, now)
  if (!verified.ok) return verified
  const record = await store.get(verified.payload.sessionId)
  if (!record || record.token !== token || record.productSlug !== verified.payload.productSlug) {
    return { ok: false, status: 403, reason: 'unknown' }
  }
  if (record.remaining <= 0) return { ok: false, status: 403, reason: 'exhausted' }
  const next = await store.consume(record.sessionId)
  if (!next) return { ok: false, status: 403, reason: 'exhausted' }
  return { ok: true, payload: verified.payload, record: next }
}
