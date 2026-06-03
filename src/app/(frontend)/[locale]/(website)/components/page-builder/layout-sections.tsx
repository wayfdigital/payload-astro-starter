import type { ComponentType } from 'react'
import { createLayoutBuilder } from '@/utils/layout-builder'
import type { Page } from '@/payload-types'
import ExampleBlockSection from '../sections/example-block'
import FormBlockSection from '../sections/form-block'
import PageContentSection from '../sections/page-content'

/** One CMS layout block from `page.layout` */
type BasePageSection = NonNullable<Page['layout']>[number]

interface ExampleBlockSectionType {
  id?: string | null
  blockType: 'exampleBlock'
  title: string
  description?: string | null
  ctaText?: string | null
  ctaUrl?: string | null
}

export type PageSection = BasePageSection | ExampleBlockSectionType

/** Add block components here: `sectionMap['page-content-1'] = PageContent1` */
const sectionMap: Record<string, ComponentType<PageSection>> = {
  'page-content-1': PageContentSection,
  'page-content-2': PageContentSection,
  'page-content-3': PageContentSection,
  formBlock: FormBlockSection,
  exampleBlock: ExampleBlockSection,
}

export const LayoutSections = createLayoutBuilder<PageSection>(sectionMap)
