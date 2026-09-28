'use client'

import { useState, useTransition } from 'react'
import { requestLoginCode, verifyLoginCode } from '@/app/admin/login-actions'

function phoneDigits(value: string) {
  let digits = value.replace(/\D/g, '')
  if (digits.length > 10 && digits.startsWith('1')) digits = digits.slice(1)
  return digits.slice(0, 10)
}

function formatPhone(value: string) {
  const digits = phoneDigits(value)
  if (digits.length < 4) return digits
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export function LoginForm() {
  const [phoneId, setPhoneId] = useState('')
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()

  function onPhone(formData: FormData) {
    setError('')
    startTransition(async () => {
      const result = await requestLoginCode(formData)
      if (result.error) setError(result.error)
      else if (result.phoneId) setPhoneId(result.phoneId)
    })
  }

  function onPin(formData: FormData) {
    setError('')
    startTransition(async () => {
      const result = await verifyLoginCode(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="login">
      <h1>Content</h1>
      <p className="login-lede">
        {phoneId ? 'Enter the 6-digit code from the text.' : 'Enter your phone. A text will bring a 6-digit code.'}
      </p>
      {phoneId ? (
        <form action={onPin} className="login-pill login-pin">
          <input type="hidden" name="phone_id" value={phoneId} />
          <input
            name="pin"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            required
            maxLength={6}
            placeholder="000000"
            aria-label="Six-digit code"
            value={pin}
            onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 6))}
          />
          <button className="btn btn-primary" type="submit" disabled={pending}>Verify</button>
        </form>
      ) : (
        <form action={onPhone} className="login-pill">
          <span className="login-cc" aria-hidden="true">+1</span>
          <input
            type="tel"
            name="phone"
            inputMode="numeric"
            autoComplete="tel-national"
            autoFocus
            required
            maxLength={14}
            placeholder="(555) 000-0000"
            aria-label="Phone number"
            value={phone}
            onChange={(event) => setPhone(formatPhone(event.target.value))}
          />
          <button className="btn btn-primary" type="submit" disabled={pending}>Send code</button>
        </form>
      )}
      <p className="login-status" role="status" aria-live="polite">{error}</p>
      {phoneId ? (
        <button
          className="text-button"
          type="button"
          onClick={() => {
            setPhoneId('')
            setPin('')
            setError('')
          }}
        >
          Use a different number
        </button>
      ) : null}
    </div>
  )
}
