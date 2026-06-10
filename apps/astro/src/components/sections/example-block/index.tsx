import { Example, CmsLink } from '@repo/ui'
import type { ExampleBlock } from '@repo/payload-types'
import type { Locale } from '../../../i18n/locales'
import { resolveLink } from '../../../lib/link/resolve-link'

/**
 * Adapter for the `exampleBlock` layout section — resolves the CMS link and maps
 * the block fields onto the `@repo/ui` `Example` component (which owns the markup).
 * Block defined in `apps/payload/src/payload/blocks/example-block.ts`.
 */
export const ExampleBlockSection = ({
  title,
  description,
  link,
  locale,
}: ExampleBlock & { locale: Locale }) => {
  const cta = resolveLink(link, locale)
  return (
    <Example
      title={title ?? ''}
      description={description ?? undefined}
      action={cta ? <CmsLink link={cta} /> : undefined}
    />
  )
}

export default ExampleBlockSection
