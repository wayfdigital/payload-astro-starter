import { getRequestConfig } from 'next-intl/server'
import { routing } from './navigation'
import { isLocale } from './const'
import { getAllMessages } from './utils'

export default getRequestConfig(async ({ locale }) => {
  const validLocale = locale && isLocale(locale) ? locale : routing.defaultLocale

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
