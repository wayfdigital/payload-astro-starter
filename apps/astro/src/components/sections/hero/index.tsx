import type { Page } from '@repo/payload-types'
import type { FC } from 'react'
import type { Locale } from '../../../i18n/locales'
import { DefaultHero } from './variants/default-hero'
import { ExampleHero } from './variants/example-hero'

/** The `hero` group on a page document. */
export type PageHero = Page['hero']

export const HeroSection: FC<PageHero & { locale: Locale }> = ({ locale, ...hero }) => {
  if (hero.type === 'exampleHero') {
    return <ExampleHero {...hero} locale={locale} />
  }

  return <DefaultHero {...hero} locale={locale} />
}

export default HeroSection
