import type { CSSProperties } from 'react'
import { buttonStyles, type ButtonSize } from '../button'

/**
 * Visual variants a CMS editor can pick for a link. The button variants reuse the
 * exact same styling as `<Button>` (via `buttonStyles`); `link` / `link-underline`
 * are plain text links with no button chrome.
 */
export type CmsLinkVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'link-underline'

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
