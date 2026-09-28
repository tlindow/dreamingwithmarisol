import { NextResponse } from 'next/server'
import { SESSION_COOKIE, SESSION_MINUTES, sessionCookieOptions, stytchConfigured, userMayEdit } from '@/lib/admin-auth'
import { getStytch } from '@/lib/stytch'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get('token')
  const back = (error: string) => NextResponse.redirect(new URL(`/admin?error=${error}`, url))
  if (!token || !stytchConfigured()) return back('link')

  try {
    const result = await getStytch().magicLinks.authenticate({
      token,
      session_duration_minutes: SESSION_MINUTES,
    })
    if (!userMayEdit(result.user.emails)) {
      if (result.session_token) {
        await getStytch().sessions.revoke({ session_token: result.session_token }).catch(() => undefined)
      }
      return back('denied')
    }
    const response = NextResponse.redirect(new URL('/admin', url))
    response.cookies.set(SESSION_COOKIE, result.session_token, sessionCookieOptions())
    return response
  } catch {
    return back('link')
  }
}
