import { Editorial } from '@/components/Editorial'
import { PAGES } from '@/content/site'
import { getPage } from '@/lib/catalog'
import { pageMetadata } from '@/lib/seo'

const copy = PAGES.limpias
export const metadata = pageMetadata(copy.seoTitle, copy.seoDescription)

export default async function LimpiasPage() {
  const page = await getPage('limpias')
  return page ? <Editorial page={page} /> : null
}
