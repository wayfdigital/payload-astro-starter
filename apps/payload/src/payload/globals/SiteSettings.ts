import { type GlobalConfig } from 'payload'
import { isAdmin } from '@/payload/access-guards/is-admin'

/**
 * Site-wide SEO defaults + Framer-style custom code injection.
 *
 * The `@payloadcms/plugin-seo` plugin already adds a per-page `meta` group to the
 * Pages collection (title / description / image). This global holds the *fallbacks*
 * and site-level values the frontend needs when a page leaves those blank, plus the
 * Organization data used to build JSON-LD structured data.
 *
 * The `customCode` tab lets an admin paste raw `<script>`/HTML into four injection
 * points (the same set Framer exposes). It is **admin-only** (`update: isAdmin`)
 * because the content is rendered unescaped into the page.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: {
    en: 'Site Settings',
    pl: 'Ustawienia witryny',
  },
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'SEO Defaults',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              label: 'Site name',
              required: false,
              admin: {
                description: 'Brand name used in the title template and JSON-LD (e.g. "Acme").',
              },
            },
            {
              name: 'titleTemplate',
              type: 'text',
              label: 'Title template',
              defaultValue: '%s · %siteName%',
              required: false,
              admin: {
                description:
                  'How the browser/tab title is built. %s = the page title, %siteName% = the site name above.',
              },
            },
            {
              name: 'defaultDescription',
              type: 'textarea',
              label: 'Default meta description',
              localized: true,
              required: false,
              admin: {
                description: 'Used when a page has no SEO description of its own.',
              },
            },
            {
              name: 'defaultOgImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Default social share image',
              required: false,
              admin: {
                description: 'Fallback Open Graph / Twitter image. The 1200×630 "og" size is used.',
              },
            },
            {
              name: 'twitterHandle',
              type: 'text',
              label: 'Twitter / X handle',
              required: false,
              admin: {
                description: 'Including the @ — used for twitter:site / twitter:creator.',
              },
            },
          ],
        },
        {
          label: 'Organization',
          fields: [
            {
              name: 'organization',
              type: 'group',
              label: 'Organization',
              admin: {
                description: 'Feeds the Organization JSON-LD emitted on the home page.',
              },
              fields: [
                { name: 'legalName', type: 'text', label: 'Legal / brand name', required: false },
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo',
                  required: false,
                },
                {
                  name: 'sameAs',
                  type: 'array',
                  label: 'Social profiles',
                  labels: { singular: 'Profile URL', plural: 'Profile URLs' },
                  admin: {
                    description: 'Full URLs to social/brand profiles (Facebook, LinkedIn, X, …).',
                  },
                  fields: [{ name: 'url', type: 'text', label: 'URL', required: true }],
                },
              ],
            },
          ],
        },
        {
          label: 'Robots',
          fields: [
            {
              name: 'robots',
              type: 'group',
              label: 'Robots',
              fields: [
                {
                  name: 'noindexSite',
                  type: 'checkbox',
                  label: 'Discourage search engines from indexing the whole site',
                  defaultValue: false,
                  admin: {
                    description: 'Turn on for staging environments. Adds noindex to every page.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Custom Code',
          description:
            'Paste tracking scripts, verification tags, or widgets. Injected raw — only admins can edit.',
          fields: [
            {
              name: 'customCode',
              type: 'group',
              label: 'Custom code',
              fields: [
                {
                  name: 'headStart',
                  type: 'code',
                  label: 'Start of <head>',
                  admin: {
                    language: 'html',
                    description: 'Injected right after <head> opens — e.g. meta verification tags.',
                  },
                },
                {
                  name: 'headEnd',
                  type: 'code',
                  label: 'End of <head>',
                  admin: {
                    language: 'html',
                    description: 'Injected just before </head> — e.g. Google Analytics / GTM, pixels.',
                  },
                },
                {
                  name: 'bodyStart',
                  type: 'code',
                  label: 'Start of <body>',
                  admin: {
                    language: 'html',
                    description: 'Injected right after <body> opens — e.g. GTM <noscript>.',
                  },
                },
                {
                  name: 'bodyEnd',
                  type: 'code',
                  label: 'End of <body>',
                  admin: {
                    language: 'html',
                    description: 'Injected just before </body> — e.g. chat widgets, deferred scripts.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
