import type { MetadataRoute } from 'next'
import { SITEMAP_PATHS } from '@/content/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://dreamingwithmarisol.com'
  return SITEMAP_PATHS.map((path) => ({
    url: `${base.replace(/\/$/, '')}${path}`,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }))
}
