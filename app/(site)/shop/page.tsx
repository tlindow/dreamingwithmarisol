import Link from 'next/link'
import { formatUsd, getProducts } from '@/lib/catalog'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata(
  'Shop',
  'Digital downloads from Dreaming with Marisól: A Book of Prayers and Enter the Cosmic Ocean.',
)

export default async function ShopPage() {
  const products = await getProducts()
  return (
    <article className="wrap section">
      <h1>Shop</h1>
      <p className="lede">Digital downloads. Files are delivered from this site after payment.</p>
      <div className="cards">
        {products.map((product) => (
          <Link className="card" key={product.slug} href={`/shop/${product.slug}`}>
            <img src={product.image} alt="" />
            <div>
              <h2>{product.title}</h2>
              <p className="price">
                {formatUsd(product.amountCents)}
                {product.status === 'coming-soon' ? ' · Coming soon' : ''}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </article>
  )
}
