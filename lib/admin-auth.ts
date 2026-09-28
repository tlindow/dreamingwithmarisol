import { cookies } from 'next/headers'
import { getStytch } from './stytch'

export const SESSION_COOKIE = 'stytch_session_token'
export const SESSION_MINUTES = 60 * 24 * 7

export function allowedEmails() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export function isAllowedEmail(email: string) {
  return allowedEmails().includes(email.trim().toLowerCase())
}

export function stytchConfigured() {
  return Boolean(process.env.STYTCH_PROJECT_ID && process.env.STYTCH_SECRET && allowedEmails().length)
}

export function loginDecision(email: string) {
  if (!stytchConfigured()) return 'config' as const
  const trimmed = email.trim().toLowerCase()
  if (!trimmed.includes('@')) return 'email' as const
  if (!isAllowedEmail(trimmed)) return 'denied' as const
  return 'send' as const
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MINUTES * 60,
  }
}

export function userMayEdit(emails: { email: string; verified: boolean }[]) {
  return emails.some((item) => item.verified && isAllowedEmail(item.email))
}

export async function isAdmin() {
  if (!stytchConfigured()) return false
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return false
  try {
    const session = await getStytch().sessions.authenticate({ session_token: token })
    return userMayEdit(session.user.emails)
  } catch {
    return false
  }
}

export async function endAdminSession() {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (token && process.env.STYTCH_PROJECT_ID && process.env.STYTCH_SECRET) {
    try {
      await getStytch().sessions.revoke({ session_token: token })
    } catch {
      // The session is already gone.
    }
  }
  jar.delete(SESSION_COOKIE)
}

export async function magicLinkUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (configured) return `${configured}/admin/authenticate`
  const { headers } = await import('next/headers')
  const requestHeaders = await headers()
  const host = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host') || 'localhost:5173'
  const proto = requestHeaders.get('x-forwarded-proto') || 'http'
  return `${proto}://${host}/admin/authenticate`
}
