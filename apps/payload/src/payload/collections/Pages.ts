import type { CollectionConfig } from 'payload';
import { heroField } from '../fields/hero';
import {
  pageContentBlock1,
  pageContentBlock2,
  pageContentBlock3,
} from '../blocks/page-content';
import { FormBlock } from '../blocks/forms';
import { ExampleBlock } from '../blocks/example-block';

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: {
      en: 'Page',
      pl: 'Strona',
    },
    plural: {
      en: 'Pages',
      pl: 'Strony',
    },
  },
  admin: {
    useAsTitle: 'slug',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    heroField,
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        pageContentBlock1,
        pageContentBlock2,
        pageContentBlock3,
        FormBlock,
        ExampleBlock,
      ],
    },
  ],
};
