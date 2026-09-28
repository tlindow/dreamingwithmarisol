'use client'

import { useState, useTransition } from 'react'
import { requestLoginCode, verifyLoginCode } from '@/app/admin/login-actions'

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

  if (phoneId) {
    return (
      <form action={onPin} className="admin-form">
        <input type="hidden" name="phone_id" value={phoneId} />
        <label>
          Code
          <input
            name="pin"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            value={pin}
            onChange={(event) => setPin(event.target.value)}
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn btn-primary" type="submit" disabled={pending}>Sign in</button>
        <p className="hint">
          <button
            className="text-button"
            type="button"
            onClick={() => {
              setPhoneId('')
              setError('')
            }}
          >
            Use a different number
          </button>
        </p>
      </form>
    )
  }

  return (
    <form action={onPhone} className="admin-form">
      <label>
        Phone
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </label>
      {error ? <p className="error">{error}</p> : null}
      <button className="btn btn-primary" type="submit" disabled={pending}>Text me a code</button>
      <p className="hint">A text message with a 6-digit code.</p>
    </form>
  )
}
