'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, sessionCookieOptions } from '@/lib/admin-auth'
import { authenticateOtp, sendSmsOtp } from '@/lib/stytch'

export type LoginResult = { phoneId?: string; error?: string }

function message(error: unknown) {
  return error instanceof Error && error.message ? error.message : 'Sign-in failed.'
}

export async function requestLoginCode(formData: FormData): Promise<LoginResult> {
  try {
    const result = await sendSmsOtp(String(formData.get('phone') || ''))
    if (!result.phone_id) return { error: 'The code could not be sent.' }
    return { phoneId: result.phone_id }
  } catch (error) {
    return { error: message(error) }
  }
}

export async function verifyLoginCode(formData: FormData): Promise<LoginResult> {
  let token = ''
  try {
    const result = await authenticateOtp(String(formData.get('phone_id') || ''), String(formData.get('pin') || ''))
    token = result.session_token || ''
  } catch (error) {
    return { error: message(error) }
  }
  if (!token) return { error: 'Sign-in did not return a session.' }
  const jar = await cookies()
  jar.set(SESSION_COOKIE, token, sessionCookieOptions())
  redirect('/admin')
}
