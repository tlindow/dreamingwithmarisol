'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { put } from '@vercel/blob'
import { adminPassword, endAdminSession, isAdmin, passwordsMatch, startAdminSession } from '@/lib/admin-auth'
import { hasBlobToken } from '@/lib/blob-store'
import {
  dollarsToCents,
  loadDocument,
  PAGE_ORDER,
  safeAssetPath,
  safeHref,
  saveDocument,
  type EditableSection,
} from '@/lib/content-store'

export type FormState = { ok?: boolean; error?: string } | null

async function requireAdmin(): Promise<FormState | null> {
  if (await isAdmin()) return null
  return { error: 'Log in again.' }
}

export async function loginAction(formData: FormData) {
  const expected = adminPassword()
  if (!expected) redirect('/admin')
  const password = String(formData.get('password') || '')
  if (!passwordsMatch(password, expected)) redirect('/admin?error=1')
  await startAdminSession()
  redirect('/admin')
}

export async function logoutAction() {
  await endAdminSession()
  redirect('/admin')
}

function readSections(formData: FormData) {
  const sections: EditableSection[] = []
  for (let index = 0; index < 40; index += 1) {
    const heading = formData.get(`section.${index}.heading`)
    const body = formData.get(`section.${index}.body`)
    const imageSrc = formData.get(`section.${index}.imageSrc`)
    if (heading === null && body === null && imageSrc === null) continue
    sections.push({
      heading: String(heading || ''),
      body: String(body || ''),
      imageSrc: String(imageSrc || ''),
      imageAlt: String(formData.get(`section.${index}.imageAlt`) || ''),
      imageCaption: String(formData.get(`section.${index}.imageCaption`) || ''),
    })
  }
  return sections.filter((section) => section.heading.trim() || section.body.trim() || section.imageSrc.trim())
}

export async function saveSettingsAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const denied = await requireAdmin()
  if (denied) return denied
  const contactEmail = String(formData.get('contactEmail') || '').trim()
  if (!contactEmail.includes('@')) return { error: 'Enter a contact email.' }
  const urls = ['instagramUrl', 'tiktokUrl', 'substackUrl'] as const
  const socials: Record<(typeof urls)[number], string> = {
    instagramUrl: '',
    tiktokUrl: '',
    substackUrl: '',
  }
  for (const key of urls) {
    const href = safeHref(String(formData.get(key) || ''))
    if (!href?.startsWith('https://')) return { error: 'Social links need to start with https://.' }
    socials[key] = href
  }
  const events = [0, 1].map((index) => ({
    name: String(formData.get(`event.${index}.name`) || '').trim(),
    url: String(formData.get(`event.${index}.url`) || '').trim(),
    priceLabel: String(formData.get(`event.${index}.priceLabel`) || '').trim(),
    durationLabel: String(formData.get(`event.${index}.durationLabel`) || '').trim(),
  }))
  if (events.some((event) => !event.name || !event.priceLabel || !event.durationLabel)) {
    return { error: 'Each session needs a name, price, and short description.' }
  }
  if (events.some((event) => !safeHref(event.url)?.startsWith('https://'))) {
    return { error: 'Each Calendly link needs to start with https://.' }
  }

  const document = await loadDocument()
  document.settings = {
    ...document.settings,
    contactEmail,
    ...socials,
    showBookingBanner: formData.get('showBookingBanner') === 'yes',
    bookingBannerText: String(formData.get('bookingBannerText') || '').trim(),
    calendlyEvents: events,
  }
  const saved = await saveDocument(document)
  if (!saved.ok) return saved
  revalidatePath('/', 'layout')
  revalidatePath('/book-your-session')
  redirect('/admin/settings?saved=1')
}

export async function saveHomeAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const denied = await requireAdmin()
  if (denied) return denied
  const heroImage = safeAssetPath(String(formData.get('heroImage') || ''))
  const limpiasImage = safeAssetPath(String(formData.get('limpiasImage') || ''))
  if (!heroImage || !limpiasImage) return { error: 'Image paths need to start with /.' }
  const heroTitle = String(formData.get('heroTitle') || '').trim()
  const quote = String(formData.get('quote') || '').trim()
  if (!heroTitle || !quote) return { error: 'The home page needs a title and a quote.' }

  const document = await loadDocument()
  document.home = {
    seoDescription: String(formData.get('seoDescription') || '').trim(),
    heroTitle,
    heroSubtitle: String(formData.get('heroSubtitle') || '').trim(),
    heroImage,
    quote,
    limpiasTitle: String(formData.get('limpiasTitle') || '').trim(),
    limpiasSubtitle: String(formData.get('limpiasSubtitle') || '').trim(),
    limpiasImage,
  }
  const saved = await saveDocument(document)
  if (!saved.ok) return saved
  revalidatePath('/')
  redirect('/admin/home?saved=1')
}

