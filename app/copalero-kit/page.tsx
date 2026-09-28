import { Editorial } from '@/components/Editorial'
import { PAGES } from '@/content/site'
import { getPage } from '@/lib/catalog'
import { pageMetadata } from '@/lib/seo'

const copy = PAGES['copalero-kit']
export const metadata = pageMetadata(copy.seoTitle, copy.seoDescription)

export default async function CopaleroPage() {
  const page = await getPage('copalero-kit')
  return page ? <Editorial page={page} /> : null
}
