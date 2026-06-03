import type { CollectionConfig } from 'payload';
import { heroField } from '@/app/(frontend)/[locale]/(website)/components/sections/hero/hero';
import {
  pageContentBlock1,
  pageContentBlock2,
  pageContentBlock3,
} from '@/app/(frontend)/[locale]/(website)/components/sections/page-content/page-content';
import { FormBlock } from '@/app/(frontend)/[locale]/(website)/components/sections/form-block/forms';
import { ExampleBlock } from '@/app/(frontend)/[locale]/(website)/components/sections/example-block/example-block';

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
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'texts',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
          localized: true,
        },
      ],
    },
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