export async function savePageAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const denied = await requireAdmin()
  if (denied) return denied
  const slug = String(formData.get('slug') || '')
  if (!PAGE_ORDER.some((page) => page.slug === slug)) return { error: 'Unknown page.' }
  const image = safeAssetPath(String(formData.get('image') || ''))
  if (image === null) return { error: 'The hero image path needs to start with /.' }
  const primaryHref = safeHref(String(formData.get('primaryHref') || ''))
  const secondaryHref = safeHref(String(formData.get('secondaryHref') || ''))
  if (primaryHref === null || secondaryHref === null) return { error: 'Button links need to start with / or https://.' }
  const sections = readSections(formData)
  if (!sections.length) return { error: 'Add at least one section.' }
  for (const section of sections) {
    if (safeAssetPath(section.imageSrc) === null) return { error: 'Section image paths need to start with /.' }
  }
  const heroTitle = String(formData.get('heroTitle') || '').trim()
  if (!heroTitle) return { error: 'Add a title.' }

  const document = await loadDocument()
  const current = document.pages[slug]
  if (!current) return { error: 'Unknown page.' }
  document.pages[slug] = {
    ...current,
    seoTitle: String(formData.get('seoTitle') || '').trim(),
    seoDescription: String(formData.get('seoDescription') || '').trim(),
    heroTitle,
    heroSubtitle: String(formData.get('heroSubtitle') || '').trim(),
    image,
    primaryLabel: String(formData.get('primaryLabel') || '').trim(),
    primaryHref,
    secondaryLabel: String(formData.get('secondaryLabel') || '').trim(),
    secondaryHref,
    sections,
  }
  const saved = await saveDocument(document)
  if (!saved.ok) return saved
  revalidatePath(`/${slug}`)
  redirect(`/admin/pages/${slug}?saved=1`)
}

async function storeProductFile(slug: string, file: File) {
  if (hasBlobToken()) {
    const blob = await put(`products/${slug}/${file.name}`, file, {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
    })
    return { blobPath: blob.pathname, fileUrl: undefined as string | undefined }
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '') || 'file'
  const relative = path.join('private-files', 'products', `${slug}-${safeName}`)
  const absolute = path.join(process.cwd(), relative)
  await fs.mkdir(path.dirname(absolute), { recursive: true })
  await fs.writeFile(absolute, Buffer.from(await file.arrayBuffer()))
  return { blobPath: undefined as string | undefined, fileUrl: relative.split(path.sep).join('/') }
}

export async function saveProductAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const denied = await requireAdmin()
  if (denied) return denied
  const slug = String(formData.get('slug') || '')
  const document = await loadDocument()
  const product = document.products.find((item) => item.slug === slug)
  if (!product) return { error: 'Unknown product.' }
  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim()
  if (!title || !description) return { error: 'Add a title and a description.' }
  const amountCents = dollarsToCents(String(formData.get('price') || ''))
  if (amountCents === null || amountCents <= 0) return { error: 'Enter the listed price in dollars, such as 5.00.' }
  const image = safeAssetPath(String(formData.get('image') || ''))
  if (!image) return { error: 'The image path needs to start with /.' }
  const status = formData.get('status') === 'coming-soon' ? 'coming-soon' : 'available'
  const stripePriceId = String(formData.get('stripePriceId') || '').trim()
  if (stripePriceId && !stripePriceId.startsWith('price_')) return { error: 'Stripe price IDs start with price_.' }
  let blobPath = String(formData.get('blobPath') || '').trim()
  if (blobPath.startsWith('/') || blobPath.includes('..') || blobPath.includes('://')) {
    return { error: 'A Blob path looks like products/file.pdf, with no leading slash.' }
  }

  let fileUrl = blobPath ? undefined : product.fileUrl
  const upload = formData.get('file')
  if (upload instanceof File && upload.size > 0) {
    try {
      const stored = await storeProductFile(slug, upload)
      blobPath = stored.blobPath || ''
      fileUrl = stored.fileUrl
    } catch {
      return { error: 'The file could not be stored.' }
    }
  } else if (!blobPath) {
    fileUrl = product.fileUrl
  }

  product.title = title
  product.description = description
  product.amountCents = amountCents
  product.image = image
  product.status = status
  product.stripePriceId = stripePriceId || undefined
  product.blobPath = blobPath || undefined
  product.fileUrl = fileUrl || undefined
  product.postPurchaseMessage = String(formData.get('postPurchaseMessage') || '').trim() || undefined

  const saved = await saveDocument(document)
  if (!saved.ok) return saved
  revalidatePath('/shop')
  revalidatePath(`/shop/${slug}`)
  revalidatePath('/')
  redirect(`/admin/products/${slug}?saved=1`)
}
