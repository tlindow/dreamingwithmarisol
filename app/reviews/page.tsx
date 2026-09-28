import { Editorial } from '@/components/Editorial'
import { PAGES } from '@/content/site'
import { getPage } from '@/lib/catalog'
import { pageMetadata } from '@/lib/seo'

const copy = PAGES.reviews
export const metadata = pageMetadata(copy.seoTitle, copy.seoDescription)

export default async function ReviewsPage() {
  const page = await getPage('reviews')
  return page ? <Editorial page={page} /> : null
}
