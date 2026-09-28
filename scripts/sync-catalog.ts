import {createClient} from '@sanity/client'
import {BOOKING_BANNER, CALENDLY_EVENTS, PAGES, PRODUCTS, SITE} from '../content/site.ts'

const token = process.env.SANITY_API_TOKEN
if (!token) {
  console.error('SANITY_API_TOKEN is required')
  process.exit(1)
}

const client = createClient({
  projectId: 't8kqnnav',
  dataset: 'production',
  apiVersion: '2025-02-24',
  token,
  useCdn: false,
})

async function main() {
  const tx = client.transaction()

  tx.createIfNotExists({
    _id: 'siteSettings',
    _type: 'siteSettings',
    title: SITE.name,
  })
  tx.patch('siteSettings', (patch) =>
    patch.set({
      contactEmail: SITE.email,
      instagramUrl: SITE.instagramUrl,
      tiktokUrl: SITE.tiktokUrl,
      substackUrl: SITE.substackUrl,
      showBookingBanner: false,
      bookingBannerText: BOOKING_BANNER,
      calendlyEvents: CALENDLY_EVENTS.map((event, index) => ({
        _key: `event-${index}`,
        _type: 'object',
        name: event.name,
        url: event.url,
        priceLabel: event.priceLabel,
        durationLabel: event.durationLabel,
      })),
    }),
  )

  for (const product of PRODUCTS) {
    tx.createIfNotExists({
      _id: `product-${product.slug}`,
      _type: 'product',
      title: product.title,
      slug: {_type: 'slug', current: product.slug},
      description: product.description,
      amountCents: product.amountCents,
      status: product.status,
      beaconsProductId: product.beaconsProductId,
      postPurchaseMessage: product.postPurchaseMessage,
    })
  }

  for (const page of Object.values(PAGES)) {
    tx.createIfNotExists({
      _id: `sitePage-${page.slug}`,
      _type: 'sitePage',
      title: page.seoTitle,
      slug: {_type: 'slug', current: page.slug},
      seoDescription: page.seoDescription,
      heroTitle: page.heroTitle,
      heroSubtitle: page.heroSubtitle,
      sections: page.sections.map((section, index) => ({
        _key: `${page.slug}-${index}`,
        _type: 'object',
        heading: section.heading,
        body: section.paragraphs.join('\n\n'),
      })),
    })
  }

  const placeholders = await client.fetch<string[]>(
    `*[_type == "product" && slug.current != "a-book-of-prayers" && slug.current != "enter-the-cosmic-ocean"]._id`,
  )
  const events = await client.fetch<string[]>(`*[_type == "event"]._id`)
  const modules = await client.fetch<string[]>(`*[_type == "videoModule"]._id`)
  for (const id of modules) {
    console.log('deleting learning module', id)
    tx.delete(id)
  }
  for (const id of [...placeholders, ...events]) {
    console.log('deleting', id)
    tx.delete(id)
  }

  const result = await tx.commit()
  console.log(`Applied ${result.results.length} mutations`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
