import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://dreamingwithmarisol.com'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/marisol-birthday', '/api/', '/checkout/'],
    },
    sitemap: `${base.replace(/\/$/, '')}/sitemap.xml`,
  }
}
