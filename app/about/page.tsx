import { Editorial } from '@/components/Editorial'
import { PAGES } from '@/content/site'
import { getPage } from '@/lib/catalog'
import { pageMetadata } from '@/lib/seo'

const copy = PAGES.about
export const metadata = pageMetadata(copy.seoTitle, copy.seoDescription)

export default async function AboutPage() {
  const page = await getPage('about')
  return page ? <Editorial page={page} /> : null
}
