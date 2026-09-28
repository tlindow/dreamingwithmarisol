import { NextResponse } from 'next/server'
import { getProduct, isPurchasable } from '@/lib/catalog'
import { getStripe } from '@/lib/stripe'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { slug?: string } | null
  const slug = body?.slug
  if (!slug) return NextResponse.json({ error: 'Missing product.' }, { status: 400 })

  const product = await getProduct(slug)
  if (!product || !isPurchasable(product) || !product.stripePriceId) {
    return NextResponse.json({ error: 'This product is not available for checkout.' }, { status: 400 })
  }

  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured yet.' }, { status: 503 })
  }

  const site = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5173').replace(/\/$/, '')
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    allow_promotion_codes: true,
    line_items: [{ price: product.stripePriceId, quantity: 1 }],
    success_url: `${site}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site}/shop/${product.slug}`,
    metadata: { productSlug: product.slug },
  })

  if (!session.url) {
    return NextResponse.json({ error: 'Stripe did not return a checkout URL.' }, { status: 502 })
  }
  return NextResponse.json({ url: session.url })
}
