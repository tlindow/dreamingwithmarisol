'use client'

import { useState } from 'react'

export function BuyButton({ slug, label }: { slug: string; label: string }) {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function start() {
    setPending(true)
    setError(null)
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
    const data = (await response.json()) as { url?: string; error?: string }
    if (!response.ok || !data.url) {
      setError(data.error || 'Checkout is unavailable right now.')
      setPending(false)
      return
    }
    window.location.href = data.url
  }

  return (
    <div>
      <button className="btn btn-primary" type="button" onClick={start} disabled={pending}>
        {pending ? 'Opening checkout…' : label}
      </button>
      {error ? <p className="error">{error}</p> : null}
    </div>
  )
}
