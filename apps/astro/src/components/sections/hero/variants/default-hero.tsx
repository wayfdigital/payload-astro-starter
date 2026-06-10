import { Hero, CmsLink } from '@repo/ui'
import type { Locale } from '../../../../i18n/locales'
import { resolveLink } from '../../../../lib/link/resolve-link'
import type { PageHero } from '../index'

/**
 * Renders the default hero from the page's `hero` group, mapping CMS fields onto
 * the `@repo/ui` Hero. Used for the `default`, `category` and `categoriesGrid`
 * hero types (anything that isn't `exampleHero`).
 */
export const DefaultHero = ({ locale, ...hero }: PageHero & { locale: Locale }) => {
  const alignment = hero.alignment === 'left' ? 'left' : 'center'
  const cta = resolveLink(hero.cta, locale)

  return (
    <Hero
      title={hero.title ?? ''}
      subtitle={hero.description ?? undefined}
      alignment={alignment}
      variant={hero.background === 'gradient' ? 'gradient' : 'default'}
      actions={cta ? <CmsLink link={cta} /> : undefined}
    />
  )
}

export default DefaultHero
