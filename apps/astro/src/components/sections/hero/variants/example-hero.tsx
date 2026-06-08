import { Hero, Button, Container, Text } from '@repo/ui'
import type { PageHero } from '../index'

/**
 * Hero variant with an "eyebrow" label above the title. Selected when the page's
 * `hero.type` is `exampleHero`.
 */
export const ExampleHero = (hero: PageHero) => {
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
          {hero.cta?.enabled && hero.cta.text ? (
            <a href={hero.cta.url ?? '/'}>
              <Button>{hero.cta.text}</Button>
            </a>
          ) : null}
        </>
      }
    />
  )
}

export default ExampleHero
