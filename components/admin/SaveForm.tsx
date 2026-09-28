'use client'

import { useActionState } from 'react'
import type { FormState } from '@/app/admin/actions'

export function SaveForm({
  action,
  children,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>
  children: React.ReactNode
}) {
  const [state, formAction, pending] = useActionState(action, null)
  return (
    <form action={formAction} className="admin-form">
      {children}
      {state?.error ? <p className="error">{state.error}</p> : null}
      {state?.ok ? <p className="saved">Saved.</p> : null}
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? 'Saving…' : 'Save'}
      </button>
    </form>
  )
}
