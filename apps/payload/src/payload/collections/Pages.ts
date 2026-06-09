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
      name: 'isHomePage',
      type: 'checkbox',
      defaultValue: false,
      label: {
        en: 'Home page',
        pl: 'Strona główna',
      },
      admin: {
        position: 'sidebar',
        description: {
          en: 'Serve this page at the site root (/). Leave the slug empty.',
          pl: 'Wyświetlaj tę stronę w katalogu głównym (/). Zostaw pusty slug.',
        },
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      // Optional: the home page is served at `/` and has no slug. Every other page
      // needs one.
      validate: (value: string | null | undefined, { data }: { data?: { isHomePage?: boolean } }) => {
        if (data?.isHomePage) return true
        if (!value) return 'Slug is required for pages that are not the home page.'
        return true
      },
      admin: {
        position: 'sidebar',
        condition: (data) => !data?.isHomePage,
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
