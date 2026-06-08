import { Hero, Button } from '@repo/ui'
import type { PageHero } from '../index'

/**
 * Renders the default hero from the page's `hero` group, mapping CMS fields onto
 * the `@repo/ui` Hero. Used for the `default`, `category` and `categoriesGrid`
 * hero types (anything that isn't `exampleHero`).
 */
export const DefaultHero = (hero: PageHero) => {
  const alignment = hero.alignment === 'left' ? 'left' : 'center'

  return (
    <Hero
      title={hero.title ?? ''}
      subtitle={hero.description ?? undefined}
      alignment={alignment}
      variant={hero.background === 'gradient' ? 'gradient' : 'default'}
      actions={
        hero.cta?.enabled && hero.cta.text ? (
          <a href={hero.cta.url ?? '/'}>
            <Button>{hero.cta.text}</Button>
          </a>
        ) : undefined
      }
    />
  )
}

export default DefaultHero
