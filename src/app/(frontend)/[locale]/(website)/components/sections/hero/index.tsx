import type { Page } from '@/payload-types'
import type { FC } from 'react'
import DefaultHero from './variants/default-hero'
import ExampleHero from './variants/example-hero'

export type BasePageHero = NonNullable<Page['hero']> & {
  eyebrow?: string | null
}

export type ExamplePageHero = Omit<BasePageHero, 'type'> & {
  type: 'exampleHero'
}

export type PageHero = BasePageHero | ExamplePageHero

export const Hero: FC<PageHero> = (props) => {
  if (props.type === 'exampleHero') {
    return <ExampleHero {...props} />
  }

  return <DefaultHero {...props} />
}

export default Hero
