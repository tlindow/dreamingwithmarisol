import { SITE } from '@/content/site'

export function Footer({ email }: { email: string }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <strong>{SITE.name}</strong>
          <div>© {new Date().getFullYear()} Dreaming with Marisól</div>
        </div>
        <div>
          <a href={`mailto:${email}`}>{email}</a>
          <div>
            <a href={SITE.substackUrl}>Newsletter</a>
            {' · '}
            <a href="/shop">Shop</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
