import { Editorial } from '@/components/Editorial'
import { getPage } from '@/lib/catalog'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  const page = await getPage('self-limpia')
  return page ? pageMetadata(page.seoTitle, page.seoDescription) : {}
}

export default async function SelfLimpiaPage() {
  const page = await getPage('self-limpia')
  return page ? <Editorial page={page} /> : null
}
