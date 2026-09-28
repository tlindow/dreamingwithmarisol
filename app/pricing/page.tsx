import { Editorial } from '@/components/Editorial'
import { PAGES } from '@/content/site'
import { getPage } from '@/lib/catalog'
import { pageMetadata } from '@/lib/seo'

const copy = PAGES.pricing
export const metadata = pageMetadata(copy.seoTitle, copy.seoDescription)

export default async function PricingPage() {
  const page = await getPage('pricing')
  return page ? <Editorial page={page} /> : null
}
