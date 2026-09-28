import { Editorial } from '@/components/Editorial'
import { PAGES } from '@/content/site'
import { getPage } from '@/lib/catalog'
import { pageMetadata } from '@/lib/seo'

const copy = PAGES.values
export const metadata = pageMetadata(copy.seoTitle, copy.seoDescription)

export default async function ValuesPage() {
  const page = await getPage('values')
  return page ? <Editorial page={page} /> : null
}
