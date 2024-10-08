import type { Metadata } from 'next'
import type { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types'

import { getBaseUrl } from '@/lib/utils'

interface Seo {
  title?: string
  description?: string
  images?: OpenGraph['images']
  url?: string
}

export const seo = (params: Seo): Metadata => {
  const title = params.title ? `${params.title} | Safe Action` : 'Safe Action'
  const description = params.description ?? 'Next.js safety server action template'
  const images = params.images ?? [{ url: '/api/og' }]
  const url = params.url ? `${getBaseUrl()}${params.url}` : getBaseUrl()

  return {
    metadataBase: new URL(getBaseUrl()),
    title,
    description,
    applicationName: 'Safe Action',
    twitter: { card: 'summary_large_image' },
    openGraph: { url, images, type: 'website' },
    icons: { icon: '/favicon.ico', shortcut: '/favicon-16x16.png', apple: '/apple-touch-icon.png' },
  }
}
