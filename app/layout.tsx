import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={dmSans.variable} style={{ fontFamily: 'var(--font-dm), "DM Sans", sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
