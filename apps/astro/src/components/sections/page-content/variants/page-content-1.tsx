import { PageContentText, CmsLink } from '@repo/ui'
import type { Locale } from '../../../../i18n/locales'
import { resolveLink } from '../../../../lib/link/resolve-link'
import type { PageContentSectionProps } from '../index'

type PageContent1VariantProps = Extract<PageContentSectionProps, { blockType: 'page-content-1' }> & {
  locale: Locale
}

/** Adapter: maps the `page-content-1` block fields onto the `PageContentText` component. */
export const PageContent1Variant = ({
  title,
  subtitle,
  content,
  link,
  locale,
}: PageContent1VariantProps) => {
  const cta = resolveLink(link, locale)
  return (
    <PageContentText
      title={title ?? undefined}
      subtitle={subtitle ?? undefined}
      content={content ?? undefined}
      action={cta ? <CmsLink link={cta} /> : undefined}
    />
  )
}

export default PageContent1Variant
