# Dreaming with Marisól

Next.js site for [dreamingwithmarisol.com](https://dreamingwithmarisol.com). Page copy, the digital catalog, and Calendly event links are editable in Sanity Studio. Session payments stay inside Calendly. Digital products use Stripe Checkout in test mode until live keys are added.

## Local development

Install the site and the studio separately:

```bash
npm install
cd studio && npm install
```

From the repo root:

```bash
npm run dev
```

The site runs at [http://localhost:5173](http://localhost:5173).

Studio, from `studio/`:

```bash
npm run dev
```

Studio runs at [http://localhost:3333](http://localhost:3333).

Copy `.env.example` to `.env.local`. Leave values empty until you have them. Do not commit real keys.

## Environment variables

| Name | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, checkout return, and download links |
| `STRIPE_SECRET_KEY` | Secret key (`sk_test_…` until launch) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Publishable key |
| `STRIPE_WEBHOOK_SECRET` | Signing secret from the Stripe CLI or dashboard |
| `DOWNLOAD_TOKEN_SECRET` | HMAC secret for expiring download links |
| `BLOB_READ_WRITE_TOKEN` | Private Vercel Blob token for product files and order records |
| `RESEND_API_KEY` | Sends the download email |
| `EMAIL_FROM` | Optional sender. Defaults to Resend’s onboarding address |
| `SANITY_API_READ_TOKEN` | Optional read token |
| `SANITY_API_TOKEN` | Write token for `scripts/sync-catalog.ts` |
| `CALENDLY_API_TOKEN` | Optional. Lets the booking page detect empty calendars |

Stripe email receipts are a dashboard setting. This app does not change that setting.

## Catalog

The shop lists two public products:

- A Book of Prayers — $5.00
- Enter the Cosmic Ocean — $9.00, coming soon until it is switched on

Prices charged at checkout come from the Stripe Price ID on the Sanity product. The cent amount in Sanity is only the listed price. A buy button appears when the product is **Available**, has a Stripe Price ID, and has either a Sanity file or a private Blob pathname.

Upload smaller PDFs on the product in Studio. For the magazine (about 147 MB), upload a **private** Vercel Blob and paste its pathname into `blobPath`. Files are not stored in `public/`.

Seed or refresh the catalog (this removes placeholder products and events):

```bash
SANITY_API_TOKEN=... npx tsx scripts/sync-catalog.ts
```

Running it again resets booking settings to the current Calendly event types. It does not overwrite product files or Stripe Price IDs that were added after the first create.

## Stripe test flow

```bash
stripe listen --forward-to localhost:5173/api/stripe/webhook
```

Put the CLI signing secret in `STRIPE_WEBHOOK_SECRET`. Use a test card such as `4242 4242 4242 4242`. On `checkout.session.completed` with `payment_status=paid`, the site creates one HMAC download link (7 days, 5 downloads) and emails it when Resend is configured. `/checkout/success` shows the same link. Replayed webhook events do not send a second email.

## Booking

`/book-your-session` embeds the current 1 hour ($100) and 30 minute ($45) Calendly event types. Calendly collects payment. Change the URLs in **Site Settings** when the monthly calendar changes. Turn on **Show “no availability” banner** to replace the embeds with the newsletter link. Virtual limpias are not offered; `/virtual-limpias` keeps the explanation and does not embed a calendar.

The home street address is not rendered. Calendly can still show the location after someone books.

## Vercel

Use the Pro team on the lindow-labs account. Hobby is not for a commercial site.

1. Import this GitHub repo in that Vercel team.
2. Framework preset: Next.js. Root directory: repository root. Do not set the output directory to `dist`.
3. Add the environment variables above. Preview can use Stripe test keys. Production keys wait for an explicit go-ahead.
4. Create a private Blob store and set `BLOB_READ_WRITE_TOKEN`.
5. Deploy. The preview URL is the Vercel deployment URL.

Studio schema deploys separately from `studio/`:

```bash
SANITY_AUTH_TOKEN=$SANITY_DEPLOY_TOKEN npx sanity deploy
```

Hosted studio: [https://dreaming-with-marisol.sanity.studio/](https://dreaming-with-marisol.sanity.studio/).

### Domain cutover (do not run this from the site deploy)

Vercel should become the host for `dreamingwithmarisol.com`. The domain is at Name.com and expires 2026-12-10 PT. Cutover is a separate checklist:

- Renew the domain before 2026-12-10 PT.
- Add the domain to the lindow-labs Vercel project and follow Vercel’s nameserver or DNS instructions.
- Keep the October booking window in mind before changing DNS.
- Confirm `/shop/<old beacons id>`, `/healings`, and the other redirects below before switching traffic.
- Do not point DNS at Vercel until that check is done.

## Redirects

| From | To |
|---|---|
| `/healings` | `/limpias` |
| `/online-healings` | `/virtual-limpias` |
| `/shop/21ffffb3-1ad3-43d6-ae68-8425a92e4a3c` | `/shop/a-book-of-prayers` |
| `/shop/23fbccb1-5fb5-4260-96f6-89e0165d154e` | `/shop/enter-the-cosmic-ocean` |
| `/store` and `/learning` and `/events` | shop or home |
| `/page-8` | `/` |

`/marisol-birthday` is not linked and is disallowed in `robots.txt`.

## Checks

```bash
npm test
npm run lint
npm run build
```
