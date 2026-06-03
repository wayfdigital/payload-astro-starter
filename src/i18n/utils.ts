import { routing } from './navigation'
import { isLocale } from './const'

export type Namespace = 'common' | 'forms' | 'errors'

export type Messages = Record<string, unknown>

/** Type guard for a plain (non-array) message object. */
const isMessages = (value: unknown): value is Messages =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export async function getMessages(locale: string, namespaces: Namespace[]): Promise<Messages> {
  const validLocale = isLocale(locale) ? locale : routing.defaultLocale

  const messages: Messages = {}

  await Promise.all(
    namespaces.map(async (namespace) => {
      try {
        messages[namespace] = await loadNamespace(validLocale, namespace)
      } catch (error) {
        console.error(`Failed to load namespace ${namespace} for locale ${validLocale}:`, error)
        messages[namespace] = {}
      }
    }),
  )

  return messages
}

async function loadNamespace(locale: string, namespace: Namespace): Promise<Messages> {
  try {
    const mod: unknown = await import(`./messages/${locale}/${namespace}.json`)
    if (!isMessages(mod)) {
      return {}
    }
    const content = mod.default
    return isMessages(content) ? content : {}
  } catch {
    console.warn(`Namespace ${namespace} not found for locale ${locale}`)
    return {}
  }
}

export function flattenMessages(messages: Messages): Messages {
  const flattened: Messages = {}

  for (const namespaceMessages of Object.values(messages)) {
    if (isMessages(namespaceMessages)) {
      Object.assign(flattened, namespaceMessages)
    }
  }

  return flattened
}

export async function getAllMessages(locale: string): Promise<Messages> {
  const validLocale = isLocale(locale) ? locale : routing.defaultLocale
  const allNamespaces: Namespace[] = ['common', 'forms', 'errors']

  const results = await Promise.all(
    allNamespaces.map(async (namespace) => ({
      namespace,
      messages: await loadNamespace(validLocale, namespace),
    })),
  )

  const messages: Messages = {}
  for (const { namespace, messages: namespaceMessages } of results) {
    messages[namespace] = namespaceMessages
  }

  return messages
}
