import { CALENDLY_EVENTS, PRODUCTS, SITE, type CalendlyEvent, type CatalogProduct, type PageCopy, type Section, PAGES } from '@/content/site'
import { getSanityReader } from './sanity'

export type SiteSettings = {
  title: string
  contactEmail: string
  instagramUrl: string
  tiktokUrl: string
  substackUrl: string
  showBookingBanner: boolean
  bookingBannerText: string
  calendlyEvents: CalendlyEvent[]
}

const DEFAULT_SETTINGS: SiteSettings = {
  title: SITE.name,
  contactEmail: SITE.email,
  instagramUrl: SITE.instagramUrl,
  tiktokUrl: SITE.tiktokUrl,
  substackUrl: SITE.substackUrl,
  showBookingBanner: false,
  bookingBannerText: '',
  calendlyEvents: CALENDLY_EVENTS,
}

type SanityProduct = {
  title?: string
  slug?: string
  description?: string
  amountCents?: number
  stripePriceId?: string
  status?: 'available' | 'coming-soon'
  blobPath?: string
  fileUrl?: string
  beaconsProductId?: string
  postPurchaseMessage?: string
  imageUrl?: string
}

export function isPurchasable(product: CatalogProduct) {
  return product.status === 'available' && Boolean(product.stripePriceId) && Boolean(product.blobPath || product.fileUrl)
}

export function formatUsd(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const data = await getSanityReader().fetch<{
      title?: string
      contactEmail?: string
      instagramUrl?: string
      tiktokUrl?: string
      substackUrl?: string
      showBookingBanner?: boolean
      bookingBannerText?: string
      calendlyEvents?: CalendlyEvent[]
    } | null>(`*[_id == "siteSettings"][0]{
      title, contactEmail, instagramUrl, tiktokUrl, substackUrl,
      showBookingBanner, bookingBannerText,
      calendlyEvents[]{ name, url, priceLabel, durationLabel }
    }`)
    if (!data) return DEFAULT_SETTINGS
    const events = (data.calendlyEvents || []).filter((event) => event?.url && event?.name)
    return {
      title: data.title || DEFAULT_SETTINGS.title,
      contactEmail: data.contactEmail || DEFAULT_SETTINGS.contactEmail,
      instagramUrl: data.instagramUrl || DEFAULT_SETTINGS.instagramUrl,
      tiktokUrl: data.tiktokUrl || DEFAULT_SETTINGS.tiktokUrl,
      substackUrl: data.substackUrl || DEFAULT_SETTINGS.substackUrl,
      showBookingBanner: Boolean(data.showBookingBanner),
      bookingBannerText: data.bookingBannerText || DEFAULT_SETTINGS.bookingBannerText,
      calendlyEvents: events.length ? events : DEFAULT_SETTINGS.calendlyEvents,
    }
  } catch (error) {
    console.error('[sanity] settings', error)
    return DEFAULT_SETTINGS
  }
}

function fromSanity(product: SanityProduct): CatalogProduct | null {
  if (!product.slug || !product.title || typeof product.amountCents !== 'number') return null
  const fallback = PRODUCTS.find((item) => item.slug === product.slug)
  return {
    slug: product.slug,
    title: product.title,
    description: product.description || fallback?.description || '',
    amountCents: product.amountCents,
    stripePriceId: product.stripePriceId || undefined,
    status: product.status === 'coming-soon' ? 'coming-soon' : 'available',
    blobPath: product.blobPath || undefined,
    fileUrl: product.fileUrl || undefined,
    beaconsProductId: product.beaconsProductId || fallback?.beaconsProductId || '',
    postPurchaseMessage: product.postPurchaseMessage,
    image: product.imageUrl || fallback?.image || '/brand/og.png',
  }
}

export async function getProducts(): Promise<CatalogProduct[]> {
  try {
    const rows = await getSanityReader().fetch<SanityProduct[]>(
      `*[_type == "product" && defined(slug.current)] | order(title asc) {
        title,
        "slug": slug.current,
        description,
        amountCents,
        stripePriceId,
        status,
        blobPath,
        beaconsProductId,
        postPurchaseMessage,
        "fileUrl": file.asset->url,
        "imageUrl": image.asset->url
      }`,
    )
    const products = rows.map(fromSanity).filter((item): item is CatalogProduct => Boolean(item))
    return products.length ? products : PRODUCTS
  } catch (error) {
    console.error('[sanity] products', error)
    return PRODUCTS
  }
}

export async function getProduct(slug: string) {
  const products = await getProducts()
  return products.find((product) => product.slug === slug) || null
}

export async function getPage(slug: string): Promise<PageCopy | null> {
  const fallback = PAGES[slug]
  if (!fallback) return null
  try {
    const remote = await getSanityReader().fetch<{
      heroTitle?: string
      heroSubtitle?: string
      seoDescription?: string
      sections?: { heading?: string; body?: string }[]
    } | null>(
      `*[_type == "sitePage" && slug.current == $slug][0]{
        heroTitle, heroSubtitle, seoDescription, sections[]{ heading, body }
      }`,
      { slug },
    )
    if (!remote?.sections?.length) return fallback
    const sections: Section[] = remote.sections
      .map((section) => ({
        heading: section.heading || undefined,
        paragraphs: (section.body || '')
          .split(/\n\s*\n/)
          .map((paragraph) => paragraph.trim())
          .filter(Boolean),
      }))
      .filter((section) => section.paragraphs.length || section.heading)
    if (!sections.length) return fallback
    return {
      ...fallback,
      heroTitle: remote.heroTitle || fallback.heroTitle,
      heroSubtitle: remote.heroSubtitle || fallback.heroSubtitle,
      seoDescription: remote.seoDescription || fallback.seoDescription,
      sections,
    }
  } catch (error) {
    console.error('[sanity] page', slug, error)
    return fallback
  }
}
