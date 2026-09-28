import { NextResponse } from 'next/server'
import { fulfillPaidSession } from '@/lib/orders'
import { constructStripeEvent, WebhookSignatureError } from '@/lib/stripe-webhook'
import type Stripe from 'stripe'

export async function POST(request: Request) {
  const payload = await request.text()
  const signature = request.headers.get('stripe-signature')
  let event: Stripe.Event
  try {
    event = constructStripeEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET || '')
  } catch (error) {
    if (error instanceof WebhookSignatureError) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
    throw error
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object
  try {
    await fulfillPaidSession(
      {
        id: session.id,
        payment_status: session.payment_status,
        customer_email: session.customer_email,
        customer_details: { email: session.customer_details?.email },
        metadata: { productSlug: session.metadata?.productSlug },
      },
      event.id,
    )
  } catch (error) {
    console.error('[stripe] webhook', error)
    return NextResponse.json({ error: 'Fulfillment failed' }, { status: 500 })
  }
  return NextResponse.json({ received: true })
}
