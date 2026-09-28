import { notFound } from 'next/navigation'
import { BuyButton } from '@/components/BuyButton'
import { PRODUCTS } from '@/content/site'
import { formatUsd, getProduct, isPurchasable } from '@/lib/catalog'
import { pageMetadata } from '@/lib/seo'
import { amountFromStripe } from '@/lib/stripe'

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return {}
  return pageMetadata(product.title, product.description)
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()
  const amount = await amountFromStripe(product.stripePriceId, product.amountCents)
  const purchasable = isPurchasable(product)
  return (
    <article className="wrap product">
      <img src={product.image} alt={product.title} />
      <div>
        {product.status === 'coming-soon' ? <p><span className="badge">Coming soon</span></p> : null}
        <h1>{product.title}</h1>
        <p className="lede">{formatUsd(amount)}</p>
        <p>{product.description}</p>
        {purchasable ? (
          <BuyButton slug={product.slug} label={`Buy · ${formatUsd(amount)}`} />
        ) : (
          <p className="note">
            {product.status === 'coming-soon'
              ? 'This piece is not for sale yet. It can be turned on from the studio once the file is uploaded.'
              : 'The file and Stripe price still need to be attached in the studio before this can be purchased. The listed price is the public catalog price.'}
          </p>
        )}
      </div>
    </article>
  )
}
