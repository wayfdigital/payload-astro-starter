import { type Field } from 'payload'

export const heroField: Field = {
  name: 'hero',
  type: 'group',
  label: 'Hero Section',
  fields: [
    {
      name: 'type',
      type: 'select',
      label: 'Hero Type',
      required: true,
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Example Hero', value: 'exampleHero' },
        { label: 'Category', value: 'category' },
        { label: 'Categories Grid', value: 'categoriesGrid' },
      ],
      defaultValue: 'default',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      localized: true,
    },
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow',
      localized: true,
      admin: {
        condition: (_, siblingData) => siblingData.type === 'exampleHero',
      },
    },
    {
      name: 'alignment',
      type: 'select',
      label: 'Text Alignment',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      defaultValue: 'center',
      admin: {
        condition: (data, siblingData) => siblingData.type === 'default',
      },
    },
    {
      name: 'background',
      type: 'select',
      label: 'Background Style',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Light Gray', value: 'light-gray' },
        { label: 'Dark', value: 'dark' },
        { label: 'Gradient', value: 'gradient' },
      ],
      defaultValue: 'none',
      admin: {
        condition: (data, siblingData) => siblingData.type === 'default',
      },
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Call to Action',
      fields: [
        { name: 'enabled', type: 'checkbox', label: 'Enable CTA Button', defaultValue: false },
        { name: 'text', type: 'text', label: 'Button Text', defaultValue: 'Learn More', localized: true },
        { name: 'url', type: 'text', label: 'Button URL', defaultValue: '/' },
      ],
      admin: {
        condition: (data, siblingData) => siblingData.type === 'default',
      },
    },
  ],
}
