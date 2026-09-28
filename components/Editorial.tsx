import Link from 'next/link'
import type { PageCopy } from '@/content/site'

function Action({ label, href, primary }: { label: string; href: string; primary?: boolean }) {
  const className = primary ? 'btn btn-primary' : 'btn'
  if (href.startsWith('/')) return <Link className={className} href={href}>{label}</Link>
  return <a className={className} href={href} target="_blank" rel="noreferrer">{label}</a>
}

export function Editorial({ page }: { page: PageCopy }) {
  return (
    <article>
      <div className="wrap hero">
        <div>
          <h1>{page.heroTitle}</h1>
          {page.heroSubtitle ? <p className="lede">{page.heroSubtitle}</p> : null}
          <div className="actions">
            {page.primary ? <Action {...page.primary} primary /> : null}
            {page.secondary ? <Action {...page.secondary} /> : null}
          </div>
        </div>
        {page.image ? <img src={page.image} alt={page.imageAlt} /> : null}
      </div>
      <div className="wrap section prose">
        {page.sections.map((section) => (
          <section key={section.heading || section.paragraphs[0]?.slice(0, 24)}>
            {section.heading ? <h2>{section.heading}</h2> : null}
            {section.image ? (
              <figure className="figure">
                <img src={section.image.src} alt={section.image.alt} />
                {section.image.caption ? <figcaption>{section.image.caption}</figcaption> : null}
              </figure>
            ) : null}
            {section.paragraphs.map((paragraph) => {
              const link = paragraph.match(/https?:\/\/\S+/)
              if (link && paragraph.includes('realizeyourbliss.com')) {
                const [before, after] = paragraph.split(link[0])
                return (
                  <p key={paragraph}>
                    {before}
                    <a href="https://www.realizeyourbliss.com/">realizeyourbliss.com</a>
                    {after?.replace(/^\/?/, '')}
                  </p>
                )
              }
              return <p key={paragraph}>{paragraph}</p>
            })}
          </section>
        ))}
      </div>
    </article>
  )
}
