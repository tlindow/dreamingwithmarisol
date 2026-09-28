import { Editorial } from '@/components/Editorial'
import { PAGES } from '@/content/site'
import { getPage } from '@/lib/catalog'
import { pageMetadata } from '@/lib/seo'

const copy = PAGES['self-limpia']
export const metadata = pageMetadata(copy.seoTitle, copy.seoDescription)

export default async function SelfLimpiaPage() {
  const page = await getPage('self-limpia')
  return page ? <Editorial page={page} /> : null
}
