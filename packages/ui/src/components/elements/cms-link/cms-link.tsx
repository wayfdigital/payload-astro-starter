import type { CSSProperties } from 'react'
import { buttonStyles, type ButtonSize } from '../button'

/**
 * Visual variants a CMS editor can pick for a link. The button variants reuse the
 * exact same styling as `<Button>` (via `buttonStyles`); `link` / `link-underline`
 * are plain text links with no button chrome.
 *
 * **Single source of truth.** The array is the value, the type derives from it — so
 * `resolve-link.ts` and the stories import this instead of re-typing the list. Adding
 * a variant here is a SCHEMA change: it must also land in `variantField.options`
 * (`apps/payload/src/payload/fields/link.ts`) plus `generate:types` and a migration.
 * See *Variant sync* in `.claude/skills/design-mode/SKILL.md`.
 *
 * Note `destructive` is deliberately absent: `<Button>` has it, editors don't get it.
 */
export const CMS_LINK_VARIANTS = [
  'primary',
  'secondary',
  'outline',
  'ghost',
  'link',
  'link-underline',
] as const

export type CmsLinkVariant = (typeof CMS_LINK_VARIANTS)[number]

/**
 * A fully resolved link, ready to render. Payload-agnostic on purpose: the Astro
 * `resolveLink()` adapter produces this shape (href already locale-prefixed), so
 * this component never touches CMS types or i18n routing.
 */
export interface CmsLinkData {
  href: string
  label: string
  variant?: CmsLinkVariant
  target?: '_blank'
  rel?: string
}

export interface CmsLinkProps {
  link: CmsLinkData
  className?: string
  /** Only affects button-style variants; text links ignore it. */
  size?: ButtonSize
}

const textLinkBaseClass = 'inline-flex items-center gap-1 font-medium transition-opacity hover:opacity-70'

/** Renders a resolved CMS link as an `<a>`, styled to match `<Button>` for button variants. */
export function CmsLink({ link, className = '', size = 'md' }: CmsLinkProps) {
  const variant = link.variant ?? 'primary'

  let resolvedClass: string
  let resolvedStyle: CSSProperties | undefined

  if (variant === 'link' || variant === 'link-underline') {
    resolvedClass = [
      textLinkBaseClass,
      variant === 'link-underline' ? 'underline underline-offset-4' : '',
    ]
      .join(' ')
      .trim()
    resolvedStyle = { color: 'var(--primary)' }
  } else {
    const styles = buttonStyles(variant, size)
    resolvedClass = styles.className
    resolvedStyle = styles.style
  }

  return (
    <a
      href={link.href}
      className={[resolvedClass, className].join(' ').trim()}
      style={resolvedStyle}
      {...(link.target ? { target: link.target } : {})}
      {...(link.rel ? { rel: link.rel } : {})}
    >
      {link.label}
    </a>
  )
}
