import type { CmsLinkData, CmsLinkVariant } from '@repo/ui'
import type { Locale } from '../../i18n/locales'
import { localizedPath } from '../seo/meta'

/**
 * The only place a CMS link is turned into a renderable href. Mirrors the
 * `linkField()` group in `apps/payload/src/payload/fields/link.ts`:
 *
 * - `reference` → an internal document; its slug is run through `localizedPath`
 *   so the href carries the right `/<locale>/` prefix.
 * - `custom`    → an author-typed URL (already localized per-locale in the CMS),
 *   used verbatim.
 *
 * Returns `null` when there's nothing to render (no label, or no resolvable href),
 * so callers render with `{link && <CmsLink link={link} />}`.
 */

/** A populated polymorphic reference. `value` is the doc only at `depth >= 1`. */
interface LinkReference {
  relationTo: 'pages'
  value: string | { slug?: string | null }
}

/** Structural shape of the `linkField()` group as it arrives from the REST API. */
export interface LinkInput {
  type?: ('custom' | 'reference') | null
  label?: string | null
  url?: string | null
  reference?: LinkReference | null
  variant?: string | null
  newTab?: boolean | null
}

const VARIANTS: readonly CmsLinkVariant[] = [
  'primary',
  'secondary',
  'outline',
  'ghost',
  'link',
  'link-underline',
]

const toVariant = (value: string | null | undefined): CmsLinkVariant | undefined =>
  value && (VARIANTS as readonly string[]).includes(value) ? (value as CmsLinkVariant) : undefined

const resolveReferenceHref = (reference: LinkReference, locale: Locale): string | null => {
  // At depth 0 `value` is the bare id (a string) and we can't build a path.
  if (typeof reference.value !== 'object' || reference.value === null) return null
  const slug = reference.value.slug
  if (!slug) return null

  switch (reference.relationTo) {
    case 'pages':
    default:
      return localizedPath(slug, locale)
  }
}

export const resolveLink = (
  link: LinkInput | null | undefined,
  locale: Locale,
): CmsLinkData | null => {
  if (!link) return null

  const label = link.label?.trim()
  if (!label) return null

  let href: string | null = null
  if (link.type === 'reference' && link.reference) {
    href = resolveReferenceHref(link.reference, locale)
  } else if (link.url && link.url.trim().length > 0) {
    href = link.url.trim()
  }
  if (!href) return null

  const variant = toVariant(link.variant)
  const newTab = link.newTab === true

  return {
    href,
    label,
    ...(variant ? { variant } : {}),
    ...(newTab ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {}),
  }
}
