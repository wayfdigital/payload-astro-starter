import { getRequestConfig } from 'next-intl/server'
import { routing } from './navigation'
import { getAllMessages } from './utils'

export default getRequestConfig(async ({ locale }) => {
  const validLocale =
    locale && routing.locales.includes(locale as (typeof routing.locales)[number])
      ? locale
      : routing.defaultLocale

  try {
    const messages = await getAllMessages(validLocale)

    return {
      messages,
      locale: validLocale,
      timeZone: 'Europe/Warsaw',
    }
  } catch (error) {
    console.error(`Failed to load messages for locale: ${validLocale}`, error)
    return {
      messages: {},
      locale: validLocale,
      timeZone: 'Europe/Warsaw',
    }
  }
})
