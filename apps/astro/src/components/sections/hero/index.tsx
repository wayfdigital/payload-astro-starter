import type { Page } from '@repo/payload-types'
import type { FC } from 'react'
import { DefaultHero } from './variants/default-hero'
import { ExampleHero } from './variants/example-hero'

/** The `hero` group on a page document. */
export type PageHero = Page['hero']

export const HeroSection: FC<PageHero> = (hero) => {
  if (hero.type === 'exampleHero') {
    return <ExampleHero {...hero} />
  }

  return <DefaultHero {...hero} />
}

export default HeroSection
