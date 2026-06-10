import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'

/**
 * Single source of truth for button styling. Both the `Button` element and the
 * CMS-driven `CmsLink` (which renders an `<a>`) consume `buttonStyles`, so a link
 * styled as a button is pixel-identical to a real button. Styles are split into a
 * Tailwind `className` (layout/size) and a `style` object (CSS-var colors) because
 * this design system themes via CSS variables, not utility classes.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg'

export const buttonVariantCSS: Record<ButtonVariant, CSSProperties> = {
  primary: {
    backgroundColor: 'var(--primary)',
    color: 'var(--primary-foreground)',
    boxShadow: 'var(--shadow-sm)',
  },
  secondary: {
    backgroundColor: 'var(--secondary)',
    color: 'var(--secondary-foreground)',
    boxShadow: 'var(--shadow-sm)',
  },
  outline: {
    border: '2px solid var(--primary)',
    backgroundColor: 'transparent',
    color: 'var(--primary)',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--foreground)',
  },
  destructive: {
    backgroundColor: 'var(--destructive)',
    color: 'var(--destructive-foreground)',
    boxShadow: 'var(--shadow-sm)',
  },
}

export const buttonSizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-5 text-sm gap-2',
  lg: 'h-12 px-7 text-base gap-2.5',
}

const buttonBaseClass = [
  'inline-flex items-center justify-center font-medium',
  'rounded-lg',
  'transition-all duration-200',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-50',
  'active:scale-[0.98]',
  'hover:opacity-90',
].join(' ')

/** Returns the className + inline style for a given button variant/size. */
export function buttonStyles(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
): { className: string; style: CSSProperties } {
  return {
    className: `${buttonBaseClass} ${buttonSizeClasses[size]}`,
    style: { ...buttonVariantCSS[variant], borderRadius: 'var(--radius)' },
  }
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  style,
  children,
  ...props
}: ButtonProps) {
  const { className: variantClass, style: variantStyle } = buttonStyles(variant, size)
  return (
    <button
      className={[variantClass, className].join(' ')}
      style={{ ...variantStyle, ...style }}
      {...props}
    >
      {children}
    </button>
  )
}
