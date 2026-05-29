import type { MetadataRoute } from 'next'
import { getServerSideURL } from '@/utils/get-url'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getServerSideURL()

  const staticPages = ['']

  return staticPages.map(page => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: page === '' ? 1 : 0.8,
  }))
}
