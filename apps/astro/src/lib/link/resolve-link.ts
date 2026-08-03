import { CMS_LINK_VARIANTS, type CmsLinkData, type CmsLinkVariant } from '@repo/ui'
import type { Page } from '@repo/payload-types'
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

/**
 * Drift guard. `linkField()`'s `variant` select (`apps/payload/src/payload/fields/link.ts`)
 * and the `@repo/ui` `CmsLinkVariant` union must stay identical — a variant added on one
 * side only degrades silently to `primary` at runtime instead of failing loudly.
 *
 * The `[…]` brackets are load-bearing: without them the conditional distributes over the
 * union and yields `boolean`, which fails `extends true` even when both sides agree.
 *
 * Limits: this compares `@repo/ui` against the GENERATED types, not against `link.ts`
 * directly — so editing `link.ts` without running `generate:types` still passes. The
 * anchor is `Page.hero.cta`; if that link ever gets `appearances: false` this errors with
 * "property 'variant' does not exist" — re-anchor it to another `linkField()` site.
 */
type PayloadLinkVariant = NonNullable<NonNullable<Page['hero']['cta']>['variant']>
type AssertTrue<T extends true> = T
export type _CmsLinkVariantsInSync = AssertTrue<
  [PayloadLinkVariant] extends [CmsLinkVariant]
    ? [CmsLinkVariant] extends [PayloadLinkVariant]
      ? true
      : false
    : false
>

const toVariant = (value: string | null | undefined): CmsLinkVariant | undefined =>
  value && (CMS_LINK_VARIANTS as readonly string[]).includes(value)
    ? (value as CmsLinkVariant)
    : undefined

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
