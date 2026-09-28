import Link from 'next/link'
import { HOME, INSTAGRAM_POSTS, SITE } from '@/content/site'
import { formatUsd, getProducts } from '@/lib/catalog'
import { pageMetadata } from '@/lib/seo'

export const metadata = {
  ...pageMetadata(SITE.name, HOME.seoDescription),
  title: { absolute: SITE.name },
}

export default async function HomePage() {
  const products = await getProducts()
  return (
    <>
      <section className="wrap hero">
        <div>
          <h1>{HOME.heroTitle}</h1>
          <p className="lede">{HOME.heroSubtitle}</p>
          <div className="actions">
            <Link className="btn btn-primary" href="/book-your-session">Work with Me</Link>
            <Link className="btn" href="/values">Learn more</Link>
          </div>
        </div>
        <img src={HOME.heroImage} alt="Marisól" />
      </section>

      <section className="band">
        <div className="wrap">
          <p className="quote">{HOME.quote}</p>
        </div>
      </section>

      <section className="wrap section split">
        <img src={HOME.limpiasImage} alt="Limpias" />
        <div>
          <h2>{HOME.limpiasTitle}</h2>
          <p>{HOME.limpiasSubtitle}</p>
          <div className="actions">
            <Link className="btn btn-primary" href="/book-your-session">Book Your Session</Link>
            <Link className="btn" href="/limpias">Learn more</Link>
          </div>
        </div>
      </section>

      <section className="wrap section split">
        <ul className="link-list">
          {HOME.links.map((link) => (
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
          <a href={SITE.instagramUrl}>{SITE.instagramHandle}</a>
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
