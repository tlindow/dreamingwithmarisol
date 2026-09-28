import Link from 'next/link'
import { loginAction } from './actions'
import { adminPassword, isAdmin } from '@/lib/admin-auth'
import { loadDocument, PAGE_ORDER } from '@/lib/content-store'

export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const authed = await isAdmin()
  const query = await searchParams
  if (!authed) {
    return (
      <>
        <h1>Content</h1>
        {adminPassword() ? (
          <form action={loginAction} className="admin-form">
            <label>
              Password
              <input type="password" name="password" autoComplete="current-password" required />
            </label>
            {query.error === '1' ? <p className="error">That password is not right.</p> : null}
            <button className="btn btn-primary" type="submit">Log in</button>
          </form>
        ) : (
          <p>Set ADMIN_PASSWORD before using this page.</p>
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
