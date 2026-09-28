import Link from 'next/link'
import { logoutAction } from './actions'
import { isAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Content',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdmin()
  return (
    <div className="admin">
      {authed ? (
        <nav className="admin-nav" aria-label="Content">
          <Link href="/admin">Content</Link>
          <Link href="/admin/home">Home</Link>
          <Link href="/admin/pages">Pages</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/settings">Settings</Link>
          <form action={logoutAction}>
            <button type="submit">Log out</button>
          </form>
        </nav>
      ) : null}
      {children}
    </div>
  )
}
