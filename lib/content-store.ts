import { promises as fs } from 'node:fs'
import path from 'node:path'
import { get, put } from '@vercel/blob'
import {
  BOOKING_BANNER,
  CALENDLY_EVENTS,
  HOME,
  PAGES,
  PRODUCTS,
  SITE,
  type CalendlyEvent,
  type CatalogProduct,
  type PageCopy,
  type Section,
} from '@/content/site'
import { hasBlobToken } from './blob-store'

export type EditableSection = {
  heading: string
  body: string
  imageSrc: string
  imageAlt: string
  imageCaption: string
}

export type EditablePage = {
  seoTitle: string
  seoDescription: string
  heroTitle: string
  heroSubtitle: string
  image: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel: string
  secondaryHref: string
  sections: EditableSection[]
}

export type EditableHome = {
  seoDescription: string
  heroTitle: string
  heroSubtitle: string
  heroImage: string
  quote: string
  limpiasTitle: string
  limpiasSubtitle: string
  limpiasImage: string
}

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

export type CmsDocument = {
  settings: SiteSettings
  home: EditableHome
  pages: Record<string, EditablePage>
  products: CatalogProduct[]
}

export const PAGE_ORDER: { slug: string; label: string }[] = [
  { slug: 'about', label: 'About' },
  { slug: 'values', label: 'Values' },
  { slug: 'limpias', label: 'Limpias' },
  { slug: 'virtual-limpias', label: 'Virtual limpias' },
  { slug: 'pricing', label: 'Fair trade' },
  { slug: 'reviews', label: 'Reviews' },
  { slug: 'shop-la-botanica', label: 'La Botanica' },
  { slug: 'copalero-kit', label: 'Copalero kit' },
  { slug: 'self-limpia', label: 'Self-limpia kit' },
  { slug: 'calendula-essence', label: 'Calendula essence' },
]

const BLOB_PATH = 'cms/content.json'

export function contentFilePath() {
  return process.env.CONTENT_FILE || path.join(process.cwd(), 'data', 'content.json')
}

function sectionToEditable(section: Section): EditableSection {
  return {
    heading: section.heading || '',
    body: section.paragraphs.join('\n\n'),
    imageSrc: section.image?.src || '',
    imageAlt: section.image?.alt || '',
    imageCaption: section.image?.caption || '',
  }
}

function pageToEditable(page: PageCopy): EditablePage {
  return {
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    heroTitle: page.heroTitle,
    heroSubtitle: page.heroSubtitle || '',
    image: page.image || '',
    primaryLabel: page.primary?.label || '',
    primaryHref: page.primary?.href || '',
    secondaryLabel: page.secondary?.label || '',
    secondaryHref: page.secondary?.href || '',
    sections: page.sections.map(sectionToEditable),
  }
}

export function defaultDocument(): CmsDocument {
  const pages: Record<string, EditablePage> = {}
  for (const [slug, page] of Object.entries(PAGES)) pages[slug] = pageToEditable(page)
  return {
    settings: {
      title: SITE.name,
      contactEmail: SITE.email,
      instagramUrl: SITE.instagramUrl,
      tiktokUrl: SITE.tiktokUrl,
      substackUrl: SITE.substackUrl,
      showBookingBanner: false,
      bookingBannerText: BOOKING_BANNER,
      calendlyEvents: CALENDLY_EVENTS.map((event) => ({ ...event })),
    },
    home: {
      seoDescription: HOME.seoDescription,
      heroTitle: HOME.heroTitle,
      heroSubtitle: HOME.heroSubtitle,
      heroImage: HOME.heroImage,
      quote: HOME.quote,
      limpiasTitle: HOME.limpiasTitle,
      limpiasSubtitle: HOME.limpiasSubtitle,
      limpiasImage: HOME.limpiasImage,
    },
    pages,
    products: PRODUCTS.map((product) => ({ ...product })),
  }
}

function text(value: unknown, fallback: string) {
  return typeof value === 'string' ? value : fallback
}

function sectionFromUnknown(value: unknown, fallback?: EditableSection): EditableSection | null {
  if (!value || typeof value !== 'object') return fallback || null
  const row = value as Partial<EditableSection>
  return {
    heading: text(row.heading, fallback?.heading || ''),
    body: text(row.body, fallback?.body || ''),
    imageSrc: text(row.imageSrc, fallback?.imageSrc || ''),
    imageAlt: text(row.imageAlt, fallback?.imageAlt || ''),
    imageCaption: text(row.imageCaption, fallback?.imageCaption || ''),
  }
}

