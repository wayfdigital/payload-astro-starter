import type { Block } from 'payload'
import { linkField } from '@/payload/fields/link'

export const ExampleBlock: Block = {
  slug: 'exampleBlock',
  dbName: 'example_block',
  interfaceName: 'ExampleBlock',
  labels: {
    singular: 'Example block',
    plural: 'Example blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      localized: true,
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      localized: true,
    },
    linkField({ label: 'CTA' }),
  ],
}
