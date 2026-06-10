import { Hero, CmsLink, Container, Text } from '@repo/ui'
import type { Locale } from '../../../../i18n/locales'
import { resolveLink } from '../../../../lib/link/resolve-link'
import type { PageHero } from '../index'

/**
 * Hero variant with an "eyebrow" label above the title. Selected when the page's
 * `hero.type` is `exampleHero`.
 */
export const ExampleHero = ({ locale, ...hero }: PageHero & { locale: Locale }) => {
  const cta = resolveLink(hero.cta, locale)

  return (
    <Hero
      title={hero.title ?? ''}
      subtitle={hero.description ?? undefined}
      alignment="center"
      variant="gradient"
      actions={
        <>
          {hero.eyebrow ? (
            <Container size="sm">
              <Text variant="small" style={{ color: 'var(--primary)' }}>
                {hero.eyebrow}
              </Text>
            </Container>
          ) : null}
          {cta ? <CmsLink link={cta} /> : null}
        </>
      }
    />
  )
}

export default ExampleHero
