import { Hero, Button } from '@/theme'
import type { BasePageHero } from '../index'

type DefaultHeroProps = Omit<BasePageHero, 'type' | 'eyebrow'>

const DefaultHero = (hero: DefaultHeroProps) => {
  const alignment = hero.alignment === 'left' ? 'left' : 'center'

  return (
    <Hero
      title={hero.title ?? ''}
      subtitle={hero.description ?? undefined}
      alignment={alignment}
      variant={hero.background === 'gradient' ? 'gradient' : 'default'}
      actions={
        hero.cta?.enabled && hero.cta?.text ? (
          <a href={hero.cta.url ?? '/'}>
            <Button>{hero.cta.text}</Button>
          </a>
        ) : undefined
      }
    />
  )
}

export default DefaultHero
