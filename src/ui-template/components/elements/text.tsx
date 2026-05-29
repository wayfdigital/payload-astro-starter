import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: 'body' | 'lead' | 'small' | 'muted'
  children: ReactNode
}

const variantCSS: Record<NonNullable<TextProps['variant']>, CSSProperties> = {
  body: { color: 'var(--template-color-foreground)', fontSize: '1rem' },
  lead: { color: 'var(--template-color-muted-foreground)', fontSize: '1.125rem' },
  small: { color: 'var(--template-color-foreground)', fontSize: '0.875rem' },
  muted: { color: 'var(--template-color-muted-foreground)', fontSize: '0.875rem' },
}

export function Text({
  variant = 'body',
  className = '',
  style,
  children,
  ...props
}: TextProps) {
  return (
    <p
      className={['leading-relaxed', className].join(' ')}
      style={{ ...variantCSS[variant], ...style }}
      {...props}
    >
      {children}
    </p>
  )
}