function mergePage(base: EditablePage, saved: unknown): EditablePage {
  if (!saved || typeof saved !== 'object') return base
  const row = saved as Partial<EditablePage>
  const sections = Array.isArray(row.sections)
    ? row.sections
        .map((section, index) => sectionFromUnknown(section, base.sections[index]))
        .filter((section): section is EditableSection => Boolean(section))
    : base.sections
  return {
    seoTitle: text(row.seoTitle, base.seoTitle),
    seoDescription: text(row.seoDescription, base.seoDescription),
    heroTitle: text(row.heroTitle, base.heroTitle),
    heroSubtitle: text(row.heroSubtitle, base.heroSubtitle),
    image: text(row.image, base.image),
    primaryLabel: text(row.primaryLabel, base.primaryLabel),
    primaryHref: text(row.primaryHref, base.primaryHref),
    secondaryLabel: text(row.secondaryLabel, base.secondaryLabel),
    secondaryHref: text(row.secondaryHref, base.secondaryHref),
    sections: sections.length ? sections : base.sections,
  }
}

function mergeProduct(base: CatalogProduct, saved: unknown): CatalogProduct {
  if (!saved || typeof saved !== 'object') return base
  const row = saved as Partial<CatalogProduct>
  const status = row.status === 'coming-soon' || row.status === 'available' ? row.status : base.status
  const amount = typeof row.amountCents === 'number' && Number.isFinite(row.amountCents) ? Math.round(row.amountCents) : base.amountCents
  return {
    ...base,
    title: text(row.title, base.title),
    description: text(row.description, base.description),
    amountCents: amount,
    status,
    stripePriceId: text(row.stripePriceId, base.stripePriceId || '') || undefined,
    blobPath: text(row.blobPath, base.blobPath || '') || undefined,
    fileUrl: text(row.fileUrl, base.fileUrl || '') || undefined,
    postPurchaseMessage: text(row.postPurchaseMessage, base.postPurchaseMessage || '') || undefined,
    image: text(row.image, base.image),
    beaconsProductId: text(row.beaconsProductId, base.beaconsProductId),
  }
}

export function mergeDocument(base: CmsDocument, saved: unknown): CmsDocument {
  if (!saved || typeof saved !== 'object') return base
  const input = saved as Partial<CmsDocument>
  const settings: Partial<SiteSettings> = input.settings && typeof input.settings === 'object' ? input.settings : {}
  const events = Array.isArray(settings.calendlyEvents)
    ? settings.calendlyEvents
        .map((event, index) => {
          if (!event || typeof event !== 'object') return null
          const fallback = base.settings.calendlyEvents[index]
          const row = event as Partial<CalendlyEvent>
          const url = text(row.url, fallback?.url || '')
          const name = text(row.name, fallback?.name || '')
          if (!url || !name) return null
          return {
            name,
            url,
            priceLabel: text(row.priceLabel, fallback?.priceLabel || ''),
            durationLabel: text(row.durationLabel, fallback?.durationLabel || ''),
          }
        })
        .filter((event): event is CalendlyEvent => Boolean(event))
    : base.settings.calendlyEvents

  const home: Partial<EditableHome> = input.home && typeof input.home === 'object' ? input.home : {}
  const pages: Record<string, EditablePage> = {}
  for (const [slug, page] of Object.entries(base.pages)) {
    pages[slug] = mergePage(page, input.pages?.[slug])
  }

  const savedProducts = Array.isArray(input.products) ? input.products : []
  const products = base.products.map((product) => {
    const match = savedProducts.find((item) => item && typeof item === 'object' && (item as CatalogProduct).slug === product.slug)
    return mergeProduct(product, match)
  })

  return {
    settings: {
      title: text(settings.title, base.settings.title),
      contactEmail: text(settings.contactEmail, base.settings.contactEmail),
      instagramUrl: text(settings.instagramUrl, base.settings.instagramUrl),
      tiktokUrl: text(settings.tiktokUrl, base.settings.tiktokUrl),
      substackUrl: text(settings.substackUrl, base.settings.substackUrl),
      showBookingBanner: typeof settings.showBookingBanner === 'boolean' ? settings.showBookingBanner : base.settings.showBookingBanner,
      bookingBannerText: text(settings.bookingBannerText, base.settings.bookingBannerText),
      calendlyEvents: events.length ? events : base.settings.calendlyEvents,
    },
    home: {
      seoDescription: text(home.seoDescription, base.home.seoDescription),
      heroTitle: text(home.heroTitle, base.home.heroTitle),
      heroSubtitle: text(home.heroSubtitle, base.home.heroSubtitle),
      heroImage: text(home.heroImage, base.home.heroImage),
      quote: text(home.quote, base.home.quote),
      limpiasTitle: text(home.limpiasTitle, base.home.limpiasTitle),
      limpiasSubtitle: text(home.limpiasSubtitle, base.home.limpiasSubtitle),
      limpiasImage: text(home.limpiasImage, base.home.limpiasImage),
    },
    pages,
    products,
  }
}

