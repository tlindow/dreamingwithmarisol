import { Editorial } from '@/components/Editorial'
import { getPage } from '@/lib/catalog'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  const page = await getPage('limpias')
  return page ? pageMetadata(page.seoTitle, page.seoDescription) : {}
}

export default async function LimpiasPage() {
  const page = await getPage('limpias')
  return page ? <Editorial page={page} /> : null
}
