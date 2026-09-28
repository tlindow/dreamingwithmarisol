import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getSettings } from '@/lib/catalog'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  return (
    <>
      <a className="skip" href="#content">Skip to content</a>
      <Header
        instagramUrl={settings.instagramUrl}
        tiktokUrl={settings.tiktokUrl}
        newsletterUrl={settings.substackUrl}
      />
      <main id="content">{children}</main>
      <Footer email={settings.contactEmail} newsletterUrl={settings.substackUrl} />
    </>
  )
}
