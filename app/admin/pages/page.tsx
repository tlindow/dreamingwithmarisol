import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/admin-auth'
import { PAGE_ORDER } from '@/lib/content-store'

export default async function PagesIndex() {
  if (!(await isAdmin())) redirect('/admin')
  return (
    <>
      <h1>Pages</h1>
      <ul className="admin-list">
        {PAGE_ORDER.map((page) => (
          <li key={page.slug}><Link href={`/admin/pages/${page.slug}`}>{page.label}</Link></li>
        ))}
      </ul>
    </>
  )
}
