import type { FC } from 'react'

import Hero, { type PageHero } from '../sections/hero'

import { LayoutSections, type PageSection } from './layout-sections'

export type SectionType = PageSection['blockType']

interface PageBuilderProps {
  sections?: PageSection[] | null
  hero: PageHero
}

export const PageBuilder: FC<PageBuilderProps> = ({ sections, hero }) => {
  return (
    <>
      <Hero {...hero} />
      {sections && sections.length > 0 && <LayoutSections sections={sections} />}
    </>
  )
}

export default PageBuilder
