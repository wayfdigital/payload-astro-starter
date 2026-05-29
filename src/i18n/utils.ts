import { routing } from './navigation'

export type Namespace = 'common' | 'forms' | 'errors'

export type Messages = Record<string, unknown>

export async function getMessages(locale: string, namespaces: Namespace[]): Promise<Messages> {
  const validLocale =
    locale && routing.locales.includes(locale as (typeof routing.locales)[number])
      ? locale
      : routing.defaultLocale

  const messages: Messages = {}

  await Promise.all(
    namespaces.map(async namespace => {
      try {
        const namespaceMessages = await loadNamespace(validLocale, namespace)
        messages[namespace] = namespaceMessages
      } catch (error) {
        console.error(`Failed to load namespace ${namespace} for locale ${validLocale}:`, error)
        messages[namespace] = {}
      }
    })
  )

  return messages
}

async function loadNamespace(locale: string, namespace: Namespace): Promise<Messages> {
  try {
    const messages = await import(`./messages/${locale}/${namespace}.json`)
    return messages.default
  } catch {
    console.warn(`Namespace ${namespace} not found for locale ${locale}`)
    return {}
  }
}

function deepMerge(target: Messages, source: Messages): Messages {
  const output = { ...target }

  for (const key in source) {
    const sourceValue = source[key]
    const targetValue = output[key]

    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      output[key] = deepMerge(targetValue as Messages, sourceValue as Messages)
    } else {
      output[key] = sourceValue
    }
  }

  return output
}

export function flattenMessages(messages: Messages): Messages {
  const flattened: Messages = {}

  for (const namespace of Object.keys(messages)) {
    const namespaceMessages = messages[namespace]
    if (typeof namespaceMessages === 'object' && namespaceMessages !== null) {
      Object.assign(flattened, namespaceMessages)
    }
  }

  return flattened
}

export async function getAllMessages(locale: string): Promise<Messages> {
  const validLocale =
    locale && routing.locales.includes(locale as (typeof routing.locales)[number])
      ? locale
      : routing.defaultLocale

  const messages: Messages = {}

  const allNamespaces: Namespace[] = ['common', 'forms', 'errors']

  const namespaceResults = await Promise.allSettled(
    allNamespaces.map(async namespace => {
      try {
        const namespaceMessages = await import(`./messages/${validLocale}/${namespace}.json`)
        return { namespace, messages: namespaceMessages.default }
      } catch {
        return { namespace, messages: null }
      }
    })
  )

  for (const result of namespaceResults) {
    if (result.status === 'fulfilled' && result.value.messages) {
      const { namespace, messages: namespaceMessages } = result.value

      if (namespaceMessages && typeof namespaceMessages === 'object') {
        if (namespace in namespaceMessages) {
          messages[namespace] = deepMerge(
            (messages[namespace] as Messages) || {},
            namespaceMessages[namespace] as Messages
          )
        } else {
          messages[namespace] = deepMerge(
            (messages[namespace] as Messages) || {},
            namespaceMessages
          )
        }
      }
    }
  }

  return messages
}
