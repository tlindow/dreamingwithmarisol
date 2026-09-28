import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getSettings } from '@/lib/catalog'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://dreamingwithmarisol.com'),
  title: {
    default: 'Dreaming with Marisól',
    template: '%s · Dreaming with Marisól',
  },
  description:
    'Spiritual healing with Marisól in San Diego. Limpias, pláticas, and prayers held with the ancestors and the Great Spirits.',
  icons: { icon: '/brand/favicon.webp' },
  openGraph: {
    siteName: 'Dreaming with Marisól',
    images: [{ url: '/brand/og.png', alt: 'Dreaming with Marisól' }],
  },
}

export const revalidate = 60

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  return (
    <html lang="en">
      <body className={dmSans.variable} style={{ fontFamily: 'var(--font-dm), "DM Sans", sans-serif' }}>
        <a className="skip" href="#content">Skip to content</a>
        <Header instagramUrl={settings.instagramUrl} tiktokUrl={settings.tiktokUrl} />
        <main id="content">{children}</main>
        <Footer email={settings.contactEmail} />
      </body>
    </html>
  )
}
