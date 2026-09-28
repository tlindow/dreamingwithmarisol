import { Editorial } from '@/components/Editorial'
import { PAGES } from '@/content/site'
import { getPage } from '@/lib/catalog'
import { pageMetadata } from '@/lib/seo'

const copy = PAGES['calendula-essence']
export const metadata = pageMetadata(copy.seoTitle, copy.seoDescription)

export default async function CalendulaPage() {
  const page = await getPage('calendula-essence')
  return page ? <Editorial page={page} /> : null
}
