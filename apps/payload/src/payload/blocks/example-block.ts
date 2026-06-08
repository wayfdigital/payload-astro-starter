import type { Block } from 'payload'

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
    {
      name: 'ctaText',
      type: 'text',
      label: 'CTA text',
      localized: true,
    },
    {
      name: 'ctaUrl',
      type: 'text',
      label: 'CTA URL',
      defaultValue: '/',
    },
  ],
}
