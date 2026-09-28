import Link from 'next/link'
import { HOME, INSTAGRAM_POSTS, SITE } from '@/content/site'
import { formatUsd, getHome, getProducts, getSettings } from '@/lib/catalog'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  const home = await getHome()
  return {
    ...pageMetadata(SITE.name, home.seoDescription),
    title: { absolute: SITE.name },
  }
}

export default async function HomePage() {
  const [home, products, settings] = await Promise.all([getHome(), getProducts(), getSettings()])
  const links = HOME.links.map((link) => (link.label === 'newsletter' ? { ...link, href: settings.substackUrl } : link))
  return (
    <>
      <section className="wrap hero">
        <div>
          <h1>{home.heroTitle}</h1>
          <p className="lede">{home.heroSubtitle}</p>
          <div className="actions">
            <Link className="btn btn-primary" href="/book-your-session">Work with Me</Link>
            <Link className="btn" href="/values">Learn more</Link>
          </div>
        </div>
        <img src={home.heroImage} alt="Marisól" />
      </section>

      <section className="band">
        <div className="wrap">
          <p className="quote">{home.quote}</p>
        </div>
      </section>

      <section className="wrap section split">
        <img src={home.limpiasImage} alt="Limpias" />
        <div>
          <h2>{home.limpiasTitle}</h2>
          <p>{home.limpiasSubtitle}</p>
          <div className="actions">
            <Link className="btn btn-primary" href="/book-your-session">Book Your Session</Link>
            <Link className="btn" href="/limpias">Learn more</Link>
          </div>
        </div>
      </section>

      <section className="wrap section split">
        <ul className="link-list">
          {links.map((link) => (
            <li key={link.label}>
              {link.external ? (
                <a href={link.href}>{link.label}</a>
              ) : (
                <Link href={link.href}>{link.label}</Link>
              )}
            </li>
          ))}
        </ul>
        <div>
          <h2>Shop</h2>
          <div className="cards">
            {products.map((product) => (
              <Link className="card" key={product.slug} href={`/shop/${product.slug}`}>
                <img src={product.image} alt="" />
                <div>
                  <h3>{product.title}</h3>
                  <p className="price">{formatUsd(product.amountCents)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap section">
        <h2>Follow me on Instagram!</h2>
        <p>
          <a href={settings.instagramUrl}>{SITE.instagramHandle}</a>
        </p>
        <div className="grid">
          {INSTAGRAM_POSTS.map((post) => (
            <a key={post.src} href={post.href} target="_blank" rel="noreferrer">
              <img src={post.src} alt="Instagram post from @dreamingwithmarisol" />
            </a>
          ))}
        </div>
      </section>
    </>
  )
}
