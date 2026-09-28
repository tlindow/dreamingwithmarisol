import type { Metadata } from 'next'

export function pageMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: '/brand/og.png', alt: 'Dreaming with Marisól' }],
    },
  }
}
