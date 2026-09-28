import { Editorial } from '@/components/Editorial'
import { PAGES } from '@/content/site'
import { getPage } from '@/lib/catalog'
import { pageMetadata } from '@/lib/seo'

const copy = PAGES['virtual-limpias']
export const metadata = pageMetadata(copy.seoTitle, copy.seoDescription)

export default async function VirtualLimpiasPage() {
  const page = await getPage('virtual-limpias')
  return page ? <Editorial page={page} /> : null
}
