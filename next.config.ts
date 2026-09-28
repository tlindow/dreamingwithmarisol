import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/healings', destination: '/limpias', permanent: true },
      { source: '/online-healings', destination: '/virtual-limpias', permanent: true },
      { source: '/store', destination: '/shop', permanent: true },
      { source: '/store/:path*', destination: '/shop', permanent: true },
      { source: '/learning', destination: '/', permanent: false },
      { source: '/learning/:path*', destination: '/', permanent: false },
      { source: '/events', destination: '/', permanent: false },
      { source: '/events/:path*', destination: '/', permanent: false },
      { source: '/page-8', destination: '/', permanent: true },
      {
        source: '/shop/21ffffb3-1ad3-43d6-ae68-8425a92e4a3c',
        destination: '/shop/a-book-of-prayers',
        permanent: true,
      },
      {
        source: '/shop/23fbccb1-5fb5-4260-96f6-89e0165d154e',
        destination: '/shop/enter-the-cosmic-ocean',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "frame-ancestors 'self' https://sanity.io https://*.sanity.io https://*.sanity.studio",
          },
        ],
      },
    ]
  },
}

export default nextConfig
