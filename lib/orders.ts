import { createBlobStore, hasBlobToken } from './blob-store'
import { sendDownloadEmail } from './email'
import { fulfillCheckoutSession, type CheckoutSessionLike, type DeliveryStore } from './fulfillment'
import { createMemoryStore } from './memory-store'
import { getProduct } from './catalog'

const globalStore = globalThis as unknown as { __deliveryStore?: DeliveryStore }

export function getDeliveryStore(): DeliveryStore {
  if (hasBlobToken()) return createBlobStore()
  if (!globalStore.__deliveryStore) globalStore.__deliveryStore = createMemoryStore()
  return globalStore.__deliveryStore
}

export function downloadSecret() {
  const secret = process.env.DOWNLOAD_TOKEN_SECRET
  if (!secret) throw new Error('DOWNLOAD_TOKEN_SECRET is not set')
  return secret
}

export async function fulfillPaidSession(session: CheckoutSessionLike, eventId: string | null) {
  const secret = downloadSecret()
  const result = await fulfillCheckoutSession(session, eventId, {
    secret,
    store: getDeliveryStore(),
    sendEmail: async (record) => {
      const product = await getProduct(record.productSlug)
      await sendDownloadEmail(record, product?.title || record.productSlug)
    },
  })
  return result
}
