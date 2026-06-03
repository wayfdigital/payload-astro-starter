import {getCachedPageBySlug } from '@/data-queries/pages'
import type { Metadata } from 'next'
import { PageBuilder } from './components/page-builder/page-builder'
import { notFound } from 'next/navigation'
import { Locale } from '@/i18n/const'
import { HOME_PAGE_SLUG } from '@/i18n/public-path'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { locale } = await params
  const page = await getCachedPageBySlug(locale, HOME_PAGE_SLUG)
  if (!page) {
    return {
      title: 'Website Starter — Home',
      description: 'Content website built with Payload CMS',
    }
  }
  return {
    title: page.meta?.title ?? page.title,
    description: page.meta?.description ?? undefined,
  }
}

const Home = async ({ params }: PageProps) => {
  const { locale } = await params

  const page = await getCachedPageBySlug(locale, HOME_PAGE_SLUG)
  if (!page) {
    return notFound()
  }

  return (
      <PageBuilder
        hero={page.hero}
        sections={page.layout}
      />
  )
}

export default Home
