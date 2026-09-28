import type { CatalogProduct, PageCopy } from '@/content/site'
import { loadDocument, toPageCopy, type EditableHome, type SiteSettings } from './content-store'

export type { SiteSettings }

export function isPurchasable(product: CatalogProduct) {
  return product.status === 'available' && Boolean(product.stripePriceId) && Boolean(product.blobPath || product.fileUrl)
}

export function formatUsd(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

export async function getSettings(): Promise<SiteSettings> {
  const document = await loadDocument()
  return document.settings
}

export async function getHome(): Promise<EditableHome> {
  const document = await loadDocument()
  return document.home
}

export async function getProducts(): Promise<CatalogProduct[]> {
  const document = await loadDocument()
  return document.products
}

export async function getProduct(slug: string) {
  const products = await getProducts()
  return products.find((product) => product.slug === slug) || null
}

export async function getPage(slug: string): Promise<PageCopy | null> {
  const document = await loadDocument()
  const page = document.pages[slug]
  if (!page) return null
  return toPageCopy(slug, page)
}