export function paragraphsFromBody(body: string) {
  return body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

export function safeAssetPath(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (!trimmed.startsWith('/') || trimmed.includes('..') || trimmed.includes('\\') || trimmed.includes('://')) return null
  return trimmed
}

export function safeHref(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.includes('..')) return trimmed
  if (/^https:\/\/[^\s]+$/.test(trimmed)) return trimmed
  return null
}

export function dollarsToCents(input: string) {
  const cleaned = input.trim().replace(/^\$/, '')
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null
  return Math.round(Number(cleaned) * 100)
}

export function toPageCopy(slug: string, page: EditablePage): PageCopy | null {
  const fallback = PAGES[slug]
  if (!fallback) return null
  const image = safeAssetPath(page.image)
  const primaryHref = safeHref(page.primaryHref)
  const secondaryHref = safeHref(page.secondaryHref)
  const sections: Section[] = page.sections
    .map((section) => {
      const imageSrc = safeAssetPath(section.imageSrc)
      return {
        heading: section.heading.trim() || undefined,
        paragraphs: paragraphsFromBody(section.body),
        image: imageSrc ? { src: imageSrc, alt: section.imageAlt.trim() || fallback.imageAlt, caption: section.imageCaption.trim() || undefined } : undefined,
      }
    })
    .filter((section) => section.paragraphs.length || section.heading || section.image)
  if (!page.heroTitle.trim() || !sections.length) return fallback
  return {
    ...fallback,
    seoTitle: page.seoTitle.trim() || fallback.seoTitle,
    seoDescription: page.seoDescription.trim() || fallback.seoDescription,
    heroTitle: page.heroTitle.trim(),
    heroSubtitle: page.heroSubtitle.trim() || undefined,
    image: image || fallback.image,
    primary: primaryHref ? { label: page.primaryLabel.trim() || fallback.primary?.label || 'Open', href: primaryHref } : undefined,
    secondary: secondaryHref ? { label: page.secondaryLabel.trim() || 'Learn more', href: secondaryHref } : undefined,
    sections,
  }
}

async function readJsonFile() {
  try {
    return JSON.parse(await fs.readFile(contentFilePath(), 'utf8')) as unknown
  } catch {
    return null
  }
}

async function readJsonBlob() {
  if (process.env.CONTENT_FILE || !hasBlobToken()) return null
  try {
    const result = await get(BLOB_PATH, { access: 'private', useCache: false })
    if (!result?.stream) return null
    return JSON.parse(await new Response(result.stream).text()) as unknown
  } catch {
    return null
  }
}

export async function loadDocument() {
  const base = defaultDocument()
  const remote = await readJsonBlob()
  if (remote) return mergeDocument(base, remote)
  const file = await readJsonFile()
  if (file) return mergeDocument(base, file)
  return base
}

export async function saveDocument(document: CmsDocument): Promise<{ ok: true } | { ok: false; error: string }> {
  const json = JSON.stringify(document, null, 2)
  const file = contentFilePath()
  let wroteFile = false
  try {
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, json)
    wroteFile = true
  } catch {
    wroteFile = false
  }
  if (!process.env.CONTENT_FILE && hasBlobToken()) {
    await put(BLOB_PATH, json, {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
    })
    return { ok: true }
  }
  if (wroteFile) return { ok: true }
  return { ok: false, error: 'Could not save. Add BLOB_READ_WRITE_TOKEN so edits persist on the host.' }
}
