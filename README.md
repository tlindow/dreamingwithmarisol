# Dreaming with Marisól

Next.js site for [dreamingwithmarisol.com](https://dreamingwithmarisol.com). Page copy, the digital catalog, and Calendly event links are edited at `/admin`. Session payments stay inside Calendly. Digital products use Stripe Checkout in test mode until live keys are added.

## Local development

```bash
npm install
npm run dev
```

The site runs at [http://localhost:5173](http://localhost:5173). The editor is at [http://localhost:5173/admin](http://localhost:5173/admin).

Copy `.env.example` to `.env.local`. Leave values empty until you have them. Do not commit real keys. `/admin` signs in with a texted 6-digit code.

## Environment variables

| Name | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, checkout return, and download links |
| `STRIPE_SECRET_KEY` | Secret key (`sk_test_…` until launch) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Publishable key |
| `STRIPE_WEBHOOK_SECRET` | Signing secret from the Stripe CLI or dashboard |
| `DOWNLOAD_TOKEN_SECRET` | HMAC secret for expiring download links |
| `BLOB_READ_WRITE_TOKEN` | Private Vercel Blob token for content saves, product files, and order records |
| `RESEND_API_KEY` | Sends the download email |
| `EMAIL_FROM` | Optional sender. Defaults to Resend’s onboarding address |
| `STYTCH_PROJECT_ID` | Stytch Consumer project id. `project-test-…` uses the test API |
| `STYTCH_SECRET` | Stytch secret key |
| `CALENDLY_API_TOKEN` | Optional. Lets the booking page detect empty calendars |

Stripe email receipts are a dashboard setting. This app does not change that setting.

## Editor login

`/admin` asks for a US phone number. Stytch texts a 6-digit code that lasts 10 minutes. The code starts a session that lasts 30 days, stored in an httpOnly cookie and checked with Stytch on each visit. Log out revokes that session. There is no email list: anyone who finishes the code on this Stytch project can edit. Use a Consumer project with SMS one-time passcodes turned on.

## Catalog

The shop lists two public products:

- A Book of Prayers — $5.00
- Enter the Cosmic Ocean — $9.00, coming soon until it is switched on

Prices charged at checkout come from the Stripe Price ID on the product. The dollar amount in Content is only the listed price. A buy button appears when the product is **Available**, has a Stripe Price ID, and has a file.

Upload the file on the product in `/admin`. For the magazine (about 147 MB), set `BLOB_READ_WRITE_TOKEN` and upload there, or paste a private Blob pathname. Files are not stored in `public/`.

Edits are saved to `data/content.json` on the machine running the site. On Vercel that file is not writable, so set `BLOB_READ_WRITE_TOKEN` and the same JSON is stored as a private blob at `cms/content.json`. Until someone saves, the site uses the copy in `content/site.ts`.

## Stripe test flow

```bash
stripe listen --forward-to localhost:5173/api/stripe/webhook
```

Put the CLI signing secret in `STRIPE_WEBHOOK_SECRET`. Use a test card such as `4242 4242 4242 4242`. On `checkout.session.completed` with `payment_status=paid`, the site creates one HMAC download link (7 days, 5 downloads) and emails it when Resend is configured. `/checkout/success` shows the same link. Replayed webhook events do not send a second email.

## Booking

`/book-your-session` embeds the current 1 hour ($100) and 30 minute ($45) Calendly event types. Calendly collects payment. Change the URLs in **Settings** when the monthly calendar changes. Turn on the no-availability option to replace the embeds with the newsletter link. Virtual limpias are not offered; `/virtual-limpias` keeps the explanation and does not embed a calendar.

The home street address is not rendered. Calendly can still show the location after someone books.

## Vercel

Use the Pro team on the lindow-labs account. Hobby is not for a commercial site.

1. Import this GitHub repo in that Vercel team.
2. Framework preset: Next.js. Root directory: repository root. Do not set the output directory to `dist`.
3. Add the environment variables above. Preview can use Stripe test keys. Production keys wait for an explicit go-ahead.
4. Create a private Blob store and set `BLOB_READ_WRITE_TOKEN`. Content edits and product files use it.
5. Create a Stytch Consumer project, enable SMS one-time passcodes, and set `STYTCH_PROJECT_ID` and `STYTCH_SECRET`.
6. Deploy. The preview URL is the Vercel deployment URL. Open `/admin` on that URL and sign in with the texted code.

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
