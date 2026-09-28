import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/admin-auth'
import { loadDocument } from '@/lib/content-store'
import { formatUsd } from '@/lib/catalog'

export default async function ProductsIndex() {
  if (!(await isAdmin())) redirect('/admin')
  const products = (await loadDocument()).products
  return (
    <>
      <h1>Products</h1>
      <ul className="admin-list">
        {products.map((product) => (
          <li key={product.slug}>
            <Link href={`/admin/products/${product.slug}`}>
              {product.title} · {formatUsd(product.amountCents)}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
