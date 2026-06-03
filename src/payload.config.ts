import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Pages } from './payload/collections/Pages'
import { Media } from './payload/collections/Media'
import { Admins } from './payload/collections/Admins'
import { Users } from './payload/collections/Users'
import { en } from '@payloadcms/translations/languages/en'
import { pl } from '@payloadcms/translations/languages/pl'
import { DEFAULT_LANGUAGE } from './i18n/const'
import { PAYLOAD_LOCALES } from './i18n/payload-locales'
import { corsOptions } from './payload/config/cors'
import { mailOptions } from './payload/config/mail'
import { plugins } from './payload/config/plugins'
import { seedUsers } from './scripts/seed/users'
import {
  pageContentBlock1,
  pageContentBlock2,
  pageContentBlock3,
} from './app/(frontend)/[locale]/(website)/components/sections/page-content/page-content'
import { FormBlock } from './app/(frontend)/[locale]/(website)/components/sections/form-block/forms'
import { FooterSettings } from './payload/globals/FooterSettings'
import { CookieSettings } from './payload/globals/CookieSettings'
import { ExampleBlock } from './app/(frontend)/[locale]/(website)/components/sections/example-block/example-block'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Admins.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    avatar: 'gravatar',
  },
  onInit: async (payload) => {
    await seedUsers(payload)
  },
  i18n: {
    supportedLanguages: { en, pl },
    fallbackLanguage: 'pl',
  },
  collections: [Admins, Media, Pages, Users],
  globals: [FooterSettings, CookieSettings],
  blocks: [pageContentBlock1, pageContentBlock2, pageContentBlock3, FormBlock, ExampleBlock],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  localization: {
    defaultLocale: DEFAULT_LANGUAGE,
    locales: PAYLOAD_LOCALES,
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI ?? '',
    },
    idType: 'uuid',
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins,
  email: mailOptions,
  cors: corsOptions,
})
