/**
 * Patches Sanity product and event documents with their Stripe Payment Link URLs.
 * Run once after creating Stripe products/prices/payment links.
 *
 * Usage: npx tsx sync-stripe-links.ts
 */
import { createClient } from '@sanity/client'

const token = process.env.SANITY_API_TOKEN
if (!token) {
    console.error('SANITY_API_TOKEN environment variable is required')
    process.exit(1)
}

const client = createClient({
    projectId: 't8kqnnav',
    dataset: 'production',
    apiVersion: '2025-02-24',
    token,
    useCdn: false,
})

// Stripe Payment Links keyed by Sanity document _id
const PRODUCT_LINKS: Record<string, string> = {
    'product-guided-meditation': 'https://buy.stripe.com/test_28E00c990e81dAj1hJ1Jm00',
    'product-curanderismo-ebook': 'https://buy.stripe.com/test_14A28kad48NH1RBgcD1Jm01',
    'product-ritual-journal': 'https://buy.stripe.com/test_aFa4gs2KC7JDgMv3pR1Jm02',
    'product-limpia-kit': 'https://buy.stripe.com/test_8x24gs1Gy0hb8fZe4v1Jm03',
    'product-crystal-set': 'https://buy.stripe.com/test_5kQ8wIgBse81ao7f8z1Jm04',
}

const EVENT_LINKS: Record<string, string> = {
    'event-full-moon-ceremony': 'https://buy.stripe.com/test_aFaaEQ2KCaVP67R4tV1Jm05',
    'event-curanderismo-workshop': 'https://buy.stripe.com/test_eVqdR2fxo6FzgMvf8z1Jm06',
}

async function patch() {
    console.log('Patching Sanity documents with Stripe Payment Links...\n')

    for (const [id, url] of Object.entries(PRODUCT_LINKS)) {
        try {
            await client.patch(id).set({ stripePaymentLink: url }).commit()
            console.log(`✓ product ${id}  →  ${url}`)
        } catch (err) {
            console.error(`✗ product ${id}: ${(err as Error).message}`)
        }
    }

    for (const [id, url] of Object.entries(EVENT_LINKS)) {
        try {
            await client.patch(id).set({ stripePaymentLink: url }).commit()
            console.log(`✓ event   ${id}  →  ${url}`)
        } catch (err) {
            console.error(`✗ event   ${id}: ${(err as Error).message}`)
        }
    }

    console.log('\nDone.')
}

patch().catch((err) => {
    console.error('Script failed:', err)
    process.exit(1)
})
