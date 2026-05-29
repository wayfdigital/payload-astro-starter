import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'
import { DEFAULT_LANGUAGE, LANGUAGES } from './const'

const locales = Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>

export const routing = defineRouting({
  locales,
  defaultLocale: DEFAULT_LANGUAGE,
  localePrefix: 'as-needed',
  localeDetection: false,
})

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing)
