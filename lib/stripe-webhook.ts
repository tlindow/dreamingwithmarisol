import Stripe from 'stripe'

export class WebhookSignatureError extends Error {
  status = 400
}

export function constructStripeEvent(payload: string, signature: string | null, secret: string) {
  if (!signature || !secret) {
    throw new WebhookSignatureError('Missing Stripe signature')
  }
  const stripe = new Stripe('sk_test_webhook_verify')
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid signature'
    throw new WebhookSignatureError(message)
  }
}
