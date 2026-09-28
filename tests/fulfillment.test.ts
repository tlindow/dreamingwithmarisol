import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import Stripe from 'stripe'
import { signDownloadToken } from '../lib/download-token.ts'
import { authorizeDownload, fulfillCheckoutSession, type DeliveryRecord } from '../lib/fulfillment.ts'
import { createMemoryStore } from '../lib/memory-store.ts'
import { constructStripeEvent, WebhookSignatureError } from '../lib/stripe-webhook.ts'

const webhookSecret = 'whsec_test_secret'
const stripe = new Stripe('sk_test_123')

function paidSession(id = 'cs_test_1') {
  return {
    id,
    payment_status: 'paid',
    customer_email: 'buyer@example.com',
    metadata: { productSlug: 'a-book-of-prayers' },
  }
}

describe('stripe webhook signature', () => {
  it('rejects a bad signature', () => {
    assert.throws(
      () => constructStripeEvent('{}', 't=1,v1=deadbeef', webhookSecret),
      WebhookSignatureError,
    )
  })

  it('accepts a signature from Stripe', () => {
    const payload = JSON.stringify({
      id: 'evt_test_1',
      object: 'event',
      type: 'checkout.session.completed',
      data: { object: { id: 'cs_test_1', object: 'checkout.session' } },
    })
    const header = stripe.webhooks.generateTestHeaderString({ payload, secret: webhookSecret })
    const event = constructStripeEvent(payload, header, webhookSecret)
    assert.equal(event.type, 'checkout.session.completed')
  })
})

describe('fulfillment', () => {
  it('does not deliver an unpaid session', async () => {
    const store = createMemoryStore()
    let emails = 0
    const result = await fulfillCheckoutSession(
      { ...paidSession(), payment_status: 'unpaid' },
      'evt_unpaid',
      { secret: 'download-secret', store, sendEmail: async () => { emails += 1 } },
    )
    assert.equal(result.delivered, false)
    assert.equal(result.reason, 'unpaid')
    assert.equal(emails, 0)
    assert.equal(await store.get('cs_test_1'), null)
  })

  it('sends one email when the same event is replayed', async () => {
    const store = createMemoryStore()
    let emails = 0
    const deps = {
      secret: 'download-secret',
      store,
      sendEmail: async () => { emails += 1 },
    }
    const first = await fulfillCheckoutSession(paidSession(), 'evt_replay', deps)
    const second = await fulfillCheckoutSession(paidSession(), 'evt_replay', deps)
    assert.equal(first.delivered, true)
    assert.equal(second.duplicate, true)
    assert.equal(emails, 1)
    const saved = await store.get('cs_test_1')
    assert.equal(saved?.eventIds.includes('evt_replay'), true)
  })
})

describe('download tokens', () => {
  it('rejects an expired token', async () => {
    const secret = 'download-secret'
    const token = signDownloadToken(
      { sessionId: 'cs_old', productSlug: 'a-book-of-prayers', exp: 1_700_000_000 },
      secret,
    )
    const record: DeliveryRecord = {
      sessionId: 'cs_old',
      productSlug: 'a-book-of-prayers',
      email: 'buyer@example.com',
      token,
      remaining: 5,
      expiresAt: 1_700_000_000_000,
      emailed: true,
      eventIds: [],
    }
    const store = createMemoryStore()
    await store.createIfAbsent(record)
    const decision = await authorizeDownload(token, secret, store, Date.now())
    assert.equal(decision.ok, false)
    if (!decision.ok) assert.equal(decision.status, 403)
  })
})
