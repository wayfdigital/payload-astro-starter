import type { PageSection } from '../../page-builder/layout-sections'
import type { FC } from 'react'
import { ExampleBlockVariant } from './variants/example-block'

export type ExampleBlockSectionProps = Extract<PageSection, { blockType: 'exampleBlock' }>

export const ExampleBlockSection: FC<ExampleBlockSectionProps> = (props) => {
  if (props.blockType === 'exampleBlock') {
    return <ExampleBlockVariant {...props} />
  }

  return null
}

export default ExampleBlockSection
