import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

const COOKIE = 'dwm_admin'
const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000

export function passwordsMatch(input: string, expected: string) {
  const a = createHash('sha256').update(input).digest()
  const b = createHash('sha256').update(expected).digest()
  return timingSafeEqual(a, b)
}

export function createSession(password: string, now = Date.now()) {
  const body = Buffer.from(JSON.stringify({ exp: now + TWO_WEEKS_MS })).toString('base64url')
  const sig = createHmac('sha256', password).update(body).digest('base64url')
  return `${body}.${sig}`
}

export function verifySession(token: string, password: string, now = Date.now()) {
  const [body, sig] = token.split('.')
  if (!body || !sig) return false
  const expected = createHmac('sha256', password).update(body).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as { exp?: number }
    return typeof payload.exp === 'number' && payload.exp > now
  } catch {
    return false
  }
}

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || ''
}

export async function isAdmin() {
  const password = adminPassword()
  if (!password) return false
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
  if (!token) return false
  return verifySession(token, password)
}

export async function startAdminSession() {
  const password = adminPassword()
  if (!password) return
  const jar = await cookies()
  jar.set(COOKIE, createSession(password), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: TWO_WEEKS_MS / 1000,
  })
}

export async function endAdminSession() {
  const jar = await cookies()
  jar.delete(COOKIE)
}
