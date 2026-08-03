import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'destructive'
  children: ReactNode
}

const variantCSS: Record<NonNullable<BadgeProps['variant']>, CSSProperties> = {
  default: {
    background: 'var(--accent)',
    color: 'var(--accent-foreground)',
  },
  success: {
    background: 'var(--success-subtle)',
    color: 'var(--success-foreground)',
  },
  warning: {
    background: 'var(--warning-subtle)',
    color: 'var(--warning-foreground)',
  },
  destructive: {
    background: 'var(--destructive-subtle)',
    color: 'var(--destructive-subtle-foreground)',
  },
}

export function Badge({
  variant = 'default',
  className = '',
  style,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={['inline-flex items-center text-xs font-medium', className].join(' ')}
      style={{
        padding: '0.125rem 0.625rem',
        borderRadius: 'var(--radius-full, 9999px)',
        ...variantCSS[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  )
}
