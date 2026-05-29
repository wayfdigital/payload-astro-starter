import type { Page } from '@/payload-types'

import PageBuilder from '../../components/page-builder/page-builder'

type DynamicPageContentProps = {
  page: Page
}

const DynamicPageContent = ({ page }: DynamicPageContentProps) => {
  return (
    <PageBuilder
      hero={page.hero}
      sections={page.layout ?? null}
    />
  )
}

export default DynamicPageContent
