import { PageContentTags } from '@repo/ui'
import type { PageContentSectionProps } from '../index'

type PageContent3VariantProps = Extract<PageContentSectionProps, { blockType: 'page-content-3' }>

/** Adapter: maps the `page-content-3` block fields onto the `PageContentTags` component. */
export const PageContent3Variant = ({ title, subtitle, audience }: PageContent3VariantProps) => (
  <PageContentTags
    title={title ?? undefined}
    subtitle={subtitle ?? undefined}
    tags={audience?.map((item) => ({ id: item.id ?? undefined, label: item.title ?? '' }))}
  />
)

export default PageContent3Variant
