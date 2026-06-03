import type { PageSection } from '../../page-builder/layout-sections'
import type { FC } from 'react'
import { DefaultFormBlockVariant } from './variants/default-form-block'

export type FormBlockSectionProps = Extract<PageSection, { blockType: 'formBlock' }>

export const FormBlockSection: FC<PageSection> = (props) => {
  if (props.blockType === 'formBlock') {
    return <DefaultFormBlockVariant {...props} />
  }

  return null
}

export default FormBlockSection
