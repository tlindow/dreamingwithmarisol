import { Editorial } from '@/components/Editorial'
import { getPage } from '@/lib/catalog'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  const page = await getPage('calendula-essence')
  return page ? pageMetadata(page.seoTitle, page.seoDescription) : {}
}

export default async function CalendulaPage() {
  const page = await getPage('calendula-essence')
  return page ? <Editorial page={page} /> : null
}
