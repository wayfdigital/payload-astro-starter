import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'
import { DEFAULT_LANGUAGE, LOCALE_CODES } from './const'

export const routing = defineRouting({
  locales: [...LOCALE_CODES],
  defaultLocale: DEFAULT_LANGUAGE,
  localePrefix: 'as-needed',
  localeDetection: false,
})

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing)
