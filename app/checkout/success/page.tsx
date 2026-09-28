import Link from 'next/link'
import { getStripe } from '@/lib/stripe'
import { fulfillPaidSession } from '@/lib/orders'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata('Checkout', 'Your download from Dreaming with Marisól.')

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id: sessionId } = await searchParams
  const stripe = getStripe()
  if (!sessionId || !stripe) {
    return (
      <article className="wrap section prose">
        <h1>Checkout</h1>
        <p>We could not confirm a paid session from this link.</p>
        <Link href="/shop">Back to the shop</Link>
      </article>
    )
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId)
  if (session.payment_status !== 'paid') {
    return (
      <article className="wrap section prose">
        <h1>Payment not completed</h1>
        <p>This checkout is not paid, so no download was created.</p>
        <Link href="/shop">Back to the shop</Link>
      </article>
    )
  }

  let token: string | undefined
  try {
    const result = await fulfillPaidSession(
      {
        id: session.id,
        payment_status: session.payment_status,
        customer_email: session.customer_email,
        customer_details: { email: session.customer_details?.email },
        metadata: { productSlug: session.metadata?.productSlug },
      },
      null,
    )
    token = result.record?.token
  } catch (error) {
    console.error('[checkout] fulfill', error)
  }

  return (
    <article className="wrap section prose">
      <h1>Thank you</h1>
      {token ? (
        <>
          <p>Your download is ready. The same link is emailed when email delivery is configured.</p>
          <p><a className="btn btn-primary" href={`/api/download/${token}`}>Download</a></p>
        </>
      ) : (
        <p>Payment was received. The download link could not be issued yet. Write to dreamingwithmarisol@gmail.com with your receipt and we will send the file.</p>
      )}
    </article>
  )
}
