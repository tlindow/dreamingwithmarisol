import Link from 'next/link'
import { sendLoginLink } from './actions'
import { isAdmin, stytchConfigured } from '@/lib/admin-auth'
import { loadDocument, PAGE_ORDER } from '@/lib/content-store'

function loginNotice(query: { error?: string; sent?: string }) {
  if (query.sent === '1') return 'Check your email for a login link.'
  if (query.error === 'denied') return 'That email is not allowed to edit this site.'
  if (query.error === 'email') return 'Enter an email address.'
  if (query.error === 'link') return 'That login link is not valid. Ask for a new one.'
  if (query.error === 'stytch') return 'The login link could not be sent. Check the Stytch project and redirect URL.'
  if (query.error === 'config') return 'Set STYTCH_PROJECT_ID, STYTCH_SECRET, and ADMIN_EMAILS before using this page.'
  return ''
}

export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>
}) {
  const authed = await isAdmin()
  const query = await searchParams
  if (!authed) {
    const notice = loginNotice(query)
    return (
      <>
        <h1>Content</h1>
        {stytchConfigured() ? (
          <form action={sendLoginLink} className="admin-form">
            <label>
              Email
              <input type="email" name="email" autoComplete="email" required />
            </label>
            {notice ? <p className={query.sent === '1' ? 'saved' : 'error'}>{notice}</p> : null}
            <button className="btn btn-primary" type="submit">Email me a login link</button>
            <p className="hint">Stytch sends the link. Open it on this site to start a session.</p>
          </form>
        ) : (
          <p>Set STYTCH_PROJECT_ID, STYTCH_SECRET, and ADMIN_EMAILS before using this page.</p>
        )}
      </>
    )
  }

  const document = await loadDocument()
  return (
    <>
      <h1>Content</h1>
      <p className="hint">Edit the words, then save. The public site updates after you save.</p>
      <ul className="admin-list">
        <li><Link href="/admin/home">Home</Link></li>
        {PAGE_ORDER.map((page) => (
          <li key={page.slug}><Link href={`/admin/pages/${page.slug}`}>{page.label}</Link></li>
        ))}
        {document.products.map((product) => (
          <li key={product.slug}><Link href={`/admin/products/${product.slug}`}>{product.title}</Link></li>
        ))}
        <li><Link href="/admin/settings">Settings</Link></li>
      </ul>
    </>
  )
}
