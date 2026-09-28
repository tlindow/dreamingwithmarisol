/* Thin Stytch REST client for the editor sign-in.
 *
 * A project id starting with `project-test-` uses test.stytch.com.
 * Any other project id uses api.stytch.com.
 */

const SESSION_MINUTES = 60 * 24 * 30

type StytchError = Error & { status?: number }

function fail(message: string, status: number): never {
  const error = new Error(message) as StytchError
  error.status = status
  throw error
}

function readEnv() {
  const projectId = process.env.STYTCH_PROJECT_ID
  const secret = process.env.STYTCH_SECRET
  if (!projectId || !secret) fail('Stytch is not configured.', 503)
  return { projectId, secret }
}

export function baseUrlFor(projectId: string) {
  return projectId.startsWith('project-test-') ? 'https://test.stytch.com' : 'https://api.stytch.com'
}

export function toE164(raw: string) {
  const digits = String(raw || '').replace(/\D/g, '')
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  fail('Enter a 10-digit US phone number.', 400)
}

async function stytchPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const { projectId, secret } = readEnv()
  const response = await fetch(`${baseUrlFor(projectId)}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${projectId}:${secret}`).toString('base64')}`,
    },
    body: JSON.stringify(body),
  })
  let payload: (T & { error_message?: string; error_type?: string }) | null = null
  try {
    payload = (await response.json()) as T & { error_message?: string; error_type?: string }
  } catch {
    payload = null
  }
  if (!response.ok) {
    fail(payload?.error_message || payload?.error_type || `Stytch ${response.status}`, response.status)
  }
  return payload || ({} as T)
}

export async function sendSmsOtp(phone: string) {
  return stytchPost<{ phone_id?: string }>('/v1/otps/sms/login_or_create', {
    phone_number: toE164(phone),
    expiration_minutes: 10,
  })
}

export async function authenticateOtp(phoneId: string, code: string) {
  if (!phoneId) fail('Request a new code.', 400)
  if (!/^\d{6}$/.test(String(code || ''))) fail('Enter the 6-digit code you received.', 400)
  return stytchPost<{ session_token?: string }>('/v1/otps/authenticate', {
    method_id: phoneId,
    code,
    session_duration_minutes: SESSION_MINUTES,
  })
}

export async function authenticateSession(token: string) {
  if (!token) fail('Missing token.', 401)
  try {
    return await stytchPost('/v1/sessions/authenticate', { session_token: token })
  } catch (error) {
    const status = (error as StytchError).status
    if (status && status >= 400 && status < 500) fail('Session expired.', 401)
    throw error
  }
}

export function revokeSession(token: string) {
  return stytchPost('/v1/sessions/revoke', { session_token: token })
}

export { SESSION_MINUTES }
