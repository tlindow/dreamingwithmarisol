import Stripe from 'stripe'

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  return new Stripe(key)
}

export async function amountFromStripe(priceId: string | undefined, fallbackCents: number) {
  const stripe = getStripe()
  if (!stripe || !priceId) return fallbackCents
  try {
    const price = await stripe.prices.retrieve(priceId)
    return price.unit_amount ?? fallbackCents
  } catch (error) {
    console.error('[stripe] price', error)
    return fallbackCents
  }
}
