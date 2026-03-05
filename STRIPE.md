# Stripe Payments Setup

This project uses Stripe Checkout for products and events. Payments are created on-demand from Sanity content (price, title, description).

## Environment Variables

Add these to your Vercel project (or `.env` for local development with `vercel dev`):

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Your Stripe secret key (starts with `sk_test_` or `sk_live_`) |

Get your keys from [Stripe Dashboard → Developers → API keys](https://dashboard.stripe.com/apikeys).

## How It Works

1. **Products** (Store): When a product has a price and no manual `stripePaymentLink`, clicking "Buy Now" creates a Checkout Session and redirects to Stripe.
2. **Events**: Same flow for paid events when no manual `stripePaymentLink` is set.
3. **Manual links**: If you set `stripePaymentLink` in Sanity (from the Stripe Dashboard), that URL is used instead.
4. **Products with `storeUrl`**: External links (Etsy, Shopify, etc.) are used when no Stripe link is set.

## Local Development

- **Frontend only** (`npm run dev`): Checkout API calls will fail until you deploy or run `vercel dev`.
- **Full stack** (`vercel dev`): Runs the frontend and API routes locally. Set `STRIPE_SECRET_KEY` in `.env`.

## Success & Cancel Pages

After payment, customers are redirected to:
- Success: `/checkout/success`
- Cancel: `/checkout/cancel`

## Webhooks (Optional)

For order fulfillment (e.g., sending download links, confirming event registration), add a webhook endpoint and listen for `checkout.session.completed`. See [Stripe webhooks](https://docs.stripe.com/webhooks).
