import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { toLocale } from '@/i18n/const'
import { getCachedPageBySlug } from '@/data-queries/pages'
import DynamicPageContent from './components/dynamic-page-content'

interface DynamicPageProps {
  readonly params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const page = await getCachedPageBySlug(toLocale(locale), slug)

  if (!page) {
    return { title: 'Page not found' }
  }

  return {
    title: page.meta?.title ?? page.title,
    description: page.meta?.description ?? undefined,
  }
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { locale, slug } = await params
  const page = await getCachedPageBySlug(toLocale(locale), slug)

  if (!page) {
    notFound()
  }

  return <DynamicPageContent page={page} />
}
