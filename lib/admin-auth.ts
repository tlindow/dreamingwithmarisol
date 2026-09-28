import { cookies } from 'next/headers'
import { authenticateSession, revokeSession, SESSION_MINUTES } from './stytch'

export const SESSION_COOKIE = 'stytch_session_token'

export function stytchConfigured() {
  return Boolean(process.env.STYTCH_PROJECT_ID && process.env.STYTCH_SECRET)
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

export async function isAdmin() {
  if (!stytchConfigured()) return false
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return false
  try {
    await authenticateSession(token)
    return true
  } catch {
    return false
  }
}

export async function endAdminSession() {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (token && stytchConfigured()) {
    try {
      await revokeSession(token)
    } catch {
      // The session is already gone.
    }
  }
  jar.delete(SESSION_COOKIE)
}
