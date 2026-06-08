import type { Page } from '@repo/payload-types'
import type { FC } from 'react'
import { PageContent1Variant } from './variants/page-content-1'
import { PageContent2Variant } from './variants/page-content-2'
import { PageContent3Variant } from './variants/page-content-3'

/** Union of every layout block on a page. */
type LayoutBlock = NonNullable<Page['layout']>[number]

export type PageContentSectionProps = Extract<
  LayoutBlock,
  { blockType: 'page-content-1' | 'page-content-2' | 'page-content-3' }
>

export const PageContentSection: FC<PageContentSectionProps> = (props) => {
  switch (props.blockType) {
    case 'page-content-1':
      return <PageContent1Variant {...props} />
    case 'page-content-2':
      return <PageContent2Variant {...props} />
    case 'page-content-3':
      return <PageContent3Variant {...props} />
    default:
      return null
  }
}

export default PageContentSection
