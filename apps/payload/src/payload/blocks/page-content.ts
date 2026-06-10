import { type Block } from 'payload'
import { linkField } from '@/payload/fields/link'

export const pageContentBlock1: Block = {
  slug: 'page-content-1',
  labels: { singular: 'Page content 1', plural: 'Page content 1' },
  fields: [
    { name: 'title', type: 'text', label: 'Section Title', localized: true },
    { name: 'subtitle', type: 'textarea', label: 'Section Subtitle', localized: true },
    { name: 'image', type: 'upload', label: 'Image', relationTo: 'media' },
    { name: 'content', type: 'textarea', label: 'Section Content', localized: true },
    linkField({ label: 'Button' }),
  ],
}

export const pageContentBlock2: Block = {
  slug: 'page-content-2',
  labels: { singular: 'Page content 2', plural: 'Page content 2' },
  fields: [
    { name: 'title', type: 'text', label: 'Section Title', localized: true },
    { name: 'subtitle', type: 'textarea', label: 'Section Subtitle', localized: true },
    {
      name: 'items',
      type: 'array',
      label: 'Items',
      minRows: 1,
      maxRows: 3,
      fields: [
        { name: 'title', type: 'text', label: 'Title', localized: true },
        { name: 'icon', type: 'upload', label: 'Icon', relationTo: 'media' },
        { name: 'content', type: 'textarea', label: 'Content', localized: true },
        linkField({ label: 'Link' }),
      ],
    },
  ],
}

export const pageContentBlock3: Block = {
  slug: 'page-content-3',
  labels: { singular: 'Page content 3', plural: 'Page content 3' },
  fields: [
    { name: 'title', type: 'text', label: 'Section Title', localized: true },
    { name: 'subtitle', type: 'textarea', label: 'Section Subtitle', localized: true },
    {
      name: 'audience',
      type: 'array',
      label: 'Audience',
      minRows: 1,
      maxRows: 9,
      fields: [
        { name: 'title', type: 'text', label: 'Title', localized: true },
      ],
    },
  ],
}
