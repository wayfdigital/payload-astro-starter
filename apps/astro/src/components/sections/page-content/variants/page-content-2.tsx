import { PageContentCards } from '@repo/ui'
import type { Locale } from '../../../../i18n/locales'
import { resolveLink } from '../../../../lib/link/resolve-link'
import type { PageContentSectionProps } from '../index'

type PageContent2VariantProps = Extract<PageContentSectionProps, { blockType: 'page-content-2' }> & {
  locale: Locale
}

/** Adapter: maps the `page-content-2` block fields onto the `PageContentCards` component. */
export const PageContent2Variant = ({ title, subtitle, items, locale }: PageContent2VariantProps) => (
  <PageContentCards
    title={title ?? undefined}
    subtitle={subtitle ?? undefined}
    items={items?.map((item) => {
      // Card links are inherently text links — pass the resolved label/href; the
      // card component owns their styling, so the link `variant` is not used here.
      const link = resolveLink(item.link, locale)
      return {
        id: item.id ?? undefined,
        title: item.title ?? undefined,
        content: item.content ?? undefined,
        linkText: link?.label,
        linkHref: link?.href,
      }
    })}
  />
)

export default PageContent2Variant
