import Link from 'next/link'
import { Editorial } from '@/components/Editorial'
import { PAGES } from '@/content/site'
import { getPage } from '@/lib/catalog'
import { pageMetadata } from '@/lib/seo'

const copy = PAGES['shop-la-botanica']
export const metadata = pageMetadata(copy.seoTitle, copy.seoDescription)

const kits = [
  { href: '/self-limpia', label: 'Self-Limpia Kit $20.00', note: 'pick up in San Diego' },
  { href: '/calendula-essence', label: 'Calendula Flower Essence $10', note: 'pick up in San Diego' },
  { href: '/copalero-kit', label: 'The Copalero Kit $75.00', note: 'pick up in San Diego' },
]

export default async function BotanicaPage() {
  const page = await getPage('shop-la-botanica')
  return (
    <>
      {page ? <Editorial page={page} /> : null}
      <div className="wrap section">
        <ul className="link-list">
          {kits.map((kit) => (
            <li key={kit.href}>
              <Link href={kit.href}>{kit.label}</Link>
              <div className="price">{kit.note}</div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
