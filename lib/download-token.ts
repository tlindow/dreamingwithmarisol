import { createHmac, timingSafeEqual } from 'node:crypto'

export const DOWNLOAD_TTL_SECONDS = 7 * 24 * 60 * 60
export const DOWNLOAD_LIMIT = 5

export type DownloadPayload = {
  sessionId: string
  productSlug: string
  exp: number
}

export type TokenResult =
  | { ok: true; payload: DownloadPayload }
  | { ok: false; status: 403; reason: 'invalid' | 'expired' }

function signBody(body: string, secret: string) {
  return createHmac('sha256', secret).update(body).digest('base64url')
}

export function signDownloadToken(payload: DownloadPayload, secret: string) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${body}.${signBody(body, secret)}`
}

export function verifyDownloadToken(token: string, secret: string, now = Date.now()): TokenResult {
  const parts = token.split('.')
  if (parts.length !== 2) return { ok: false, status: 403, reason: 'invalid' }
  const [body, sig] = parts
  const expected = signBody(body, secret)
  const left = Buffer.from(sig)
  const right = Buffer.from(expected)
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return { ok: false, status: 403, reason: 'invalid' }
  }
  let payload: DownloadPayload
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as DownloadPayload
  } catch {
    return { ok: false, status: 403, reason: 'invalid' }
  }
  if (!payload.sessionId || !payload.productSlug || typeof payload.exp !== 'number') {
    return { ok: false, status: 403, reason: 'invalid' }
  }
  if (payload.exp * 1000 <= now) return { ok: false, status: 403, reason: 'expired' }
  return { ok: true, payload }
}
