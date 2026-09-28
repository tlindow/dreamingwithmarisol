import Link from 'next/link'
import { LoginForm } from '@/components/admin/LoginForm'
import { isAdmin, stytchConfigured } from '@/lib/admin-auth'
import { loadDocument, PAGE_ORDER } from '@/lib/content-store'

export default async function AdminHome() {
  const authed = await isAdmin()
  if (!authed) {
    return (
      <>
        <h1>Content</h1>
        {stytchConfigured() ? (
          <LoginForm />
        ) : (
          <p>Set STYTCH_PROJECT_ID and STYTCH_SECRET before using this page.</p>
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
